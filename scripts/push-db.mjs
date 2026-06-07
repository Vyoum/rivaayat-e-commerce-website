import { readFileSync } from "fs"
import path from "path"
import { fileURLToPath } from "url"
import pg from "pg"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://postgres.gduvyvsvymujcbmwxree:BqRLXccL5mb9R%29v@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres"

const pool = new pg.Pool({
  connectionString: connectionString.replace(":6543/", ":5432/").replace("?pgbouncer=true", ""),
  ssl: { rejectUnauthorized: false },
})

const sqlPath = path.join(__dirname, "../prisma/push-products-schema.sql")
const sql = readFileSync(sqlPath, "utf8")

try {
  await pool.query(sql)
  console.log("Database schema pushed successfully.")
} catch (error) {
  console.error("Push failed:", error.message)
  process.exit(1)
} finally {
  await pool.end()
}
