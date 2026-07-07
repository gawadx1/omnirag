import type { ChunkingStrategy, ChunkResult, ChunkOptions } from "./types";
import { ulid } from "ulid";

export class ParentChildChunking implements ChunkingStrategy {
  type = "PARENT_CHILD" as const;
  name = "Parent-Child Chunking";

  async chunk(text: string, options: ChunkOptions): Promise<ChunkResult[]> {
    const results: ChunkResult[] = [];
    const parentSize = options.chunkSize * 3;
    const childSize = options.chunkSize;

    const paragraphs = text.split(/\n\n+/);
    let parentIndex = 0;

    for (const paragraph of paragraphs) {
      if (!paragraph.trim()) continue;

      const parentId = ulid();
      const parentContent = paragraph.slice(0, parentSize);

      results.push({
        id: parentId,
        content: parentContent,
        index: parentIndex++,
        metadata: { ...options.metadata, type: "parent" },
      });

      const words = parentContent.split(/\s+/);
      let childChunk: string[] = [];
      let childIndex = 0;

      for (const word of words) {
        childChunk.push(word);
        if (childChunk.join(" ").length >= childSize) {
          results.push({
            id: ulid(),
            content: childChunk.join(" "),
            index: childIndex++,
            metadata: { ...options.metadata, type: "child" },
            parentId,
          });
          childChunk = childChunk.slice(
            -Math.ceil(options.chunkOverlap / 10)
          );
        }
      }

      if (childChunk.length > 0) {
        results.push({
          id: ulid(),
          content: childChunk.join(" "),
          index: childIndex,
          metadata: { ...options.metadata, type: "child" },
          parentId,
        });
      }
    }

    return results;
  }
}
