import { NextResponse } from "next/server"

import { requireAdminApi } from "@/lib/admin-auth-server"
import {
  getCustomOrderCategorySettings,
  updateCustomOrderCategorySetting,
} from "@/lib/custom-order-categories"
import { CUSTOM_ORDER_CATEGORY_IDS } from "@/lib/custom-order-categories-shared"
import type { CustomOrderCategoryId } from "@/lib/custom-orders-config"

export async function GET() {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  try {
    const categories = await getCustomOrderCategorySettings()
    return NextResponse.json({ categories })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load custom order categories" },
      { status: 500 },
    )
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  try {
    const body = (await request.json()) as {
      id?: CustomOrderCategoryId
      label?: string
      startingPrice?: number | null
      formTitle?: string
      fields?: Array<{
        id: string
        label: string
        options: Array<{ label: string; price: number | null }>
      }>
      weightOptions?: Array<{ label: string; price: number | null }>
    }

    if (!body.id || !CUSTOM_ORDER_CATEGORY_IDS.includes(body.id)) {
      return NextResponse.json({ error: "Valid category id is required" }, { status: 400 })
    }

    const category = await updateCustomOrderCategorySetting(body.id, {
      ...(body.label !== undefined ? { label: body.label } : {}),
      ...(body.startingPrice !== undefined ? { startingPrice: body.startingPrice } : {}),
      ...(body.formTitle !== undefined ? { formTitle: body.formTitle } : {}),
      ...(body.fields !== undefined ? { fields: body.fields } : {}),
      ...(body.weightOptions !== undefined ? { weightOptions: body.weightOptions } : {}),
    })

    return NextResponse.json({ category })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update custom order category" },
      { status: 400 },
    )
  }
}
