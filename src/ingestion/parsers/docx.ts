import type { DocumentParser, ParsedDocument } from "./types";

export class DOCXParser implements DocumentParser {
  supportedMimeTypes = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  async parse(buffer: Buffer, filename: string): Promise<ParsedDocument> {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return {
      content: result.value,
      metadata: {
        filename,
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        wordCount: result.value.split(/\s+/).length,
      },
    };
  }
}
