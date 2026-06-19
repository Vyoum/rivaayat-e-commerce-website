export const DEFAULT_TEXTILE_COLOR_OPTIONS = [
  "Natural",
  "Cream",
  "Terracotta",
  "Indigo",
  "Maroon",
  "Sage",
  "Black",
] as const

/** Display swatches for known colour names (case-insensitive lookup). */
export const TEXTILE_COLOR_SWATCHES: Record<string, string> = {
  Natural: "#E8DFD0",
  Cream: "#F5F0E8",
  Terracotta: "#C47848",
  Indigo: "#3D5A80",
  Maroon: "#6B2D3C",
  Sage: "#8FA68E",
  Black: "#2B1B12",
  White: "#FAF7F2",
  Gold: "#C4A882",
  Rust: "#B85A32",
}

export function getTextileColorSwatch(color: string) {
  const match = Object.entries(TEXTILE_COLOR_SWATCHES).find(
    ([name]) => name.toLowerCase() === color.trim().toLowerCase(),
  )
  return match?.[1] ?? "#D9CFC0"
}

export function normalizeAvailableColors(colors: string[]): string[] {
  const trimmed = colors.map((entry) => entry.trim()).filter(Boolean)
  const known = new Set(DEFAULT_TEXTILE_COLOR_OPTIONS.map((option) => option.toLowerCase()))

  const normalizedDefaults = DEFAULT_TEXTILE_COLOR_OPTIONS.filter((option) =>
    trimmed.some((entry) => entry.toLowerCase() === option.toLowerCase()),
  )

  const custom = trimmed.filter((entry) => !known.has(entry.toLowerCase()))

  return [...normalizedDefaults, ...custom]
}

export function resolveProductColors(availableColors: string[] | null | undefined): string[] {
  const normalized = normalizeAvailableColors(availableColors ?? [])
  return normalized.length > 0 ? normalized : [...DEFAULT_TEXTILE_COLOR_OPTIONS]
}
