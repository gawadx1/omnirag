import type { DocumentParser, ParsedDocument } from "./types";
import { PDFParser } from "./pdf";
import { DOCXParser } from "./docx";
import { TextParser } from "./text";
import { MarkdownParser } from "./markdown";
import { HTMLParser } from "./html";
import { CSVParser } from "./csv";
import { OCRParser } from "./ocr";

const parsers: DocumentParser[] = [
  new PDFParser(),
  new DOCXParser(),
  new TextParser(),
  new MarkdownParser(),
  new HTMLParser(),
  new CSVParser(),
  new OCRParser(),
];

const mimeTypeMap: Record<string, DocumentParser> = {};
for (const parser of parsers) {
  for (const mime of parser.supportedMimeTypes) {
    mimeTypeMap[mime] = parser;
  }
}

export function getParser(mimeType: string): DocumentParser | undefined {
  return mimeTypeMap[mimeType];
}

export function getParserForFile(filename: string): DocumentParser | undefined {
  const ext = filename.split(".").pop()?.toLowerCase();
  const mimeMap: Record<string, string> = {
    pdf: "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    txt: "text/plain",
    md: "text/markdown",
    html: "text/html",
    htm: "text/html",
    csv: "text/csv",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    tiff: "image/tiff",
    tif: "image/tiff",
  };
  const mime = ext ? mimeMap[ext] : undefined;
  return mime ? getParser(mime) : undefined;
}

export async function parseDocument(
  buffer: Buffer,
  filename: string,
  mimeType?: string
): Promise<ParsedDocument> {
  const parser = mimeType
    ? getParser(mimeType)
    : getParserForFile(filename);

  if (!parser) {
    throw new Error(`No parser available for file: ${filename}`);
  }

  return parser.parse(buffer, filename);
}

export { PDFParser, DOCXParser, TextParser, MarkdownParser, HTMLParser, CSVParser, OCRParser };
export type { DocumentParser, ParsedDocument } from "./types";
