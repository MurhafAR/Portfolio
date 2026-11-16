import { getProjects } from "@/actions/project.actions";
import { ProjectManager } from "@/components/admin/ProjectManager";
import { connection } from "next/server";

export const instant = false;

export default async function ProjectsAdminPage() {
  await connection();
  const projects = await getProjects();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100">Manage Projects</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Add, edit, and manage your portfolio projects. Featured projects
          appear on the public landing page.
        </p>
      </div>

      <ProjectManager initialProjects={projects} />
    </div>
  );
}
