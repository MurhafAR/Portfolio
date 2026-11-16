"use client";

import { Code2, Send, Camera, FileText, ArrowUp, Globe } from "lucide-react";
import type { Profile } from "@/db/schema";
import { useLanguage } from "@/context/LanguageContext";

export function SocialDock({ profile }: { profile: Profile }) {
  const { language, toggleLanguage, t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-zinc-800/80 bg-zinc-950/85 px-4 py-2.5 shadow-2xl backdrop-blur-xl">
        <a
          href={profile.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition"
          title={t("github")}
        >
          <Code2 className="h-4 w-4" />
        </a>

        <a
          href={profile.telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl p-2 text-zinc-400 hover:bg-sky-500/20 hover:text-sky-400 transition"
          title={t("telegram")}
        >
          <Send className="h-4 w-4" />
        </a>

        <a
          href={profile.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl p-2 text-zinc-400 hover:bg-pink-500/20 hover:text-pink-400 transition"
          title={t("instagram")}
        >
          <Camera className="h-4 w-4" />
        </a>

        <div className="h-4 w-[1px] bg-zinc-800 mx-1" />

        <a
          href="#contact"
          className="rounded-xl bg-indigo-600/20 border border-indigo-500/30 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-600/30 transition"
        >
          {t("dockGetInTouch")}
        </a>

        {profile.resumeUrl && (
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition"
            title={t("dockResume")}
          >
            <FileText className="h-4 w-4" />
          </a>
        )}

        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1 rounded-xl p-2 text-zinc-400 hover:bg-zinc-800 hover:text-indigo-400 transition"
          title={language === "en" ? "تبديل إلى العربية" : "Switch to English"}
        >
          <Globe className="h-4 w-4 text-indigo-400" />
          <span className="text-[11px] font-bold uppercase">{language === "en" ? "ar" : "en"}</span>
        </button>

        <button
          onClick={scrollToTop}
          className="rounded-xl p-2 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition"
          title={t("dockBackToTop")}
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
