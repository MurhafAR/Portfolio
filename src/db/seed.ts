import { db } from "./index";
import { profile, skills } from "./schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // 1. Seed Profile (replaces existing profile idempotently)
  await db.delete(profile);
  await db.insert(profile).values({
    fullName: "Murhaf Abu Rashed",
    headline: "Full-Stack Web Developer | Next.js, TypeScript & Node.js",
    bio: "I build modern, high-performance web applications with a focus on clean architecture and exceptional user experiences. Passionate about real-time systems, TypeScript, and the React ecosystem.",
    avatarUrl: "/images/profile-hero.jpg",
    isAvailable: true,
    statusMessage:
      "Available for Full-Stack roles & freelance — Currently building with Next.js & WebSockets",
    githubUrl: "https://github.com/murhaf",
    telegramUrl: "https://t.me/murhaf",
    instagramUrl: "https://instagram.com/murhaf",
    resumeUrl: "/resume.pdf",
  });
  console.log("✅ Profile seeded");

  // 2. Seed Skills (replaces skills idempotently)
  await db.delete(skills);
  const skillsData = [
    // Frontend
    { name: "Next.js", category: "FRONTEND" as const, proficiency: 95, displayOrder: 1 },
    { name: "React", category: "FRONTEND" as const, proficiency: 95, displayOrder: 2 },
    { name: "TypeScript", category: "FRONTEND" as const, proficiency: 90, displayOrder: 3 },
    { name: "Tailwind CSS", category: "FRONTEND" as const, proficiency: 90, displayOrder: 4 },
    // Backend
    { name: "Node.js", category: "BACKEND" as const, proficiency: 90, displayOrder: 1 },
    { name: "Socket.io", category: "BACKEND" as const, proficiency: 85, displayOrder: 2 },
    // Database
    { name: "PostgreSQL", category: "DATABASE" as const, proficiency: 85, displayOrder: 1 },
    { name: "Drizzle ORM", category: "DATABASE" as const, proficiency: 85, displayOrder: 2 },
    // DevOps & Tools
    { name: "Git", category: "DEVOPS_TOOLS" as const, proficiency: 90, displayOrder: 1 },
    { name: "Linux/Ubuntu", category: "DEVOPS_TOOLS" as const, proficiency: 85, displayOrder: 2 },
  ];

  await db.insert(skills).values(skillsData);
  console.log("✅ Skills seeded");

  console.log("ℹ️  Projects are dynamic — add and manage them via the /admin/projects dashboard.");
  console.log("🎉 Seeding complete!");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
