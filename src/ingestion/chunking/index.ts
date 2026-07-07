import type { ChunkingStrategy, ChunkResult, ChunkOptions } from "./types";
import type { ChunkStrategy } from "@/types";
import { RecursiveChunking } from "./recursive";
import { SemanticChunking } from "./semantic";
import { ParentChildChunking } from "./parent-child";
import { MetadataChunking } from "./metadata";

const registry: Record<ChunkStrategy, ChunkingStrategy> = {
  RECURSIVE: new RecursiveChunking(),
  SEMANTIC: new SemanticChunking(),
  PARENT_CHILD: new ParentChildChunking(),
  METADATA: new MetadataChunking(),
};

export function getChunkingStrategy(type: ChunkStrategy): ChunkingStrategy {
  const strategy = registry[type];
  if (!strategy) {
    throw new Error(`Unsupported chunking strategy: ${type}`);
  }
  return strategy;
}

export function getChunkingStrategies(): { id: ChunkStrategy; name: string }[] {
  return [
    { id: "RECURSIVE", name: "Recursive Character Text Splitter" },
    { id: "SEMANTIC", name: "Semantic Chunking" },
    { id: "PARENT_CHILD", name: "Parent-Child Chunking" },
    { id: "METADATA", name: "Metadata-Aware Chunking" },
  ];
}

export async function chunkDocument(
  text: string,
  strategy: ChunkStrategy,
  options: ChunkOptions
): Promise<ChunkResult[]> {
  const chunker = getChunkingStrategy(strategy);
  return chunker.chunk(text, options);
}

export type { ChunkingStrategy, ChunkResult, ChunkOptions } from "./types";
