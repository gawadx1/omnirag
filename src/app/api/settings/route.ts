import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/crypto";
import { settingsUpdateSchema, providerCredentialSchema } from "@/schemas";

export async function GET() {
  try {
    const settings = await prisma.userSetting.findFirst();
    const credentials = await prisma.providerCredential.findMany();

    const sanitizedCredentials = credentials.map((c) => ({
      provider: c.provider,
      baseUrl: c.baseUrl,
      model: c.model,
      hasApiKey: !!c.apiKey,
    }));

    return NextResponse.json({
      success: true,
      data: {
        settings,
        credentials: sanitizedCredentials,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = settingsUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.message }, { status: 400 });
    }

    const existing = await prisma.userSetting.findFirst();
    if (existing) {
      await prisma.userSetting.update({
        where: { id: existing.id },
        data: parsed.data,
      });
    } else {
      await prisma.userSetting.create({
        data: { userId: "system", ...parsed.data },
      });
    }

    return NextResponse.json({ success: true, message: "Settings updated" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = providerCredentialSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.message }, { status: 400 });
    }

    const encryptedApiKey = parsed.data.apiKey ? encrypt(parsed.data.apiKey) : "";

    await prisma.providerCredential.upsert({
      where: { userId_provider: { userId: "system", provider: parsed.data.provider as any } },
      update: {
        apiKey: encryptedApiKey,
        baseUrl: parsed.data.baseUrl,
        model: parsed.data.model,
      },
      create: {
        userId: "system",
        provider: parsed.data.provider as any,
        apiKey: encryptedApiKey,
        baseUrl: parsed.data.baseUrl,
        model: parsed.data.model,
      },
    });

    return NextResponse.json({ success: true, message: "Credentials saved" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to save credentials" },
      { status: 500 }
    );
  }
}
