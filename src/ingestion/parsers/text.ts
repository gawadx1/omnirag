import type { DocumentParser, ParsedDocument } from "./types";

export class TextParser implements DocumentParser {
  supportedMimeTypes = ["text/plain"];

  async parse(buffer: Buffer, filename: string): Promise<ParsedDocument> {
    const content = buffer.toString("utf-8");
    return {
      content,
      metadata: {
        filename,
        mimeType: "text/plain",
        wordCount: content.split(/\s+/).length,
      },
    };
  }
}
