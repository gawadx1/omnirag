import type { ChunkingStrategy, ChunkResult, ChunkOptions } from "./types";
import { ulid } from "ulid";

export class SemanticChunking implements ChunkingStrategy {
  type = "SEMANTIC" as const;
  name = "Semantic Chunking";

  async chunk(text: string, options: ChunkOptions): Promise<ChunkResult[]> {
    const sentences = text.match(/[^.!?\n]+[.!?]*\s*/g) || [text];
    const chunks: ChunkResult[] = [];
    let currentChunk = "";
    let chunkIndex = 0;

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > options.chunkSize && currentChunk) {
        chunks.push({
          id: ulid(),
          content: currentChunk.trim(),
          index: chunkIndex++,
          metadata: options.metadata,
        });
        const overlap = currentChunk
          .split(/\s+/)
          .slice(-Math.ceil(options.chunkOverlap / 10))
          .join(" ");
        currentChunk = overlap + sentence;
      } else {
        currentChunk += sentence;
      }
    }

    if (currentChunk.trim()) {
      chunks.push({
        id: ulid(),
        content: currentChunk.trim(),
        index: chunkIndex,
        metadata: options.metadata,
      });
    }

    return chunks;
  }
}
