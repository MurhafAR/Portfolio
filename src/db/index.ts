import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Prioritize IPv4 for environments with broken dual-stack IPv6 routing (e.g. WSL/local Docker)
if (typeof process !== "undefined" && process.env) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const dns = require("node:dns");
    dns?.setDefaultResultOrder?.("ipv4first");

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { setGlobalDispatcher, Agent } = require("undici");
    setGlobalDispatcher(new Agent({ connect: { family: 4 } }));
  } catch {
    // Browser or edge runtime fallback
  }
}

const connectionString =
  process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL!;

const sql = neon(connectionString);

export const db = drizzle(sql, { schema });
