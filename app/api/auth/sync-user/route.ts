import { NextResponse } from "next/server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { ensureDbUserForAuthUser } from "@/lib/user-sync-server"

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ error: "Authentication is not configured" }, { status: 503 })
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 })
    }

    const dbUser = await ensureDbUserForAuthUser(user)
    if (!dbUser) {
      return NextResponse.json({ error: "Could not save user profile" }, { status: 503 })
    }

    return NextResponse.json({ user: dbUser })
  } catch (error) {
    console.error("[sync-user] unexpected error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Sync failed" },
      { status: 500 },
    )
  }
}
