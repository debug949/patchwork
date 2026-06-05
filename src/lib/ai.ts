import type { GitHubCommit } from "./github";

export interface ChangelogContent {
  summary: string;
  breaking: string[];
  features: string[];
  fixes: string[];
  refactors: string[];
}

function classifyCommit(
  message: string
): "breaking" | "feature" | "fix" | "refactor" {
  const firstLine = message.split("\n")[0].trim();
  const lower = firstLine.toLowerCase();

  if (/\bbreaking[\s-]change\b|BREAKING CHANGE/i.test(message)) {
    return "breaking";
  }
  if (/^(feat|feature|add|new|implement|create)(\(.+\))?!?:/.test(firstLine)) {
    return "feature";
  }
  if (/^(fix|bug|patch|resolve|correct|hotfix|revert)(\(.+\))?!?:/.test(firstLine)) {
    return "fix";
  }
  if (/^(refactor|chore|perf|style|test|docs|build|ci|clean|improve|update|optimize)(\(.+\))?!?:/.test(firstLine)) {
    return "refactor";
  }
  if (/\b(feat|feature|add|new|implement|introduce|create)\b/.test(lower)) {
    return "feature";
  }
  if (/\b(fix|bug|error|issue|problem|crash|broken|correct|patch)\b/.test(lower)) {
    return "fix";
  }
  return "refactor";
}

function formatCommitLine(commit: GitHubCommit): string {
  const firstLine = commit.commit.message.split("\n")[0].trim();
  const sha = commit.sha.slice(0, 7);
  return `${firstLine} (${sha})`;
}

function mockGenerate(commits: GitHubCommit[]): ChangelogContent {
  const breaking: string[] = [];
  const features: string[] = [];
  const fixes: string[] = [];
  const refactors: string[] = [];

  for (const commit of commits) {
    const line = formatCommitLine(commit);
    const kind = classifyCommit(commit.commit.message);
    if (kind === "breaking") breaking.push(line);
    else if (kind === "feature") features.push(line);
    else if (kind === "fix") fixes.push(line);
    else refactors.push(line);
  }

  const parts: string[] = [];
  if (features.length) parts.push(`${features.length} new feature${features.length > 1 ? "s" : ""}`);
  if (fixes.length) parts.push(`${fixes.length} bug fix${fixes.length > 1 ? "es" : ""}`);
  if (refactors.length) parts.push(`${refactors.length} improvement${refactors.length > 1 ? "s" : ""}`);
  if (breaking.length) parts.push(`${breaking.length} breaking change${breaking.length > 1 ? "s" : ""}`);

  const summary =
    commits.length === 0
      ? "No commits in this range."
      : `This release includes ${parts.join(", ")} across ${commits.length} commit${commits.length > 1 ? "s" : ""}.`;

  return { summary, breaking, features, fixes, refactors };
}

async function groqGenerate(commits: GitHubCommit[]): Promise<ChangelogContent> {
  const commitList = commits
    .map((c) => `- ${c.commit.message.split("\n")[0].trim()} (${c.sha.slice(0, 7)})`)
    .join("\n");

  const prompt = `You are a changelog generator. Analyze these git commits and produce a structured changelog.

Commits:
${commitList}

Respond with ONLY valid JSON in this exact shape:
{
  "summary": "2-3 sentence plain-English summary of what changed",
  "breaking": ["breaking change descriptions"],
  "features": ["new feature descriptions"],
  "fixes": ["bug fix descriptions"],
  "refactors": ["refactor/improvement descriptions"]
}

Rules:
- Keep each item concise (under 100 chars)
- Omit empty arrays (still include the key with [])
- summary should be friendly and readable for end users`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 1024,
    }),
  });

  if (!res.ok) throw new Error(`Groq error: ${res.status}`);

  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  const text = data.choices[0]?.message?.content ?? "{}";

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON in Groq response");
  return JSON.parse(jsonMatch[0]) as ChangelogContent;
}

export async function generateChangelog(
  commits: GitHubCommit[]
): Promise<ChangelogContent> {
  if (process.env.GROQ_API_KEY) {
    try {
      return await groqGenerate(commits);
    } catch {
      // fall through to mock
    }
  }
  return mockGenerate(commits);
}
