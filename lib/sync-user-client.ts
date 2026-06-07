/** Call after sign-in / sign-up so public.users stays in sync with Supabase auth. */
export async function syncUserAfterAuth() {
  try {
    await fetch("/api/auth/sync-user", { method: "POST", credentials: "include" })
  } catch {
    // Non-blocking — AuthUserSync will retry on the next page load.
  }
}
