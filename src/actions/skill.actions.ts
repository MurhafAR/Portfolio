"use server";

import { db } from "@/db";
import { skills } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth";
import { SkillSchema } from "@/lib/validators";
import type { SkillInput } from "@/lib/validators";

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

export async function upsertSkillAction(
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

  const data = parsed.data;

  try {
    if (data.id) {
      await db
        .update(skills)
        .set({
          name: data.name,
          category: data.category,
          proficiency: data.proficiency,
          displayOrder: data.displayOrder,
          isVisible: data.isVisible,
        })
        .where(eq(skills.id, data.id));
    } else {
      await db.insert(skills).values({
        name: data.name,
        category: data.category,
        proficiency: data.proficiency,
        displayOrder: data.displayOrder,
        isVisible: data.isVisible,
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/skills");
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to save skill",
    };
  }
}

export async function deleteSkillAction(
  id: number
): Promise<{ success: true } | { success: false; error: string }> {
  await requireAdminSession();
  try {
    await db.delete(skills).where(eq(skills.id, id));
    revalidatePath("/");
    revalidatePath("/admin/skills");
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to delete skill",
    };
  }
}
