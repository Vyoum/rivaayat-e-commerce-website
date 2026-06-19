export type ProductColorImages = Record<string, string[]>

export const MAX_COLOR_GALLERY_IMAGES = 5

export function parseColorImages(value: unknown): ProductColorImages {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {}
  }

  const parsed: ProductColorImages = {}

  for (const [key, urls] of Object.entries(value as Record<string, unknown>)) {
    const color = key.trim()
    if (!color || !Array.isArray(urls)) continue
    const imageUrls = urls
      .filter((entry): entry is string => typeof entry === "string")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .slice(0, MAX_COLOR_GALLERY_IMAGES)
    if (imageUrls.length > 0) parsed[color] = imageUrls
  }

  return parsed
}

export function findColorImagesKey(
  colorImages: ProductColorImages,
  color: string | null | undefined,
): string | null {
  if (!color) return null
  const normalized = color.trim().toLowerCase()
  if (!normalized) return null

  const match = Object.keys(colorImages).find(
    (entry) => entry.trim().toLowerCase() === normalized,
  )
  return match ?? null
}

export function normalizeColorImages(
  colorImages: ProductColorImages,
  availableColors: string[],
): ProductColorImages {
  const allowed = new Map(
    availableColors.map((color) => [color.trim().toLowerCase(), color.trim()] as const),
  )
  const normalized: ProductColorImages = {}

  for (const [rawColor, urls] of Object.entries(colorImages)) {
    const canonical = allowed.get(rawColor.trim().toLowerCase())
    if (!canonical) continue
    const imageUrls = urls
      .map((entry) => entry.trim())
      .filter(Boolean)
      .slice(0, MAX_COLOR_GALLERY_IMAGES)
    if (imageUrls.length > 0) normalized[canonical] = imageUrls
  }

  return normalized
}

export function resolveImagesForColor(
  defaultImages: string[],
  colorImages: ProductColorImages,
  color: string | null | undefined,
): string[] {
  const key = findColorImagesKey(colorImages, color)
  if (key && colorImages[key]?.length) {
    return colorImages[key]
  }
  return defaultImages.length > 0 ? defaultImages : ["/placeholder.svg"]
}
