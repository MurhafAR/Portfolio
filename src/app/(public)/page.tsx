import { getProfile } from "@/actions/profile.actions";
import { getVisibleSkills } from "@/actions/skill.actions";
import { getFeaturedProjects } from "@/actions/project.actions";
import { LanguageProvider } from "@/context/LanguageContext";
import { Navbar } from "@/components/public/Navbar";
import { HeroSection } from "@/components/public/HeroSection";
import { SkillsBento } from "@/components/public/SkillsBento";
import { ProjectShowcase } from "@/components/public/ProjectShowcase";
import { GithubActivity } from "@/components/public/GithubActivity";
import { ContactTelegram } from "@/components/public/ContactTelegram";
import { SocialDock } from "@/components/public/SocialDock";
import { Footer } from "@/components/public/Footer";
import { connection } from "next/server";

export const instant = false;

export default async function HomePage() {
  await connection();
  const [profileData, skills, projects] = await Promise.all([
    getProfile(),
    getVisibleSkills(),
    getFeaturedProjects(),
  ]);

  if (!profileData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        <p>Profile not found. Run the seed script first.</p>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <main className="min-h-screen bg-zinc-950 pb-24 selection:bg-indigo-500/20 selection:text-indigo-300">
        <Navbar fullName={profileData.fullName} />
        <HeroSection profile={profileData} />
        <SkillsBento skills={skills} />
        <ProjectShowcase projects={projects} />
        <GithubActivity githubUrl={profileData.githubUrl} />
        <ContactTelegram telegramUrl={profileData.telegramUrl} />
        <SocialDock profile={profileData} />
        <Footer fullName={profileData.fullName} />
      </main>
    </LanguageProvider>
  );
}
