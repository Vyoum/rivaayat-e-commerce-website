import { NextResponse, type NextRequest } from "next/server"

import {
  loadWishlistForAuthUser,
  migrateWishlistItemsForAuthUser,
  toggleWishlistItemForAuthUser,
} from "@/lib/wishlist-server"
import { createSupabaseApiClient } from "@/lib/supabase/server"

function withAuthCookies(response: NextResponse, source: NextResponse) {
  source.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie)
  })
  return response
}

export async function GET(request: NextRequest) {
  const response = NextResponse.next()

  try {
    const supabase = createSupabaseApiClient(request, response)
    if (!supabase) {
      return NextResponse.json({ error: "Authentication is not configured." }, { status: 503 })
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const items = await loadWishlistForAuthUser(user)
    return withAuthCookies(NextResponse.json({ items }), response)
  } catch (error) {
    console.error("[api/wishlist GET]", error)
    return NextResponse.json({ error: "Failed to load wishlist." }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const response = NextResponse.next()

  try {
    const supabase = createSupabaseApiClient(request, response)
    if (!supabase) {
      return NextResponse.json({ error: "Authentication is not configured." }, { status: 503 })
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = (await request.json()) as {
      action?: "toggle" | "migrate"
      productId?: string
      slug?: string | null
      items?: Array<{ productId: string; slug?: string | null }>
    }

    if (body.action === "migrate" && Array.isArray(body.items)) {
      const items = await migrateWishlistItemsForAuthUser(user, body.items)
      return withAuthCookies(NextResponse.json({ items }), response)
    }

    if (!body.productId?.trim()) {
      return NextResponse.json({ error: "Product id is required." }, { status: 400 })
    }

    const result = await toggleWishlistItemForAuthUser(user, body.productId, body.slug)
    if (!result) {
      return NextResponse.json(
        { error: "Product not found or wishlist is unavailable." },
        { status: 404 },
      )
    }

    return withAuthCookies(
      NextResponse.json({ added: result.added, items: result.items }),
      response,
    )
  } catch (error) {
    console.error("[api/wishlist POST]", error)
    return NextResponse.json({ error: "Failed to update wishlist." }, { status: 500 })
  }
}
