import { NextResponse } from "next/server"

import { getSafeRedirectPath } from "@/lib/auth-redirect"
import { createSupabaseRouteHandlerClient } from "@/lib/supabase/server"
import { ensureDbUserForAuthUser } from "@/lib/user-sync-server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = getSafeRedirectPath(searchParams.get("next"))
  const oauthError = searchParams.get("error_description") || searchParams.get("error")

  if (oauthError) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(oauthError)}`)
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=Sign-in+could+not+be+completed`)
  }

  const response = NextResponse.redirect(`${origin}${next}`)
  const supabase = await createSupabaseRouteHandlerClient(response)

  if (!supabase) {
    return NextResponse.redirect(`${origin}/login?error=Authentication+is+not+configured`)
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) {
    await ensureDbUserForAuthUser(user)
  }

  return response
}
