import { getLLMProvider } from "@/lib/llm";
import type { LLMModelConfig } from "@/types";

export interface QueryProcessorOptions {
  config: LLMModelConfig;
  history?: { role: string; content: string }[];
}

export async function rewriteQuery(
  query: string,
  options: QueryProcessorOptions
): Promise<string> {
  const provider = getLLMProvider(options.config);
  const response = await provider.chat({
    messages: [
      {
        role: "system",
        content:
          "Rewrite the following query to be more specific and optimized for retrieval. Return only the rewritten query.",
      },
      { role: "user", content: query },
    ],
  });
  return response.trim();
}

export async function generateMultiQueries(
  query: string,
  count: number,
  options: QueryProcessorOptions
): Promise<string[]> {
  const provider = getLLMProvider(options.config);
  const response = await provider.chat({
    messages: [
      {
        role: "system",
        content: `Generate ${count} different versions of the given query to improve retrieval recall. Return each query on a new line.`,
      },
      { role: "user", content: query },
    ],
  });
  return response
    .split("\n")
    .map((q) => q.trim())
    .filter(Boolean);
}

export async function generateHydeDocument(
  query: string,
  options: QueryProcessorOptions
): Promise<string> {
  const provider = getLLMProvider(options.config);
  const response = await provider.chat({
    messages: [
      {
        role: "system",
        content:
          "Generate a hypothetical document that would answer the following query. Be detailed and factual.",
      },
      { role: "user", content: query },
    ],
  });
  return response.trim();
}

export async function expandContext(
  query: string,
  options: QueryProcessorOptions
): Promise<string> {
  const provider = getLLMProvider(options.config);
  const response = await provider.chat({
    messages: [
      {
        role: "system",
        content:
          "Expand the following query with related terms and context to improve search retrieval. Return only the expanded query.",
      },
      { role: "user", content: query },
    ],
  });
  return response.trim();
}

export async function historyAwareQuery(
  query: string,
  history: { role: string; content: string }[],
  options: QueryProcessorOptions
): Promise<string> {
  if (!history.length) return query;

  const provider = getLLMProvider(options.config);
  const historyText = history
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  const response = await provider.chat({
    messages: [
      {
        role: "system",
        content:
          "Given the conversation history and a new query, reformulate the query to be self-contained and ready for retrieval. Return only the reformulated query.",
      },
      {
        role: "user",
        content: `History:\n${historyText}\n\nNew query: ${query}`,
      },
    ],
  });
  return response.trim();
}
