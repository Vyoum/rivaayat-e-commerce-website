/**
 * Base URL used for OAuth redirects. Must match Supabase Redirect URLs
 * (see SUPABASE_REDIRECT_URLS). In the browser we use the current origin
 * so the port/host always matches where you're actually developing.
 */
export function getAppOrigin() {
  if (typeof window !== "undefined") {
    return window.location.origin
  }

  return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? ""
}

export function getAuthCallbackUrl(redirectPath = "/profile") {
  const origin = getAppOrigin()
  return `${origin}/auth/callback?next=${encodeURIComponent(redirectPath)}`
}

/** Paste these into Supabase → Authentication → URL Configuration → Redirect URLs */
export const SUPABASE_REDIRECT_URLS = [
  "http://localhost:3000/**",
  "http://127.0.0.1:3000/**",
  "https://houseofindika.vercel.app/**",
  "https://houseofindika.com/**",
  "https://www.houseofindika.com/**",
] as const

export const SUPABASE_GOOGLE_REDIRECT_URI =
  "https://gduvyvsvymujcbmwxree.supabase.co/auth/v1/callback"
