"use client";

import { useState, useTransition } from "react";
import { upsertSkillAction, deleteSkillAction } from "@/actions/skill.actions";
import type { Skill } from "@/db/schema";
import { Plus, Trash2, Edit3, Check, X } from "lucide-react";

const CATEGORIES = [
  { value: "FRONTEND", label: "Frontend" },
  { value: "BACKEND", label: "Backend" },
  { value: "DATABASE", label: "Database & ORM" },
  { value: "DEVOPS_TOOLS", label: "DevOps & Tools" },
] as const;

export function SkillManager({ initialSkills }: { initialSkills: Skill[] }) {
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Skill["category"]>("FRONTEND");
  const [proficiency, setProficiency] = useState(85);
  const [displayOrder, setDisplayOrder] = useState(0);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setCategory("FRONTEND");
    setProficiency(85);
    setDisplayOrder(0);
  };

  const handleEditSelect = (skill: Skill) => {
    setError("");
    setSuccess("");
    setEditingId(skill.id);
    setName(skill.name);
    setCategory(skill.category);
    setProficiency(skill.proficiency);
    setDisplayOrder(skill.displayOrder);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    startTransition(async () => {
      const res = await upsertSkillAction({
        id: editingId ?? undefined,
        name,
        category,
        proficiency,
        displayOrder,
        isVisible: true,
      });
      if (!res.success) {
        setError(res.error);
      } else {
        setSuccess(editingId ? "Skill updated!" : "Skill added!");
        resetForm();
        setTimeout(() => setSuccess(""), 4000);
      }
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this skill?")) return;
    setError("");
    setSuccess("");
    startTransition(async () => {
      const res = await deleteSkillAction(id);
      if (!res.success) {
        setError(res.error);
      } else {
        setSuccess("Skill removed.");
        setTimeout(() => setSuccess(""), 4000);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Left: Add / Edit Skill Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 lg:col-span-4 h-fit"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-100">
            {editingId ? "Edit Skill" : "Add New Skill"}
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
            Skill Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Next.js, Drizzle ORM, Socket.io"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Skill["category"])}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex justify-between text-xs font-medium text-zinc-400 mb-1">
            <span>Proficiency</span>
            <span className="text-indigo-400">{proficiency}%</span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={proficiency}
            onChange={(e) => setProficiency(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">
            Display Order
          </label>
          <input
            type="number"
            min={0}
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
          />
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
          {isPending ? "Saving..." : editingId ? "Update Skill" : "Add Skill"}
        </button>
      </form>

      {/* Right: Existing Skills List by Category */}
      <div className="space-y-6 lg:col-span-8">
        {CATEGORIES.map((cat) => {
          const catSkills = initialSkills.filter(
            (s) => s.category === cat.value
          );
          return (
            <div
              key={cat.value}
              className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5"
            >
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-400">
                {cat.label} ({catSkills.length})
              </h4>

              {catSkills.length === 0 ? (
                <p className="text-xs text-zinc-600">
                  No skills in this category yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {catSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-zinc-200">
                          {skill.name}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-800">
                            <div
                              className="h-full bg-indigo-500"
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-mono text-zinc-400">
                            {skill.proficiency}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditSelect(skill)}
                          className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                          title="Edit skill"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          disabled={isPending}
                          className="rounded-lg p-2 text-zinc-400 hover:bg-red-500/10 hover:text-red-400"
                          title="Delete skill"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
