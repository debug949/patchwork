import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { getRepoCommits, getCommitsBetweenRefs } from "@/lib/github";
import { generateChangelog } from "@/lib/ai";

export const maxDuration = 45;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const repo = await prisma.repository.findFirst({
    where: { id, userId: session.userId },
  });

  if (!repo) {
    return NextResponse.json({ error: "Repository not found" }, { status: 404 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    since?: string;
    version?: string;
    perPage?: number;
    fromTag?: string;
    toTag?: string;
  };

  let commits;
  try {
    if (body.fromTag && body.toTag) {
      // Both tags → compare API for exact commit range
      commits = await getCommitsBetweenRefs(
        session.githubAccessToken,
        repo.owner,
        repo.name,
        body.fromTag,
        body.toTag
      );
    } else if (body.toTag) {
      // Only toTag → all commits up to that tag (last 50)
      commits = await getRepoCommits(
        session.githubAccessToken,
        repo.owner,
        repo.name,
        { sha: body.toTag, perPage: 50 }
      );
    } else {
      // Recent commits mode
      commits = await getRepoCommits(
        session.githubAccessToken,
        repo.owner,
        repo.name,
        { since: body.since, perPage: body.perPage ?? 50 }
      );
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to fetch commits";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  if (commits.length === 0) {
    return NextResponse.json({ error: "No commits found in that range" }, { status: 400 });
  }

  const content = await generateChangelog(commits);

  const newest = commits[0];
  const oldest = commits[commits.length - 1];
  const dateStr = new Date(newest.commit.author.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // version: explicit > toTag auto-label > null
  const resolvedVersion = body.version ?? (body.toTag ? body.toTag : null);

  const title = resolvedVersion
    ? `${resolvedVersion} — ${dateStr}`
    : body.fromTag && body.toTag
      ? `${body.fromTag}…${body.toTag} — ${dateStr}`
      : `${commits.length} commits through ${dateStr}`;

  const changelog = await prisma.changelog.create({
    data: {
      repositoryId: repo.id,
      title,
      version: resolvedVersion,
      fromSha: oldest.sha,
      toSha: newest.sha,
      commitCount: commits.length,
      content: content as object,
      rawCommits: commits.map((c) => ({
        sha: c.sha,
        message: c.commit.message,
        author: c.commit.author.name,
        date: c.commit.author.date,
        url: c.html_url,
      })) as object,
    },
  });

  await prisma.repository.update({
    where: { id: repo.id },
    data: { lastSyncedAt: new Date() },
  });

  return NextResponse.json(changelog, { status: 201 });
}
