import type { EmbeddingConfig } from "@/types";
import type { AIProvider } from "@/types";
import { OpenAIEmbeddings } from "@langchain/openai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";

export type EmbeddingProvider = OpenAIEmbeddings | GoogleGenerativeAIEmbeddings | OllamaEmbeddings;

export function getEmbeddings(config: EmbeddingConfig): EmbeddingProvider {
  switch (config.provider) {
    case "OPENAI":
      return new OpenAIEmbeddings({
        apiKey: config.apiKey,
        model: config.model || "text-embedding-3-small",
      });
    case "ANTHROPIC":
      return new OpenAIEmbeddings({
        apiKey: config.apiKey,
        model: config.model || "text-embedding-3-small",
      });
    case "GEMINI":
      return new GoogleGenerativeAIEmbeddings({
        apiKey: config.apiKey,
        model: config.model || "embedding-001",
      });
    case "DEEPSEEK":
      return new OpenAIEmbeddings({
        apiKey: config.apiKey,
        model: config.model || "text-embedding-ada-002",
        configuration: { baseURL: "https://api.deepseek.com/v1" },
      });
    case "OLLAMA":
      return new OllamaEmbeddings({
        baseUrl: config.baseUrl || "http://localhost:11434",
        model: config.model || "nomic-embed-text",
      });
    default:
      throw new Error(`Unsupported embedding provider: ${config.provider}`);
  }
}

export async function generateEmbeddings(
  texts: string[],
  config: EmbeddingConfig
): Promise<number[][]> {
  const embeddings = getEmbeddings(config);
  return embeddings.embedDocuments(texts);
}

export async function generateQueryEmbedding(
  text: string,
  config: EmbeddingConfig
): Promise<number[]> {
  const embeddings = getEmbeddings(config);
  return embeddings.embedQuery(text);
}
