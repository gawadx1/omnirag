export interface Reranker {
  rerank(query: string, documents: { id: string; content: string }[]): Promise<{ id: string; score: number }[]>;
}

export class JinaReranker implements Reranker {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async rerank(query: string, documents: { id: string; content: string }[]): Promise<{ id: string; score: number }[]> {
    const response = await fetch("https://api.jina.ai/v1/rerank", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: "jina-reranker-v2-base-multilingual",
        query,
        documents: documents.map((d) => d.content),
      }),
    });

    const data = await response.json();
    return (data.results || []).map((r: any) => ({
      id: documents[r.index]?.id || "",
      score: r.relevance_score || 0,
    }));
  }
}

export class CohereReranker implements Reranker {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async rerank(query: string, documents: { id: string; content: string }[]): Promise<{ id: string; score: number }[]> {
    const response = await fetch("https://api.cohere.com/v1/rerank", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: "rerank-v3.5",
        query,
        documents: documents.map((d) => d.content),
      }),
    });

    const data = await response.json();
    return (data.results || []).map((r: any) => ({
      id: documents[r.index]?.id || "",
      score: r.relevance_score || 0,
    }));
  }
}

export class BGEReranker implements Reranker {
  private apiKey?: string;
  private baseUrl: string;

  constructor(baseUrl: string = "http://localhost:11434", apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async rerank(query: string, documents: { id: string; content: string }[]): Promise<{ id: string; score: number }[]> {
    const response = await fetch(`${this.baseUrl}/api/rerank`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: "bge-reranker-v2-m3",
        query,
        documents: documents.map((d) => d.content),
      }),
    });

    const data = await response.json();
    return (data.results || []).map((r: any, i: number) => ({
      id: documents[i]?.id || "",
      score: r.score || 0,
    }));
  }
}

export class CrossEncoderReranker implements Reranker {
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  async rerank(query: string, documents: { id: string; content: string }[]): Promise<{ id: string; score: number }[]> {
    const pairs = documents.map((d) => ({ query, content: d.content }));
    const response = await fetch("https://api-inference.huggingface.co/models/cross-encoder/ms-marco-MiniLM-L-6-v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
      },
      body: JSON.stringify({ inputs: pairs.map((p) => [p.query, p.content]) }),
    });

    const scores: number[][] = await response.json();
    return documents.map((doc, i) => ({
      id: doc.id,
      score: scores[i]?.[0] || 0,
    }));
  }
}

export function createReranker(provider: "jina" | "cohere" | "bge" | "cross-encoder", apiKey?: string, baseUrl?: string): Reranker {
  switch (provider) {
    case "jina":
      if (!apiKey) throw new Error("Jina AI API key required");
      return new JinaReranker(apiKey);
    case "cohere":
      if (!apiKey) throw new Error("Cohere API key required");
      return new CohereReranker(apiKey);
    case "bge":
      return new BGEReranker(baseUrl, apiKey);
    case "cross-encoder":
      return new CrossEncoderReranker(apiKey);
    default:
      throw new Error(`Unsupported reranker: ${provider}`);
  }
}
