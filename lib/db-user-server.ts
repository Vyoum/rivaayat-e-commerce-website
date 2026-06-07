import { getPrisma } from "@/lib/prisma"
import { getSupabaseAdmin } from "@/lib/supabase/admin"

export type DbUserRecord = {
  id: string
  email: string
  name: string
  role: "customer" | "admin"
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

async function getDbUserByEmailFromPrisma(email: string): Promise<DbUserRecord | null> {
  const prisma = getPrisma()
  if (!prisma) return null

  try {
    return await prisma.user.findUnique({
      where: { email: normalizeEmail(email) },
      select: { id: true, email: true, name: true, role: true },
    })
  } catch (error) {
    console.error("[db-user] prisma lookup failed:", error)
    return null
  }
}

async function getDbUserByEmailFromSupabase(email: string): Promise<DbUserRecord | null> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return null

  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, email, name, role")
      .eq("email", normalizeEmail(email))
      .maybeSingle()

    if (error) {
      console.error("[db-user] supabase lookup failed:", error.message)
      return null
    }

    if (!data?.role) return null

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role === "admin" ? "admin" : "customer",
    }
  } catch (error) {
    console.error("[db-user] supabase lookup error:", error)
    return null
  }
}

/** Look up public.users by email — Prisma first, Supabase service role as fallback. */
export async function getDbUserByEmail(email: string): Promise<DbUserRecord | null> {
  const fromPrisma = await getDbUserByEmailFromPrisma(email)
  if (fromPrisma) return fromPrisma

  return getDbUserByEmailFromSupabase(email)
}

export async function isDbReachable() {
  if (getPrisma()) return true
  return !!getSupabaseAdmin()
}
