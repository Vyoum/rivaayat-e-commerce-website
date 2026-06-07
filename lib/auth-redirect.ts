export function getSafeRedirectPath(next: string | null | undefined, fallback = "/profile") {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return fallback
  }
  return next
}
