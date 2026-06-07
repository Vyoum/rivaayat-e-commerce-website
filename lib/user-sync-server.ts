import type { User as AuthUser } from "@supabase/supabase-js"

import { getPrisma } from "@/lib/prisma"

function authDisplayName(authUser: AuthUser) {
  return (
    (authUser.user_metadata?.full_name as string | undefined) ??
    (authUser.user_metadata?.name as string | undefined) ??
    authUser.email?.split("@")[0] ??
    "Guest"
  )
}

/** Create or update public.users from a Supabase auth session. Never changes role on update. */
export async function ensureDbUserForAuthUser(authUser: AuthUser) {
  const prisma = getPrisma()
  if (!prisma || !authUser.email) return null

  const email = authUser.email.toLowerCase()
  const name = authDisplayName(authUser)
  const avatarUrl = (authUser.user_metadata?.avatar_url as string | undefined) ?? null

  try {
    return await prisma.user.upsert({
      where: { email },
      update: {
        name,
        ...(avatarUrl ? { avatarUrl } : {}),
        ...(authUser.phone ? { phone: authUser.phone } : {}),
      },
      create: {
        email,
        name,
        avatarUrl,
        phone: authUser.phone ?? null,
        role: "customer",
      },
      select: { id: true, email: true, name: true, role: true },
    })
  } catch (error) {
    console.error("[user-sync] failed to upsert public.users row:", error)
    return null
  }
}
