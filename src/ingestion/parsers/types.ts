export interface ParsedDocument {
  content: string;
  metadata: {
    filename: string;
    mimeType: string;
    pages?: number;
    wordCount: number;
    [key: string]: unknown;
  };
}

export interface DocumentParser {
  supportedMimeTypes: string[];
  parse(buffer: Buffer, filename: string): Promise<ParsedDocument>;
}
