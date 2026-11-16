"use client";

import { useLanguage } from "@/context/LanguageContext";

export function Footer({ fullName }: { fullName: string }) {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-zinc-800/60 py-8 text-center text-xs text-zinc-600">
      <p>
        &copy; {new Date().getFullYear()} {fullName}. {t("footerBuiltWith")}
      </p>
    </footer>
  );
}
