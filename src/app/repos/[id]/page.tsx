import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { GenerateForm } from "@/components/GenerateForm";
import { ChangelogEntry } from "@/components/ChangelogEntry";
import type { ChangelogContent } from "@/lib/ai";

export default async function RepoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession();
  if (!session) redirect("/login");

  const { id } = await params;

  const repo = await prisma.repository.findFirst({
    where: { id, userId: session.userId },
    include: {
      changelogs: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!repo) notFound();

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Nav */}
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
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
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
          <span style={{ color: "var(--color-border)" }}>/</span>
          <Link
            href="/dashboard"
            style={{ color: "var(--color-muted)", fontSize: 13, textDecoration: "none" }}
          >
            Dashboard
          </Link>
          <span style={{ color: "var(--color-border)" }}>/</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>
            {repo.fullName}
          </span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <a
            href={`https://github.com/${repo.fullName}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--color-muted)",
              fontSize: 12,
              textDecoration: "none",
              border: "1px solid var(--color-border)",
              padding: "5px 10px",
              borderRadius: 6,
            }}
          >
            View on GitHub →
          </a>
          <a
            href={`/log/${repo.owner}/${repo.name}`}
            target="_blank"
            style={{
              color: "var(--color-blue-light)",
              fontSize: 12,
              textDecoration: "none",
              border: "1px solid var(--color-blue)",
              padding: "5px 10px",
              borderRadius: 6,
            }}
          >
            Public Page →
          </a>
        </div>
      </header>

      <main style={{ maxWidth: 840, margin: "0 auto", padding: "40px 24px" }}>
        {/* Repo header */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 22,
              fontWeight: 700,
              margin: 0,
            }}
          >
            {repo.fullName}
          </h1>
          {repo.description && (
            <p style={{ color: "var(--color-muted)", marginTop: 8, fontSize: 14 }}>
              {repo.description}
            </p>
          )}
          {repo.lastSyncedAt && (
            <p style={{ color: "var(--color-muted)", fontSize: 12, marginTop: 4 }}>
              Last synced{" "}
              {new Date(repo.lastSyncedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
        </div>

        {/* Generate */}
        <div style={{ marginBottom: 32 }}>
          <GenerateForm repoId={repo.id} />
        </div>

        {/* Embed snippet */}
        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            padding: "16px 20px",
            marginBottom: 32,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
            Embed widget
          </div>
          <code
            style={{
              display: "block",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--color-muted)",
              background: "var(--color-canvas)",
              border: "1px solid var(--color-border-muted)",
              borderRadius: 4,
              padding: "10px 14px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
            }}
          >
            {`<iframe src="${process.env.NEXT_PUBLIC_APP_URL}/embed/${repo.owner}/${repo.name}" width="100%" height="600" frameborder="0"></iframe>`}
          </code>
        </div>

        {/* Changelogs */}
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
            Changelogs
            <span
              style={{
                color: "var(--color-muted)",
                fontSize: 13,
                fontWeight: 400,
                marginLeft: 8,
              }}
            >
              {repo.changelogs.length}
            </span>
          </h2>

          {repo.changelogs.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 24px",
                border: "1px dashed var(--color-border)",
                borderRadius: 8,
                color: "var(--color-muted)",
                fontSize: 13,
              }}
            >
              No changelogs yet. Click Generate above to create your first one.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {repo.changelogs.map((cl) => (
                <ChangelogEntry
                  key={cl.id}
                  title={cl.title}
                  version={cl.version}
                  createdAt={cl.createdAt}
                  commitCount={cl.commitCount}
                  content={cl.content as unknown as ChangelogContent}
                  slug={cl.slug}
                  owner={repo.owner}
                  repo={repo.name}
                  showLink
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
