---

### 1. High-Value Portfolio Additions for a Full-Stack Developer

Beyond your photo, projects showcase, skills editor, and social links (GitHub, Telegram, Instagram), adding these four elements will make your portfolio stand out to recruiters and clients:

* **Interactive System Architecture Modal:** Instead of just linking to a live demo or repo (like your *MovieNight* real-time watch-party app), include a "View Architecture" button on project cards that opens a modal showing the tech stack breakdown, database schema diagram, and how you solved hard engineering problems (e.g., WebSocket state synchronization or Auth flows).
* **"Availability & Current Focus" Status Pill:** A live, admin-toggleable badge right next to your hero portrait (e.g., *"🟢 Available for Full-Stack Roles & Freelance — Currently building with Next.js & WebSockets"*).
* **Live GitHub Activity & Commit Graph:** A server-fetched widget pulling your latest public commits and pinned repositories via the GitHub GraphQL/REST API so visitors see active code output.
* **One-Click CV/Resume & Direct Contact Drawer:** A downloadable PDF resume button (manageable from the admin panel) alongside a quick message form that forwards inquiries directly to your **Telegram** via a simple Telegram Bot webhook—so clients can reach you instantly without leaving the site.

---

### 2. Multi-File Folder Structure (Next.js App Router)

```text
my-portfolio/
├── public/
│   ├── images/
│   │   └── profile-hero.jpg          # Place your uploaded portrait here (image_86ac83.jpg)
│   └── resume.pdf
├── src/
│   ├── app/
│   │   ├── (public)/                 # Public-facing portfolio routes
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx              # Main portfolio landing page (SSR / ISR)
│   │   ├── admin/                    # Protected CMS dashboard
│   │   │   ├── layout.tsx            # Auth guard wrapper
│   │   │   ├── page.tsx              # Overview & quick toggles
│   │   │   ├── skills/
│   │   │   │   └── page.tsx          # CRUD interface for Skills
│   │   │   └── projects/
│   │   │       └── page.tsx          # CRUD interface for Projects
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── skills/route.ts       # REST fallback / external API
│   │       └── projects/route.ts
│   ├── actions/                      # Next.js Server Actions (Mutations + Revalidation)
│   │   ├── skill.actions.ts
│   │   ├── project.actions.ts
│   │   └── profile.actions.ts
│   ├── components/
│   │   ├── public/
│   │   │   ├── HeroSection.tsx       # Displays your portrait, bio, availability, & socials
│   │   │   ├── SocialDock.tsx        # Floating/inline GitHub, Telegram, Instagram links
│   │   │   ├── SkillsBento.tsx       # Categorized interactive skills grid
│   │   │   ├── ProjectShowcase.tsx   # Filterable project cards + Architecture modal
│   │   │   └── ContactTelegram.tsx   # Direct-to-Telegram contact form
│   │   └── admin/
│   │       ├── SkillManager.tsx      # Client component for adding/editing/deleting skills
│   │       └── ProjectManager.tsx    # Client component for managing portfolio works
│   ├── db/
│   │   ├── index.ts                  # PostgreSQL connection pool (Neon / Supabase / local PG)
│   │   ├── schema.ts                 # Drizzle ORM database schema
│   │   └── seed.ts                   # Initial seed script for your profile & skills
│   └── lib/
│       ├── auth.ts                   # Auth.js configuration (GitHub OAuth / Credentials)
│       └── validators.ts             # Zod schemas for form & API validation
├── drizzle.config.ts
├── next.config.mjs
├── package.json
└── tsconfig.json

```

---

### 3. Full-Stack Database Schema (`src/db/schema.ts`)

Using **PostgreSQL** and **Drizzle ORM**, this schema covers your personal profile (including your portrait URL and social links), categorized skills with proficiency/ordering, and featured projects with architecture notes.

```typescript
// src/db/schema.ts
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

// 1. Singleton Profile & Social Links Table
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

// 2. Editable Skills Table
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // e.g., "Next.js", "TypeScript", "PostgreSQL"
  category: skillCategoryEnum("category").notNull().default("FRONTEND"),
  proficiency: integer("proficiency").notNull().default(90), // 1 - 100
  iconName: text("icon_name"), // Lucide or SimpleIcons slug
  displayOrder: integer("display_order").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 3. Projects Showcase Table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(), // e.g., "MovieNight — Real-Time Watch Party"
  slug: text("slug").notNull().unique(),
  shortDescription: text("short_description").notNull(),
  architectureNotes: text("architecture_notes"), // Markdown explaining DB/Socket architecture
  thumbnailUrl: text("thumbnail_url").notNull(),
  techStack: jsonb("tech_stack").$type<string[]>().notNull().default([]), // ["Next.js", "Socket.io", "Drizzle", "PostgreSQL"]
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
```

---

### 4. API & Server Actions Architecture (`src/actions/skill.actions.ts`)

