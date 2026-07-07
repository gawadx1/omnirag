import { prisma } from "@/lib/prisma";
import { parseDocument } from "./parsers";
import { chunkDocument } from "./chunking";
import { generateEmbeddings } from "@/embeddings";
import { getVectorStore } from "@/lib/vector-store";
import type { ChunkStrategy, AIProvider, VectorDB } from "@/types";
import { ulid } from "ulid";
import type { DocumentStatus } from "@prisma/client";

export interface IngestionOptions {
  userId: string;
  workspaceId?: string;
  buffer: Buffer;
  filename: string;
  mimeType?: string;
  chunkStrategy?: ChunkStrategy;
  chunkSize?: number;
  chunkOverlap?: number;
  embeddingProvider?: AIProvider;
  embeddingModel?: string;
  embeddingApiKey?: string;
  embeddingBaseUrl?: string;
  vectorDb?: VectorDB;
  vectorDbConfig?: { url?: string; apiKey?: string; indexName?: string };
}

export async function ingestDocument(options: IngestionOptions) {
  const parsed = await parseDocument(options.buffer, options.filename, options.mimeType);

  const document = await prisma.document.create({
    data: {
      userId: options.userId,
      workspaceId: options.workspaceId,
      filename: `${ulid()}-${options.filename}`,
      originalName: options.filename,
      mimeType: parsed.metadata.mimeType,
      size: options.buffer.length,
      status: "PROCESSING",
      metadata: parsed.metadata as any,
    },
  });

  try {
    const chunks = await chunkDocument(
      parsed.content,
      options.chunkStrategy || "RECURSIVE",
      {
        chunkSize: options.chunkSize || 1000,
        chunkOverlap: options.chunkOverlap || 200,
        metadata: { documentId: document.id, filename: options.filename },
      }
    );

    const embeddingConfig = {
      provider: options.embeddingProvider || "OPENAI",
      model: options.embeddingModel || "text-embedding-3-small",
      apiKey: options.embeddingApiKey,
      baseUrl: options.embeddingBaseUrl,
    };

    const texts = chunks.map((c) => c.content);
    const embeddings = await generateEmbeddings(texts, embeddingConfig);

    const dbChunks = await Promise.all(
      chunks.map((chunk, i) =>
        prisma.chunk.create({
          data: {
            documentId: document.id,
            content: chunk.content,
            index: chunk.index,
            chunkSize: chunk.content.length,
            parentId: chunk.parentId,
            metadata: chunk.metadata as any,
            embeddingModel: embeddingConfig.model,
          },
        })
      )
    );

    const vectorStore = await getVectorStore({
      type: options.vectorDb || "QDRANT",
      url: options.vectorDbConfig?.url,
      apiKey: options.vectorDbConfig?.apiKey,
      indexName: options.vectorDbConfig?.indexName,
    });

    await vectorStore.bulkUpsertVectors(
      dbChunks.map((chunk, i) => ({
        id: chunk.id,
        vector: embeddings[i] || [],
        metadata: {
          documentId: document.id,
          chunkIndex: chunk.index,
          content: chunk.content,
          parentId: chunk.parentId || undefined,
        },
      }))
    );

    await prisma.document.update({
      where: { id: document.id },
      data: {
        status: "READY",
        version: document.version,
      },
    });

    return document;
  } catch (error) {
    await prisma.document.update({
      where: { id: document.id },
      data: {
        status: "FAILED",
        error: error instanceof Error ? error.message : "Unknown error",
      },
    });
    throw error;
  }
}

export async function reindexDocument(documentId: string) {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: { chunks: true },
  });
  if (!document) throw new Error("Document not found");

  return document;
}

export async function deleteDocument(documentId: string) {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });
  if (!document) throw new Error("Document not found");

  await prisma.document.update({
    where: { id: documentId },
    data: { status: "PENDING" },
  });

  await prisma.chunk.deleteMany({ where: { documentId } });
  await prisma.documentVersion.deleteMany({ where: { documentId } });
  await prisma.document.delete({ where: { id: documentId } });
}
