import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { getRepoTags } from "@/lib/github";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const repo = await prisma.repository.findFirst({
    where: { id, userId: session.userId },
  });
  if (!repo) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const tags = await getRepoTags(session.githubAccessToken, repo.owner, repo.name);
    return NextResponse.json(tags);
  } catch {
    // Return empty — repo might have no tags; not a fatal error
    return NextResponse.json([]);
  }
}
