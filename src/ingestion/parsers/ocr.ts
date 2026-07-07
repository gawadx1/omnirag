import type { DocumentParser, ParsedDocument } from "./types";

export class OCRParser implements DocumentParser {
  supportedMimeTypes = ["image/png", "image/jpeg", "image/webp", "image/tiff"];

  async parse(buffer: Buffer, filename: string): Promise<ParsedDocument> {
    const Tesseract = await import("tesseract.js");
    const { data } = await Tesseract.recognize(buffer, "eng");
    return {
      content: data.text,
      metadata: {
        filename,
        mimeType: filename.endsWith(".png")
          ? "image/png"
          : filename.endsWith(".tiff")
            ? "image/tiff"
            : "image/jpeg",
        wordCount: data.text.split(/\s+/).length,
        confidence: data.confidence,
      },
    };
  }
}
