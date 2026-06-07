import { NextResponse } from "next/server"
import type { UserRole } from "@prisma/client"

import { getPrisma } from "@/lib/prisma"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { ensureDbUserForAuthUser } from "@/lib/user-sync-server"

export type AdminAccess = {
  authenticated: boolean
  isAdmin: boolean
  email: string | null
  userId: string | null
  dbUserId: string | null
}

export async function getDbUserByEmail(email: string) {
  const prisma = getPrisma()
  if (!prisma) return null

  try {
    return await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, email: true, name: true, role: true },
    })
  } catch (error) {
    console.error("[auth] failed to load user by email:", error)
    return null
  }
}

export async function isEmailAdmin(email: string) {
  const dbUser = await getDbUserByEmail(email)
  return dbUser?.role === "admin"
}

export async function getAdminAccess(): Promise<AdminAccess> {
  const unauthenticated: AdminAccess = {
    authenticated: false,
    isAdmin: false,
    email: null,
    userId: null,
    dbUserId: null,
  }

  try {
    const supabase = await createSupabaseServerClient()
    if (!supabase) return unauthenticated

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user?.email) return unauthenticated

    const dbUser = (await ensureDbUserForAuthUser(user)) ?? (await getDbUserByEmail(user.email))

    return {
      authenticated: true,
      isAdmin: dbUser?.role === "admin",
      email: user.email,
      userId: user.id,
      dbUserId: dbUser?.id ?? null,
    }
  } catch (error) {
    console.error("[admin] access check failed:", error)
    return unauthenticated
  }
}

export async function requireAdminApi() {
  const access = await getAdminAccess()

  if (!access.authenticated) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Sign in required" }, { status: 401 }),
    }
  }

  if (!access.isAdmin) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Admin access required" }, { status: 403 }),
    }
  }

  return { ok: true as const, access }
}

export async function setUserRoleByEmail(email: string, role: UserRole) {
  const prisma = getPrisma()
  if (!prisma) throw new Error("Database unavailable")

  const normalizedEmail = email.trim().toLowerCase()
  if (!normalizedEmail) throw new Error("Email is required")

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })

  if (existing) {
    return prisma.user.update({
      where: { id: existing.id },
      data: { role },
      select: { id: true, email: true, role: true },
    })
  }

  return prisma.user.create({
    data: {
      email: normalizedEmail,
      name: normalizedEmail.split("@")[0],
      role,
    },
    select: { id: true, email: true, role: true },
  })
}

export { ensureDbUserForAuthUser } from "@/lib/user-sync-server"
