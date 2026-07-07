import type { LLMProvider, ChatOptions, EmbeddingOptions } from "../types";
import type { LLMModelConfig } from "@/types";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export class GeminiProvider implements LLMProvider {
  id = "GEMINI" as const;
  name = "Google Gemini";
  private config: LLMModelConfig;
  private client: ChatGoogleGenerativeAI;
  private embeddingsClient: GoogleGenerativeAIEmbeddings;

  constructor(config: LLMModelConfig) {
    this.config = config;
    this.client = new ChatGoogleGenerativeAI({
      apiKey: config.apiKey,
      model: config.model || "gemini-1.5-pro",
      temperature: config.temperature ?? 0.7,
      maxOutputTokens: config.maxTokens ?? 4096,
    });
    this.embeddingsClient = new GoogleGenerativeAIEmbeddings({
      apiKey: config.apiKey,
      model: config.embeddingModel || "embedding-001",
    });
  }

  async chat(options: ChatOptions): Promise<string> {
    const response = await this.client.invoke(
      options.messages.map((m) => ({
        role: m.role,
        content: m.content,
      }))
    );
    const content = response.content;
    return typeof content === "string" ? content : JSON.stringify(content);
  }

  async stream(options: ChatOptions): Promise<ReadableStream<string>> {
    const stream = await this.client.stream(
      options.messages.map((m) => ({
        role: m.role,
        content: m.content,
      }))
    );
    return new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.content;
          if (content) {
            controller.enqueue(typeof content === "string" ? content : JSON.stringify(content));
          }
        }
        controller.close();
      },
    });
  }

  async embeddings(options: EmbeddingOptions): Promise<number[][]> {
    return this.embeddingsClient.embedDocuments(options.texts);
  }

  async validateConfig(): Promise<boolean> {
    return true;
  }
}
