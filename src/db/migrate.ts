import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

if (typeof process !== "undefined" && process.env) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { setGlobalDispatcher, Agent } = require("undici");
    setGlobalDispatcher(new Agent({ connect: { family: 4 } }));
  } catch {
    // ignore
  }
}

async function runMigrations() {
  const connectionString =
    process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!;
  const sql = neon(connectionString);
  const db = drizzle(sql);

  console.log("🚀 Running Drizzle migrations on Neon...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✅ Migrations completed successfully!");
}

runMigrations().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
