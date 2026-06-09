import type { WishlistItem } from "@/lib/wishlist"

export type WishlistPriceFilter =
  | "all"
  | "under-2000"
  | "2000-5000"
  | "5000-10000"
  | "above-10000"

export type WishlistStockFilter = "all" | "in-stock" | "out-of-stock"

export type WishlistFilters = {
  category: string
  subcategory: string
  price: WishlistPriceFilter
  stock: WishlistStockFilter
}

export const DEFAULT_WISHLIST_FILTERS: WishlistFilters = {
  category: "all",
  subcategory: "all",
  price: "all",
  stock: "all",
}

export const WISHLIST_PRICE_FILTER_LABELS: Record<WishlistPriceFilter, string> = {
  all: "All prices",
  "under-2000": "Under ₹2,000",
  "2000-5000": "₹2,000 – ₹5,000",
  "5000-10000": "₹5,000 – ₹10,000",
  "above-10000": "Above ₹10,000",
}

export const WISHLIST_STOCK_FILTER_LABELS: Record<WishlistStockFilter, string> = {
  all: "All items",
  "in-stock": "In stock",
  "out-of-stock": "Out of stock",
}

export function getWishlistCategoryLabel(item: WishlistItem) {
  return item.categoryLabel ?? "Uncategorized"
}

export function getWishlistSubcategoryLabel(item: WishlistItem) {
  return item.subcategoryLabel ?? item.subcategory ?? "General"
}

export function getWishlistInStock(item: WishlistItem) {
  return item.inStock ?? true
}

export function matchesWishlistPriceFilter(price: number, filter: WishlistPriceFilter) {
  if (filter === "all") return true
  if (filter === "under-2000") return price < 2000
  if (filter === "2000-5000") return price >= 2000 && price <= 5000
  if (filter === "5000-10000") return price > 5000 && price <= 10000
  return price > 10000
}

export function filterWishlistItems(items: WishlistItem[], filters: WishlistFilters) {
  return items.filter((item) => {
    const categoryLabel = getWishlistCategoryLabel(item)
    const subcategoryLabel = getWishlistSubcategoryLabel(item)
    const inStock = getWishlistInStock(item)

    if (filters.category !== "all" && categoryLabel !== filters.category) return false
    if (filters.subcategory !== "all" && subcategoryLabel !== filters.subcategory) return false
    if (!matchesWishlistPriceFilter(item.price, filters.price)) return false
    if (filters.stock === "in-stock" && !inStock) return false
    if (filters.stock === "out-of-stock" && inStock) return false

    return true
  })
}

export function getWishlistCategoryOptions(items: WishlistItem[]) {
  const labels = new Set(items.map(getWishlistCategoryLabel))
  return Array.from(labels).sort((a, b) => a.localeCompare(b))
}

export function getWishlistSubcategoryOptions(items: WishlistItem[], category: string) {
  const scoped =
    category === "all"
      ? items
      : items.filter((item) => getWishlistCategoryLabel(item) === category)

  const labels = new Set(scoped.map(getWishlistSubcategoryLabel))
  return Array.from(labels).sort((a, b) => a.localeCompare(b))
}
