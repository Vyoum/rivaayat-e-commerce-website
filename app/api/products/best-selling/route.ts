import { NextResponse } from "next/server"

import { getBestSellingProducts } from "@/lib/best-selling-products"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(Number(searchParams.get("limit") ?? 12) || 12, 24)
    const categoryRoute = searchParams.get("category")?.trim() || undefined
    const excludeIds = searchParams.get("excludeIds")?.split(",").filter(Boolean) ?? []
    const excludeSlugs = searchParams.get("excludeSlugs")?.split(",").filter(Boolean) ?? []

    const products = await getBestSellingProducts({
      limit,
      categoryRoute,
      excludeIds,
      excludeSlugs,
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error("[api/products/best-selling]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load best sellers" },
      { status: 500 },
    )
  }
}
