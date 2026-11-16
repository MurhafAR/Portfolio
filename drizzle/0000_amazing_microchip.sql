CREATE TYPE "public"."skill_category" AS ENUM('FRONTEND', 'BACKEND', 'DATABASE', 'DEVOPS_TOOLS');--> statement-breakpoint
CREATE TABLE "profile" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text DEFAULT 'Murhaf Abu Rashed' NOT NULL,
	"headline" text DEFAULT 'Full-Stack Web Developer | Next.js, TypeScript & Node.js' NOT NULL,
	"bio" text NOT NULL,
	"avatar_url" text DEFAULT '/images/profile-hero.jpg' NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"status_message" text DEFAULT 'Available for Full-Stack roles & freelance projects',
	"github_url" text NOT NULL,
	"telegram_url" text NOT NULL,
	"instagram_url" text NOT NULL,
	"resume_url" text DEFAULT '/resume.pdf',
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"short_description" text NOT NULL,
	"architecture_notes" text,
	"thumbnail_url" text NOT NULL,
	"tech_stack" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"github_url" text,
	"live_url" text,
	"is_featured" boolean DEFAULT true NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" "skill_category" DEFAULT 'FRONTEND' NOT NULL,
	"proficiency" integer DEFAULT 90 NOT NULL,
	"icon_name" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
