import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import type { ChangelogContent } from "@/lib/ai";

const STYLES = `
  body { padding: 12px; }
  .entry {
    border: 1px solid #30363d;
    border-radius: 6px;
    margin-bottom: 12px;
    overflow: hidden;
    background: #161b22;
  }
  .entry-header {
    padding: 10px 14px;
    border-bottom: 1px solid #30363d;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
  }
  .version-badge {
    background: #1f6feb;
    color: white;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: ui-monospace, monospace;
    margin-right: 6px;
  }
  .entry-title { font-weight: 600; font-size: 13px; }
  .entry-meta { color: #8b949e; font-size: 11px; margin-top: 3px; }
  .entry-link { color: #58a6ff; font-size: 11px; text-decoration: none; white-space: nowrap; margin-top: 2px; }
  .summary { padding: 10px 14px 0; color: #8b949e; font-size: 12px; line-height: 1.6; }
  .category {
    margin: 10px 14px;
    border-radius: 4px;
    padding: 8px 12px;
  }
  .cat-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 6px;
  }
  .cat-breaking { background: rgba(218,54,51,.08); border: 1px solid #da3633; }
  .cat-breaking .cat-label { color: #f85149; }
  .cat-features { background: rgba(35,134,54,.08); border: 1px solid #238636; }
  .cat-features .cat-label { color: #3fb950; }
  .cat-fixes { background: rgba(31,111,235,.08); border: 1px solid #1f6feb; }
  .cat-fixes .cat-label { color: #58a6ff; }
  .cat-refactors { background: rgba(210,153,34,.08); border: 1px solid #d29922; }
  .cat-refactors .cat-label { color: #e3b341; }
  ul { padding-left: 16px; margin: 0; }
  li { margin-bottom: 3px; font-size: 12px; }
  .embed-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
    padding-bottom: 10px;
    border-bottom: 1px solid #30363d;
  }
  .embed-header a { color: #58a6ff; text-decoration: none; font-size: 11px; }
`;

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo } = await params;
  const fullName = `${owner}/${repo}`;

  const repository = await prisma.repository.findFirst({
    where: { fullName },
    include: {
      changelogs: {
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!repository) notFound();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const changelogs = repository.changelogs;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="embed-header">
        <span
          style={{
            fontFamily: "ui-monospace, monospace",
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          {fullName}
        </span>
        <a
          href={`${appUrl}/log/${owner}/${repo}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Full changelog →
        </a>
      </div>

      {changelogs.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px 16px",
            color: "#8b949e",
            fontSize: 13,
          }}
        >
          No changelogs published yet.
        </div>
      ) : (
        changelogs.map((cl) => {
          const content = cl.content as unknown as ChangelogContent;
          const date = new Date(cl.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          return (
            <div key={cl.id} className="entry">
              <div className="entry-header">
                <div>
                  <div>
                    {cl.version && (
                      <span className="version-badge">{cl.version}</span>
                    )}
                    <span className="entry-title">{cl.title}</span>
                  </div>
                  <div className="entry-meta">
                    {date} · {cl.commitCount} commit{cl.commitCount !== 1 ? "s" : ""}
                  </div>
                </div>
                <a
                  href={`${appUrl}/log/${owner}/${repo}/${cl.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="entry-link"
                >
                  View →
                </a>
              </div>

              <div className="summary">{content.summary}</div>

              {content.breaking?.length > 0 && (
                <div className="category cat-breaking">
                  <div className="cat-label">Breaking Changes</div>
                  <ul>
                    {content.breaking.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {content.features?.length > 0 && (
                <div className="category cat-features">
                  <div className="cat-label">New Features</div>
                  <ul>
                    {content.features.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {content.fixes?.length > 0 && (
                <div className="category cat-fixes">
                  <div className="cat-label">Bug Fixes</div>
                  <ul>
                    {content.fixes.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {content.refactors?.length > 0 && (
                <div className="category cat-refactors">
                  <div className="cat-label">Improvements</div>
                  <ul>
                    {content.refactors.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })
      )}

      <div
        style={{
          textAlign: "center",
          paddingTop: 12,
          color: "#8b949e",
          fontSize: 11,
        }}
      >
        Powered by{" "}
        <a
          href={appUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#58a6ff" }}
        >
          Patchwork
        </a>
      </div>
    </>
  );
}
