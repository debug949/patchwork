"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface GenerateFormProps {
  repoId: string;
}

export function GenerateForm({ repoId }: GenerateFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [since, setSince] = useState("");
  const [version, setVersion] = useState("");

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const body: Record<string, string | number> = {};
      if (since) body.since = new Date(since).toISOString();
      if (version) body.version = version;

      const res = await fetch(`/api/repos/${repoId}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Generation failed");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: 8,
        padding: 20,
      }}
    >
      <div
        style={{
          fontWeight: 600,
          marginBottom: 16,
          fontSize: 14,
        }}
      >
        Generate Changelog
      </div>

      <div
        style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label
            style={{ fontSize: 12, color: "var(--color-muted)", fontWeight: 500 }}
          >
            Since (optional)
          </label>
          <input
            type="date"
            value={since}
            onChange={(e) => setSince(e.target.value)}
            style={{
              background: "var(--color-canvas)",
              border: "1px solid var(--color-border)",
              borderRadius: 6,
              color: "var(--color-fg)",
              padding: "7px 10px",
              fontSize: 13,
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label
            style={{ fontSize: 12, color: "var(--color-muted)", fontWeight: 500 }}
          >
            Version tag (optional)
          </label>
          <input
            type="text"
            placeholder="v1.2.0"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            style={{
              background: "var(--color-canvas)",
              border: "1px solid var(--color-border)",
              borderRadius: 6,
              color: "var(--color-fg)",
              padding: "7px 10px",
              fontSize: 13,
              outline: "none",
              width: 120,
            }}
          />
        </div>

        <button
          onClick={generate}
          disabled={loading}
          style={{
            background: loading ? "var(--color-surface-2)" : "var(--color-blue)",
            color: "white",
            border: "none",
            padding: "8px 18px",
            borderRadius: 6,
            cursor: loading ? "default" : "pointer",
            fontSize: 13,
            fontWeight: 500,
            height: 34,
          }}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      <p style={{ color: "var(--color-muted)", fontSize: 12, marginTop: 12 }}>
        Fetches the last 50 commits (or since the date you choose) and generates a
        categorized changelog using AI.
      </p>

      {error && (
        <div
          style={{
            marginTop: 12,
            padding: "8px 12px",
            background: "rgba(218, 54, 51, 0.1)",
            border: "1px solid var(--color-red)",
            borderRadius: 6,
            color: "var(--color-red-light)",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
