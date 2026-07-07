import { z } from "zod";

export const aiProviderSchema = z.enum(["OPENAI", "ANTHROPIC", "GEMINI", "DEEPSEEK", "OLLAMA"]);

export const llmConfigSchema = z.object({
  provider: aiProviderSchema,
  model: z.string().min(1),
  apiKey: z.string().optional(),
  baseUrl: z.string().optional(),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().min(1).max(128000).default(4096),
  embeddingModel: z.string().optional(),
});

export const embeddingConfigSchema = z.object({
  provider: aiProviderSchema,
  model: z.string().min(1),
  apiKey: z.string().optional(),
  baseUrl: z.string().optional(),
});

export const vectorDbSchema = z.enum(["QDRANT", "PINECONE", "CHROMA"]);

export const vectorDbConfigSchema = z.object({
  type: vectorDbSchema,
  url: z.string().optional(),
  apiKey: z.string().optional(),
  indexName: z.string().optional(),
});

export const chunkStrategySchema = z.enum([
  "SEMANTIC",
  "RECURSIVE",
  "PARENT_CHILD",
  "METADATA",
]);

export const chunkConfigSchema = z.object({
  strategy: chunkStrategySchema.default("RECURSIVE"),
  chunkSize: z.number().min(100).max(10000).default(1000),
  chunkOverlap: z.number().min(0).max(1000).default(200),
});

export const documentUploadSchema = z.object({
  filename: z.string().min(1),
  mimeType: z.string().optional(),
  chunkStrategy: chunkStrategySchema.optional(),
  chunkSize: z.number().optional(),
  chunkOverlap: z.number().optional(),
});

export const chatMessageSchema = z.object({
  id: z.string().optional(),
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1),
});

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1),
  conversationId: z.string().optional(),
  stream: z.boolean().default(false),
  includeSources: z.boolean().default(true),
  includeConfidence: z.boolean().default(true),
});

export const settingsUpdateSchema = z.object({
  aiProvider: aiProviderSchema.optional(),
  embeddingModel: z.string().optional(),
  vectorDb: vectorDbSchema.optional(),
  chunkingStrategy: chunkStrategySchema.optional(),
  chunkSize: z.number().optional(),
  chunkOverlap: z.number().optional(),
  temperature: z.number().optional(),
  maxTokens: z.number().optional(),
  rerankEnabled: z.boolean().optional(),
  rerankProvider: z.string().optional(),
  theme: z.string().optional(),
});

export const providerCredentialSchema = z.object({
  provider: aiProviderSchema,
  apiKey: z.string().optional(),
  baseUrl: z.string().optional(),
  model: z.string().optional(),
});

export const querySchema = z.object({
  query: z.string().min(1),
  topK: z.number().min(1).max(100).default(10),
  filters: z.record(z.unknown()).optional(),
  enableHybridSearch: z.boolean().default(false),
});

export const webhookSchema = z.object({
  url: z.string().url(),
  events: z.array(z.string()).min(1),
});

export const apiKeySchema = z.object({
  name: z.string().min(1),
});
