export const MAX_REVIEW_PHOTOS = 4

export function normalizeReviewImageUrls(value: unknown): string[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .slice(0, MAX_REVIEW_PHOTOS)
}
