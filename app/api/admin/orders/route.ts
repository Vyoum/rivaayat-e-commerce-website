import { NextResponse } from "next/server"

import { ADMIN_ORDER_TABS, type AdminOrderTab } from "@/lib/order-admin-constants"
import { getAdminOrderStatusCounts, loadAdminOrders } from "@/lib/order-admin-server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tabParam = searchParams.get("tab") ?? "All"
    const query = searchParams.get("q") ?? undefined

    const tab = ADMIN_ORDER_TABS.includes(tabParam as AdminOrderTab)
      ? (tabParam as AdminOrderTab)
      : "All"

    const [orders, counts] = await Promise.all([
      loadAdminOrders({ tab, query }),
      getAdminOrderStatusCounts(),
    ])

    return NextResponse.json({ orders, counts, tab })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load orders" },
      { status: 500 },
    )
  }
}
