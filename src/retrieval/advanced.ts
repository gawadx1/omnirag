import { prisma } from "@/lib/prisma";

export async function filterByMetadata(
  documentId?: string,
  dateRange?: { start?: Date; end?: Date },
  customFilters?: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const filter: Record<string, unknown> = {};

  if (documentId) {
    filter.documentId = documentId;
  }

  if (dateRange?.start || dateRange?.end) {
    const dateFilter: Record<string, Date> = {};
    if (dateRange.start) dateFilter.$gte = dateRange.start;
    if (dateRange.end) dateFilter.$lte = dateRange.end;
  }

  return { ...filter, ...customFilters };
}

export async function multiVectorRetrieve(
  queryVector: number[],
  queryText: string,
  topK: number
) {
  const chunks = await prisma.chunk.findMany({
    where: { parentId: null },
    take: topK * 2,
    include: {
      children: { take: 3 },
      document: { select: { originalName: true } },
    },
  });

  return chunks;
}

export async function parentDocumentRetrieve(
  chunkIds: string[]
): Promise<Map<string, string>> {
  const chunks = await prisma.chunk.findMany({
    where: { id: { in: chunkIds } },
    include: { parent: true },
  });

  const parentMap = new Map<string, string>();
  for (const chunk of chunks) {
    if (chunk.parent) {
      parentMap.set(chunk.id, chunk.parent.content);
    } else {
      parentMap.set(chunk.id, chunk.content);
    }
  }

  return parentMap;
}

export async function mmrRetrieve(
  results: { id: string; content: string; score: number }[],
  queryEmbedding: number[],
  lambda: number = 0.5,
  topK: number
): Promise<typeof results> {
  if (results.length === 0) return [];

  const selected: typeof results = [];
  const remaining = [...results];

  while (selected.length < topK && remaining.length > 0) {
    let bestIdx = 0;
    let bestScore = -Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const relevance = remaining[i]!.score;
      let maxSimilarity = 0;
      for (const sel of selected) {
        const sim = cosineSimilarity(
          stringToVector(remaining[i]!.content),
          stringToVector(sel.content)
        );
        maxSimilarity = Math.max(maxSimilarity, sim);
      }
      const mmrScore = lambda * relevance - (1 - lambda) * maxSimilarity;
      if (mmrScore > bestScore) {
        bestScore = mmrScore;
        bestIdx = i;
      }
    }

    selected.push(remaining[bestIdx]!);
    remaining.splice(bestIdx, 1);
  }

  return selected;
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * (b[i] || 0), 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return magA && magB ? dot / (magA * magB) : 0;
}

function stringToVector(s: string): number[] {
  const words = s.toLowerCase().split(/\s+/);
  const freq = new Map<string, number>();
  for (const word of words) {
    freq.set(word, (freq.get(word) || 0) + 1);
  }
  return Array.from(freq.values());
}
