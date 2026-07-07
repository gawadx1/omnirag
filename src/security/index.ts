import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export type Permission = "read" | "write" | "delete" | "admin";

const rolePermissions: Record<string, Permission[]> = {
  ADMIN: ["read", "write", "delete", "admin"],
  MEMBER: ["read", "write"],
  VIEWER: ["read"],
};

export function hasPermission(role: string, permission: Permission): boolean {
  return (rolePermissions[role] || []).includes(permission);
}

export async function getCurrentUser() {
  try {
    const headersList = await headers();
    const userId = headersList.get("x-user-id");
    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { settings: true },
    });

    return user;
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Authentication required");
  return user;
}

export async function requireRole(permission: Permission) {
  const user = await requireAuth();
  if (!hasPermission(user.role, permission)) {
    throw new Error("Insufficient permissions");
  }
  return user;
}

export function checkRateLimit(
  ip: string,
  action: string,
  maxRequests: number = 100,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetAt: Date } {
  return { allowed: true, remaining: maxRequests, resetAt: new Date(Date.now() + windowMs) };
}

export function validateCsrfToken(token: string, sessionToken: string): boolean {
  return token === sessionToken;
}

export function generateAuditLog(params: {
  userId?: string;
  action: string;
  entity?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) {
  return prisma.auditLog.create({
    data: {
      userId: params.userId,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
      metadata: (params.metadata || {}) as any,
    },
  });
}
