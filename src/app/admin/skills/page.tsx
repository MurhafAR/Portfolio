import { getSkills } from "@/actions/skill.actions";
import { SkillManager } from "@/components/admin/SkillManager";
import { connection } from "next/server";

export const instant = false;

export default async function SkillsAdminPage() {
  await connection();
  const skills = await getSkills();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100">Manage Skills</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Add, edit, reorder, and delete your skill entries. Changes are
          reflected on the public site immediately.
        </p>
      </div>

      <SkillManager initialSkills={skills} />
    </div>
  );
}
