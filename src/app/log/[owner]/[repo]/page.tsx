import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ChangelogEntry } from "@/components/ChangelogEntry";
import type { ChangelogContent } from "@/lib/ai";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}): Promise<Metadata> {
  const { owner, repo } = await params;
  return {
    title: `${owner}/${repo} Changelog — Patchwork`,
    description: `Changelog for ${owner}/${repo}`,
  };
}

export default async function PublicRepoPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo } = await params;
  const fullName = `${owner}/${repo}`;

  const repository = await prisma.repository.findFirst({
    where: { fullName },
    include: {
      changelogs: {
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!repository) notFound();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

  return (
    <div style={{ minHeight: "100vh" }}>
      <header
        style={{
          borderBottom: "1px solid var(--color-border)",
          padding: "0 24px",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            fontSize: 16,
            textDecoration: "none",
            color: "var(--color-fg)",
          }}
        >
          patchwork
        </Link>
        <a
          href={`https://github.com/${fullName}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "var(--color-muted)",
            fontSize: 12,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <GitHubIcon />
          {fullName}
        </a>
      </header>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
            <h1
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 22,
                fontWeight: 700,
                margin: 0,
              }}
            >
              {fullName}
            </h1>
            <a
              href={`${appUrl}/embed/${owner}/${repo}`}
              target="_blank"
              style={{
                fontSize: 11,
                color: "var(--color-muted)",
                border: "1px solid var(--color-border)",
                borderRadius: 4,
                padding: "2px 8px",
                textDecoration: "none",
              }}
            >
              embed
            </a>
          </div>
          {repository.description && (
            <p style={{ color: "var(--color-muted)", margin: 0, fontSize: 14 }}>
              {repository.description}
            </p>
          )}
          <p style={{ color: "var(--color-muted)", fontSize: 12, marginTop: 8 }}>
            {repository.changelogs.length} changelog
            {repository.changelogs.length !== 1 ? "s" : ""} · Powered by{" "}
            <Link href="/" style={{ color: "var(--color-blue-light)" }}>
              Patchwork
            </Link>
          </p>
        </div>

        {repository.changelogs.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 24px",
              border: "1px dashed var(--color-border)",
              borderRadius: 8,
              color: "var(--color-muted)",
            }}
          >
            No changelogs published yet.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {repository.changelogs.map((cl) => (
              <ChangelogEntry
                key={cl.id}
                title={cl.title}
                version={cl.version}
                createdAt={cl.createdAt}
                commitCount={cl.commitCount}
                content={cl.content as unknown as ChangelogContent}
                slug={cl.slug}
                owner={owner}
                repo={repo}
                showLink
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
