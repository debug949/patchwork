import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import { getUserRepos } from "@/lib/github";

// GET /api/repos/github-list — fetch user's GitHub repos for the picker
export async function GET() {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const repos = await getUserRepos(session.githubAccessToken);
    return NextResponse.json(repos);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "GitHub API error";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
