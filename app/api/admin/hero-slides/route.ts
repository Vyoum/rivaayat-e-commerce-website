import { NextResponse } from "next/server"

import { requireAdminApi } from "@/lib/admin-auth-server"
import {
  createHeroSlide,
  getAllHeroSlides,
  MAX_HERO_SLIDES,
  reorderHeroSlides,
} from "@/lib/hero-slides"

export async function GET() {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  try {
    const slides = await getAllHeroSlides()
    return NextResponse.json({ slides, max: MAX_HERO_SLIDES })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load slides" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  try {
    const body = await request.json()

    if (body.action === "reorder" && Array.isArray(body.orderedIds)) {
      const slides = await reorderHeroSlides(body.orderedIds)
      return NextResponse.json({ slides })
    }

    const { imageUrl, alt, mediaType } = body
    if (!imageUrl || typeof imageUrl !== "string") {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 })
    }

    const slide = await createHeroSlide({
      imageUrl,
      alt: alt ?? "",
      mediaType: mediaType === "video" ? "video" : "image",
    })
    return NextResponse.json({ slide }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save slide" },
      { status: 400 },
    )
  }
}
