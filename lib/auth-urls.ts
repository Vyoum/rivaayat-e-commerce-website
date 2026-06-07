/**
 * Base URL used for OAuth redirects. Must exactly match an entry in
 * Supabase → Authentication → URL Configuration → Redirect URLs.
 */
export function getAppOrigin() {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "")
  if (configured) return configured

  if (typeof window !== "undefined") {
    return window.location.origin
  }

  return ""
}

export function getAuthCallbackUrl(redirectPath = "/profile") {
  const origin = getAppOrigin()
  return `${origin}/auth/callback?next=${encodeURIComponent(redirectPath)}`
}

export const SUPABASE_REDIRECT_URLS = [
  "http://localhost:3000/auth/callback",
  "http://127.0.0.1:3000/auth/callback",
  "https://houseofindika.vercel.app/auth/callback",
] as const

export const SUPABASE_GOOGLE_REDIRECT_URI =
  "https://gduvyvsvymujcbmwxree.supabase.co/auth/v1/callback"
