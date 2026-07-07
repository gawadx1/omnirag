import type { LLMProvider, ChatOptions, EmbeddingOptions } from "../types";
import type { LLMModelConfig } from "@/types";
import { ChatAnthropic } from "@langchain/anthropic";
import { OpenAIEmbeddings } from "@langchain/openai";

export class AnthropicProvider implements LLMProvider {
  id = "ANTHROPIC" as const;
  name = "Anthropic Claude";
  private config: LLMModelConfig;
  private client: ChatAnthropic;
  private embeddingsClient: OpenAIEmbeddings;

  constructor(config: LLMModelConfig) {
    this.config = config;
    this.client = new ChatAnthropic({
      anthropicApiKey: config.apiKey,
      model: config.model || "claude-3-opus-20240229",
      temperature: config.temperature ?? 0.7,
      maxTokens: config.maxTokens ?? 4096,
    });
    this.embeddingsClient = new OpenAIEmbeddings({
      apiKey: config.apiKey,
      model: config.embeddingModel || "text-embedding-3-small",
    });
  }

  async chat(options: ChatOptions): Promise<string> {
    const response = await this.client.invoke(
      options.messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }))
    );
    const content = response.content;
    return typeof content === "string" ? content : JSON.stringify(content);
  }

  async stream(options: ChatOptions): Promise<ReadableStream<string>> {
    const stream = await this.client.stream(
      options.messages.map((m) => ({
        role: m.role as "user" | "assistant",
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
    try {
      await this.client.invoke([{ role: "user", content: "test" }]);
      return true;
    } catch {
      return false;
    }
  }
}
