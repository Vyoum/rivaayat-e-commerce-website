import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

const connectionString = process.env.DATABASE_URL!

// Single connection in development (prevents exhausting pool during hot-reload)
const globalForDb = globalThis as unknown as { _pgClient?: ReturnType<typeof postgres> }

const client =
  globalForDb._pgClient ??
  postgres(connectionString, {
    ssl: "require",
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  })

if (process.env.NODE_ENV !== "production") {
  globalForDb._pgClient = client
}

export const db = drizzle(client, { schema })
export type DB = typeof db
