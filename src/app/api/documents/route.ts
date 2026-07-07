import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { documentUploadSchema } from "@/schemas";
import { ingestDocument, deleteDocument as removeDocument } from "@/ingestion";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const search = searchParams.get("search") || "";

    const where = search
      ? { originalName: { contains: search, mode: "insensitive" as const } }
      : {};

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { _count: { select: { chunks: true } } },
      }),
      prisma.document.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: documents.map((doc) => ({
        id: doc.id,
        filename: doc.originalName,
        mimeType: doc.mimeType,
        size: doc.size,
        status: doc.status,
        version: doc.version,
        chunkCount: doc._count.chunks,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

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
      { success: false, error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Document ID required" }, { status: 400 });
    }

    await removeDocument(id);
    return NextResponse.json({ success: true, message: "Document deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete document" },
      { status: 500 }
    );
  }
}
