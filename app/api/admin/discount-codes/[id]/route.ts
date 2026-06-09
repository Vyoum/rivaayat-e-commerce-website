import { NextResponse } from "next/server"

import { requireAdminApi } from "@/lib/admin-auth-server"
import {
  deleteAdminDiscountCode,
  updateAdminDiscountCode,
} from "@/lib/discount-code-server"
import type { UpdateDiscountCodeInput } from "@/types/discount-code"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  try {
    const { id } = await params
    const body = (await request.json()) as UpdateDiscountCodeInput
    const code = await updateAdminDiscountCode(id, body)

    if (!code) {
      return NextResponse.json({ error: "Discount code not found" }, { status: 404 })
    }

    return NextResponse.json({ code })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update discount code" },
      { status: 400 },
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  try {
    const { id } = await params
    const deleted = await deleteAdminDiscountCode(id)

    if (!deleted) {
      return NextResponse.json({ error: "Discount code not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete discount code" },
      { status: 500 },
    )
  }
}
