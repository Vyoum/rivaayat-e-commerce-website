import { NextResponse } from "next/server"

import {
  deleteAdminProduct,
  getAdminProductById,
  updateAdminProduct,
} from "@/lib/product-admin-server"
import type { UpdateProductInput } from "@/types/product"
import type { Category } from "@prisma/client"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const product = await getAdminProductById(id)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load product" },
      { status: 500 },
    )
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const body = (await request.json()) as UpdateProductInput

    const product = await updateAdminProduct(id, {
      ...body,
      ...(body.category ? { category: body.category as Category } : {}),
    })

    return NextResponse.json({ product })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update product"
    const status = message === "Product not found" ? 404 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    await deleteAdminProduct(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete product" },
      { status: 500 },
    )
  }
}
