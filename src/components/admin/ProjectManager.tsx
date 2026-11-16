"use client";

import { useState, useTransition } from "react";
import {
  upsertProjectAction,
  deleteProjectAction,
} from "@/actions/project.actions";
import type { Project } from "@/db/schema";
import { Plus, Trash2, Edit3, Check, X } from "lucide-react";

export function ProjectManager({
  initialProjects,
}: {
  initialProjects: Project[];
}) {
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [architectureNotes, setArchitectureNotes] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [techStackInput, setTechStackInput] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(0);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setShortDescription("");
    setArchitectureNotes("");
    setThumbnailUrl("");
    setTechStackInput("");
    setGithubUrl("");
    setLiveUrl("");
    setIsFeatured(true);
    setDisplayOrder(0);
  };

  const handleEditSelect = (project: Project) => {
    setError("");
    setSuccess("");
    setEditingId(project.id);
    setTitle(project.title);
    setSlug(project.slug);
    setShortDescription(project.shortDescription);
    setArchitectureNotes(project.architectureNotes ?? "");
    setThumbnailUrl(project.thumbnailUrl);
    setTechStackInput(project.techStack.join(", "));
    setGithubUrl(project.githubUrl ?? "");
    setLiveUrl(project.liveUrl ?? "");
    setIsFeatured(project.isFeatured);
    setDisplayOrder(project.displayOrder);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    startTransition(async () => {
      const res = await upsertProjectAction({
        id: editingId ?? undefined,
        title,
        slug,
        shortDescription,
        architectureNotes: architectureNotes || undefined,
        thumbnailUrl,
        techStack: techStackInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        githubUrl: githubUrl || "",
        liveUrl: liveUrl || "",
        isFeatured,
        displayOrder,
      });
      if (!res.success) {
        setError(res.error);
      } else {
        setSuccess(editingId ? "Project updated successfully!" : "Project created successfully!");
        resetForm();
        setTimeout(() => setSuccess(""), 4000);
      }
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this project?")) return;
    setError("");
    setSuccess("");
    startTransition(async () => {
      const res = await deleteProjectAction(id);
      if (!res.success) {
        setError(res.error);
      } else {
        setSuccess("Project deleted.");
        setTimeout(() => setSuccess(""), 4000);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Left: Add / Edit Project Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 lg:col-span-5 h-fit"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-100">
            {editingId ? "Edit Project" : "Add New Project"}
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
            >
              <X className="h-3.5 w-3.5" /> Cancel
            </button>
          )}
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400">
            {success}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">
            Title
          </label>
          <input
            type="text"
            required
            placeholder="e.g., MovieNight — Real-Time Watch Party"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">
            Slug
          </label>
          <input
            type="text"
            required
            placeholder="e.g., movienight"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">
            Short Description
          </label>
          <textarea
            required
            rows={3}
            placeholder="Brief project overview..."
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">
            Thumbnail URL
          </label>
          <input
            type="text"
            required
            placeholder="/images/project-thumb.jpg"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">
            Tech Stack (comma-separated)
          </label>
          <input
            type="text"
            placeholder="Next.js, TypeScript, PostgreSQL"
            value={techStackInput}
            onChange={(e) => setTechStackInput(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              GitHub URL
            </label>
            <input
              type="text"
              placeholder="https://github.com/..."
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Live URL
            </label>
            <input
              type="text"
              placeholder="https://..."
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">
            Architecture Notes (Markdown)
          </label>
          <textarea
            rows={5}
            placeholder="## Architecture Overview..."
            value={architectureNotes}
            onChange={(e) => setArchitectureNotes(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 font-mono focus:border-indigo-500 focus:outline-none resize-none"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="accent-indigo-500"
            />
            Featured
          </label>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-zinc-400">Order</label>
            <input
              type="number"
              min={0}
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="w-20 rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
        >
          {editingId ? (
            <Check className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {isPending
            ? "Saving..."
            : editingId
              ? "Update Project"
              : "Add Project"}
        </button>
      </form>

      {/* Right: Existing Projects List */}
      <div className="space-y-4 lg:col-span-7">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Projects ({initialProjects.length})
        </h4>

        {initialProjects.length === 0 ? (
          <p className="text-sm text-zinc-600">No projects yet.</p>
        ) : (
          <div className="space-y-3">
            {initialProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-start justify-between rounded-xl border border-zinc-800 bg-zinc-950/80 px-5 py-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-zinc-200 truncate">
                      {project.title}
                    </p>
                    {project.isFeatured && (
                      <span className="shrink-0 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-zinc-500 truncate">
                    /{project.slug}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {project.techStack.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 ml-4">
                  <button
                    onClick={() => handleEditSelect(project)}
                    className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                    title="Edit project"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    disabled={isPending}
                    className="rounded-lg p-2 text-zinc-400 hover:bg-red-500/10 hover:text-red-400"
                    title="Delete project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
