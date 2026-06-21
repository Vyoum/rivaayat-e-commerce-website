import {
  FOOD_BOX_SIZES,
  getAvailableFoodBoxSizes,
  normalizeFoodBoxSizeLabel,
  parseQuantityPrices,
  type FoodQuantityPrices,
} from "@/lib/food-quantity-prices"

export const DEFAULT_FOOD_QUANTITY_OPTIONS = [...FOOD_BOX_SIZES] as const

export function normalizeAvailableQuantities(quantities: string[]): string[] {
  const trimmed = quantities.map((entry) => entry.trim()).filter(Boolean)
  const normalized = trimmed
    .map((entry) => normalizeFoodBoxSizeLabel(entry) ?? entry)
    .filter(Boolean)

  const known = new Set(DEFAULT_FOOD_QUANTITY_OPTIONS.map((option) => option.toLowerCase()))
  const normalizedDefaults = DEFAULT_FOOD_QUANTITY_OPTIONS.filter((option) =>
    normalized.some((entry) => entry.toLowerCase() === option.toLowerCase()),
  )
  const custom = normalized.filter((entry) => !known.has(entry.toLowerCase()))

  return [...normalizedDefaults, ...custom]
}

export function resolveFoodQuantityOptions(input: {
  availableQuantities?: string[] | null
  quantityPrices?: FoodQuantityPrices | unknown
}) {
  const pricedSizes = getAvailableFoodBoxSizes(parseQuantityPrices(input.quantityPrices))
  if (pricedSizes.length > 0) return pricedSizes

  const normalized = normalizeAvailableQuantities(input.availableQuantities ?? [])
  return normalized.length > 0 ? normalized : [...DEFAULT_FOOD_QUANTITY_OPTIONS]
}

export function resolveProductQuantities(
  availableQuantities: string[] | null | undefined,
  quantityPrices?: FoodQuantityPrices | unknown,
): string[] {
  return resolveFoodQuantityOptions({ availableQuantities, quantityPrices })
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
