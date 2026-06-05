import Link from "next/link";
import { requireSession } from "@/lib/session";

export default async function LandingPage() {
  const session = await requireSession();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
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
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 16 }}>
          patchwork
        </span>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {session ? (
            <Link
              href="/dashboard"
              style={{
                background: "var(--color-green)",
                color: "white",
                padding: "6px 14px",
                borderRadius: 6,
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              style={{
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                color: "var(--color-fg)",
                padding: "6px 14px",
                borderRadius: 6,
                textDecoration: "none",
                fontSize: 13,
              }}
            >
              Sign in with GitHub
            </Link>
          )}
        </div>
      </header>

      {/* Hero */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 640 }}>
          <div
            style={{
              display: "inline-block",
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: 20,
              padding: "4px 14px",
              fontSize: 12,
              color: "var(--color-muted)",
              marginBottom: 24,
              fontFamily: "var(--font-mono)",
            }}
          >
            GitHub OAuth · AI · Public changelogs
          </div>

          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: 20,
              letterSpacing: "-0.5px",
            }}
          >
            Ship with a changelog your users can actually read.
          </h1>

          <p
            style={{
              fontSize: 17,
              color: "var(--color-muted)",
              marginBottom: 40,
              lineHeight: 1.7,
            }}
          >
            Connect a GitHub repository. Patchwork fetches your commits and generates
            a categorized changelog — features, fixes, refactors, breaking changes —
            ready to share or embed on your site.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href={session ? "/dashboard" : "/login"}
              style={{
                background: "var(--color-green)",
                color: "white",
                padding: "10px 22px",
                borderRadius: 6,
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 15,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <GitHubIcon size={18} />
              {session ? "Go to Dashboard" : "Connect GitHub"}
            </Link>
            <a
              href="https://github.com"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                color: "var(--color-fg)",
                padding: "10px 22px",
                borderRadius: 6,
                textDecoration: "none",
                fontSize: 15,
              }}
            >
              View example
            </a>
          </div>
        </div>

        {/* Feature grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            maxWidth: 800,
            width: "100%",
            marginTop: 80,
          }}
        >
          {[
            { emoji: "🔐", title: "GitHub OAuth", desc: "Real OAuth 2.0 — no API keys to paste, no manual token management." },
            { emoji: "⚡", title: "AI Categorization", desc: "Commits sorted into features, fixes, refactors, and breaking changes automatically." },
            { emoji: "🌐", title: "Public Pages", desc: "Every changelog gets a shareable URL at /log/owner/repo." },
            { emoji: "📦", title: "Embeddable Widget", desc: "Paste one iframe tag to show your changelog anywhere." },
          ].map((f) => (
            <div
              key={f.title}
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
                padding: "20px",
                textAlign: "left",
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 10 }}>{f.emoji}</div>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>{f.title}</div>
              <div style={{ color: "var(--color-muted)", fontSize: 13, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </main>

      <footer
        style={{
          borderTop: "1px solid var(--color-border)",
          padding: "20px 24px",
          textAlign: "center",
          color: "var(--color-muted)",
          fontSize: 12,
        }}
      >
        Patchwork · MIT License
      </footer>
    </div>
  );
}

function GitHubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
