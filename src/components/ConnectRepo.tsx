"use client";

import { useState } from "react";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: { login: string };
  description: string | null;
  private: boolean;
  updated_at: string;
}

export function ConnectRepo({ onConnected }: { onConnected: () => void }) {
  const [open, setOpen] = useState(false);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [connecting, setConnecting] = useState<string | null>(null);

  async function openPicker() {
    setOpen(true);
    setLoading(true);
    try {
      const res = await fetch("/api/repos/github-list");
      if (res.ok) setRepos(await res.json());
    } finally {
      setLoading(false);
    }
  }

  async function connect(repo: GitHubRepo) {
    setConnecting(repo.full_name);
    try {
      const res = await fetch("/api/repos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner: repo.owner.login,
          name: repo.name,
          description: repo.description,
          isPrivate: repo.private,
        }),
      });
      if (res.ok) {
        setOpen(false);
        onConnected();
      }
    } finally {
      setConnecting(null);
    }
  }

  const filtered = repos.filter(
    (r) =>
      r.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (r.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <button
        onClick={openPicker}
        style={{
          background: "var(--color-green)",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: 6,
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        + Connect Repository
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: 24,
          }}
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: 12,
              width: "100%",
              maxWidth: 520,
              maxHeight: "80vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "20px 20px 16px",
                borderBottom: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 15 }}>
                Connect a repository
              </span>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--color-muted)",
                  cursor: "pointer",
                  fontSize: 18,
                  lineHeight: 1,
                  padding: 4,
                }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: "12px 20px" }}>
              <input
                placeholder="Search repositories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                style={{
                  width: "100%",
                  background: "var(--color-canvas)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 6,
                  color: "var(--color-fg)",
                  padding: "8px 12px",
                  fontSize: 13,
                  outline: "none",
                }}
              />
            </div>

            <div style={{ overflowY: "auto", flex: 1 }}>
              {loading && (
                <div
                  style={{
                    padding: 40,
                    textAlign: "center",
                    color: "var(--color-muted)",
                  }}
                >
                  Loading repositories...
                </div>
              )}
              {!loading &&
                filtered.map((repo) => (
                  <button
                    key={repo.id}
                    onClick={() => connect(repo)}
                    disabled={!!connecting}
                    style={{
                      width: "100%",
                      background: "none",
                      border: "none",
                      borderBottom: "1px solid var(--color-border-muted)",
                      padding: "14px 20px",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      opacity: connecting === repo.full_name ? 0.5 : 1,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 13,
                          color: "var(--color-fg)",
                          fontWeight: 500,
                        }}
                      >
                        {repo.full_name}
                      </div>
                      {repo.description && (
                        <div
                          style={{
                            color: "var(--color-muted)",
                            fontSize: 12,
                            marginTop: 4,
                          }}
                        >
                          {repo.description}
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      {repo.private && (
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
                      <span style={{ color: "var(--color-muted)", fontSize: 18 }}>
                        →
                      </span>
                    </div>
                  </button>
                ))}
              {!loading && filtered.length === 0 && !loading && (
                <div
                  style={{
                    padding: 40,
                    textAlign: "center",
                    color: "var(--color-muted)",
                  }}
                >
                  No repositories found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
