export type RepoInfo = {
  readmeContent: string;
  stars: number;
  latestVersion: string;
  homepage: string | null;
  license: string | null;
};

const GITHUB_JSON_HEADERS = {
  Accept: "application/vnd.github+json",
  "User-Agent": "dandi-app",
};

function parseGithubUrl(githubUrl: string): { owner: string; repo: string } {
  const match = githubUrl.trim().match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) {
    throw new Error("Invalid GitHub URL");
  }

  const [, owner, repo] = match;
  return { owner, repo: repo.replace(/\.git$/, "") };
}

async function fetchReadme(owner: string, repo: string): Promise<string> {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/readme`,
    {
      headers: {
        Accept: "application/vnd.github.raw",
        "User-Agent": "dandi-app",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch README");
  }

  return res.text();
}

async function fetchRepoMeta(
  owner: string,
  repo: string
): Promise<{ stars: number; homepage: string | null; license: string | null }> {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    { headers: GITHUB_JSON_HEADERS }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch repository info");
  }

  const data = await res.json();

  return {
    stars: typeof data.stargazers_count === "number" ? data.stargazers_count : 0,
    homepage: data.homepage ?? null,
    license: data.license?.spdx_id ?? data.license?.name ?? null,
  };
}

async function fetchLatestRelease(owner: string, repo: string): Promise<string> {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/releases/latest`,
    { headers: GITHUB_JSON_HEADERS }
  );

  if (!res.ok) {
    return "unknown";
  }

  const data = await res.json();
  return typeof data.tag_name === "string" ? data.tag_name : "unknown";
}

export async function getRepoInfo(githubUrl: string): Promise<RepoInfo> {
  const { owner, repo } = parseGithubUrl(githubUrl);

  const [readmeContent, meta, latestVersion] = await Promise.all([
    fetchReadme(owner, repo),
    fetchRepoMeta(owner, repo),
    fetchLatestRelease(owner, repo),
  ]);

  return {
    readmeContent,
    stars: meta.stars,
    latestVersion,
    homepage: meta.homepage,
    license: meta.license,
  };
}
