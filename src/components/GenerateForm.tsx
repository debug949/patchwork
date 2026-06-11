"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Tag {
  name: string;
  commit: { sha: string; url: string };
}

interface GenerateFormProps {
  repoId: string;
}

type Mode = "recent" | "tags";

const inputStyle: React.CSSProperties = {
  background: "rgba(0,0,0,0.4)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  color: "#fff",
  padding: "8px 12px",
  fontSize: 13,
  outline: "none",
  fontFamily: "var(--font-poppins, sans-serif)",
  width: "100%",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
  appearance: "none",
  WebkitAppearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='rgba(255,255,255,0.4)' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  paddingRight: 32,
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  color: "rgba(255,255,255,0.45)",
  fontWeight: 500,
  fontFamily: "var(--font-poppins, sans-serif)",
  marginBottom: 6,
  display: "block",
};

export function GenerateForm({ repoId }: GenerateFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("recent");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Recent mode state
  const [since, setSince] = useState("");
  const [version, setVersion] = useState("");

  // Tag range mode state
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [fromTag, setFromTag] = useState("");
  const [toTag, setToTag] = useState("");

  const loadTags = useCallback(async () => {
    if (tags.length > 0) return; // already loaded
    setTagsLoading(true);
    try {
      const res = await fetch(`/api/repos/${repoId}/tags`);
      if (res.ok) {
        const data = (await res.json()) as Tag[];
        setTags(data);
        // Auto-select sensible defaults: toTag = latest, fromTag = second
        if (data.length >= 2) {
          setToTag(data[0].name);
          setFromTag(data[1].name);
        } else if (data.length === 1) {
          setToTag(data[0].name);
        }
      }
    } finally {
      setTagsLoading(false);
    }
  }, [repoId, tags.length]);

  useEffect(() => {
    if (mode === "tags") loadTags();
  }, [mode, loadTags]);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const body: Record<string, string | number> = {};

      if (mode === "tags") {
        if (!toTag) {
          setError("Select a target tag.");
          return;
        }
        if (fromTag) body.fromTag = fromTag;
        body.toTag = toTag;
      } else {
        if (since) body.since = new Date(since).toISOString();
        if (version) body.version = version;
      }

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
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Mode toggle */}
      <div style={{ display: "flex", gap: 6, background: "rgba(0,0,0,0.35)", padding: 4, borderRadius: 10, width: "fit-content" }}>
        {(["recent", "tags"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              background: mode === m ? "rgba(255,255,255,0.12)" : "transparent",
              border: mode === m ? "1px solid rgba(255,255,255,0.12)" : "1px solid transparent",
              color: mode === m ? "#fff" : "rgba(255,255,255,0.45)",
              borderRadius: 7,
              padding: "5px 14px",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "var(--font-poppins, sans-serif)",
              transition: "all 0.15s",
            }}
          >
            {m === "recent" ? "Recent commits" : "Tag range"}
          </button>
        ))}
      </div>

      {/* Recent commits mode */}
      {mode === "recent" && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", minWidth: 150 }}>
            <label style={labelStyle}>Since (optional)</label>
            <input
              type="date"
              value={since}
              onChange={(e) => setSince(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", minWidth: 120 }}>
            <label style={labelStyle}>Version label (optional)</label>
            <input
              type="text"
              placeholder="v1.2.0"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>
      )}

      {/* Tag range mode */}
      {mode === "tags" && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          {tagsLoading ? (
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: "var(--font-poppins, sans-serif)" }}>
              Loading tags…
            </div>
          ) : tags.length === 0 ? (
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: "var(--font-poppins, sans-serif)", padding: "6px 0" }}>
              No tags found for this repository.{" "}
              <button
                onClick={() => setMode("recent")}
                style={{ background: "none", border: "none", color: "rgba(88,166,255,0.8)", cursor: "pointer", fontSize: 13, padding: 0, fontFamily: "var(--font-poppins, sans-serif)" }}
              >
                Use recent commits instead.
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", minWidth: 160 }}>
                <label style={labelStyle}>From tag (base)</label>
                <select value={fromTag} onChange={(e) => setFromTag(e.target.value)} style={selectStyle}>
                  <option value="">— start of history</option>
                  {tags.map((t) => (
                    <option key={t.name} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column", minWidth: 160 }}>
                <label style={labelStyle}>To tag <span style={{ color: "rgba(255,107,107,0.7)" }}>*</span></label>
                <select value={toTag} onChange={(e) => setToTag(e.target.value)} style={selectStyle}>
                  <option value="">Select a tag…</option>
                  {tags.map((t) => (
                    <option key={t.name} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "var(--font-poppins, sans-serif)", marginBottom: 2 }}>
                {tags.length} tag{tags.length !== 1 ? "s" : ""} found
              </div>
            </>
          )}
        </div>
      )}

      {/* Generate button */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <button
          onClick={generate}
          disabled={loading || (mode === "tags" && tagsLoading)}
          style={{
            background: loading ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.95)",
            color: loading ? "rgba(255,255,255,0.4)" : "#000",
            border: "none",
            padding: "9px 22px",
            borderRadius: 8,
            cursor: loading ? "default" : "pointer",
            fontSize: 13,
            fontWeight: 600,
            height: 36,
            fontFamily: "var(--font-poppins, sans-serif)",
            transition: "all 0.15s",
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          {loading ? (
            <>
              <SpinnerIcon />
              Generating…
            </>
          ) : (
            <>
              <SparkleIcon />
              Generate changelog
            </>
          )}
        </button>
        {!loading && (
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, fontFamily: "var(--font-poppins, sans-serif)" }}>
            {mode === "tags" && toTag
              ? fromTag ? `Commits from ${fromTag} → ${toTag}` : `All commits up to ${toTag}`
              : "Last 50 commits, AI-categorized"}
          </span>
        )}
      </div>

      {error && (
        <div
          style={{
            padding: "9px 14px",
            background: "rgba(218,54,51,0.08)",
            border: "1px solid rgba(218,54,51,0.3)",
            borderRadius: 8,
            color: "#f85149",
            fontSize: 13,
            fontFamily: "var(--font-poppins, sans-serif)",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l1.8 5.4L19.2 9l-5.4 1.8L12 16.2l-1.8-5.4L4.8 9l5.4-1.8z" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
      style={{ animation: "spin 0.8s linear infinite" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
    </svg>
  );
}
