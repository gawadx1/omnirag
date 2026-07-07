import { getVectorStore } from "@/lib/vector-store";
import { generateQueryEmbedding } from "@/embeddings";
import { prisma } from "@/lib/prisma";
import type { VectorDB, AIProvider, RetrievalConfig } from "@/types";

export interface RetrievalOptions {
  query: string;
  topK?: number;
  scoreThreshold?: number;
  vectorDb: VectorDB;
  vectorDbConfig: { url?: string; apiKey?: string; indexName?: string };
  embeddingProvider: AIProvider;
  embeddingModel?: string;
  embeddingApiKey?: string;
  embeddingBaseUrl?: string;
  retrievalConfig: RetrievalConfig;
  filters?: Record<string, unknown>;
}

export interface RetrievalResult {
  id: string;
  content: string;
  score: number;
  documentId: string;
  documentName?: string;
  metadata?: Record<string, unknown>;
}

export async function retrieve(options: RetrievalOptions): Promise<RetrievalResult[]> {
  const queryEmbedding = await generateQueryEmbedding(options.query, {
    provider: options.embeddingProvider,
    model: options.embeddingModel || "text-embedding-3-small",
    apiKey: options.embeddingApiKey,
    baseUrl: options.embeddingBaseUrl,
  });

  const vectorStore = await getVectorStore({ type: options.vectorDb, ...options.vectorDbConfig });
  const results = await vectorStore.queryVectors(
    queryEmbedding,
    options.topK || 10,
    options.filters
  );

  const chunkIds = results.map((r) => r.id);
  const chunks = await prisma.chunk.findMany({
    where: { id: { in: chunkIds } },
    include: { document: { select: { originalName: true } } },
  });

  const chunkMap = new Map(chunks.map((c) => [c.id, c]));

  return results
    .filter((r) => r.score >= (options.scoreThreshold || 0))
    .map((r) => {
      const chunk = chunkMap.get(r.id);
      return {
        id: r.id,
        content: chunk?.content || "",
        score: r.score,
        documentId: chunk?.documentId || "",
        documentName: chunk?.document.originalName,
        metadata: r.metadata as Record<string, unknown> | undefined,
      };
    });
}

export async function hybridRetrieve(
  options: RetrievalOptions
): Promise<RetrievalResult[]> {
  const vectorResults = await retrieve(options);

  try {
    const { searchWithElasticsearch } = await import(
      "@/lib/search/elasticsearch"
    );
    const esResults = await searchWithElasticsearch(options.query, options.topK || 10);
    const merged = mergeResults(vectorResults, esResults);
    return merged.slice(0, options.topK || 10);
  } catch {
    const bm25Results = await bm25Retrieve(options.query, options.topK || 10);
    const merged = mergeResults(vectorResults, bm25Results);
    return merged.slice(0, options.topK || 10);
  }
}

async function bm25Retrieve(query: string, topK: number): Promise<RetrievalResult[]> {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const chunks = await prisma.chunk.findMany({
    take: 1000,
    include: { document: { select: { originalName: true } } },
  });

  const scores = chunks.map((chunk) => {
    const content = chunk.content.toLowerCase();
    const score = terms.reduce((acc, term) => {
      const count = (content.match(new RegExp(term, "g")) || []).length;
      return acc + Math.log(1 + count);
    }, 0);
    return { chunk, score };
  });

  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(({ chunk, score }) => ({
      id: chunk.id,
      content: chunk.content,
      score,
      documentId: chunk.documentId,
      documentName: chunk.document.originalName,
      metadata: chunk.metadata as Record<string, unknown> | undefined,
    }));
}

function mergeResults(
  vector: RetrievalResult[],
  keyword: RetrievalResult[]
): RetrievalResult[] {
  const seen = new Map<string, RetrievalResult>();

  for (const result of vector) {
    seen.set(result.id, { ...result, score: result.score * 0.7 });
  }

  for (const result of keyword) {
    if (seen.has(result.id)) {
      const existing = seen.get(result.id)!;
      existing.score = existing.score + result.score * 0.3;
    } else {
      seen.set(result.id, { ...result, score: result.score * 0.3 });
    }
  }

  return Array.from(seen.values()).sort((a, b) => b.score - a.score);
}
