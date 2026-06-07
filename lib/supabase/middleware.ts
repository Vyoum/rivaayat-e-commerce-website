import { NextResponse, type NextRequest } from "next/server"

import { createSupabaseMiddlewareClient } from "@/lib/supabase/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createSupabaseMiddlewareClient(request, supabaseResponse)
  if (!supabase) {
    return supabaseResponse
  }

  await supabase.auth.getUser()

  supabaseResponse.headers.set("Cache-Control", "private, no-store")
  return supabaseResponse
}
