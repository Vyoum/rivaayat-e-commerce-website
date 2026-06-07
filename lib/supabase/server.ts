import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return { url, key }
}

export async function createSupabaseServerClient() {
  const env = getSupabaseEnv()
  if (!env) return null

  const cookieStore = await cookies()

  return createServerClient(env.url, env.key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // setAll can fail in Server Components; middleware keeps sessions fresh.
        }
      },
    },
  })
}

export async function createSupabaseRouteHandlerClient(response: NextResponse) {
  const env = getSupabaseEnv()
  if (!env) return null

  const cookieStore = await cookies()

  return createServerClient(env.url, env.key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          try {
            cookieStore.set(name, value, options)
          } catch {
            // Route handlers can write to the outgoing response directly.
          }
          response.cookies.set(name, value, options)
        })
      },
    },
  })
}

export function createSupabaseMiddlewareClient(
  request: NextRequest,
  response: NextResponse,
) {
  const env = getSupabaseEnv()
  if (!env) return null

  return createServerClient(env.url, env.key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })
}

export function createSupabaseApiClient(request: NextRequest, response: NextResponse) {
  const env = getSupabaseEnv()
  if (!env) return null

  return createServerClient(env.url, env.key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })
}
