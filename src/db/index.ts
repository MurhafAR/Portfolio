import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (typeof process !== "undefined" && process.env) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const dns = require("node:dns");
    if (dns?.setDefaultResultOrder) {
      dns.setDefaultResultOrder("ipv4first");
    }
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { setGlobalDispatcher, Agent } = require("undici");
    setGlobalDispatcher(new Agent({ connect: { family: 4 } }));
  } catch {
    // browser or edge runtime
  }
}

const connectionString =
  process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL!;

const sql = neon(connectionString);

export const db = drizzle(sql, { schema });
