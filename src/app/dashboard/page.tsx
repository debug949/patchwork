import { redirect } from "next/navigation";
import Link from "next/link";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { ConnectRepo } from "@/components/ConnectRepo";
import { DashboardRepoList } from "@/components/DashboardRepoList";

export const metadata = { title: "Dashboard — Patchwork" };

export default async function DashboardPage() {
  const session = await requireSession();
  if (!session) redirect("/login");

  const repos = await prisma.repository.findMany({
    where: { userId: session.userId },
    include: { _count: { select: { changelogs: true } } },
    orderBy: { createdAt: "desc" },
  });

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
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {session.githubAvatarUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.githubAvatarUrl}
              alt={session.githubLogin}
              style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid var(--color-border)" }}
            />
          )}
          <span style={{ color: "var(--color-muted)", fontSize: 13 }}>
            {session.githubLogin}
          </span>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              style={{
                background: "none",
                border: "1px solid var(--color-border)",
                color: "var(--color-muted)",
                padding: "5px 12px",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main style={{ maxWidth: 840, margin: "0 auto", padding: "40px 24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
              Repositories
            </h1>
            <p style={{ color: "var(--color-muted)", fontSize: 13, marginTop: 4 }}>
              {repos.length === 0
                ? "Connect a GitHub repository to start generating changelogs."
                : `${repos.length} connected repositor${repos.length === 1 ? "y" : "ies"}`}
            </p>
          </div>
          <DashboardRepoList initialRepos={repos} userId={session.userId} />
        </div>

        {repos.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {repos.map((repo) => (
              <Link
                key={repo.id}
                href={`/repos/${repo.id}`}
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  padding: "16px 20px",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontWeight: 600,
                      fontSize: 14,
                      color: "var(--color-fg)",
                    }}
                  >
                    {repo.fullName}
                  </div>
                  {repo.description && (
                    <div
                      style={{
                        color: "var(--color-muted)",
                        fontSize: 13,
                        marginTop: 4,
                      }}
                    >
                      {repo.description}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  {repo.isPrivate && (
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--color-muted)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 4,
                        padding: "2px 6px",
                      }}
                    >
                      private
                    </span>
                  )}
                  <span style={{ color: "var(--color-muted)", fontSize: 12 }}>
                    {repo._count.changelogs} changelog{repo._count.changelogs !== 1 ? "s" : ""}
                  </span>
                  <span style={{ color: "var(--color-muted)", fontSize: 16 }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "60px 24px",
        border: "1px dashed var(--color-border)",
        borderRadius: 8,
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 16 }}>📋</div>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>No repositories yet</div>
      <div style={{ color: "var(--color-muted)", fontSize: 13 }}>
        Connect a GitHub repository to start generating changelogs.
      </div>
    </div>
  );
}
