import { NextResponse } from "next/server"

import { requireAdminApi } from "@/lib/admin-auth-server"
import {
  createAdminDiscountCode,
  loadAdminDiscountCodes,
} from "@/lib/discount-code-server"
import type { CreateDiscountCodeInput } from "@/types/discount-code"

export async function GET() {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  try {
    const codes = await loadAdminDiscountCodes()
    return NextResponse.json({ codes })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load discount codes" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  try {
    const body = (await request.json()) as CreateDiscountCodeInput
    const code = await createAdminDiscountCode(body)
    return NextResponse.json({ code })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create discount code" },
      { status: 400 },
    )
  }
}
