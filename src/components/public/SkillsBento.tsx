"use client";

import type { Skill } from "@/db/schema";
import { useLanguage } from "@/context/LanguageContext";

export function SkillsBento({ skills }: { skills: Skill[] }) {
  const { t } = useLanguage();

  const CATEGORY_META = [
    {
      value: "FRONTEND" as const,
      label: t("categoryFrontend"),
      gradient: "from-blue-500/20 to-indigo-500/20",
      border: "border-blue-500/20",
      badge: "bg-blue-500/10 text-blue-400",
    },
    {
      value: "BACKEND" as const,
      label: t("categoryBackend"),
      gradient: "from-emerald-500/20 to-green-500/20",
      border: "border-emerald-500/20",
      badge: "bg-emerald-500/10 text-emerald-400",
    },
    {
      value: "DATABASE" as const,
      label: t("categoryDatabase"),
      gradient: "from-amber-500/20 to-orange-500/20",
      border: "border-amber-500/20",
      badge: "bg-amber-500/10 text-amber-400",
    },
    {
      value: "DEVOPS_TOOLS" as const,
      label: t("categoryDevops"),
      gradient: "from-purple-500/20 to-pink-500/20",
      border: "border-purple-500/20",
      badge: "bg-purple-500/10 text-purple-400",
    },
  ] as const;

  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
          {t("skillsTitle")}
        </h2>
        <p className="mt-3 text-zinc-400 max-w-2xl mx-auto">
          {t("skillsSubtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {CATEGORY_META.map((cat) => {
          const catSkills = skills.filter((s) => s.category === cat.value);
          if (catSkills.length === 0) return null;

          return (
            <div
              key={cat.value}
              className={`rounded-2xl border ${cat.border} bg-gradient-to-br ${cat.gradient} p-6 backdrop-blur-sm`}
            >
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${cat.badge} mb-4`}
              >
                {cat.label}
              </span>

              <div className="space-y-3">
                {catSkills.map((skill) => (
                  <div key={skill.id} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition">
                        {skill.name}
                      </span>
                      <span className="text-xs font-mono text-zinc-500">
                        {skill.proficiency}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800/60">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-700"
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
