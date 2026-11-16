"use server";

import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth";
import { ProjectSchema } from "@/lib/validators";
import type { ProjectInput } from "@/lib/validators";

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

export async function upsertProjectAction(
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

  const data = parsed.data;

  try {
    if (data.id) {
      await db
        .update(projects)
        .set({
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
        })
        .where(eq(projects.id, data.id));
    } else {
      await db.insert(projects).values({
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
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/projects");
    return { success: true };
  } catch (error: any) {
    if (error?.code === "23505" || error?.message?.includes("unique")) {
      return {
        success: false,
        error:
          "A project with this slug already exists. Please choose a unique slug.",
      };
    }
    return {
      success: false,
      error: error?.message || "Failed to save project",
    };
  }
}

export async function deleteProjectAction(
  id: number
): Promise<{ success: true } | { success: false; error: string }> {
  await requireAdminSession();
  try {
    await db.delete(projects).where(eq(projects.id, id));
    revalidatePath("/");
    revalidatePath("/admin/projects");
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to delete project",
    };
  }
}
