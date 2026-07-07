import { NextRequest, NextResponse } from "next/server";
import { generateWithRag } from "@/chat/generate";
import { prisma } from "@/lib/prisma";
import { chatRequestSchema } from "@/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = chatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.message }, { status: 400 });
    }

    const { messages, conversationId, stream, includeSources, includeConfidence } = parsed.data;

    const userSettings = await prisma.userSetting.findFirst();
    const llmConfig = {
      provider: (userSettings?.aiProvider || "OPENAI") as any,
      model: "gpt-4o",
      temperature: userSettings?.temperature ?? 0.7,
      maxTokens: userSettings?.maxTokens ?? 4096,
    };

    const result = await generateWithRag({
      messages,
      llmConfig,
      includeSources,
      includeConfidence,
      stream,
    });

    if (conversationId) {
      await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          messages: messages as any,
          title: messages[0]?.content?.slice(0, 100) || "New Conversation",
        },
      });
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Chat failed" },
      { status: 500 }
    );
  }
}
