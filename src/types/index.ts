import { Provider, VectorDatabase, ChunkingStrategy, Role } from "@prisma/client";

export type AIProvider = Provider;
export type VectorDB = VectorDatabase;
export type ChunkStrategy = ChunkingStrategy;
export type UserRole = Role;

export interface LLMModelConfig {
  provider: AIProvider;
  model: string;
  apiKey?: string;
  baseUrl?: string;
  temperature?: number;
  maxTokens?: number;
  embeddingModel?: string;
}

export interface EmbeddingConfig {
  provider: AIProvider;
  model: string;
  apiKey?: string;
  baseUrl?: string;
}

export interface VectorDBConfig {
  type: VectorDB;
  url?: string;
  apiKey?: string;
  indexName?: string;
}

export interface ChunkConfig {
  strategy: ChunkStrategy;
  chunkSize: number;
  chunkOverlap: number;
  separators?: string[];
}

export interface RetrievalConfig {
  topK: number;
  scoreThreshold?: number;
  enableHybridSearch: boolean;
  enableReranking: boolean;
  rerankProvider?: "jina" | "cohere" | "bge" | "cross-encoder";
  filters?: Record<string, unknown>;
  mmrEnabled: boolean;
  mmrLambda?: number;
  contextCompression: boolean;
}

export interface QueryConfig {
  queryRewrite: boolean;
  multiQuery: boolean;
  multiQueryCount?: number;
  hyde: boolean;
  contextExpansion: boolean;
  historyAware: boolean;
}

export interface GenerationConfig {
  temperature: number;
  maxTokens: number;
  stream: boolean;
  structuredOutput: boolean;
  jsonMode: boolean;
  includeCitations: boolean;
  includeSources: boolean;
  includeConfidence: boolean;
}

export interface RagPipelineConfig {
  llm: LLMModelConfig;
  embedding: EmbeddingConfig;
  vectorDb: VectorDBConfig;
  chunk: ChunkConfig;
  retrieval: RetrievalConfig;
  query: QueryConfig;
  generation: GenerationConfig;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  sources?: Source[];
  confidence?: number;
  hallucinationScore?: number;
  warnings?: string[];
  timestamp: Date;
}

export interface Source {
  id: string;
  documentId: string;
  documentName: string;
  content: string;
  page?: number;
  score?: number;
  metadata?: Record<string, unknown>;
}

export interface EvaluationMetrics {
  faithfulness: number;
  answerRelevancy: number;
  contextPrecision: number;
  contextRecall: number;
  latency: number;
  cost: number;
}

export interface HallucinationResult {
  score: number;
  isHallucinated: boolean;
  unsupportedStatements: string[];
  warnings: string[];
}

export interface DocumentMetadata {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  status: string;
  version: number;
  chunkCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChunkResult {
  id: string;
  content: string;
  index: number;
  score?: number;
  metadata?: Record<string, unknown>;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface DashboardStats {
  totalDocuments: number;
  totalChunks: number;
  totalQueries: number;
  totalUsers: number;
  averageLatency: number;
  totalEmbeddings: number;
  storageUsed: number;
  averageResponseTime: number;
  hallucinationRate: number;
  evaluationScores: EvaluationMetrics;
}
