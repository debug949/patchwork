import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ChangelogEntry } from "@/components/ChangelogEntry";
import type { ChangelogContent } from "@/lib/ai";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ owner: string; repo: string; slug: string }>;
}): Promise<Metadata> {
  const { owner, repo, slug } = await params;
  const changelog = await prisma.changelog.findUnique({
    where: { slug },
    select: { title: true },
  });
  return {
    title: changelog
      ? `${changelog.title} — ${owner}/${repo} — Patchwork`
      : "Changelog — Patchwork",
  };
}

export default async function SingleChangelogPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string; slug: string }>;
}) {
  const { owner, repo, slug } = await params;
  const fullName = `${owner}/${repo}`;

  const changelog = await prisma.changelog.findFirst({
    where: {
      slug,
      isPublished: true,
      repository: { fullName },
    },
    include: { repository: true },
  });

  if (!changelog) notFound();

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-canvas)" }}>
      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid var(--color-border)",
          padding: "0 24px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          background: "rgba(13,17,23,0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-poppins, sans-serif)",
              fontWeight: 700,
              fontSize: 17,
              textDecoration: "none",
              color: "var(--color-fg)",
              letterSpacing: "-0.03em",
            }}
          >
            patchwork
          </Link>
          <span style={{ color: "var(--color-border)", fontSize: 16 }}>/</span>
          <Link
            href={`/log/${owner}/${repo}`}
            style={{
              color: "var(--color-muted)",
              fontSize: 14,
              textDecoration: "none",
              fontFamily: "var(--font-poppins, sans-serif)",
            }}
          >
            {fullName}
          </Link>
        </div>
        <a
          href={`https://github.com/${fullName}/compare/${changelog.fromSha ?? ""}...${changelog.toSha ?? ""}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "var(--color-muted)",
            fontSize: 13,
            textDecoration: "none",
            border: "1px solid var(--color-border)",
            padding: "5px 12px",
            borderRadius: 8,
            fontFamily: "var(--font-poppins, sans-serif)",
          }}
        >
          View diff on GitHub →
        </a>
      </header>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "52px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <Link
            href={`/log/${owner}/${repo}`}
            style={{
              color: "var(--color-blue-light)",
              fontSize: 14,
              textDecoration: "none",
              fontFamily: "var(--font-poppins, sans-serif)",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            ← All changelogs
          </Link>
        </div>

        <ChangelogEntry
          title={changelog.title}
          version={changelog.version}
          createdAt={changelog.createdAt}
          commitCount={changelog.commitCount}
          content={changelog.content as unknown as ChangelogContent}
        />

        {/* Raw commits */}
        {Array.isArray(changelog.rawCommits) && (changelog.rawCommits as unknown as RawCommit[]).length > 0 && (
          <details style={{ marginTop: 28 }}>
            <summary
              style={{
                cursor: "pointer",
                color: "var(--color-muted)",
                fontSize: 14,
                padding: "10px 0",
                userSelect: "none",
                fontFamily: "var(--font-poppins, sans-serif)",
              }}
            >
              {(changelog.rawCommits as unknown as RawCommit[]).length} raw commits
            </summary>
            <div
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: 10,
                marginTop: 10,
                overflow: "hidden",
              }}
            >
              {(changelog.rawCommits as unknown as RawCommit[]).map((c, i) => (
                <div
                  key={c.sha}
                  style={{
                    padding: "12px 18px",
                    borderBottom:
                      i < (changelog.rawCommits as unknown as RawCommit[]).length - 1
                        ? "1px solid var(--color-border-muted)"
                        : "none",
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-start",
                  }}
                >
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "ui-monospace, monospace",
                      fontSize: 12,
                      color: "var(--color-blue-light)",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                      marginTop: 2,
                    }}
                  >
                    {c.sha.slice(0, 7)}
                  </a>
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        lineHeight: 1.55,
                        fontFamily: "var(--font-poppins, sans-serif)",
                        color: "var(--color-fg)",
                      }}
                    >
                      {c.message.split("\n")[0]}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--color-muted)",
                        marginTop: 3,
                        fontFamily: "var(--font-poppins, sans-serif)",
                      }}
                    >
                      {c.author} ·{" "}
                      {new Date(c.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </details>
        )}

        <div
          style={{
            marginTop: 40,
            padding: "20px 0",
            borderTop: "1px solid var(--color-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link
            href={`/log/${owner}/${repo}`}
            style={{
              color: "var(--color-muted)",
              fontSize: 14,
              textDecoration: "none",
              fontFamily: "var(--font-poppins, sans-serif)",
            }}
          >
            ← Back to all changelogs
          </Link>
          <span style={{ color: "var(--color-muted)", fontSize: 13, fontFamily: "var(--font-poppins, sans-serif)" }}>
            Generated by{" "}
            <Link href="/" style={{ color: "var(--color-blue-light)", textDecoration: "none" }}>
              Patchwork
            </Link>
          </span>
        </div>
      </main>
    </div>
  );
}

interface RawCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}
