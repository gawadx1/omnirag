import { NextRequest, NextResponse } from "next/server";
import { ingestDocument } from "@/ingestion";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const document = await ingestDocument({
      userId: "system",
      buffer,
      filename: file.name,
      mimeType: file.type || undefined,
    });

    return NextResponse.json({ success: true, data: document });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Ingestion failed" },
      { status: 500 }
    );
  }
}
