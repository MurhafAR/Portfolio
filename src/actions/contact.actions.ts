"use server";

import { z } from "zod";
import { headers } from "next/headers";

const ContactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  contact: z.string().min(1, "Email or handle is required").max(100),
  message: z.string().min(5, "Message must be at least 5 characters").max(2000),
  hp: z.string().optional(), // Honeypot field for bot suppression
});

export type ContactInput = z.infer<typeof ContactSchema>;

// Simple in-memory rate limiting: max 5 inquiries per 5 minutes per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 5 * 60 * 1000; // 5 minutes
  const maxRequests = 5;

  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
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

export async function sendTelegramInquiryAction(input: ContactInput) {
  const parsed = ContactSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  // 1. Bot honeypot check: If honeypot is filled, discard silently
  if (parsed.data.hp && parsed.data.hp.trim().length > 0) {
    return { success: true };
  }

  // 2. IP Rate limiting
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

  // 3. Format message safely with HTML escaping (immune to Telegram Markdown entity crashes)
  const formattedHtml =
    `📬 <b>New Portfolio Inquiry</b>\n\n` +
    `<b>From:</b> ${escapeHtml(name)}\n` +
    `<b>Contact:</b> ${escapeHtml(contact)}\n\n` +
    `<b>Message:</b>\n${escapeHtml(message)}`;

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

  // Fallback when bot token is not configured yet in .env
  console.log("Portfolio contact inquiry received:", { name, contact, message });
  return {
    success: true,
    fallback: true,
  };
}
