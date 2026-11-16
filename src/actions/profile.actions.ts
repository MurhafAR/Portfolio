"use server";

import { db } from "@/db";
import { profile } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth";
import { ProfileSchema, type ProfileInput } from "@/lib/validators";

export async function getProfile() {
  const rows = await db.select().from(profile).limit(1);
  return rows[0] ?? null;
}

export async function updateProfile(
  input: ProfileInput
): Promise<{ success: true } | { success: false; error: string }> {
  await requireAdminSession();

  const parsed = ProfileSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid profile data",
    };
  }

  const data = parsed.data;

  try {
    const existing = await getProfile();
    if (!existing) {
      return {
        success: false,
        error: "Profile not found. Run the seed script first.",
      };
    }

    await db
      .update(profile)
      .set({
        fullName: data.fullName,
        headline: data.headline,
        bio: data.bio,
        avatarUrl: data.avatarUrl,
        isAvailable: data.isAvailable,
        statusMessage: data.statusMessage ?? null,
        githubUrl: data.githubUrl,
        telegramUrl: data.telegramUrl,
        instagramUrl: data.instagramUrl,
        resumeUrl: data.resumeUrl ?? null,
        updatedAt: new Date(),
      })
      .where(eq(profile.id, existing.id));

    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Failed to update profile";
    return { success: false, error };
  }
}

export async function toggleAvailability(
  isAvailable: boolean,
  statusMessage?: string
): Promise<{ success: true } | { success: false; error: string }> {
  await requireAdminSession();

  try {
    const existing = await getProfile();
    if (!existing) {
      return { success: false, error: "Profile not found" };
    }

    await db
      .update(profile)
      .set({
        isAvailable,
        statusMessage:
          statusMessage !== undefined ? statusMessage : existing.statusMessage,
        updatedAt: new Date(),
      })
      .where(eq(profile.id, existing.id));

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Failed to toggle availability";
    return { success: false, error };
  }
}

// Aliases for compatibility
export const updateProfileAction = updateProfile;
export const toggleAvailabilityAction = toggleAvailability;
