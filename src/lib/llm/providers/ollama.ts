import type { LLMProvider, ChatOptions, EmbeddingOptions } from "../types";
import type { LLMModelConfig } from "@/types";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";

export class OllamaProvider implements LLMProvider {
  id = "OLLAMA" as const;
  name = "Ollama";
  private config: LLMModelConfig;
  private client: ChatOllama;
  private embeddingsClient: OllamaEmbeddings;

  constructor(config: LLMModelConfig) {
    this.config = config;
    this.client = new ChatOllama({
      baseUrl: config.baseUrl || "http://localhost:11434",
      model: config.model || "llama3.1",
      temperature: config.temperature ?? 0.7,
      numPredict: config.maxTokens ?? 4096,
    });
    this.embeddingsClient = new OllamaEmbeddings({
      baseUrl: config.baseUrl || "http://localhost:11434",
      model: config.embeddingModel || "nomic-embed-text",
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
