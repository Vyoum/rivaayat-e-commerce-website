import { getPrisma } from "@/lib/prisma"
import { getInitials } from "@/lib/profile-utils"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import type { AdminUserRecord, AdminUsersSummary } from "@/types/admin-user"

const RECENTLY_ACTIVE_MS = 24 * 60 * 60 * 1000

function parseProvider(metadata: Record<string, unknown> | undefined, appMetadata: Record<string, unknown> | undefined) {
  const provider =
    (appMetadata?.provider as string | undefined) ??
    (Array.isArray(appMetadata?.providers) ? (appMetadata.providers as string[])[0] : undefined) ??
    (metadata?.provider as string | undefined)

  if (!provider) return "email"
  return provider === "google" ? "Google" : provider.charAt(0).toUpperCase() + provider.slice(1)
}

function isRecentlyActive(lastSignInAt: string | null) {
  if (!lastSignInAt) return false
  return Date.now() - new Date(lastSignInAt).getTime() <= RECENTLY_ACTIVE_MS
}

export async function loadAdminUsers(): Promise<AdminUserRecord[]> {
  const supabase = getSupabaseAdmin()
  const prisma = getPrisma()

  const dbUsers = prisma
    ? await prisma.user
        .findMany({
          include: {
            _count: { select: { orders: true } },
          },
          orderBy: { createdAt: "desc" },
        })
        .catch((err) => {
          console.error("[admin users] prisma error:", err)
          return []
        })
    : []

  const dbByEmail = new Map(dbUsers.map((user) => [user.email.toLowerCase(), user]))
  const merged = new Map<string, AdminUserRecord>()

  for (const dbUser of dbUsers) {
    merged.set(dbUser.email.toLowerCase(), {
      id: dbUser.id,
      authUserId: null,
      name: dbUser.name,
      email: dbUser.email,
      phone: dbUser.phone,
      avatarUrl: dbUser.avatarUrl,
      patronSince: dbUser.patronSince.toISOString(),
      lastSignInAt: null,
      createdAt: dbUser.createdAt.toISOString(),
      orderCount: dbUser._count.orders,
      provider: null,
      recentlyActive: false,
    })
  }

  if (supabase) {
    let page = 1
    const perPage = 100

    while (true) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage })
      if (error) {
        console.error("[admin users] auth list error:", error.message)
        break
      }

      for (const authUser of data.users) {
        const email = authUser.email?.toLowerCase()
        if (!email) continue

        const dbUser = dbByEmail.get(email)
        const name =
          (authUser.user_metadata?.full_name as string | undefined) ??
          (authUser.user_metadata?.name as string | undefined) ??
          dbUser?.name ??
          email.split("@")[0]

        const lastSignInAt = authUser.last_sign_in_at ?? null

        merged.set(email, {
          id: dbUser?.id ?? authUser.id,
          authUserId: authUser.id,
          name,
          email: authUser.email ?? email,
          phone: authUser.phone ?? dbUser?.phone ?? null,
          avatarUrl:
            (authUser.user_metadata?.avatar_url as string | undefined) ??
            dbUser?.avatarUrl ??
            null,
          patronSince: (dbUser?.patronSince ?? new Date(authUser.created_at)).toISOString(),
          lastSignInAt,
          createdAt: authUser.created_at,
          orderCount: dbUser?._count.orders ?? 0,
          provider: parseProvider(authUser.user_metadata, authUser.app_metadata),
          recentlyActive: isRecentlyActive(lastSignInAt),
        })
      }

      if (data.users.length < perPage) break
      page += 1
    }
  }

  return [...merged.values()].sort((a, b) => {
    const aTime = a.lastSignInAt ? new Date(a.lastSignInAt).getTime() : 0
    const bTime = b.lastSignInAt ? new Date(b.lastSignInAt).getTime() : 0
    if (bTime !== aTime) return bTime - aTime
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

export async function loadAdminUsersSummary(): Promise<AdminUsersSummary> {
  const users = await loadAdminUsers()
  return {
    total: users.length,
    recentlyActive: users.filter((user) => user.recentlyActive).length,
    preview: users.slice(0, 4),
  }
}
