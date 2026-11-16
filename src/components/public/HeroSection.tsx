"use client";

import Image from "next/image";
import { Code2, Send, Camera, FileText, Terminal } from "lucide-react";
import type { Profile } from "@/db/schema";
import { useLanguage } from "@/context/LanguageContext";

export function HeroSection({ profile }: { profile: Profile }) {
  const { t, language } = useLanguage();

  const isArabic = language === "ar";
  const headline = isArabic ? t("defaultHeadline") : profile.headline;
  const bio = isArabic ? t("defaultBio") : profile.bio;
  const statusMsg = isArabic ? t("statusAvailable") : profile.statusMessage;

  return (
    <section className="relative mx-auto max-w-6xl px-6 pt-16 pb-16 md:py-24">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          {profile.isAvailable && (
            <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {statusMsg}
            </div>
          )}

          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-100 sm:text-6xl">
            {t("greeting")}{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              {profile.fullName}
            </span>
          </h1>

          <p className="text-xl font-medium text-zinc-300">
            {headline}
          </p>

          <p className="max-w-2xl leading-relaxed text-zinc-400">
            {bio}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-white"
            >
              <Code2 className="h-4 w-4" />
              {t("github")}
            </a>

            <a
              href={profile.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-sky-500/40 bg-sky-500/10 px-5 py-3 text-sm font-semibold text-sky-400 transition hover:bg-sky-500/20"
            >
              <Send className="h-4 w-4" />
              {t("telegram")}
            </a>

            <a
              href={profile.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-pink-500/40 bg-pink-500/10 px-5 py-3 text-sm font-semibold text-pink-400 transition hover:bg-pink-500/20"
            >
              <Camera className="h-4 w-4" />
              {t("instagram")}
            </a>

            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:border-zinc-700 hover:text-white"
              >
                <FileText className="h-4 w-4" />
                {t("resume")}
              </a>
            )}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm lg:col-span-5">
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-indigo-500/30 via-cyan-500/20 to-emerald-500/30 blur-2xl" />

          <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/90 p-2 shadow-2xl">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
              <Image
                src={profile.avatarUrl}
                alt={profile.fullName}
                fill
                priority
                className="object-cover object-top transition duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
            </div>

            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-xl border border-zinc-700/60 bg-zinc-900/90 px-4 py-3 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <Terminal className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-medium text-zinc-200">
                  Next.js • TypeScript • PostgreSQL
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">
                {t("fullStackBadge")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
