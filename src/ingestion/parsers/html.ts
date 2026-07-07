import type { DocumentParser, ParsedDocument } from "./types";

export class HTMLParser implements DocumentParser {
  supportedMimeTypes = ["text/html"];

  async parse(buffer: Buffer, filename: string): Promise<ParsedDocument> {
    const content = buffer.toString("utf-8");
    const text = content.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    return {
      content: text,
      metadata: {
        filename,
        mimeType: "text/html",
        wordCount: text.split(/\s+/).length,
      },
    };
  }
}
