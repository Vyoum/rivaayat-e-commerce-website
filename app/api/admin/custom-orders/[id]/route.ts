import type { OrderStatus } from "@prisma/client"
import { NextResponse } from "next/server"

import { requireAdminApi } from "@/lib/admin-auth-server"
import { updateAdminCustomOrder } from "@/lib/custom-order-admin-server"

const validStatuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  try {
    const { id } = await params
    const body = await request.json()

    const status = body.status as OrderStatus | undefined
    const artisanId =
      body.artisanId === null || typeof body.artisanId === "string" ? body.artisanId : undefined

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    if (!status && artisanId === undefined) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 })
    }

    const order = await updateAdminCustomOrder(id, { status, artisanId })

    if (!order) {
      return NextResponse.json({ error: "Custom order not found" }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update custom order" },
      { status: 500 },
    )
  }
}
