export const FOOD_BOX_SIZES = ["250g", "500g", "1kg", "2kg"] as const

export type FoodBoxSize = (typeof FOOD_BOX_SIZES)[number]

export type FoodQuantityPrices = Partial<Record<FoodBoxSize, number>>

export type FoodQuantityPriceOption = {
  label: FoodBoxSize
  price: number | null
}

const BOX_SIZE_LABEL_ALIASES: Record<string, FoodBoxSize> = {
  "250g": "250g",
  "250gm": "250g",
  "250 g": "250g",
  "500g": "500g",
  "500gm": "500g",
  "500 g": "500g",
  "1kg": "1kg",
  "1 kg": "1kg",
  "2kg": "2kg",
  "2 kg": "2kg",
}

export function normalizeFoodBoxSizeLabel(label: string): FoodBoxSize | null {
  const normalized = label.trim().toLowerCase().replace(/\s+/g, " ")
  return BOX_SIZE_LABEL_ALIASES[normalized] ?? null
}

export function parseQuantityPrices(raw: unknown): FoodQuantityPrices {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {}

  const prices: FoodQuantityPrices = {}
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    const size = normalizeFoodBoxSizeLabel(key)
    const price = Number(value)
    if (!size || !Number.isFinite(price) || price <= 0) continue
    prices[size] = price
  }

  return prices
}

export function mergeFoodQuantityPrices(raw?: unknown): FoodQuantityPriceOption[] {
  const parsed = parseQuantityPrices(raw)

  return FOOD_BOX_SIZES.map((label) => ({
    label,
    price: parsed[label] ?? null,
  }))
}

export function getLowestFoodBoxPrice(prices: FoodQuantityPrices): number | null {
  const values = FOOD_BOX_SIZES.map((size) => prices[size]).filter(
    (price): price is number => typeof price === "number" && price > 0,
  )
  if (values.length === 0) return null
  return Math.min(...values)
}

export function getFoodBoxPrice(prices: FoodQuantityPrices, label: string): number | null {
  const size = normalizeFoodBoxSizeLabel(label)
  if (!size) return null
  const price = prices[size]
  return typeof price === "number" && price > 0 ? price : null
}

export function getAvailableFoodBoxSizes(prices: FoodQuantityPrices): FoodBoxSize[] {
  return FOOD_BOX_SIZES.filter((size) => typeof prices[size] === "number" && (prices[size] ?? 0) > 0)
}

export function quantityPriceDraftsToRecord(
  drafts: Array<{ label: FoodBoxSize; price: string }>,
): FoodQuantityPrices {
  const prices: FoodQuantityPrices = {}

  for (const draft of drafts) {
    const trimmed = draft.price.trim()
    if (!trimmed) continue
    const price = Number(trimmed)
    if (!Number.isFinite(price) || price <= 0) continue
    prices[draft.label] = price
  }

  return prices
}
