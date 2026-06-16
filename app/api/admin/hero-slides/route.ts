import { NextResponse } from "next/server"

import { requireAdminApi } from "@/lib/admin-auth-server"
import {
  createHeroSlide,
  getAllHeroSlides,
  getHeroCopy,
  MAX_HERO_SLIDES,
  reorderHeroSlides,
  updateHeroCopy,
} from "@/lib/hero-slides"

export async function GET() {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  try {
    const [slides, copy] = await Promise.all([getAllHeroSlides(), getHeroCopy()])
    return NextResponse.json({ slides, copy, max: MAX_HERO_SLIDES })
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

export async function PATCH(request: Request) {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  try {
    const body = await request.json()
    const { tagline, titleLine1, titleLine2, subtitle } = body as {
      tagline?: string
      titleLine1?: string
      titleLine2?: string
      subtitle?: string
    }

    const copy = await updateHeroCopy({
      ...(tagline !== undefined ? { tagline } : {}),
      ...(titleLine1 !== undefined ? { titleLine1 } : {}),
      ...(titleLine2 !== undefined ? { titleLine2 } : {}),
      ...(subtitle !== undefined ? { subtitle } : {}),
    })

    return NextResponse.json({ copy })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update hero copy" },
      { status: 400 },
    )
  }
}
