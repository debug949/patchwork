import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/db";

// DELETE /api/repos/[id] — disconnect a repo
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const repo = await prisma.repository.findFirst({
    where: { id, userId: session.userId },
  });

  if (!repo) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.repository.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}

// GET /api/repos/[id] — get repo with changelogs
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const repo = await prisma.repository.findFirst({
    where: { id, userId: session.userId },
    include: {
      changelogs: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          version: true,
          slug: true,
          commitCount: true,
          isPublished: true,
          createdAt: true,
          content: true,
        },
      },
    },
  });

  if (!repo) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(repo);
}
