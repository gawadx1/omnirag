import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, events } = body;

    if (!url || !events?.length) {
      return NextResponse.json({ success: false, error: "URL and events required" }, { status: 400 });
    }

    const webhook = await prisma.webhook.create({
      data: {
        userId: "system",
        url,
        events,
        secret: Math.random().toString(36).slice(2),
      },
    });

    return NextResponse.json({ success: true, data: webhook });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create webhook" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const webhooks = await prisma.webhook.findMany();
    return NextResponse.json({ success: true, data: webhooks });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch webhooks" },
      { status: 500 }
    );
  }
}
