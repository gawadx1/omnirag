import type { DocumentParser, ParsedDocument } from "./types";

export class CSVParser implements DocumentParser {
  supportedMimeTypes = ["text/csv"];

  async parse(buffer: Buffer, filename: string): Promise<ParsedDocument> {
    const content = buffer.toString("utf-8");
    const { parse } = await import("csv-parse/sync");
    const records = parse(content, { columns: true, skip_empty_lines: true });
    const text = JSON.stringify(records, null, 2);
    return {
      content: text,
      metadata: {
        filename,
        mimeType: "text/csv",
        wordCount: text.split(/\s+/).length,
        rowCount: records.length,
      },
    };
  }
}
