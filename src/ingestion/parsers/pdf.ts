import type { DocumentParser, ParsedDocument } from "./types";

export class PDFParser implements DocumentParser {
  supportedMimeTypes = ["application/pdf"];

  async parse(buffer: Buffer, filename: string): Promise<ParsedDocument> {
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(buffer);
    return {
      content: data.text,
      metadata: {
        filename,
        mimeType: "application/pdf",
        pages: data.numpages,
        wordCount: data.text.split(/\s+/).length,
      },
    };
  }
}
