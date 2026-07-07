import { prisma } from "@/lib/prisma";
import { Redis } from "ioredis";

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;
  if (process.env.REDIS_URL) {
    redis = new Redis(process.env.REDIS_URL);
  }
  return redis;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = getRedis();
  if (!client) return null;
  const value = await client.get(key);
  return value ? JSON.parse(value) : null;
}

export async function cacheSet(key: string, value: unknown, ttlSeconds: number = 3600): Promise<void> {
  const client = getRedis();
  if (!client) return;
  await client.setex(key, ttlSeconds, JSON.stringify(value));
}

export async function cacheDelete(key: string): Promise<void> {
  const client = getRedis();
  if (!client) return;
  await client.del(key);
}

export async function trackUsage(userId: string, action: string): Promise<void> {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      metadata: { timestamp: new Date().toISOString() },
    },
  });
}

export function logInfo(message: string, data?: Record<string, unknown>): void {
  console.log(JSON.stringify({ level: "info", message, timestamp: new Date().toISOString(), ...data }));
}

export function logError(message: string, error?: unknown): void {
  console.error(JSON.stringify({
    level: "error",
    message,
    error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
    timestamp: new Date().toISOString(),
  }));
}

export function logWarn(message: string, data?: Record<string, unknown>): void {
  console.warn(JSON.stringify({ level: "warn", message, timestamp: new Date().toISOString(), ...data }));
}
