declare module "pdf-parse" {
  interface PDFData {
    text: string;
    numpages: number;
    info: Record<string, unknown>;
    metadata: Record<string, unknown>;
    version: string;
  }
  function pdfParse(dataBuffer: Buffer, options?: Record<string, unknown>): Promise<PDFData>;
  export default pdfParse;
}

declare module "mammoth" {
  export function extractRawText(options: { buffer: Buffer }): Promise<{ value: string }>;
}

declare module "ulid" {
  export function ulid(): string;
}
