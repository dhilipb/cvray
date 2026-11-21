// One-off copy of all rows from the old SQLite DB into Postgres.
// Usage: SQLITE_URL=file:./dev.db DATABASE_URL=postgresql://... node scripts/migrate-sqlite-to-pg.mjs
// Run `pnpm exec prisma db push` against Postgres first. Safe to re-run: existing ids are skipped.
import "dotenv/config";
import { createClient } from "@libsql/client";
import pg from "pg";

// Parents before children so foreign keys resolve.
const TABLES = ["User", "Account", "Session", "VerificationToken", "UserProfile", "JobApplication"];

const sqlite = createClient({ url: process.env.SQLITE_URL || "file:./dev.db" });
const pgClient = new pg.Client({ connectionString: process.env.DATABASE_URL });
await pgClient.connect();

// Prisma on SQLite stores DateTime as ISO text or epoch ms; Postgres needs real timestamps.
const toDate = (v) =>
  v == null ? v : new Date(typeof v === "string" && /^\d+$/.test(v) ? Number(v) : v);

try {
  await pgClient.query("BEGIN");
  for (const table of TABLES) {
    const { rows: pgCols } = await pgClient.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1",
      [table],
    );
    const types = Object.fromEntries(pgCols.map((c) => [c.column_name, c.data_type]));
    const { rows } = await sqlite.execute(`SELECT * FROM "${table}"`);
    let copied = 0;
    for (const row of rows) {
      const cols = Object.keys(row).filter((c) => c in types);
      const values = cols.map((c) => (types[c].startsWith("timestamp") ? toDate(row[c]) : row[c]));
      if (values.some((v) => v instanceof Date && isNaN(v)))
        throw new Error(`Bad date in ${table} row ${row.id}`);
      const sql = `INSERT INTO "${table}" (${cols.map((c) => `"${c}"`).join(", ")}) VALUES (${cols
        .map((_, i) => `$${i + 1}`)
        .join(", ")}) ON CONFLICT DO NOTHING`;
      copied += (await pgClient.query(sql, values)).rowCount;
    }
    console.log(`${table}: ${copied}/${rows.length} rows copied`);
  }
  await pgClient.query("COMMIT");
} catch (e) {
  await pgClient.query("ROLLBACK");
  throw e;
} finally {
  await pgClient.end();
  sqlite.close();
}
