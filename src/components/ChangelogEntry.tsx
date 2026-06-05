interface ChangelogContent {
  summary: string;
  breaking: string[];
  features: string[];
  fixes: string[];
  refactors: string[];
}

interface ChangelogEntryProps {
  title: string;
  version?: string | null;
  createdAt: string | Date;
  commitCount: number;
  content: ChangelogContent;
  slug?: string;
  owner?: string;
  repo?: string;
  showLink?: boolean;
}

const CATEGORIES = [
  { key: "breaking" as const, label: "Breaking Changes", color: "var(--color-red-light)", bg: "rgba(218,54,51,0.08)", border: "var(--color-red)" },
  { key: "features" as const, label: "New Features", color: "var(--color-green-light)", bg: "rgba(35,134,54,0.08)", border: "var(--color-green)" },
  { key: "fixes" as const, label: "Bug Fixes", color: "var(--color-blue-light)", bg: "rgba(31,111,235,0.08)", border: "var(--color-blue)" },
  { key: "refactors" as const, label: "Improvements", color: "var(--color-yellow-light)", bg: "rgba(210,153,34,0.08)", border: "var(--color-yellow)" },
];

export function ChangelogEntry({
  title,
  version,
  createdAt,
  commitCount,
  content,
  slug,
  owner,
  repo,
  showLink = false,
}: ChangelogEntryProps) {
  const date = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {version && (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  background: "var(--color-blue)",
                  color: "white",
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontWeight: 600,
                }}
              >
                {version}
              </span>
            )}
            <span style={{ fontWeight: 600, fontSize: 15 }}>{title}</span>
          </div>
          <div style={{ color: "var(--color-muted)", fontSize: 12, marginTop: 4 }}>
            {date} · {commitCount} commit{commitCount !== 1 ? "s" : ""}
          </div>
        </div>

        {showLink && slug && owner && repo && (
          <a
            href={`/log/${owner}/${repo}/${slug}`}
            style={{
              color: "var(--color-blue-light)",
              fontSize: 12,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            View →
          </a>
        )}
      </div>

      {/* Summary */}
      <div style={{ padding: "16px 20px 0" }}>
        <p style={{ color: "var(--color-muted)", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          {content.summary}
        </p>
      </div>

      {/* Categories */}
      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        {CATEGORIES.filter((c) => content[c.key]?.length > 0).map((cat) => (
          <div
            key={cat.key}
            style={{
              background: cat.bg,
              border: `1px solid ${cat.border}`,
              borderRadius: 6,
              padding: "12px 16px",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: cat.color,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 8,
              }}
            >
              {cat.label}
            </div>
            <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
              {content[cat.key].map((item, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: 13,
                    color: "var(--color-fg)",
                    lineHeight: 1.6,
                    marginBottom: i < content[cat.key].length - 1 ? 4 : 0,
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </article>
  );
}
