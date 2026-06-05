import { redirect } from "next/navigation";
import Link from "next/link";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { DashboardRepoList } from "@/components/DashboardRepoList";
import { AppNav } from "@/components/AppNav";

export const metadata = { title: "Dashboard — Patchwork" };

export default async function DashboardPage() {
  const session = await requireSession();
  if (!session) redirect("/login");

  const repos = await prisma.repository.findMany({
    where: { userId: session.userId },
    include: { _count: { select: { changelogs: true } } },
    orderBy: { createdAt: "desc" },
  });

  const rightSlot = (
    <>
      {session.githubAvatarUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={session.githubAvatarUrl}
          alt={session.githubLogin}
          style={{ width: 30, height: 30, borderRadius: "50%", border: "1px solid var(--color-border)" }}
        />
      )}
      <span style={{ color: "var(--color-muted)", fontSize: 14, fontFamily: "var(--font-poppins, sans-serif)" }}>
        {session.githubLogin}
      </span>
      <form action="/api/auth/logout" method="POST">
        <button
          type="submit"
          style={{
            background: "none",
            border: "1px solid var(--color-border)",
            color: "var(--color-muted)",
            padding: "5px 14px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 13,
            fontFamily: "var(--font-poppins, sans-serif)",
          }}
        >
          Sign out
        </button>
      </form>
    </>
  )

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-canvas)" }}>
      <AppNav rightSlot={rightSlot} />

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "48px 24px" }}>
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 32,
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 700,
                margin: "0 0 6px",
                letterSpacing: "-0.02em",
                fontFamily: "var(--font-poppins, sans-serif)",
                color: "var(--color-fg)",
              }}
            >
              Your repositories
            </h1>
            <p
              style={{
                color: "var(--color-muted)",
                fontSize: 15,
                marginTop: 0,
                lineHeight: 1.6,
                fontFamily: "var(--font-poppins, sans-serif)",
              }}
            >
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
                  borderRadius: 12,
                  padding: "18px 22px",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  flexWrap: "wrap",
                  transition: "border-color 0.15s",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-poppins, sans-serif)",
                      fontWeight: 600,
                      fontSize: 15,
                      color: "var(--color-fg)",
                      marginBottom: repo.description ? 4 : 0,
                    }}
                  >
                    {repo.fullName}
                  </div>
                  {repo.description && (
                    <div
                      style={{
                        color: "var(--color-muted)",
                        fontSize: 14,
                        lineHeight: 1.5,
                        fontFamily: "var(--font-poppins, sans-serif)",
                      }}
                    >
                      {repo.description}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  {repo.isPrivate && (
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--color-muted)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 6,
                        padding: "2px 8px",
                        fontFamily: "var(--font-poppins, sans-serif)",
                      }}
                    >
                      private
                    </span>
                  )}
                  <span style={{ color: "var(--color-muted)", fontSize: 14, fontFamily: "var(--font-poppins, sans-serif)" }}>
                    {repo._count.changelogs} changelog{repo._count.changelogs !== 1 ? "s" : ""}
                  </span>
                  <span style={{ color: "var(--color-muted)", fontSize: 18 }}>→</span>
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
        padding: "80px 24px",
        border: "1px dashed var(--color-border)",
        borderRadius: 16,
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 20 }}>📋</div>
      <div
        style={{
          fontWeight: 700,
          fontSize: 18,
          marginBottom: 10,
          fontFamily: "var(--font-poppins, sans-serif)",
          color: "var(--color-fg)",
        }}
      >
        No repositories connected yet
      </div>
      <div
        style={{
          color: "var(--color-muted)",
          fontSize: 15,
          lineHeight: 1.7,
          maxWidth: 360,
          margin: "0 auto",
          fontFamily: "var(--font-poppins, sans-serif)",
        }}
      >
        Connect a GitHub repository using the button above to start generating AI-powered changelogs.
      </div>
    </div>
  );
}
