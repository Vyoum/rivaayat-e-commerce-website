import { NextResponse, type NextRequest } from "next/server"

import { removeWishlistItemForAuthUser } from "@/lib/wishlist-server"
import { createSupabaseApiClient } from "@/lib/supabase/server"

type RouteContext = { params: Promise<{ productId: string }> }

export async function DELETE(request: NextRequest, context: RouteContext) {
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

    const { productId } = await context.params
    if (!productId?.trim()) {
      return NextResponse.json({ error: "Product id is required." }, { status: 400 })
    }

    const items = await removeWishlistItemForAuthUser(user, productId)
    const jsonResponse = NextResponse.json({ items })
    response.cookies.getAll().forEach((cookie) => {
      jsonResponse.cookies.set(cookie)
    })
    return jsonResponse
  } catch (error) {
    console.error("[api/wishlist DELETE]", error)
    return NextResponse.json({ error: "Failed to remove wishlist item." }, { status: 500 })
  }
}
