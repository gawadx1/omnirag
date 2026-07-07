import { getLLMProvider } from "@/lib/llm";
import type { LLMModelConfig, ChatMessage, Source } from "@/types";
import { retrieve, hybridRetrieve } from "@/retrieval";
import type { RetrievalOptions } from "@/retrieval";

export interface GenerateOptions {
  messages: { role: "user" | "assistant" | "system"; content: string }[];
  llmConfig: LLMModelConfig;
  retrievalOptions?: RetrievalOptions;
  enableHybridSearch?: boolean;
  includeSources?: boolean;
  includeConfidence?: boolean;
  stream?: boolean;
  onToken?: (token: string) => void;
}

export interface GenerateResult {
  content: string;
  sources: Source[];
  confidence?: number;
  hallucinationScore?: number;
  warnings?: string[];
}

export async function generateWithRag(options: GenerateOptions): Promise<GenerateResult> {
  const query = options.messages[options.messages.length - 1]?.content || "";
  let sources: Source[] = [];

  if (options.retrievalOptions) {
    const results = options.enableHybridSearch
      ? await hybridRetrieve(options.retrievalOptions)
      : await retrieve(options.retrievalOptions);

    sources = results.map((r) => ({
      id: r.id,
      documentId: r.documentId,
      documentName: r.documentName || "Unknown",
      content: r.content,
      score: r.score,
      metadata: r.metadata,
    }));

    const context = sources.map((s) => s.content).join("\n\n");
    const lastMessage = options.messages[options.messages.length - 1];

    if (lastMessage && lastMessage.role === "user") {
      options.messages[options.messages.length - 1] = {
        role: "user",
        content: `Context:\n${context}\n\nQuestion: ${lastMessage.content}\n\nAnswer the question based on the context provided. If the context doesn't contain relevant information, say so.`,
      };
    }
  }

  const provider = getLLMProvider(options.llmConfig);
  let content: string;

  if (options.stream && provider.stream) {
    const stream = await provider.stream({
      messages: options.messages,
      temperature: options.llmConfig.temperature,
      maxTokens: options.llmConfig.maxTokens,
    });

    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let fullContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        fullContent += value;
        options.onToken?.(value);
      }
    }
    content = fullContent;
  } else {
    content = await provider.chat({
      messages: options.messages,
      temperature: options.llmConfig.temperature,
      maxTokens: options.llmConfig.maxTokens,
    });
  }

  const result: GenerateResult = {
    content,
    sources,
  };

  if (options.includeConfidence) {
    const { detectHallucination } = await import("@/evaluation/hallucination");
    const hallucinationResult = await detectHallucination(
      content,
      sources.map((s) => s.content),
      options.llmConfig
    );
    result.confidence = 1 - hallucinationResult.score;
    result.hallucinationScore = hallucinationResult.score;
    result.warnings = hallucinationResult.warnings;
  }

  return result;
}

export async function generateChatResponse(
  messages: { role: "user" | "assistant" | "system"; content: string }[],
  llmConfig: LLMModelConfig
): Promise<string> {
  const provider = getLLMProvider(llmConfig);
  return provider.chat({ messages });
}

export async function generateStreamResponse(
  messages: { role: "user" | "assistant" | "system"; content: string }[],
  llmConfig: LLMModelConfig,
  onToken: (token: string) => void
): Promise<string> {
  const provider = getLLMProvider(llmConfig);
  if (!provider.stream) {
    const content = await provider.chat({ messages });
    onToken(content);
    return content;
  }

  const stream = await provider.stream({ messages });
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let fullContent = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      fullContent += value;
      onToken(value);
    }
  }

  return fullContent;
}
