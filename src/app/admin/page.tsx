import Link from "next/link";
import { getProfile } from "@/actions/profile.actions";
import { getSkills } from "@/actions/skill.actions";
import { getProjects } from "@/actions/project.actions";
import { Layers, Zap, FolderOpen } from "lucide-react";
import { connection } from "next/server";
import { ProfileManager } from "@/components/admin/ProfileManager";

export const instant = false;

export default async function AdminOverview() {
  await connection();
  const [profileData, skills, projects] = await Promise.all([
    getProfile(),
    getSkills(),
    getProjects(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100">Welcome back</h2>
        <p className="mt-1 text-zinc-400">
          Manage your portfolio content from here.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-500/10 p-2">
              <Zap className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">
                {skills.length}
              </p>
              <p className="text-xs text-zinc-400">Total Skills</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-500/10 p-2">
              <FolderOpen className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">
                {projects.length}
              </p>
              <p className="text-xs text-zinc-400">Total Projects</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-cyan-500/10 p-2">
              <Layers className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">
                {profileData?.isAvailable ? "🟢" : "🔴"}
              </p>
              <p className="text-xs text-zinc-400">Availability Status</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/admin/skills"
          className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 transition hover:border-indigo-500/30 hover:bg-indigo-500/5"
        >
          <h3 className="text-lg font-semibold text-zinc-200 group-hover:text-indigo-300 transition">
            Manage Skills →
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            Add, edit, reorder, and delete your skill entries.
          </p>
        </Link>

        <Link
          href="/admin/projects"
          className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 transition hover:border-emerald-500/30 hover:bg-emerald-500/5"
        >
          <h3 className="text-lg font-semibold text-zinc-200 group-hover:text-emerald-300 transition">
            Manage Projects →
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            Add, edit, and manage your portfolio projects.
          </p>
        </Link>
      </div>

      {/* Profile & Live Status Management */}
      {profileData && (
        <div className="space-y-4 pt-4 border-t border-zinc-800/80">
          <div>
            <h3 className="text-xl font-bold text-zinc-100">
              Profile & Availability Settings
            </h3>
            <p className="mt-1 text-sm text-zinc-400">
              Update your portrait, status badge, bio, and social links. Changes are reflected on your public portfolio immediately.
            </p>
          </div>
          <ProfileManager profile={profileData} />
        </div>
      )}
    </div>
  );
}
