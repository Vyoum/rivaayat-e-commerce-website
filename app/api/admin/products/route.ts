import { NextResponse } from "next/server"

import {
  createAdminProduct,
  getAdminProductCounts,
  loadAdminProducts,
} from "@/lib/product-admin-server"
import type { AdminProductTab, CreateProductInput } from "@/types/product"
import type { Category } from "@prisma/client"

const VALID_TABS: AdminProductTab[] = ["All", "jewellery", "clothing", "decor", "custom_food", "Draft"]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tabParam = searchParams.get("tab") ?? "All"
    const query = searchParams.get("q") ?? undefined

    const tab = VALID_TABS.includes(tabParam as AdminProductTab)
      ? (tabParam as AdminProductTab)
      : "All"

    const [products, counts] = await Promise.all([
      loadAdminProducts({ tab, query }),
      getAdminProductCounts(),
    ])

    return NextResponse.json({ products, counts, tab })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load products" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateProductInput

    if (!body.name?.trim()) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 })
    }

    if (!body.category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 })
    }

    if (typeof body.price !== "number" || body.price <= 0) {
      return NextResponse.json({ error: "Valid price is required" }, { status: 400 })
    }

    if (!Array.isArray(body.imageUrls) || body.imageUrls.length === 0) {
      return NextResponse.json({ error: "At least one image is required" }, { status: 400 })
    }

    const product = await createAdminProduct({
      ...body,
      category: body.category as Category,
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create product" },
      { status: 500 },
    )
  }
}
