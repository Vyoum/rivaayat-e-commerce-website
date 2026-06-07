import { readFileSync, readdirSync } from "fs"
import path from "path"
import { fileURLToPath } from "url"
import pg from "pg"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const prismaDir = path.join(__dirname, "../prisma")

const connectionString = (
  process.env.DATABASE_URL ??
  "postgresql://postgres.gduvyvsvymujcbmwxree:BqRLXccL5mb9R%29v@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres"
)
  .replace(":6543/", ":5432/")
  .replace("?pgbouncer=true", "")

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
})

const sqlFiles = readdirSync(prismaDir)
  .filter((file) => file.startsWith("push-") && file.endsWith("-schema.sql"))
  .sort()

if (sqlFiles.length === 0) {
  console.error("No prisma/push-*-schema.sql files found.")
  process.exit(1)
}

try {
  for (const file of sqlFiles) {
    const sql = readFileSync(path.join(prismaDir, file), "utf8")
    console.log(`Running ${file}...`)
    await pool.query(sql)
  }
  console.log("Database schema pushed successfully.")
} catch (error) {
  console.error("Push failed:", error.message)
  process.exit(1)
} finally {
  await pool.end()
}
