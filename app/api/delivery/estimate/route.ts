import { NextRequest, NextResponse } from "next/server"

import { estimateDeliveryForPinCode } from "@/lib/delhivery-estimate"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const pinCode = request.nextUrl.searchParams.get("pinCode")?.trim() ?? ""
  const weightParam = request.nextUrl.searchParams.get("weightGrams")
  const weightGrams = weightParam ? Number(weightParam) : undefined

  if (!pinCode) {
    return NextResponse.json({ error: "PIN code is required." }, { status: 400 })
  }

  try {
    const estimate = await estimateDeliveryForPinCode(
      pinCode,
      Number.isFinite(weightGrams) ? weightGrams : undefined,
    )

    return NextResponse.json({ estimate })
  } catch (error) {
    console.error("[api/delivery/estimate]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to estimate delivery." },
      { status: 500 },
    )
  }
}