Rather than writing boilerplate `fetch('/api/skills')` calls for internal mutations, use **Next.js Server Actions** validated with **Zod**. Whenever you add, edit, or delete a skill in your Admin Panel, `revalidatePath("/")` immediately updates your public portfolio without a rebuild.

```typescript
// src/actions/skill.actions.ts
"use server";

import { db } from "@/db";
import { skills } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
// Replace with your Auth.js session check helper
import { requireAdminSession } from "@/lib/auth";

const SkillSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Skill name is required").max(50),
  category: z.enum(["FRONTEND", "BACKEND", "DATABASE", "DEVOPS_TOOLS"]),
  proficiency: z.coerce.number().min(10).max(100),
  displayOrder: z.coerce.number().default(0),
  isVisible: z.boolean().default(true),
});

export async function upsertSkillAction(input: z.infer<typeof SkillSchema>) {
  await requireAdminSession(); // Ensures only you can mutate data
  const parsed = SkillSchema.parse(input);

  if (parsed.id) {
    // Update existing skill
    await db
      .update(skills)
      .set({
        name: parsed.name,
        category: parsed.category,
        proficiency: parsed.proficiency,
        displayOrder: parsed.displayOrder,
        isVisible: parsed.isVisible,
      })
      .where(eq(skills.id, parsed.id));
  } else {
    // Create new skill
    await db.insert(skills).values({
      name: parsed.name,
      category: parsed.category,
      proficiency: parsed.proficiency,
      displayOrder: parsed.displayOrder,
      isVisible: parsed.isVisible,
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/skills");
  return { success: true };
}

export async function deleteSkillAction(id: number) {
  await requireAdminSession();
  await db.delete(skills).where(eq(skills.id, id));

  revalidatePath("/");
  revalidatePath("/admin/skills");
  return { success: true };
}
```

---

### 5. Core Next.js / React Components

#### A. Hero Section with Portrait Frame & Social Links (`src/components/public/HeroSection.tsx`)

Because your uploaded photo is a vertical portrait in a sharp dark blazer, framing it inside a stylized glassmorphic card with a subtle gradient border and floating tech badge integrates it naturally into a dark-mode developer theme.

```tsx
// src/components/public/HeroSection.tsx
import Image from "next/image";
import { Github, Send, Instagram, FileText, Terminal } from "lucide-react";
import type { Profile } from "@/db/schema";

export function HeroSection({ profile }: { profile: Profile }) {
  return (
    <section className="relative mx-auto max-w-6xl px-6 pt-20 pb-16 md:py-28">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        {/* Left Column: Intro, Bio & Social CTAs (7 Cols) */}
        <div className="space-y-6 lg:col-span-7">
          {profile.isAvailable && (
            <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {profile.statusMessage}
            </div>
          )}

          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-100 sm:text-6xl">
            Hi, I&apos;m{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              {profile.fullName}
            </span>
          </h1>

          <p className="text-xl font-medium text-zinc-300">
            {profile.headline}
          </p>

          <p className="max-w-2xl leading-relaxed text-zinc-400">
            {profile.bio}
          </p>

          {/* Social Links & Resume Bar */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-white"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>

            <a
              href={profile.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-sky-500/40 bg-sky-500/10 px-5 py-3 text-sm font-semibold text-sky-400 transition hover:bg-sky-500/20"
            >
              <Send className="h-4 w-4" />
              Telegram
            </a>

            <a
              href={profile.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-pink-500/40 bg-pink-500/10 px-5 py-3 text-sm font-semibold text-pink-400 transition hover:bg-pink-500/20"
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </a>

            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:border-zinc-700 hover:text-white"
              >
                <FileText className="h-4 w-4" />
                Resume
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Framed Developer Portrait (5 Cols) */}
        <div className="relative mx-auto w-full max-w-sm lg:col-span-5">
          {/* Ambient Glow Behind Portrait */}
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-indigo-500/30 via-cyan-500/20 to-emerald-500/30 blur-2xl" />

          <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/90 p-2 shadow-2xl">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
              <Image
                src={profile.avatarUrl} // Save your uploaded image as /public/images/profile-hero.jpg
                alt={profile.fullName}
                fill
                priority
                className="object-cover object-top transition duration-500 hover:scale-105"
              />
              {/* Subtle bottom vignette so overlay badge pops */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
            </div>

            {/* Floating Tech Stack Badge on Portrait */}
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-xl border border-zinc-700/60 bg-zinc-900/90 px-4 py-3 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <Terminal className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-medium text-zinc-200">
                  Next.js • TypeScript • PostgreSQL
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">
                Full-Stack
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

#### B. Interactive Admin Skills Manager (`src/components/admin/SkillManager.tsx`)

This Client Component connects directly to your Server Actions so you can add new skills, adjust proficiency sliders, change categories, or delete skills in real time.

```tsx
// src/components/admin/SkillManager.tsx
"use client";

