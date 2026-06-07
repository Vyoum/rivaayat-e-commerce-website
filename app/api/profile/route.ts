import { NextResponse, type NextRequest } from "next/server"

import { buildFallbackProfile, loadProfileForUser } from "@/lib/profile-server"
import { createSupabaseApiClient } from "@/lib/supabase/server"

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

    try {
      const profile = await loadProfileForUser(user)
      const jsonResponse = NextResponse.json(profile)
      response.cookies.getAll().forEach((cookie) => {
        jsonResponse.cookies.set(cookie)
      })
      return jsonResponse
    } catch (dbError) {
      console.error("[api/profile] database error:", dbError)
      const jsonResponse = NextResponse.json(buildFallbackProfile(user))
      response.cookies.getAll().forEach((cookie) => {
        jsonResponse.cookies.set(cookie)
      })
      return jsonResponse
    }
  } catch (err) {
    console.error("[api/profile]", err)
    return NextResponse.json({ error: "Failed to load profile." }, { status: 500 })
  }
}
