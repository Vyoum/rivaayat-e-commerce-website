import { getAdminAccess } from "@/lib/admin-auth-server"
import { getDbUserByEmail } from "@/lib/db-user-server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export type AdminProfile = {
  name: string
  email: string
  avatarUrl: string | null
  roleLabel: string
}

function displayNameFromAuth(
  email: string,
  metadata?: Record<string, unknown> | null,
) {
  const fromMeta =
    (metadata?.full_name as string | undefined) ??
    (metadata?.name as string | undefined)

  if (fromMeta?.trim()) return fromMeta.trim()
  return email.split("@")[0]
}

export async function getAdminProfile(): Promise<AdminProfile | null> {
  const access = await getAdminAccess()
  if (!access.authenticated || !access.email) return null

  const [dbUser, supabase] = await Promise.all([
    getDbUserByEmail(access.email),
    createSupabaseServerClient(),
  ])

  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } }

  const email = access.email
  const name =
    dbUser?.name?.trim() ||
    displayNameFromAuth(email, user?.user_metadata) ||
    "Admin"

  const avatarUrl =
    (user?.user_metadata?.avatar_url as string | undefined) ?? null

  return {
    name,
    email,
    avatarUrl,
    roleLabel: dbUser?.role === "admin" ? "Administrator" : "Admin",
  }
}
