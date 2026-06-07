import { NextResponse } from "next/server"

import { requireAdminApi } from "@/lib/admin-auth-server"
import { loadDashboardOverview } from "@/lib/dashboard-admin-server"

export async function GET() {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  try {
    const overview = await loadDashboardOverview()
    return NextResponse.json(overview)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load dashboard" },
      { status: 500 },
    )
  }
}
