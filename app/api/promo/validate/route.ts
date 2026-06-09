import { NextResponse } from "next/server"

import { validatePromoCode } from "@/lib/discount-code-server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const code = typeof body.code === "string" ? body.code : ""
    const subtotal = Number(body.subtotal)

    const result = await validatePromoCode(code, subtotal)

    if (!result.valid) {
      return NextResponse.json({ valid: false, error: result.error }, { status: 400 })
    }

    return NextResponse.json({ valid: true, promo: result.promo })
  } catch (error) {
    return NextResponse.json(
      { valid: false, error: error instanceof Error ? error.message : "Failed to validate code" },
      { status: 500 },
    )
  }
}
