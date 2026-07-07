import type { LLMProvider, ChatOptions, EmbeddingOptions } from "../types";
import type { LLMModelConfig } from "@/types";
import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";

export class DeepSeekProvider implements LLMProvider {
  id = "DEEPSEEK" as const;
  name = "DeepSeek";
  private config: LLMModelConfig;
  private client: ChatOpenAI;
  private embeddingsClient: OpenAIEmbeddings;

  constructor(config: LLMModelConfig) {
    this.config = config;
    this.client = new ChatOpenAI({
      apiKey: config.apiKey,
      model: config.model || "deepseek-chat",
      temperature: config.temperature ?? 0.7,
      maxTokens: config.maxTokens ?? 4096,
      configuration: {
        baseURL: "https://api.deepseek.com/v1",
      },
    });
    this.embeddingsClient = new OpenAIEmbeddings({
      apiKey: config.apiKey,
      model: config.embeddingModel || "text-embedding-ada-002",
      configuration: {
        baseURL: "https://api.deepseek.com/v1",
      },
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
