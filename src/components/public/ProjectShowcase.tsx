"use client";

import { useState } from "react";
import Image from "next/image";
import { Code2, ExternalLink, X, Layers } from "lucide-react";
import type { Project } from "@/db/schema";
import { useLanguage } from "@/context/LanguageContext";

function ArchitectureModal({
  project,
  onClose,
  titleText,
}: {
  project: Project;
  onClose: () => void;
  titleText: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-zinc-100">
              {project.title}
            </h3>
            <p className="text-sm text-zinc-400 mt-1">{titleText}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-300"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Architecture Notes */}
        <div className="prose prose-invert prose-sm max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-300">
            {project.architectureNotes}
          </pre>
        </div>
      </div>
    </div>
  );
}

export function ProjectShowcase({ projects }: { projects: Project[] }) {
  const { t } = useLanguage();
  const [activeModal, setActiveModal] = useState<Project | null>(null);

  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
          {t("projectsTitle")}
        </h2>
        <p className="mt-3 text-zinc-400 max-w-2xl mx-auto">
          {t("projectsSubtitle")}
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-12 text-center">
          <Layers className="mx-auto h-10 w-10 text-zinc-600 mb-3" />
          <h3 className="text-base font-semibold text-zinc-300">
            {t("noProjectsTitle")}
          </h3>
          <p className="mt-1 text-sm text-zinc-500 max-w-sm mx-auto">
            {t("noProjectsDesc")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 transition hover:border-zinc-700"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-800">
                <Image
                  src={project.thumbnailUrl}
                  alt={project.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-zinc-100">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400 line-clamp-3">
                  {project.shortDescription}
                </p>

                {/* Tech Stack */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.techStack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md bg-zinc-800 px-2 py-0.5 text-[11px] font-medium text-zinc-400"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 4 && (
                    <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-[11px] font-medium text-zinc-500">
                      +{project.techStack.length - 4}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-5 flex items-center gap-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-zinc-700 hover:text-white"
                    >
                      <Code2 className="h-3.5 w-3.5" />
                      {t("btnCode")}
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-zinc-700 hover:text-white"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {t("btnLive")}
                    </a>
                  )}
                  {project.architectureNotes && (
                    <button
                      onClick={() => setActiveModal(project)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-3 py-2 text-xs font-medium text-indigo-400 transition hover:bg-indigo-500/20"
                    >
                      <Layers className="h-3.5 w-3.5" />
                      {t("btnArchitecture")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Architecture Modal */}
      {activeModal && (
        <ArchitectureModal
          project={activeModal}
          titleText={t("modalArchTitle")}
          onClose={() => setActiveModal(null)}
        />
      )}
    </section>
  );
}
