"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe } from "lucide-react";

interface ChangelogContent {
  summary: string;
  breaking: string[];
  features: string[];
  fixes: string[];
  refactors: string[];
}

interface DemoResult {
  owner: string;
  repo: string;
  commitCount: number;
  generatedAt: string;
  content: ChangelogContent;
}

const PRESET_REPOS = [
  { owner: "debug949", repo: "patchwork", label: "patchwork", description: "AI changelog generator" },
  { owner: "debug949", repo: "shipsafe", label: "shipsafe", description: "Web security auditor" },
  { owner: "typicode", repo: "json-server", label: "json-server", description: "Fake REST API" },
  { owner: "sindresorhus", repo: "ora", label: "ora", description: "Terminal spinner" },
  { owner: "vitejs", repo: "vite", label: "vite", description: "Frontend build tool" },
] as const;

const CATEGORIES = [
  { key: "breaking" as const, label: "Breaking Changes", color: "#f85149", bg: "rgba(218,54,51,0.08)", border: "rgba(218,54,51,0.3)" },
  { key: "features" as const, label: "New Features", color: "#3fb950", bg: "rgba(35,134,54,0.08)", border: "rgba(35,134,54,0.3)" },
  { key: "fixes" as const, label: "Bug Fixes", color: "#58a6ff", bg: "rgba(31,111,235,0.08)", border: "rgba(31,111,235,0.3)" },
  { key: "refactors" as const, label: "Improvements", color: "#e3b341", bg: "rgba(210,153,34,0.08)", border: "rgba(210,153,34,0.3)" },
];

