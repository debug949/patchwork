import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/db";

// GET /api/repos — list connected repos for the authed user
export async function GET() {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const repos = await prisma.repository.findMany({
    where: { userId: session.userId },
    include: { _count: { select: { changelogs: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(repos);
}

// POST /api/repos — connect a GitHub repo
export async function POST(req: NextRequest) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as {
    owner: string;
    name: string;
    description?: string | null;
    isPrivate?: boolean;
  };

  if (!body.owner || !body.name) {
    return NextResponse.json({ error: "owner and name required" }, { status: 400 });
  }

  const fullName = `${body.owner}/${body.name}`;

  const repo = await prisma.repository.upsert({
    where: { userId_fullName: { userId: session.userId, fullName } },
    create: {
      userId: session.userId,
      owner: body.owner,
      name: body.name,
      fullName,
      description: body.description ?? null,
      isPrivate: body.isPrivate ?? false,
    },
    update: {
      description: body.description ?? null,
      isPrivate: body.isPrivate ?? false,
    },
  });

  return NextResponse.json(repo, { status: 201 });
}
