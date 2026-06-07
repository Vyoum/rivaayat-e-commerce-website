import { redirect } from "next/navigation"

import type { Metadata } from "next"
import { HOUSE_OF_INDIKA } from "@/lib/brand"
import { getAdminAccess } from "@/lib/admin-auth-server"
import { getAdminProfile } from "@/lib/admin-profile-server"
import { AdminSessionProvider } from "@/components/admin/admin-session-provider"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: `Admin Console — ${HOUSE_OF_INDIKA}`,
  description: `${HOUSE_OF_INDIKA} admin dashboard`,
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let access
  try {
    access = await getAdminAccess()
  } catch (error) {
    console.error("[admin layout] access check failed:", error)
    redirect("/login?next=/admin&error=admin_unavailable")
  }

  if (!access.authenticated) {
    redirect("/login?next=/admin")
  }

  if (!access.dbReachable) {
    redirect("/login?next=/admin&error=database_unavailable")
  }

  if (!access.dbUserFound) {
    redirect("/login?next=/admin&error=profile_sync_failed")
  }

  if (!access.isAdmin) {
    redirect("/login?next=/admin&error=admin_required")
  }

  const profile = (await getAdminProfile()) ?? {
    name: access.email?.split("@")[0] ?? "Admin",
    email: access.email ?? "",
    avatarUrl: null,
    roleLabel: "Administrator",
  }

  return (
    <div className="min-h-screen bg-[#FDF8F1] [font-family:var(--font-sans)]">
      <AdminSessionProvider profile={profile}>{children}</AdminSessionProvider>
    </div>
  )
}
