"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Globe, Lock } from "lucide-react";
import Link from "next/link";

export function Navbar({ fullName }: { fullName: string }) {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/50 bg-zinc-950/70 backdrop-blur-xl transition">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        {/* Brand */}
        <a
          href="#"
          className="text-sm font-bold tracking-tight text-zinc-100 hover:text-indigo-400 transition"
        >
          {fullName}
        </a>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
          <a href="#skills" className="hover:text-zinc-100 transition">
            {t("navSkills")}
          </a>
          <a href="#projects" className="hover:text-zinc-100 transition">
            {t("navProjects")}
          </a>
          <a href="#activity" className="hover:text-zinc-100 transition">
            {t("navActivity")}
          </a>
          <a href="#contact" className="hover:text-zinc-100 transition">
            {t("navContact")}
          </a>
        </nav>

        {/* Right Actions: Language Switcher & Admin */}
        <div className="flex items-center gap-3">
          {/* Translate Button */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:border-indigo-500/50 hover:bg-zinc-800 hover:text-white transition shadow-sm"
            title={language === "en" ? "تبديل إلى العربية" : "Switch to English"}
          >
            <Globe className="h-3.5 w-3.5 text-indigo-400" />
            <span>{t("switchLanguage")}</span>
          </button>

          {/* Admin Link */}
          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-1 rounded-full border border-zinc-800/80 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-500 hover:border-zinc-700 hover:text-zinc-300 transition"
            title={t("navAdmin")}
          >
            <Lock className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </header>
  );
}
