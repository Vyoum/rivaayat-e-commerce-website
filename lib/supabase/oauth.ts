import { getSupabaseBrowser } from "@/lib/supabase/browser"

type OAuthProvider = "google" | "facebook"

export async function signInWithOAuth(
  provider: OAuthProvider,
  redirectPath = "/profile",
) {
  const supabase = getSupabaseBrowser()
  if (!supabase) {
    return { error: new Error("Authentication is not configured.") }
  }

  const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectPath)}`

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      skipBrowserRedirect: false,
    },
  })

  return { error }
}
