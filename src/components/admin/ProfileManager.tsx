"use client";

import { useState, useTransition } from "react";
import { updateProfileAction } from "@/actions/profile.actions";
import type { Profile } from "@/db/schema";
import { Check, User, Link as LinkIcon, Radio } from "lucide-react";

export function ProfileManager({ profile }: { profile: Profile }) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState(profile.fullName);
  const [headline, setHeadline] = useState(profile.headline);
  const [bio, setBio] = useState(profile.bio);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [isAvailable, setIsAvailable] = useState(profile.isAvailable);
  const [statusMessage, setStatusMessage] = useState(profile.statusMessage ?? "");
  const [githubUrl, setGithubUrl] = useState(profile.githubUrl);
  const [telegramUrl, setTelegramUrl] = useState(profile.telegramUrl);
  const [instagramUrl, setInstagramUrl] = useState(profile.instagramUrl);
  const [resumeUrl, setResumeUrl] = useState(profile.resumeUrl ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback("");
    setError("");

    startTransition(async () => {
      const res = await updateProfileAction({
        fullName,
        headline,
        bio,
        avatarUrl,
        isAvailable,
        statusMessage: statusMessage || undefined,
        githubUrl,
        telegramUrl,
        instagramUrl,
        resumeUrl: resumeUrl || undefined,
      });

      if (!res.success) {
        setError(res.error);
      } else {
        setFeedback("Profile updated successfully!");
        setTimeout(() => setFeedback(""), 4000);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {feedback && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          <Check className="h-4 w-4" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Radio className="h-5 w-5 text-indigo-400" />
            <div>
              <h3 className="text-base font-semibold text-zinc-100">
                Live Availability Badge
              </h3>
              <p className="text-xs text-zinc-400">
                Displayed next to your portrait on the Hero section
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            <span className="ml-3 text-xs font-medium text-zinc-300">
              {isAvailable ? "🟢 Available" : "🔴 Not Available"}
            </span>
          </label>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">
            Status Pill Message
          </label>
          <input
            type="text"
            value={statusMessage}
            onChange={(e) => setStatusMessage(e.target.value)}
            placeholder="Available for Full-Stack roles & freelance projects"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <div className="flex items-center gap-2.5 mb-2">
          <User className="h-5 w-5 text-indigo-400" />
          <h3 className="text-base font-semibold text-zinc-100">
            Personal Information
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Avatar Image URL
            </label>
            <input
              type="text"
              required
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">
            Headline
          </label>
          <input
            type="text"
            required
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">
            Bio
          </label>
          <textarea
            required
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none resize-none"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <div className="flex items-center gap-2.5 mb-2">
          <LinkIcon className="h-5 w-5 text-indigo-400" />
          <h3 className="text-base font-semibold text-zinc-100">
            Social Links & Documents
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              GitHub URL
            </label>
            <input
              type="url"
              required
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Telegram URL
            </label>
            <input
              type="url"
              required
              value={telegramUrl}
              onChange={(e) => setTelegramUrl(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Instagram URL
            </label>
            <input
              type="url"
              required
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Resume URL / Path
            </label>
            <input
              type="text"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="/resume.pdf"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500 disabled:opacity-50"
      >
        <Check className="h-4 w-4" />
        {isPending ? "Saving changes..." : "Save Profile Changes"}
      </button>
    </form>
  );
}
