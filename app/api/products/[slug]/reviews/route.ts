import { NextResponse, type NextRequest } from "next/server"

import { getPrisma } from "@/lib/prisma"
import {
  createOrUpdateProductReview,
  getProductReviewsBySlug,
} from "@/lib/review-server"
import { normalizeReviewImageUrls } from "@/lib/review-images"
import { createSupabaseApiClient } from "@/lib/supabase/server"

async function resolveDbUserId(request: NextRequest) {
  const prisma = getPrisma()
  if (!prisma) return null

  const response = NextResponse.next()
  const supabase = createSupabaseApiClient(request, response)
  if (!supabase) return null

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) return null

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    select: { id: true },
  })

  return dbUser?.id ?? null
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params
    const userId = await resolveDbUserId(request)
    const data = await getProductReviewsBySlug(slug, userId)

    if (!data) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load reviews" },
      { status: 500 },
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const response = NextResponse.next()

  try {
    const prisma = getPrisma()
    if (!prisma) {
      return NextResponse.json({ error: "Database is unavailable." }, { status: 503 })
    }

    const userId = await resolveDbUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Sign in to leave a review." }, { status: 401 })
    }

    const { slug } = await params
    const body = await request.json()

    const rating = Number(body.rating)
    const reviewBody = typeof body.body === "string" ? body.body.trim() : ""
    const title = typeof body.title === "string" ? body.title.trim() : undefined
    const imageUrls = normalizeReviewImageUrls(body.imageUrls)

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 })
    }

    if (reviewBody.length < 10) {
      return NextResponse.json(
        { error: "Please write at least 10 characters in your review." },
        { status: 400 },
      )
    }

    const review = await createOrUpdateProductReview({
      slug,
      userId,
      rating,
      title,
      body: reviewBody,
      imageUrls,
    })

    if (!review) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const data = await getProductReviewsBySlug(slug, userId)
    const jsonResponse = NextResponse.json({ review, data })
    response.cookies.getAll().forEach((cookie) => {
      jsonResponse.cookies.set(cookie)
    })
    return jsonResponse
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit review" },
      { status: 500 },
    )
  }
}