export function DemoClient() {
  const [selected, setSelected] = useState<(typeof PRESET_REPOS)[number]>(PRESET_REPOS[0]);
  const [result, setResult] = useState<DemoResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  async function generate(preset: (typeof PRESET_REPOS)[number]) {
    setSelected(preset);
    setLoading(true);
    setError(null);
    setResult(null);
    setHasGenerated(true);

    try {
      const res = await fetch("/api/demo/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner: preset.owner, repo: preset.repo }),
      });
      const data = (await res.json()) as DemoResult & { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Generation failed");
        return;
      }
      setResult(data);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#e6edf3" }}>
      {/* Nav */}
      <header
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "0 24px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          background: "rgba(13,17,23,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          zIndex: 50,
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <Globe size={18} color="#fff" />
          <span style={{ fontFamily: "var(--font-poppins, sans-serif)", fontWeight: 600, fontSize: 15, color: "#fff", letterSpacing: "-0.03em" }}>
            patchwork
          </span>
        </Link>
        <Link
          href="/login"
          style={{
            fontFamily: "var(--font-poppins, sans-serif)",
            fontSize: 13,
            fontWeight: 500,
            color: "#fff",
            textDecoration: "none",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            padding: "6px 16px",
            borderRadius: 8,
          }}
        >
          Sign in for full access →
        </Link>
      </header>

      <main style={{ maxWidth: 780, margin: "0 auto", padding: "56px 24px 80px" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(88,166,255,0.08)",
              border: "1px solid rgba(88,166,255,0.2)",
              borderRadius: 9999,
              padding: "4px 14px",
              fontSize: 11,
              fontWeight: 600,
              color: "#58a6ff",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: "var(--font-poppins, sans-serif)",
              marginBottom: 20,
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#58a6ff", boxShadow: "0 0 6px #58a6ff", display: "inline-block" }} />
            Live demo · no sign-in required
          </div>

          <h1
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(38px, 7vw, 64px)",
              fontWeight: 400,
              color: "#fff",
              margin: "0 0 16px",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            See it <em className="italic">in action.</em>
          </h1>

          <p
            style={{
              fontFamily: "var(--font-poppins, sans-serif)",
              color: "rgba(255,255,255,0.5)",
              fontSize: 15,
              lineHeight: 1.7,
              maxWidth: 440,
              margin: "0 auto",
            }}
          >
            Pick a real GitHub repository below. Patchwork fetches the latest commits
            and generates an AI-categorized changelog in seconds.
          </p>
        </div>

        {/* Repo selector */}
        <div
          style={{
            background: "rgba(22,27,34,0.8)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: "24px",
            marginBottom: 28,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "rgba(255,255,255,0.7)",
              fontFamily: "var(--font-poppins, sans-serif)",
              marginBottom: 14,
              letterSpacing: "0.02em",
              textTransform: "uppercase" as const,
            }}
          >
            Choose a repository
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {PRESET_REPOS.map((preset) => (
              <button
                key={`${preset.owner}/${preset.repo}`}
                onClick={() => setSelected(preset)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 2,
                  background: selected.repo === preset.repo && selected.owner === preset.owner
                    ? "rgba(88,166,255,0.1)"
                    : "rgba(255,255,255,0.04)",
                  border: `1px solid ${selected.repo === preset.repo && selected.owner === preset.owner
                    ? "rgba(88,166,255,0.35)"
                    : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 10,
                  padding: "10px 14px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                  minWidth: 120,
                }}
              >
                <span
                  style={{
                    fontFamily: "ui-monospace, monospace",
                    fontSize: 13,
                    fontWeight: 600,
                    color: selected.repo === preset.repo && selected.owner === preset.owner
                      ? "#58a6ff"
                      : "#e6edf3",
                  }}
                >
                  {preset.label}
                </span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-poppins, sans-serif)" }}>
                  {preset.description}
                </span>
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <button
              onClick={() => generate(selected)}
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: loading ? "rgba(255,255,255,0.06)" : "#fff",
                color: loading ? "rgba(255,255,255,0.3)" : "#000",
                border: "none",
                padding: "10px 24px",
                borderRadius: 9999,
                cursor: loading ? "default" : "pointer",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "var(--font-poppins, sans-serif)",
                transition: "all 0.15s",
              }}
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  Generating…
                </>
              ) : (
                <>
                  <SparkleIcon />
                  Generate changelog
                </>
              )}
            </button>

            {!loading && !hasGenerated && (
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-poppins, sans-serif)" }}>
                Uses Groq AI · ~5 seconds · no account needed
              </span>
            )}

            {loading && (
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-poppins, sans-serif)" }}>
                Fetching commits from {selected.owner}/{selected.repo}…
              </span>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              padding: "12px 18px",
              background: "rgba(218,54,51,0.08)",
              border: "1px solid rgba(218,54,51,0.3)",
              borderRadius: 10,
              color: "#f85149",
              fontSize: 14,
              fontFamily: "var(--font-poppins, sans-serif)",
              marginBottom: 24,
            }}
          >
            {error}
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div>
            {/* Result header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2
                  style={{
                    fontFamily: "var(--font-poppins, sans-serif)",
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#fff",
                    margin: "0 0 4px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {result.owner}/{result.repo}
                </h2>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: "var(--font-poppins, sans-serif)" }}>
                  {result.commitCount} commits analyzed · {result.generatedAt}
                </p>
              </div>
              <Link
                href="/login"
                style={{
                  fontFamily: "var(--font-poppins, sans-serif)",
                  fontSize: 13,
                  color: "#58a6ff",
                  textDecoration: "none",
                  border: "1px solid rgba(88,166,255,0.25)",
                  padding: "6px 14px",
                  borderRadius: 8,
                  whiteSpace: "nowrap",
                }}
              >
                Connect your own repo →
              </Link>
            </div>

            {/* Summary */}
            <div
              style={{
                background: "rgba(22,27,34,0.8)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: "20px 24px",
                marginBottom: 16,
              }}
            >
              <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.75, fontFamily: "var(--font-poppins, sans-serif)" }}>
                {result.content.summary}
              </p>
            </div>

            {/* Categories */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {CATEGORIES.filter((c) => (result.content[c.key]?.length ?? 0) > 0).map((cat) => (
                <div
                  key={cat.key}
                  style={{
                    background: cat.bg,
                    border: `1px solid ${cat.border}`,
                    borderRadius: 12,
                    padding: "14px 18px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: cat.color,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: 10,
                      fontFamily: "var(--font-poppins, sans-serif)",
                    }}
                  >
                    {cat.label}
                  </div>
                  <ul style={{ margin: 0, padding: "0 0 0 18px" }}>
                    {result.content[cat.key].map((item, i) => (
                      <li
                        key={i}
                        style={{
                          fontSize: 13,
                          color: "#e6edf3",
                          lineHeight: 1.65,
                          marginBottom: i < result.content[cat.key].length - 1 ? 5 : 0,
                          fontFamily: "var(--font-poppins, sans-serif)",
                        }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div
              style={{
                marginTop: 36,
                padding: "24px 28px",
                background: "rgba(88,166,255,0.05)",
                border: "1px solid rgba(88,166,255,0.15)",
                borderRadius: 14,
                textAlign: "center",
              }}
            >
              <p style={{ margin: "0 0 16px", fontSize: 15, color: "#fff", fontFamily: "var(--font-poppins, sans-serif)", fontWeight: 600 }}>
                Ready to track your own repositories?
              </p>
              <p style={{ margin: "0 0 20px", fontSize: 14, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-poppins, sans-serif)", lineHeight: 1.6 }}>
                Sign in with GitHub to connect any repo, generate changelogs on demand,<br />
                and get a public embeddable widget for your site.
              </p>
              <Link
                href="/login"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#fff",
                  color: "#000",
                  textDecoration: "none",
                  padding: "10px 28px",
                  borderRadius: 9999,
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "var(--font-poppins, sans-serif)",
                }}
              >
                <GitHubIcon />
                Sign in with GitHub
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l1.8 5.4L19.2 9l-5.4 1.8L12 16.2l-1.8-5.4L4.8 9l5.4-1.8z" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
      style={{ animation: "spin 0.8s linear infinite" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
