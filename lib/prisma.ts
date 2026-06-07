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
  const pool = globalForPrisma.pgPool
  globalForPrisma.prisma = undefined
  globalForPrisma.pgPool = undefined
  globalForPrisma.databaseUrl = undefined
  globalForPrisma.schemaFingerprint = undefined
  void pool?.end().catch(() => {})
}

function normalizeDatabaseUrl(connectionString: string) {
  try {
    const url = new URL(connectionString)
    if (url.hostname.includes("pooler.supabase.com") && !url.searchParams.has("pgbouncer")) {
      url.searchParams.set("pgbouncer", "true")
    }
    if (!url.searchParams.has("sslmode")) {
      url.searchParams.set("sslmode", "require")
    }
    return url.toString()
  } catch {
    return connectionString
  }
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) return null

  const normalizedUrl = normalizeDatabaseUrl(connectionString)

  if (
    globalForPrisma.pgPool &&
    globalForPrisma.databaseUrl &&
    globalForPrisma.databaseUrl !== normalizedUrl
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
      connectionString: normalizedUrl,
      ssl: normalizedUrl.includes("supabase")
        ? { rejectUnauthorized: false }
        : undefined,
      max: 1,
      idleTimeoutMillis: 0,
      connectionTimeoutMillis: 15000,
      allowExitOnIdle: true,
    })

  globalForPrisma.pgPool = pool
  globalForPrisma.databaseUrl = normalizedUrl
  globalForPrisma.schemaFingerprint = SCHEMA_FINGERPRINT

  return new PrismaClient({
    adapter: new PrismaPg(pool),
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })
}

export function getPrisma() {
  const connectionString = process.env.DATABASE_URL
  const normalizedUrl = connectionString ? normalizeDatabaseUrl(connectionString) : null

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
    normalizedUrl &&
    globalForPrisma.databaseUrl !== normalizedUrl
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
