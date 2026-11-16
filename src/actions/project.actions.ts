"use server";

import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth";
import { ProjectSchema, type ProjectInput } from "@/lib/validators";

export async function getProjects() {
  return db.select().from(projects).orderBy(asc(projects.displayOrder));
}

export async function getFeaturedProjects() {
  return db
    .select()
    .from(projects)
    .where(eq(projects.isFeatured, true))
    .orderBy(asc(projects.displayOrder));
}

export async function upsertProject(
  input: ProjectInput
): Promise<{ success: true } | { success: false; error: string }> {
  await requireAdminSession();

  const parsed = ProjectSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid project data",
    };
  }

  const { id, ...data } = parsed.data;
  const values = {
    title: data.title,
    slug: data.slug,
    shortDescription: data.shortDescription,
    architectureNotes: data.architectureNotes ?? null,
    thumbnailUrl: data.thumbnailUrl,
    techStack: data.techStack,
    githubUrl: data.githubUrl || null,
    liveUrl: data.liveUrl || null,
    isFeatured: data.isFeatured,
    displayOrder: data.displayOrder,
  };

  try {
    if (id) {
      await db.update(projects).set(values).where(eq(projects.id, id));
    } else {
      await db.insert(projects).values(values);
    }

    revalidatePath("/");
    revalidatePath("/admin/projects");
    return { success: true };
  } catch (err: unknown) {
    const isConflict =
      typeof err === "object" &&
      err !== null &&
      ("code" in err ? (err as { code?: string }).code === "23505" : false);

    if (isConflict) {
      return {
        success: false,
        error: "A project with this slug already exists. Please choose a unique slug.",
      };
    }

    const message = err instanceof Error ? err.message : "Failed to save project";
    return { success: false, error: message };
  }
}

export async function deleteProject(
  id: number
): Promise<{ success: true } | { success: false; error: string }> {
  await requireAdminSession();

  try {
    await db.delete(projects).where(eq(projects.id, id));
    revalidatePath("/");
    revalidatePath("/admin/projects");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete project";
    return { success: false, error: message };
  }
}

// Aliases for compatibility
export const upsertProjectAction = upsertProject;
export const deleteProjectAction = deleteProject;
