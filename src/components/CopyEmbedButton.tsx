"use client";

import { useState } from "react";

interface CopyEmbedButtonProps {
  owner: string;
  repo: string;
  appUrl: string;
}

export function CopyEmbedButton({ owner, repo, appUrl }: CopyEmbedButtonProps) {
  const [copied, setCopied] = useState(false);

  const embedCode = `<iframe src="${appUrl}/embed/${owner}/${repo}" width="100%" height="600" frameborder="0"></iframe>`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for non-HTTPS or denied clipboard access
      const el = document.createElement("textarea");
      el.value = embedCode;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.focus();
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 4 }}>
        <div style={{ fontFamily: "var(--font-poppins, sans-serif)", fontSize: 14, fontWeight: 600, color: "#fff" }}>
          Embed widget
        </div>
        <button
          onClick={handleCopy}
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: copied ? "rgba(35,134,54,0.15)" : "rgba(255,255,255,0.07)",
            border: `1px solid ${copied ? "rgba(63,185,80,0.4)" : "rgba(255,255,255,0.1)"}`,
            color: copied ? "#3fb950" : "rgba(255,255,255,0.7)",
            borderRadius: 8,
            padding: "4px 12px",
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "var(--font-poppins, sans-serif)",
            transition: "all 0.2s",
            whiteSpace: "nowrap",
          }}
        >
          {copied ? (
            <>
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy code
            </>
          )}
        </button>
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
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 8,
          padding: "12px 16px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
          lineHeight: 1.6,
          cursor: "text",
          userSelect: "all",
        }}
        onClick={handleCopy}
        title="Click to copy"
      >
        {embedCode}
      </code>
    </div>
  );
}
