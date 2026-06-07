import { NextResponse } from "next/server"

import { loadDashboardOverview } from "@/lib/dashboard-admin-server"

export async function GET() {
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
