import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
  pgPool?: Pool
  databaseUrl?: string
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) return null

  // Dev hot-reload keeps global state — recreate pool when DATABASE_URL changes
  if (
    globalForPrisma.pgPool &&
    globalForPrisma.databaseUrl &&
    globalForPrisma.databaseUrl !== connectionString
  ) {
    void globalForPrisma.pgPool.end().catch(() => {})
    globalForPrisma.pgPool = undefined
    globalForPrisma.prisma = undefined
  }

  const pool =
    globalForPrisma.pgPool ??
    new Pool({
      connectionString,
      ssl: connectionString.includes("supabase")
        ? { rejectUnauthorized: false }
        : undefined,
    })

  globalForPrisma.pgPool = pool
  globalForPrisma.databaseUrl = connectionString

  return new PrismaClient({
    adapter: new PrismaPg(pool),
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })
}

export function getPrisma() {
  const connectionString = process.env.DATABASE_URL

  if (
    globalForPrisma.prisma &&
    globalForPrisma.databaseUrl &&
    connectionString &&
    globalForPrisma.databaseUrl !== connectionString
  ) {
    void globalForPrisma.pgPool?.end().catch(() => {})
    globalForPrisma.pgPool = undefined
    globalForPrisma.prisma = undefined
  }

  if (!globalForPrisma.prisma) {
    const client = createPrismaClient()
    if (client) {
      globalForPrisma.prisma = client
    }
  }

  return globalForPrisma.prisma ?? null
}
