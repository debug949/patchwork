import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { GenerateForm } from "@/components/GenerateForm";
import { ChangelogEntry } from "@/components/ChangelogEntry";
import { AppNav } from "@/components/AppNav";
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

  const rightSlot = (
    <div style={{ display: "flex", gap: 10 }}>
      <a
        href={`https://github.com/${repo.fullName}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: 13,
          textDecoration: "none",
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "6px 12px",
          borderRadius: 8,
          fontFamily: "var(--font-poppins, sans-serif)",
        }}
      >
        GitHub ↗
      </a>
      <a
        href={`/log/${repo.owner}/${repo.name}`}
        target="_blank"
        style={{
          color: "rgba(255,255,255,0.8)",
          fontSize: 13,
          textDecoration: "none",
          border: "1px solid rgba(255,255,255,0.15)",
          padding: "6px 12px",
          borderRadius: 8,
          fontFamily: "var(--font-poppins, sans-serif)",
        }}
      >
        Public page ↗
      </a>
    </div>
  )

  const VIDEO_URL =
    "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4"

  return (
    <div style={{ minHeight: "100vh", background: "#000", position: "relative" }}>
      {/* Video background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden" }}>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video autoPlay muted loop playsInline preload="metadata"
          style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0, filter: "brightness(0.35)" }}>
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
      <AppNav
        crumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: repo.fullName },
        ]}
        rightSlot={rightSlot}
      />

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "48px 24px" }}>
        {/* Repo header */}
        <div style={{ marginBottom: 36 }}>
          <h1
            style={{
              fontFamily: "var(--font-poppins, sans-serif)",
              fontSize: 24,
              fontWeight: 700,
              margin: "0 0 6px",
              letterSpacing: "-0.02em",
              color: "#fff",
            }}
          >
            {repo.fullName}
          </h1>
          {repo.description && (
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                marginTop: 6,
                fontSize: 15,
                lineHeight: 1.65,
                fontFamily: "var(--font-poppins, sans-serif)",
              }}
            >
              {repo.description}
            </p>
          )}
          {repo.lastSyncedAt && (
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 6, fontFamily: "var(--font-poppins, sans-serif)" }}>
              Last synced{" "}
              {new Date(repo.lastSyncedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
        </div>

        {/* Generate */}
        <div
          className="liquid-glass"
          style={{
            borderRadius: 14,
            padding: "24px",
            marginBottom: 28,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-poppins, sans-serif)",
              fontSize: 16,
              fontWeight: 600,
              margin: "0 0 6px",
              color: "#fff",
            }}
          >
            Generate changelog
          </h2>
          <p
            style={{
              fontFamily: "var(--font-poppins, sans-serif)",
              color: "rgba(255,255,255,0.5)",
              fontSize: 14,
              margin: "0 0 16px",
              lineHeight: 1.6,
            }}
          >
            Fetches the last 50 commits and categorizes them using AI into features, fixes, refactors, and breaking changes.
          </p>
          <GenerateForm repoId={repo.id} />
        </div>

        {/* Embed snippet */}
        <div
          className="liquid-glass"
          style={{
            borderRadius: 14,
            padding: "20px 24px",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 4,
              fontFamily: "var(--font-poppins, sans-serif)",
              color: "#fff",
            }}
          >
            Embed widget
          </div>
          <p
            style={{
              fontFamily: "var(--font-poppins, sans-serif)",
              color: "rgba(255,255,255,0.5)",
              fontSize: 13,
              margin: "0 0 12px",
              lineHeight: 1.6,
            }}
          >
            Paste this snippet anywhere on your site to show a live changelog.
          </p>
          <code
            style={{
              display: "block",
              fontFamily: "ui-monospace, monospace",
              fontSize: 12,
              color: "rgba(255,255,255,0.5)",
              background: "rgba(0,0,0,0.6)",
              border: "1px solid var(--color-border-muted)",
              borderRadius: 8,
              padding: "12px 16px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              lineHeight: 1.6,
            }}
          >
            {`<iframe src="${process.env.NEXT_PUBLIC_APP_URL}/embed/${repo.owner}/${repo.name}" width="100%" height="600" frameborder="0"></iframe>`}
          </code>
        </div>

        {/* Changelogs */}
        <div>
          <h2
            style={{
              fontFamily: "var(--font-poppins, sans-serif)",
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 18,
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "#fff",
            }}
          >
            Changelogs
            <span
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 14,
                fontWeight: 400,
              }}
            >
              {repo.changelogs.length}
            </span>
          </h2>

          {repo.changelogs.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 24px",
                border: "1px dashed var(--color-border)",
                borderRadius: 14,
                color: "rgba(255,255,255,0.5)",
                fontSize: 15,
                lineHeight: 1.7,
                fontFamily: "var(--font-poppins, sans-serif)",
              }}
            >
              No changelogs yet. Click <strong>Generate changelog</strong> above to create your first one.
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
    </div>
  );
}
