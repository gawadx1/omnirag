import type { ChunkingStrategy, ChunkResult, ChunkOptions } from "./types";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ulid } from "ulid";

export class RecursiveChunking implements ChunkingStrategy {
  type = "RECURSIVE" as const;
  name = "Recursive Character Text Splitter";

  async chunk(text: string, options: ChunkOptions): Promise<ChunkResult[]> {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: options.chunkSize,
      chunkOverlap: options.chunkOverlap,
      separators: options.separators || ["\n\n", "\n", " ", ""],
    });
    const docs = await splitter.createDocuments([text]);
    return docs.map((doc, i) => ({
      id: ulid(),
      content: doc.pageContent,
      index: i,
      metadata: { ...options.metadata, ...doc.metadata },
    }));
  }
}