import { useState, useTransition } from "react";
import { upsertSkillAction, deleteSkillAction } from "@/actions/skill.actions";
import type { Skill } from "@/db/schema";
import { Plus, Trash2, Edit3, Check, X } from "lucide-react";

const CATEGORIES = [
  { value: "FRONTEND", label: "Frontend" },
  { value: "BACKEND", label: "Backend" },
  { value: "DATABASE", label: "Database & ORM" },
  { value: "DEVOPS_TOOLS", label: "DevOps & Tools" },
] as const;

export function SkillManager({ initialSkills }: { initialSkills: Skill[] }) {
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Skill["category"]>("FRONTEND");
  const [proficiency, setProficiency] = useState(85);
  const [displayOrder, setDisplayOrder] = useState(0);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setCategory("FRONTEND");
    setProficiency(85);
    setDisplayOrder(0);
  };

  const handleEditSelect = (skill: Skill) => {
    setEditingId(skill.id);
    setName(skill.name);
    setCategory(skill.category);
    setProficiency(skill.proficiency);
    setDisplayOrder(skill.displayOrder);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await upsertSkillAction({
        id: editingId ?? undefined,
        name,
        category,
        proficiency,
        displayOrder,
        isVisible: true,
      });
      resetForm();
    });
  };

  const handleDelete = (id: number) => {
    startTransition(async () => {
      await deleteSkillAction(id);
    });
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Left: Add / Edit Skill Form (4 Cols) */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 lg:col-span-4 h-fit"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-100">
            {editingId ? "Edit Skill" : "Add New Skill"}
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
            >
              <X className="h-3.5 w-3.5" /> Cancel
            </button>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">
            Skill Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Next.js, Drizzle ORM, Socket.io"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Skill["category"])}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex justify-between text-xs font-medium text-zinc-400 mb-1">
            <span>Proficiency</span>
            <span className="text-indigo-400">{proficiency}%</span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={proficiency}
            onChange={(e) => setProficiency(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
        >
          {editingId ? (
            <Check className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {isPending ? "Saving..." : editingId ? "Update Skill" : "Add Skill"}
        </button>
      </form>

      {/* Right: Existing Skills List by Category (8 Cols) */}
      <div className="space-y-6 lg:col-span-8">
        {CATEGORIES.map((cat) => {
          const catSkills = initialSkills.filter(
            (s) => s.category === cat.value
          );
          return (
            <div
              key={cat.value}
              className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5"
            >
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-400">
                {cat.label} ({catSkills.length})
              </h4>

              {catSkills.length === 0 ? (
                <p className="text-xs text-zinc-600">
                  No skills in this category yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {catSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-zinc-200">
                          {skill.name}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-800">
                            <div
                              className="h-full bg-indigo-500"
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-mono text-zinc-400">
                            {skill.proficiency}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditSelect(skill)}
                          className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                          title="Edit skill"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          disabled={isPending}
                          className="rounded-lg p-2 text-zinc-400 hover:bg-red-500/10 hover:text-red-400"
                          title="Delete skill"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

---

### 6. Copy-Paste Master Prompt for Antigravity

Copy the prompt block below directly into **Antigravity** alongside the schema and components above so it scaffolds the entire project cleanly in one go:

```text
Act as a Senior Full-Stack Next.js Architect. Scaffold my personal developer portfolio and Admin CMS using Next.js 15 (App Router), TypeScript, Tailwind CSS, Drizzle ORM with PostgreSQL, Auth.js (NextAuth v5), and Lucide Icons.

Requirements:
1. Save my uploaded portrait photo to `public/images/profile-hero.jpg` and render it inside the HeroSection component with a glassmorphic dark-mode frame.
2. Implement `src/db/schema.ts` using Drizzle ORM for `profile`, `skills` (categorized as FRONTEND, BACKEND, DATABASE, DEVOPS_TOOLS), and `projects` (with JSONB techStack and markdown architectureNotes).
3. Create a seed script (`src/db/seed.ts`) pre-populating:
   - My profile with links to GitHub, Telegram, and Instagram.
   - My core skills: Next.js, React, TypeScript, Node.js, PostgreSQL, Drizzle ORM, Socket.io, Tailwind CSS, Linux/Ubuntu, and Git.
   - A featured project card for "MovieNight" (real-time synchronized video streaming and watch-party web application built with Next.js, TypeScript, PostgreSQL, Drizzle ORM, Socket.io, and Auth.js).
4. Build the public landing page (`src/app/(public)/page.tsx`) with Server Components fetching profile, visible skills grouped by category, and featured projects with an interactive "Architecture Notes" modal.
5. Build a protected `/admin` dashboard guarded by Auth.js where I can add, edit, reorder, and delete skills and projects using Next.js Server Actions and `revalidatePath("/")`.

```

Would you like me to also write the **Project Showcase component with the interactive Architecture Modal** or the **Telegram Bot contact webhook action** so visitors can message your Telegram directly from the portfolio?
