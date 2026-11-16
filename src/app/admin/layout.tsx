import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { LayoutDashboard, LogOut } from "lucide-react";
import { logoutAdmin } from "@/lib/auth";
import { connection } from "next/server";

export const instant = false;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  const session = await getAdminSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Admin Header */}
      <header className="border-b border-zinc-800/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-5 w-5 text-indigo-400" />
            <h1 className="text-lg font-bold text-zinc-100">
              Admin Dashboard
            </h1>
          </div>

          <nav className="flex items-center gap-6">
            <a
              href="/admin"
              className="text-sm text-zinc-400 hover:text-zinc-100 transition"
            >
              Overview
            </a>
            <a
              href="/admin/skills"
              className="text-sm text-zinc-400 hover:text-zinc-100 transition"
            >
              Skills
            </a>
            <a
              href="/admin/projects"
              className="text-sm text-zinc-400 hover:text-zinc-100 transition"
            >
              Projects
            </a>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-500 hover:text-zinc-300 transition"
            >
              View Site →
            </a>
            <form
              action={async () => {
                "use server";
                await logoutAdmin();
                redirect("/login");
              }}
            >
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </form>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
    </div>
  );
}
