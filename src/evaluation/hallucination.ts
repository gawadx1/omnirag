import { getLLMProvider } from "@/lib/llm";
import type { LLMModelConfig } from "@/types";

export interface HallucinationResult {
  score: number;
  isHallucinated: boolean;
  unsupportedStatements: string[];
  warnings: string[];
}

export async function detectHallucination(
  answer: string,
  contexts: string[],
  llmConfig: LLMModelConfig
): Promise<HallucinationResult> {
  const provider = getLLMProvider(llmConfig);

  const response = await provider.chat({
    messages: [
      {
        role: "system",
        content: `You are a hallucination detection expert. Analyze the answer against the provided context.
Return a JSON object with:
- "score": number between 0 and 1 (0 = no hallucination, 1 = completely hallucinated)
- "unsupported_statements": array of strings, each being a statement in the answer not supported by context
- "warnings": array of warning strings

Only return valid JSON.`,
      },
      {
        role: "user",
        content: `Context:\n${contexts.join("\n---\n")}\n\nAnswer:\n${answer}`,
      },
    ],
  });

  try {
    const parsed = JSON.parse(response.trim());
    const unsupported = parsed.unsupported_statements || [];
    const warnings = parsed.warnings || [];
    const score = Math.min(1, Math.max(0, parsed.score || 0));

    return {
      score,
      isHallucinated: score > 0.3,
      unsupportedStatements: unsupported,
      warnings,
    };
  } catch {
    return {
      score: 0,
      isHallucinated: false,
      unsupportedStatements: [],
      warnings: ["Unable to parse hallucination detection result"],
    };
  }
}

export async function validateCitations(
  answer: string,
  sources: { content: string }[]
): Promise<{ valid: boolean; invalidCitations: string[] }> {
  const citationRegex = /\[(\d+)\]/g;
  const citations = new Set<string>();
  let match;

  while ((match = citationRegex.exec(answer)) !== null) {
    citations.add(match[1]!);
  }

  const invalidCitations: string[] = [];
  for (const citation of citations) {
    const idx = parseInt(citation) - 1;
    if (idx < 0 || idx >= sources.length) {
      invalidCitations.push(citation);
    }
  }

  return {
    valid: invalidCitations.length === 0,
    invalidCitations,
  };
}

export async function checkFaithfulness(
  answer: string,
  contexts: string[],
  llmConfig: LLMModelConfig
): Promise<number> {
  const provider = getLLMProvider(llmConfig);

  const response = await provider.chat({
    messages: [
      {
        role: "system",
        content:
          "Rate the faithfulness of the answer to the provided context on a scale of 0 to 1. Return only the number.",
      },
      {
        role: "user",
        content: `Context:\n${contexts.join("\n")}\n\nAnswer:\n${answer}`,
      },
    ],
  });

  try {
    return Math.min(1, Math.max(0, parseFloat(response.trim())));
  } catch {
    return 0.5;
  }
}
