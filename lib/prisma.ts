import { Prisma, PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const SCHEMA_FINGERPRINT =
  Prisma.dmmf.datamodel.models
    .find((model) => model.name === "Product")
    ?.fields.map((field) => field.name)
    .sort()
    .join(",") ?? ""

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
  pgPool?: Pool
  databaseUrl?: string
  schemaFingerprint?: string
}

function resetPrismaCache() {
  void globalForPrisma.pgPool?.end().catch(() => {})
  globalForPrisma.pgPool = undefined
  globalForPrisma.prisma = undefined
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) return null

  if (
    globalForPrisma.pgPool &&
    globalForPrisma.databaseUrl &&
    globalForPrisma.databaseUrl !== connectionString
  ) {
    resetPrismaCache()
  }

  if (
    globalForPrisma.prisma &&
    globalForPrisma.schemaFingerprint &&
    globalForPrisma.schemaFingerprint !== SCHEMA_FINGERPRINT
  ) {
    resetPrismaCache()
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
  globalForPrisma.schemaFingerprint = SCHEMA_FINGERPRINT

  return new PrismaClient({
    adapter: new PrismaPg(pool),
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })
}

export function getPrisma() {
  const connectionString = process.env.DATABASE_URL

  if (
    globalForPrisma.prisma &&
    globalForPrisma.schemaFingerprint &&
    globalForPrisma.schemaFingerprint !== SCHEMA_FINGERPRINT
  ) {
    resetPrismaCache()
  }

  if (
    globalForPrisma.prisma &&
    globalForPrisma.databaseUrl &&
    connectionString &&
    globalForPrisma.databaseUrl !== connectionString
  ) {
    resetPrismaCache()
  }

  if (!globalForPrisma.prisma) {
    const client = createPrismaClient()
    if (client) {
      globalForPrisma.prisma = client
    }
  }

  return globalForPrisma.prisma ?? null
}
