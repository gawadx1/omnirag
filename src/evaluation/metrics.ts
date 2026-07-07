import { getLLMProvider } from "@/lib/llm";
import type { LLMModelConfig, EvaluationMetrics } from "@/types";

export async function evaluateFaithfulness(
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
          "Evaluate the faithfulness of the answer to the provided context. Return a score between 0 and 1. Return only the number.",
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
    return 0;
  }
}

export async function evaluateAnswerRelevancy(
  question: string,
  answer: string,
  llmConfig: LLMModelConfig
): Promise<number> {
  const provider = getLLMProvider(llmConfig);
  const response = await provider.chat({
    messages: [
      {
        role: "system",
        content:
          "Evaluate how relevant the answer is to the question. Return a score between 0 and 1. Return only the number.",
      },
      {
        role: "user",
        content: `Question: ${question}\n\nAnswer: ${answer}`,
      },
    ],
  });

  try {
    return Math.min(1, Math.max(0, parseFloat(response.trim())));
  } catch {
    return 0;
  }
}

export async function evaluateContextPrecision(
  question: string,
  contexts: string[],
  llmConfig: LLMModelConfig
): Promise<number> {
  if (!contexts.length) return 0;

  const provider = getLLMProvider(llmConfig);
  let relevantCount = 0;

  for (const context of contexts) {
    const response = await provider.chat({
      messages: [
        {
          role: "system",
          content:
            "Does this context help answer the question? Answer only 'yes' or 'no'.",
        },
        {
          role: "user",
          content: `Question: ${question}\n\nContext: ${context}`,
        },
      ],
    });

    if (response.trim().toLowerCase().startsWith("yes")) {
      relevantCount++;
    }
  }

  return relevantCount / contexts.length;
}

export async function evaluateContextRecall(
  question: string,
  contexts: string[],
  llmConfig: LLMModelConfig
): Promise<number> {
  if (!contexts.length) return 0;

  const provider = getLLMProvider(llmConfig);
  const response = await provider.chat({
    messages: [
      {
        role: "system",
        content:
          "Given a question and retrieved context chunks, estimate what fraction of the information needed to answer the question is present in the context. Return a score between 0 and 1. Return only the number.",
      },
      {
        role: "user",
        content: `Question: ${question}\n\nContext:\n${contexts.join("\n---\n")}`,
      },
    ],
  });

  try {
    return Math.min(1, Math.max(0, parseFloat(response.trim())));
  } catch {
    return 0;
  }
}

export async function evaluateRag(
  question: string,
  answer: string,
  contexts: string[],
  llmConfig: LLMModelConfig,
  latency: number,
  cost: number
): Promise<EvaluationMetrics> {
  const [faithfulness, relevancy, precision, recall] = await Promise.all([
    evaluateFaithfulness(answer, contexts, llmConfig),
    evaluateAnswerRelevancy(question, answer, llmConfig),
    evaluateContextPrecision(question, contexts, llmConfig),
    evaluateContextRecall(question, contexts, llmConfig),
  ]);

  return {
    faithfulness,
    answerRelevancy: relevancy,
    contextPrecision: precision,
    contextRecall: recall,
    latency,
    cost,
  };
}
