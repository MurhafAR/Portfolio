"use server";

import { z } from "zod";
import { headers } from "next/headers";

const ContactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  contact: z.string().min(1, "Email or handle is required").max(100),
  message: z.string().min(5, "Message must be at least 5 characters").max(2000),
  hp: z.string().optional(),
});

export type ContactInput = z.infer<typeof ContactSchema>;

// In-memory rate limiting: 5 messages per 5 minutes per client IP
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 5 * 60 * 1000;
  const maxRequests = 5;

  const record = rateLimits.get(ip);
  if (!record || now > record.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (record.count >= maxRequests) {
    return true;
  }

  record.count += 1;
  return false;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendTelegramInquiry(input: ContactInput) {
  const parsed = ContactSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  // Silent discard if spam bot triggered the honeypot
  if (parsed.data.hp?.trim()) {
    return { success: true };
  }

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "127.0.0.1";

  if (isRateLimited(ip)) {
    return {
      success: false,
      error: "Too many messages sent. Please wait a few minutes before trying again.",
    };
  }

  const { name, contact, message } = parsed.data;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const formattedHtml = [
    "📬 <b>New Portfolio Inquiry</b>",
    "",
    `<b>From:</b> ${escapeHtml(name)}`,
    `<b>Contact:</b> ${escapeHtml(contact)}`,
    "",
    "<b>Message:</b>",
    escapeHtml(message),
  ].join("\n");

  if (botToken && chatId) {
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: formattedHtml,
            parse_mode: "HTML",
          }),
        }
      );

      if (!res.ok) {
        console.error("Telegram API error:", await res.text());
        return {
          success: false,
          error:
            "Failed to deliver message via Telegram bot. Please try reaching out directly on Telegram.",
        };
      }

      return { success: true };
    } catch (err) {
      console.error("Telegram webhook error:", err);
      return {
        success: false,
        error: "Network error sending to Telegram. Please message directly.",
      };
    }
  }

  // Local fallback if bot credentials are not set up in development
  console.log("Portfolio inquiry received (dev mode):", { name, contact, message });
  return {
    success: true,
    fallback: true,
  };
}

export const sendTelegramInquiryAction = sendTelegramInquiry;
