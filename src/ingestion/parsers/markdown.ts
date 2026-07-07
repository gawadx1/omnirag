import type { DocumentParser, ParsedDocument } from "./types";

export class MarkdownParser implements DocumentParser {
  supportedMimeTypes = ["text/markdown"];

  async parse(buffer: Buffer, filename: string): Promise<ParsedDocument> {
    const content = buffer.toString("utf-8");
    const { marked } = await import("marked");
    const html = await marked.parse(content);
    const text = html.replace(/<[^>]*>/g, "");
    return {
      content: text,
      metadata: {
        filename,
        mimeType: "text/markdown",
        wordCount: text.split(/\s+/).length,
        rawContent: content,
      },
    };
  }
}
