import type { VectorStoreAdapter } from "./types";
import type { VectorDB, VectorDBConfig } from "@/types";
import { QdrantAdapter } from "./adapters/qdrant";
import { PineconeAdapter } from "./adapters/pinecone";
import { ChromaAdapter } from "./adapters/chroma";

const adapterRegistry: Record<VectorDB, new () => VectorStoreAdapter> = {
  QDRANT: QdrantAdapter,
  PINECONE: PineconeAdapter,
  CHROMA: ChromaAdapter,
};

export async function getVectorStore(config: VectorDBConfig): Promise<VectorStoreAdapter> {
  const Adapter = adapterRegistry[config.type];
  if (!Adapter) {
    throw new Error(`Unsupported vector database: ${config.type}`);
  }
  const adapter = new Adapter();
  await adapter.initialize(config);
  return adapter;
}

export function getVectorStoreNames(): { id: VectorDB; name: string }[] {
  return [
    { id: "QDRANT", name: "Qdrant" },
    { id: "PINECONE", name: "Pinecone" },
    { id: "CHROMA", name: "Chroma" },
  ];
}

export type { VectorStoreAdapter } from "./types";
