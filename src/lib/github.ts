export interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  email: string | null;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: { login: string };
  description: string | null;
  private: boolean;
  updated_at: string;
  default_branch: string;
  html_url: string;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
  html_url: string;
  author: { login: string; avatar_url: string } | null;
}

async function ghFetch<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`GitHub API error ${res.status}: ${path}`);
  }
  return res.json() as Promise<T>;
}

export async function getAuthenticatedUser(token: string): Promise<GitHubUser> {
  return ghFetch<GitHubUser>("/user", token);
}

export async function getUserRepos(token: string): Promise<GitHubRepo[]> {
  return ghFetch<GitHubRepo[]>(
    "/user/repos?sort=updated&per_page=100&affiliation=owner,collaborator",
    token
  );
}

export async function getRepoCommits(
  token: string,
  owner: string,
  repo: string,
  options: { since?: string; perPage?: number } = {}
): Promise<GitHubCommit[]> {
  const params = new URLSearchParams({
    per_page: String(options.perPage ?? 50),
  });
  if (options.since) params.set("since", options.since);
  return ghFetch<GitHubCommit[]>(
    `/repos/${owner}/${repo}/commits?${params}`,
    token
  );
}
