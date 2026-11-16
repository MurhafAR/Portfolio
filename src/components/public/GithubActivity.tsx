import { GithubActivityClient, type GitHubRepo } from "./GithubActivityClient";

async function getGitHubRepos(username: string): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=4`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "portfolio-app",
        },
      }
    );

    if (!res.ok) {
      return [];
    }

    const data: GitHubRepo[] = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function GithubActivity({ githubUrl }: { githubUrl: string }) {
  // Extract username from githubUrl (e.g. "https://github.com/murhaf" -> "murhaf")
  const username = githubUrl.split("/").filter(Boolean).pop() || "murhaf";
  const repos = await getGitHubRepos(username);

  return <GithubActivityClient repos={repos} githubUrl={githubUrl} />;
}
