import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";

export const skillCategoryEnum = pgEnum("skill_category", [
  "FRONTEND",
  "BACKEND",
  "DATABASE",
  "DEVOPS_TOOLS",
]);

export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull().default("Murhaf Abu Rashed"),
  headline: text("headline")
    .notNull()
    .default("Full-Stack Web Developer | Next.js, TypeScript & Node.js"),
  bio: text("bio").notNull(),
  avatarUrl: text("avatar_url").notNull().default("/images/profile-hero.jpg"),
  isAvailable: boolean("is_available").notNull().default(true),
  statusMessage: text("status_message").default(
    "Available for Full-Stack roles & freelance projects"
  ),
  githubUrl: text("github_url").notNull(),
  telegramUrl: text("telegram_url").notNull(),
  instagramUrl: text("instagram_url").notNull(),
  resumeUrl: text("resume_url").default("/resume.pdf"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: skillCategoryEnum("category").notNull().default("FRONTEND"),
  proficiency: integer("proficiency").notNull().default(90),
  iconName: text("icon_name"),
  displayOrder: integer("display_order").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  shortDescription: text("short_description").notNull(),
  architectureNotes: text("architecture_notes"),
  thumbnailUrl: text("thumbnail_url").notNull(),
  techStack: jsonb("tech_stack").$type<string[]>().notNull().default([]),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  isFeatured: boolean("is_featured").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Profile = typeof profile.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
