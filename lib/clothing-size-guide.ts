export type ClothingSizeGuideRow = {
  size: string
  chestIn: string
  waistIn: string
  hipIn: string
  lengthIn: string
}

export const CLOTHING_SIZE_GUIDE_ROWS: ClothingSizeGuideRow[] = [
  { size: "XS", chestIn: "32–33", waistIn: "26–27", hipIn: "35–36", lengthIn: "36–37" },
  { size: "S", chestIn: "34–35", waistIn: "28–29", hipIn: "37–38", lengthIn: "38–39" },
  { size: "M", chestIn: "36–37", waistIn: "30–31", hipIn: "39–40", lengthIn: "40–41" },
  { size: "L", chestIn: "38–39", waistIn: "32–33", hipIn: "41–42", lengthIn: "42–43" },
  { size: "XL", chestIn: "40–42", waistIn: "34–36", hipIn: "43–45", lengthIn: "44–45" },
  { size: "XXL", chestIn: "43–45", waistIn: "37–39", hipIn: "46–48", lengthIn: "46–47" },
]

export const CLOTHING_SIZE_GUIDE_MEASURE_TIPS = [
  "Chest — measure around the fullest part of the bust, keeping the tape level.",
  "Waist — measure around your natural waistline, above the navel.",
  "Hip — measure around the fullest part of the hips.",
  "Length — from the highest shoulder point to the desired hem.",
]

export const CLOTHING_SIZE_GUIDE_NOTE =
  "Measurements are in inches. Handcrafted textiles may vary slightly — this chart reflects typical finished sizing. For a relaxed fit, consider sizing up."

export const TEXTILE_SIZE_OPTIONS = CLOTHING_SIZE_GUIDE_ROWS.map((row) => row.size)

export function normalizeAvailableSizes(sizes: string[]): string[] {
  const selected = new Set(sizes.map((size) => size.trim().toUpperCase()))
  return TEXTILE_SIZE_OPTIONS.filter((size) => selected.has(size))
}

/** Product-specific sizes in chart order; empty config falls back to the full range. */
export function resolveProductSizes(availableSizes: string[] | null | undefined): string[] {
  const normalized = normalizeAvailableSizes(availableSizes ?? [])
  return normalized.length > 0 ? normalized : [...TEXTILE_SIZE_OPTIONS]
}

const TEXTILE_SUBCATEGORIES = new Set(["loom", "textiles"])
const TEXTILE_TAGS = new Set(["textile", "textiles", "clothing", "handloom", "handloom-textile"])

export function isTextileProduct(input: {
  categoryRoute?: string | null
  category?: string | null
  subcategory?: string | null
  tags?: string[]
  categoryLabel?: string | null
}) {
  const route = input.categoryRoute?.trim().toLowerCase()
  if (route === "clothing") return true

  const category = input.category?.trim().toLowerCase()
  if (category === "clothing") return true

  const subcategory = input.subcategory?.trim().toLowerCase()
  if (subcategory && TEXTILE_SUBCATEGORIES.has(subcategory)) return true

  if (input.tags?.some((tag) => TEXTILE_TAGS.has(tag.trim().toLowerCase()))) return true

  const label = input.categoryLabel?.trim().toLowerCase() ?? ""
  if (
    label.includes("textile") ||
    label.includes("loom") ||
    label === "clothing" ||
    label === "the loom series"
  ) {
    return true
  }

  return false
}

/** @deprecated use isTextileProduct */
export function isClothingProduct(categoryRoute: string) {
  return isTextileProduct({ categoryRoute })
}
