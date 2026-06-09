import { NextResponse } from "next/server"

import { requireAdminApi } from "@/lib/admin-auth-server"
import {
  getAllCategoryCardsAdmin,
  updateCategoryCard,
  updateCategorySectionHeading,
} from "@/lib/category-cards"
import type { CategoryCardKey } from "@/lib/category-cards-shared"
import { CATEGORY_CARD_KEYS } from "@/lib/category-cards-shared"

export async function GET() {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  try {
    const { cards, sectionHeading } = await getAllCategoryCardsAdmin()
    return NextResponse.json({ cards, sectionHeading })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load category cards" },
      { status: 500 },
    )
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  try {
    const body = (await request.json()) as {
      id?: CategoryCardKey
      imageUrl?: string
      title?: string
      description?: string
      sectionHeading?: string
    }

    if (body.sectionHeading !== undefined) {
      const sectionHeading = await updateCategorySectionHeading(body.sectionHeading)
      return NextResponse.json({ sectionHeading })
    }

    if (!body.id || !CATEGORY_CARD_KEYS.includes(body.id)) {
      return NextResponse.json({ error: "Valid category id is required" }, { status: 400 })
    }

    const card = await updateCategoryCard(body.id, {
      ...(body.imageUrl !== undefined ? { imageUrl: body.imageUrl } : {}),
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.description !== undefined ? { description: body.description } : {}),
    })

    return NextResponse.json({ card })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update category card" },
      { status: 400 },
    )
  }
}
