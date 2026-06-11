import { NextRequest, NextResponse } from "next/server";
import { getPublicRepoCommits } from "@/lib/github";
import { generateChangelog } from "@/lib/ai";

export const maxDuration = 45;

// Only these repos are allowed for the demo to prevent abuse
const ALLOWED_REPOS = new Set([
  "debug949/patchwork",
  "debug949/shipsafe",
  "typicode/json-server",
  "sindresorhus/ora",
  "tailwindlabs/tailwindcss",
  "vitejs/vite",
]);

export async function POST(req: NextRequest) {
  let body: { owner?: string; repo?: string };
  try {
    body = (await req.json()) as { owner?: string; repo?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { owner, repo } = body;

  if (!owner || !repo) {
    return NextResponse.json({ error: "owner and repo are required" }, { status: 400 });
  }

  // Validate characters (prevent injection)
  if (!/^[a-zA-Z0-9_.-]{1,64}$/.test(owner) || !/^[a-zA-Z0-9_.-]{1,64}$/.test(repo)) {
    return NextResponse.json({ error: "Invalid repository name" }, { status: 400 });
  }

  const fullName = `${owner}/${repo}`.toLowerCase();
  if (!ALLOWED_REPOS.has(fullName)) {
    return NextResponse.json(
      { error: "Demo is limited to preset repositories. Sign in to analyze any repo." },
      { status: 403 }
    );
  }

  let commits;
  try {
    commits = await getPublicRepoCommits(owner, repo, 25);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to fetch commits";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  if (commits.length === 0) {
    return NextResponse.json({ error: "No commits found" }, { status: 400 });
  }

  const content = await generateChangelog(commits);

  const newest = commits[0];
  const dateStr = new Date(newest.commit.author.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return NextResponse.json(
    {
      owner,
      repo,
      commitCount: commits.length,
      generatedAt: dateStr,
      content,
    },
    {
      headers: {
        // Cache for 5 min — same repo hits should reuse
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}
