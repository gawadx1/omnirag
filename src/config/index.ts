export const appConfig = {
  name: "Enterprise RAG Platform",
  description: "Production-ready Retrieval-Augmented Generation Platform",
  version: "1.0.0",

  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },

  upload: {
    maxFileSize: 50 * 1024 * 1024,
    allowedMimeTypes: [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "text/markdown",
      "text/html",
      "text/csv",
      "image/png",
      "image/jpeg",
      "image/webp",
    ],
  },

  chunking: {
    defaultChunkSize: 1000,
    defaultChunkOverlap: 200,
    minChunkSize: 100,
    maxChunkSize: 10000,
  },

  retrieval: {
    defaultTopK: 10,
    maxTopK: 100,
    defaultScoreThreshold: 0.0,
    mmrDefaultLambda: 0.5,
  },

  generation: {
    defaultTemperature: 0.7,
    defaultMaxTokens: 4096,
    maxMaxTokens: 128000,
  },

  rateLimit: {
    chatRequestsPerMinute: 60,
    apiRequestsPerMinute: 100,
    uploadRequestsPerHour: 50,
  },

  cache: {
    ttlSeconds: 3600,
    embeddingCacheTtl: 86400,
  },
} as const;

export const providerDefaults: Record<string, { model: string; embeddingModel: string }> = {
  OPENAI: { model: "gpt-4o", embeddingModel: "text-embedding-3-small" },
  ANTHROPIC: { model: "claude-3-opus-20240229", embeddingModel: "text-embedding-3-small" },
  GEMINI: { model: "gemini-1.5-pro", embeddingModel: "embedding-001" },
  DEEPSEEK: { model: "deepseek-chat", embeddingModel: "text-embedding-ada-002" },
  OLLAMA: { model: "llama3.1", embeddingModel: "nomic-embed-text" },
};
