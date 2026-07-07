import type { VectorDB, VectorDBConfig } from "@/types";

export interface VectorStoreAdapter {
  type: VectorDB;
  initialize(config: VectorDBConfig): Promise<void>;
  upsertVectors(
    id: string,
    vector: number[],
    metadata?: Record<string, unknown>
  ): Promise<void>;
  bulkUpsertVectors(
    vectors: { id: string; vector: number[]; metadata?: Record<string, unknown> }[]
  ): Promise<void>;
  queryVectors(
    vector: number[],
    topK: number,
    filter?: Record<string, unknown>
  ): Promise<{ id: string; score: number; metadata?: Record<string, unknown> }[]>;
  deleteVectors(ids: string[]): Promise<void>;
  deleteCollection(): Promise<void>;
}
