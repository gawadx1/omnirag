import type { VectorStoreAdapter } from "../types";
import type { VectorDBConfig } from "@/types";

export class ChromaAdapter implements VectorStoreAdapter {
  type = "CHROMA" as const;
  private client: any = null;
  private collectionName = "documents";

  async initialize(config: VectorDBConfig): Promise<void> {
    const { ChromaClient } = await import("chromadb");
    this.client = new ChromaClient({
      path: config.url || "http://localhost:8000",
    });
    const collections = await this.client.listCollections();
    const exists = collections.some(
      (c: any) => c.name === this.collectionName
    );
    if (!exists) {
      await this.client.createCollection({ name: this.collectionName });
    }
  }

  private async getCollection() {
    return this.client.getCollection({ name: this.collectionName });
  }

  async upsertVectors(
    id: string,
    vector: number[],
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const collection = await this.getCollection();
    await collection.upsert({
      ids: [id],
      embeddings: [vector],
      metadatas: [metadata || {}],
    });
  }

  async bulkUpsertVectors(
    vectors: { id: string; vector: number[]; metadata?: Record<string, unknown> }[]
  ): Promise<void> {
    const collection = await this.getCollection();
    await collection.upsert({
      ids: vectors.map((v) => v.id),
      embeddings: vectors.map((v) => v.vector),
      metadatas: vectors.map((v) => v.metadata || {}),
    });
  }

  async queryVectors(
    vector: number[],
    topK: number,
    filter?: Record<string, unknown>
  ): Promise<{ id: string; score: number; metadata?: Record<string, unknown> }[]> {
    const collection = await this.getCollection();
    const result = await collection.query({
      queryEmbeddings: [vector],
      nResults: topK,
      where: filter,
    });
    const ids: string[] = result.ids[0] || [];
    const distances: number[] = result.distances?.[0] || [];
    const metadatas: Record<string, unknown>[] = result.metadatas?.[0] || [];
    return ids.map((id, i) => ({
      id,
      score: 1 - (distances[i] || 0),
      metadata: metadatas[i] || {},
    }));
  }

  async deleteVectors(ids: string[]): Promise<void> {
    const collection = await this.getCollection();
    await collection.delete({ ids });
  }

  async deleteCollection(): Promise<void> {
    await this.client.deleteCollection({ name: this.collectionName });
  }
}
