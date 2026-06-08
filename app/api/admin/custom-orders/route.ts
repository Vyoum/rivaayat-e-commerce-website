import { NextResponse } from "next/server"

import { requireAdminApi } from "@/lib/admin-auth-server"
import { loadCustomOrderKanbanBoard } from "@/lib/custom-order-admin-server"

export async function GET() {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  try {
    const board = await loadCustomOrderKanbanBoard()
    return NextResponse.json(board)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load custom orders" },
      { status: 500 },
    )
  }
}
