"use client";

import { useState, useTransition } from "react";
import { Send, CheckCircle2, AlertCircle, MessageSquare } from "lucide-react";
import { sendTelegramInquiryAction } from "@/actions/contact.actions";
import { useLanguage } from "@/context/LanguageContext";

export function ContactTelegram({ telegramUrl }: { telegramUrl: string }) {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setFeedback("");

    startTransition(async () => {
      const result = await sendTelegramInquiryAction({ name, contact, message, hp });
      if (result.success) {
        setStatus("success");
        setFeedback(
          result.fallback
            ? t("msgSuccessFallback")
            : t("msgSuccessBot")
        );
        setName("");
        setContact("");
        setMessage("");
        setHp("");
      } else {
        setStatus("error");
        setFeedback(result.error || "Failed to send message. Please contact via Telegram directly.");
      }
    });
  };

  return (
    <section id="contact" className="mx-auto max-w-4xl px-6 py-20">
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/80 to-zinc-950 p-8 md:p-12 shadow-2xl backdrop-blur-xl">
        {/* Glow */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Left: Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-400">
              <MessageSquare className="h-3.5 w-3.5" />
              {t("directCommBadge")}
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-100 sm:text-4xl">
              {t("letsTalkTitle")}
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              {t("contactDesc")}
            </p>

            <div className="pt-4">
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-sky-500/40 bg-sky-500/10 px-4 py-2.5 text-xs font-semibold text-sky-400 transition hover:bg-sky-500/20"
              >
                <Send className="h-3.5 w-3.5" />
                {t("msgTelegramDirect")}
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <div className="md:col-span-7">
            {status === "success" ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center space-y-3">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400" />
                <h3 className="text-base font-semibold text-zinc-200">{t("msgDelivered")}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{feedback}</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-2 text-xs text-emerald-400 underline hover:text-emerald-300"
                >
                  {t("sendAnother")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field for bot suppression */}
                <input
                  type="text"
                  name="user_website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                  className="hidden"
                  aria-hidden="true"
                />

                {status === "error" && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{feedback}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    {t("yourName")}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("namePlaceholder")}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    {t("yourContact")}
                  </label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder={t("contactPlaceholder")}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    {t("messageLabel")}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t("messagePlaceholder")}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none resize-none transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-90 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  {isPending ? t("btnDelivering") : t("btnSendTelegram")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
