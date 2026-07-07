import type { VectorStoreAdapter } from "../types";
import type { VectorDBConfig } from "@/types";

export class QdrantAdapter implements VectorStoreAdapter {
  type = "QDRANT" as const;
  private client: any = null;
  private collectionName = "documents";

  async initialize(config: VectorDBConfig): Promise<void> {
    const { QdrantClient } = await import("@qdrant/js-client-rest");
    this.client = new QdrantClient({
      url: config.url || "http://localhost:6333",
      apiKey: config.apiKey,
    });
    const collections = await this.client.getCollections();
    const exists = collections.collections.some(
      (c: any) => c.name === this.collectionName
    );
    if (!exists) {
      await this.client.createCollection(this.collectionName, {
        vectors: { size: 1536, distance: "Cosine" },
      });
    }
  }

  async upsertVectors(
    id: string,
    vector: number[],
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await this.client.upsert(this.collectionName, {
      points: [{ id, vector, payload: metadata }],
    });
  }

  async bulkUpsertVectors(
    vectors: { id: string; vector: number[]; metadata?: Record<string, unknown> }[]
  ): Promise<void> {
    await this.client.upsert(this.collectionName, {
      points: vectors.map((v) => ({
        id: v.id,
        vector: v.vector,
        payload: v.metadata,
      })),
    });
  }

  async queryVectors(
    vector: number[],
    topK: number,
    filter?: Record<string, unknown>
  ): Promise<{ id: string; score: number; metadata?: Record<string, unknown> }[]> {
    const result = await this.client.search(this.collectionName, {
      vector,
      limit: topK,
      filter: filter as any,
      with_payload: true,
    });
    return result.map((r: any) => ({
      id: String(r.id),
      score: r.score ?? 0,
      metadata: r.payload as Record<string, unknown> | undefined,
    }));
  }

  async deleteVectors(ids: string[]): Promise<void> {
    await this.client.delete(this.collectionName, {
      points: ids,
    });
  }

  async deleteCollection(): Promise<void> {
    await this.client.deleteCollection(this.collectionName);
  }
}
