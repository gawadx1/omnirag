import { NextRequest, NextResponse } from "next/server";
import { evaluateRag } from "@/evaluation/metrics";
import { getLLMProvider } from "@/lib/llm";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, answer, contexts } = body;
    if (!query || !answer) {
      return NextResponse.json({ success: false, error: "Query and answer required" }, { status: 400 });
    }

    const llmConfig = {
      provider: "OPENAI" as const,
      model: "gpt-4o",
      temperature: 0.7,
      maxTokens: 4096,
    };

    const startTime = Date.now();
    const metrics = await evaluateRag(
      query,
      answer,
      contexts || [],
      llmConfig,
      Date.now() - startTime,
      0.01
    );

    const queryRecord = await prisma.query.create({
      data: {
        userId: "system",
        query,
        response: answer,
        latency: metrics.latency,
        cost: metrics.cost,
      },
    });

    await prisma.evaluationResult.create({
      data: {
        queryId: queryRecord.id,
        faithfulness: metrics.faithfulness,
        answerRelevancy: metrics.answerRelevancy,
        contextPrecision: metrics.contextPrecision,
        contextRecall: metrics.contextRecall,
        latency: metrics.latency,
        cost: metrics.cost,
      },
    });

    return NextResponse.json({ success: true, data: metrics });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Evaluation failed" },
      { status: 500 }
    );
  }
}
