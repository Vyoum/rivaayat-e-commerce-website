export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function formatProductPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`
}

export function parsePriceInput(value: string) {
  const cleaned = value.replace(/[^\d.]/g, "")
  const parsed = Number.parseFloat(cleaned)
  if (!Number.isFinite(parsed) || parsed < 0) return null
  return Math.round(parsed * 100) / 100
}
