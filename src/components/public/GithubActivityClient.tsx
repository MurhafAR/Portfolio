"use client";

import { Code2, GitFork, Star, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
}

export function GithubActivityClient({
  repos,
  githubUrl,
}: {
  repos: GitHubRepo[];
  githubUrl: string;
}) {
  const { t } = useLanguage();

  if (repos.length === 0) {
    return null;
  }

  return (
    <section id="activity" className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 mb-2">
            <Code2 className="h-3.5 w-3.5" /> {t("liveActivityBadge")}
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
            {t("recentOpenSourceTitle")}
          </h2>
        </div>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition"
        >
          {t("viewAllGithub")} <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {repos.map((repo) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 transition hover:border-zinc-700 hover:bg-zinc-900/80"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-zinc-200 group-hover:text-indigo-400 transition truncate">
                  {repo.name}
                </span>
                <ExternalLink className="h-3.5 w-3.5 text-zinc-500 group-hover:text-zinc-300 transition shrink-0 ml-2" />
              </div>

              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {repo.description || t("repoFallbackDesc")}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-zinc-800/60 pt-3 text-[11px] text-zinc-500">
              <span className="font-medium text-zinc-400">
                {repo.language || "TypeScript"}
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-amber-400" />
                  {repo.stargazers_count}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="h-3 w-3 text-zinc-500" />
                  {repo.forks_count}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
