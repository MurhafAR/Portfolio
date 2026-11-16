import { z } from "zod";

export const SkillSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Skill name is required").max(50),
  category: z.enum(["FRONTEND", "BACKEND", "DATABASE", "DEVOPS_TOOLS"]),
  proficiency: z.coerce.number().min(10).max(100),
  displayOrder: z.coerce.number().default(0),
  isVisible: z.boolean().default(true),
});

export const ProjectSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Project title is required").max(100),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  shortDescription: z.string().min(1).max(500),
  architectureNotes: z.string().optional(),
  thumbnailUrl: z.string().min(1, "Thumbnail URL is required"),
  techStack: z.array(z.string()).default([]),
  githubUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  isFeatured: z.boolean().default(true),
  displayOrder: z.coerce.number().default(0),
});

export const ProfileSchema = z.object({
  fullName: z.string().min(1).max(100),
  headline: z.string().min(1).max(200),
  bio: z.string().min(1).max(2000),
  avatarUrl: z.string().min(1),
  isAvailable: z.boolean(),
  statusMessage: z.string().max(200).optional(),
  githubUrl: z.string().url(),
  telegramUrl: z.string().url(),
  instagramUrl: z.string().url(),
  resumeUrl: z.string().optional(),
});

export type SkillInput = z.infer<typeof SkillSchema>;
export type ProjectInput = z.infer<typeof ProjectSchema>;
export type ProfileInput = z.infer<typeof ProfileSchema>;
