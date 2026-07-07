import type { ChunkingStrategy, ChunkResult, ChunkOptions } from "./types";
import { ulid } from "ulid";

export class MetadataChunking implements ChunkingStrategy {
  type = "METADATA" as const;
  name = "Metadata-Aware Chunking";

  async chunk(text: string, options: ChunkOptions): Promise<ChunkResult[]> {
    const results: ChunkResult[] = [];
    const sections = text.split(/\n(?=#{1,6}\s|\w+[:]\s|\[.*?\))/);
    let index = 0;

    for (const section of sections) {
      if (!section.trim()) continue;

      const header = section.split("\n")[0]?.trim() || "";
      const content = section.slice(header.length).trim();

      if (content.length <= options.chunkSize) {
        results.push({
          id: ulid(),
          content: section.trim(),
          index: index++,
          metadata: {
            ...options.metadata,
            header,
            sectionType: detectSectionType(header),
          },
        });
      } else {
        const splitter = new (await import("./recursive")).RecursiveChunking();
        const subChunks = await splitter.chunk(content, options);
        for (const chunk of subChunks) {
          results.push({
            ...chunk,
            index: index++,
            metadata: {
              ...chunk.metadata,
              ...options.metadata,
              header,
            },
          });
        }
      }
    }

    return results;
  }
}

function detectSectionType(header: string): string {
  const lower = header.toLowerCase();
  if (lower.includes("introduction") || lower.includes("overview")) return "introduction";
  if (lower.includes("method") || lower.includes("approach")) return "methodology";
  if (lower.includes("result") || lower.includes("finding")) return "results";
  if (lower.includes("conclusion") || lower.includes("summary")) return "conclusion";
  if (lower.includes("reference") || lower.includes("bibliography")) return "references";
  if (lower.includes("appendix")) return "appendix";
  return "general";
}
