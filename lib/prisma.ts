import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
  pgPool?: Pool
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) return null

  const pool =
    globalForPrisma.pgPool ??
    new Pool({
      connectionString,
    })

  globalForPrisma.pgPool = pool

  return new PrismaClient({
    adapter: new PrismaPg(pool),
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })
}

export function getPrisma() {
  if (!globalForPrisma.prisma) {
    const client = createPrismaClient()
    if (client) {
      globalForPrisma.prisma = client
    }
  }

  return globalForPrisma.prisma ?? null
}
