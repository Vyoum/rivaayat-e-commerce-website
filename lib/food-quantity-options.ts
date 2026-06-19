export const DEFAULT_FOOD_QUANTITY_OPTIONS = ["250gm", "500gm", "1kg", "2kg"] as const

export function normalizeAvailableQuantities(quantities: string[]): string[] {
  const trimmed = quantities.map((entry) => entry.trim()).filter(Boolean)
  const known = new Set(DEFAULT_FOOD_QUANTITY_OPTIONS.map((option) => option.toLowerCase()))

  const normalizedDefaults = DEFAULT_FOOD_QUANTITY_OPTIONS.filter((option) =>
    trimmed.some((entry) => entry.toLowerCase() === option.toLowerCase()),
  )

  const custom = trimmed.filter((entry) => !known.has(entry.toLowerCase()))

  return [...normalizedDefaults, ...custom]
}

export function resolveProductQuantities(
  availableQuantities: string[] | null | undefined,
): string[] {
  const normalized = normalizeAvailableQuantities(availableQuantities ?? [])
  return normalized.length > 0 ? normalized : [...DEFAULT_FOOD_QUANTITY_OPTIONS]
}

export function isFoodProduct(input: {
  categoryRoute?: string | null
  category?: string | null
  subcategory?: string | null
  tags?: string[]
  categoryLabel?: string | null
}) {
  const route = input.categoryRoute?.trim().toLowerCase()
  if (route === "custom-laddoos" || route === "custom_food") return true

  const category = input.category?.trim().toLowerCase()
  if (category === "custom_food") return true

  const subcategory = input.subcategory?.trim().toLowerCase()
  if (subcategory && ["laddoos", "gifts", "mithai", "sweets", "food"].includes(subcategory)) {
    return true
  }

  if (
    input.tags?.some((tag) => {
      const value = tag.trim().toLowerCase()
      return value.includes("food") || value.includes("ladoo") || value.includes("laddoo")
    })
  ) {
    return true
  }

  const label = input.categoryLabel?.trim().toLowerCase() ?? ""
  return label.includes("food") || label.includes("ladoo") || label.includes("laddoo")
}
