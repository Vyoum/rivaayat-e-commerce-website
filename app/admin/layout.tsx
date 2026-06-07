import { redirect } from "next/navigation"

import type { Metadata } from "next"
import { HOUSE_OF_INDIKA } from "@/lib/brand"
import { getAdminAccess } from "@/lib/admin-auth-server"

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

  if (!access.isAdmin) {
    redirect("/login?next=/admin&error=admin_required")
  }

  return (
    <div className="min-h-screen bg-[#FDF8F1] [font-family:var(--font-sans)]">
      {children}
    </div>
  )
}
