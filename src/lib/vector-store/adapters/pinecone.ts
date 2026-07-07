import type { VectorStoreAdapter } from "../types";
import type { VectorDBConfig } from "@/types";

export class PineconeAdapter implements VectorStoreAdapter {
  type = "PINECONE" as const;
  private client: any = null;
  private indexName = "documents";

  async initialize(config: VectorDBConfig): Promise<void> {
    const { Pinecone } = await import("@pinecone-database/pinecone");
    this.client = new Pinecone({
      apiKey: config.apiKey || "",
    });
    this.indexName = config.indexName || "documents";
    const indexes = await this.client.listIndexes();
    const exists = indexes.indexes?.some((i: any) => i.name === this.indexName);
    if (!exists) {
      await this.client.createIndex({
        name: this.indexName,
        dimension: 1536,
        metric: "cosine",
        spec: { serverless: { cloud: "aws", region: "us-east-1" } },
      });
    }
  }

  private getIndex() {
    return this.client.Index(this.indexName);
  }

  async upsertVectors(
    id: string,
    vector: number[],
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await this.getIndex().upsert([{ id, values: vector, metadata }]);
  }

  async bulkUpsertVectors(
    vectors: { id: string; vector: number[]; metadata?: Record<string, unknown> }[]
  ): Promise<void> {
    await this.getIndex().upsert(
      vectors.map((v) => ({ id: v.id, values: v.vector, metadata: v.metadata }))
    );
  }

  async queryVectors(
    vector: number[],
    topK: number,
    filter?: Record<string, unknown>
  ): Promise<{ id: string; score: number; metadata?: Record<string, unknown> }[]> {
    const result = await this.getIndex().query({
      vector,
      topK,
      filter: filter as any,
      includeMetadata: true,
    });
    return (result.matches || []).map((r: any) => ({
      id: r.id,
      score: r.score ?? 0,
      metadata: r.metadata as Record<string, unknown> | undefined,
    }));
  }

  async deleteVectors(ids: string[]): Promise<void> {
    await this.getIndex().deleteMany(ids);
  }

  async deleteCollection(): Promise<void> {
    await this.client.deleteIndex(this.indexName);
  }
}
