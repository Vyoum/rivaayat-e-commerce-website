import { NextResponse } from "next/server"

import { requireAdminApi } from "@/lib/admin-auth-server"
import { loadAdminUsers, loadAdminUsersSummary } from "@/lib/users-admin-server"

export async function GET(request: Request) {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  try {
    const { searchParams } = new URL(request.url)
    const summaryOnly = searchParams.get("summary") === "1"

    if (summaryOnly) {
      const summary = await loadAdminUsersSummary()
      return NextResponse.json({ summary })
    }

    const users = await loadAdminUsers()
    const summary = {
      total: users.length,
      recentlyActive: users.filter((user) => user.recentlyActive).length,
      preview: users.slice(0, 4),
    }

    return NextResponse.json({ users, summary })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load users" },
      { status: 500 },
    )
  }
}
