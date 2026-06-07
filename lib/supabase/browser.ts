import { createBrowserClient, type SupabaseClient } from "@supabase/ssr"

let browserClient: SupabaseClient | null = null

export function getSupabaseBrowser() {
  if (typeof window === "undefined") return null

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null

  if (!browserClient) {
    browserClient = createBrowserClient(url, key)
  }

  return browserClient
}
