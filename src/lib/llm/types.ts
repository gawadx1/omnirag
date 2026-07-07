import type { AIProvider, LLMModelConfig } from "@/types";

export interface ChatOptions {
  messages: { role: "user" | "assistant" | "system"; content: string }[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  onToken?: (token: string) => void;
}

export interface EmbeddingOptions {
  texts: string[];
  model?: string;
}

export interface LLMProvider {
  id: AIProvider;
  name: string;
  chat(options: ChatOptions): Promise<string>;
  stream?(options: ChatOptions): Promise<ReadableStream<string>>;
  embeddings(options: EmbeddingOptions): Promise<number[][]>;
  validateConfig(): Promise<boolean>;
}

export interface LLMProviderConstructor {
  new (config: LLMModelConfig): LLMProvider;
}
