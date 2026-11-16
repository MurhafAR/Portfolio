"use server";

import { db } from "@/db";
import { skills } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth";
import { SkillSchema, type SkillInput } from "@/lib/validators";

export async function getSkills() {
  return db.select().from(skills).orderBy(asc(skills.displayOrder));
}

export async function getVisibleSkills() {
  return db
    .select()
    .from(skills)
    .where(eq(skills.isVisible, true))
    .orderBy(asc(skills.displayOrder));
}

export async function upsertSkill(
  input: SkillInput
): Promise<{ success: true } | { success: false; error: string }> {
  await requireAdminSession();

  const parsed = SkillSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid skill data",
    };
  }

  const { id, ...values } = parsed.data;

  try {
    if (id) {
      await db.update(skills).set(values).where(eq(skills.id, id));
    } else {
      await db.insert(skills).values(values);
    }

    revalidatePath("/");
    revalidatePath("/admin/skills");
    return { success: true };
  } catch (err) {
    const error = err instanceof Error ? err.message : "Failed to save skill";
    return { success: false, error };
  }
}

export async function deleteSkill(
  id: number
): Promise<{ success: true } | { success: false; error: string }> {
  await requireAdminSession();

  try {
    await db.delete(skills).where(eq(skills.id, id));
    revalidatePath("/");
    revalidatePath("/admin/skills");
    return { success: true };
  } catch (err) {
    const error = err instanceof Error ? err.message : "Failed to delete skill";
    return { success: false, error };
  }
}

// Aliases for compatibility
export const upsertSkillAction = upsertSkill;
export const deleteSkillAction = deleteSkill;
