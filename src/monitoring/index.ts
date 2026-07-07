import { prisma } from "@/lib/prisma";
import type { DashboardStats, EvaluationMetrics } from "@/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    totalDocuments,
    totalChunks,
    totalQueries,
    totalUsers,
    storageResult,
    avgLatencyResult,
    evaluations,
  ] = await Promise.all([
    prisma.document.count(),
    prisma.chunk.count(),
    prisma.query.count(),
    prisma.user.count(),
    prisma.document.aggregate({ _sum: { size: true } }),
    prisma.query.aggregate({ _avg: { latency: true } }),
    prisma.evaluationResult.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);

  const avgMetrics = calculateAverageMetrics(evaluations);

  return {
    totalDocuments,
    totalChunks,
    totalQueries,
    totalUsers,
    averageLatency: avgLatencyResult._avg.latency || 0,
    totalEmbeddings: totalChunks,
    storageUsed: storageResult._sum.size || 0,
    averageResponseTime: avgLatencyResult._avg.latency || 0,
    hallucinationRate: avgMetrics ? 1 - avgMetrics.faithfulness : 0,
    evaluationScores: avgMetrics || {
      faithfulness: 0,
      answerRelevancy: 0,
      contextPrecision: 0,
      contextRecall: 0,
      latency: 0,
      cost: 0,
    },
  };
}

function calculateAverageMetrics(
  evaluations: { faithfulness: number | null; answerRelevancy: number | null; contextPrecision: number | null; contextRecall: number | null; latency: number | null; cost: number | null }[]
): EvaluationMetrics | null {
  if (!evaluations.length) return null;

  let faithfulness = 0, answerRelevancy = 0, contextPrecision = 0, contextRecall = 0, latency = 0, cost = 0;
  for (const e of evaluations) {
    faithfulness += e.faithfulness ?? 0;
    answerRelevancy += e.answerRelevancy ?? 0;
    contextPrecision += e.contextPrecision ?? 0;
    contextRecall += e.contextRecall ?? 0;
    latency += e.latency ?? 0;
    cost += e.cost ?? 0;
  }

  const count = evaluations.length;
  return {
    faithfulness: faithfulness / count,
    answerRelevancy: answerRelevancy / count,
    contextPrecision: contextPrecision / count,
    contextRecall: contextRecall / count,
    latency: latency / count,
    cost: cost / count,
  };
}

export async function getRecentQueries(limit: number = 10) {
  return prisma.query.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { user: { select: { name: true, email: true } } },
  });
}

export async function getEvaluationTrend(days: number = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const evaluations = await prisma.evaluationResult.findMany({
    where: { createdAt: { gte: startDate } },
    orderBy: { createdAt: "asc" },
  });

  const trend: Record<string, { faithfulness: number[]; relevancy: number[] }> = {};
  for (const evalResult of evaluations) {
    const date = evalResult.createdAt.toISOString().split("T")[0] || "unknown";
    if (!trend[date]) trend[date] = { faithfulness: [], relevancy: [] };
    if (evalResult.faithfulness !== null) trend[date].faithfulness.push(evalResult.faithfulness);
    if (evalResult.answerRelevancy !== null) trend[date].relevancy.push(evalResult.answerRelevancy);
  }

  return Object.entries(trend).map(([date, values]) => ({
    date,
    faithfulness: average(values.faithfulness),
    answerRelevancy: average(values.relevancy),
  }));
}

function average(arr: number[]): number {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
