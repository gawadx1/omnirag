import type { ChunkStrategy } from "@/types";

export interface ChunkResult {
  id: string;
  content: string;
  index: number;
  metadata?: Record<string, unknown>;
  parentId?: string;
}

export interface ChunkingStrategy {
  type: ChunkStrategy;
  name: string;
  chunk(text: string, options: ChunkOptions): Promise<ChunkResult[]>;
}

export interface ChunkOptions {
  chunkSize: number;
  chunkOverlap: number;
  separators?: string[];
  metadata?: Record<string, unknown>;
}
