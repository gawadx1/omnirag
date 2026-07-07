import type { RetrievalResult } from "@/retrieval";

let esClient: any = null;

async function getEsClient() {
  if (esClient) return esClient;
  try {
    const { Client } = await import("@elastic/elasticsearch");
    if (process.env.ELASTICSEARCH_URL) {
      esClient = new Client({
        node: process.env.ELASTICSEARCH_URL,
        auth: { apiKey: process.env.ELASTICSEARCH_API_KEY || "" },
      });
    }
    return esClient;
  } catch {
    return null;
  }
}

export async function searchWithElasticsearch(
  query: string,
  topK: number
): Promise<RetrievalResult[]> {
  const client = await getEsClient();
  if (!client) throw new Error("Elasticsearch not configured");

  const result = await client.search({
    index: "chunks",
    body: {
      query: {
        match: { content: query },
      },
      size: topK,
    },
  });

  return (result.hits?.hits || []).map((hit: any) => ({
    id: hit._id,
    content: hit._source.content || "",
    score: hit._score || 0,
    documentId: hit._source.documentId || "",
    documentName: hit._source.documentName,
    metadata: hit._source,
  }));
}

export async function indexChunkInElasticsearch(chunk: {
  id: string;
  content: string;
  documentId: string;
  metadata?: Record<string, unknown>;
}) {
  const client = await getEsClient();
  if (!client) return;

  await client.index({
    index: "chunks",
    id: chunk.id,
    body: {
      content: chunk.content,
      documentId: chunk.documentId,
      ...chunk.metadata,
    },
  });
}

export async function bulkIndexChunks(
  chunks: { id: string; content: string; documentId: string; metadata?: Record<string, unknown> }[]
) {
  const client = await getEsClient();
  if (!client) return;

  const body = chunks.flatMap((chunk) => [
    { index: { _index: "chunks", _id: chunk.id } },
    { content: chunk.content, documentId: chunk.documentId, ...chunk.metadata },
  ]);

  await client.bulk({ body });
}
