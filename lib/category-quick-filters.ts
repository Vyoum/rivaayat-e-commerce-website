import type { CatalogProduct } from "@/lib/category-catalog"

export type CategoryQuickFilter = {
  id: string
  label: string
  group?: string
}

const DECOR_PRICE_FILTERS = new Set(["under-1000", "1000-2500", "above-2500"])
const JEWELLERY_PRICE_FILTERS = new Set(["under-500", "500-1000", "above-1000"])
const FOOD_PRICE_FILTERS = new Set(["under-500", "500-1000", "above-1000"])
const MENS_PRICE_FILTERS = new Set(["mens-under-1000", "mens-1000-2500", "mens-above-2500"])
const WOMENS_PRICE_FILTERS = new Set([
  "womens-under-1000",
  "womens-1000-2500",
  "womens-above-2500",
])

const FILTERABLE_CATEGORY_SLUGS = new Set(["decor", "jewellery", "clothing", "custom-laddoos"])

/** Home & Living filters — shown only on `/decor` or Collections when Décor is selected */
export const DECOR_QUICK_FILTERS: CategoryQuickFilter[] = [
  { id: "home-decor", label: "Home Décor" },
  { id: "under-1000", label: "Under ₹1000" },
  { id: "1000-2500", label: "₹1000–₹2500" },
  { id: "above-2500", label: "Above ₹2500" },
  { id: "wall-decor", label: "Wall Décor" },
  { id: "room-decor", label: "Room Décor" },
  { id: "interior-decor", label: "Interior Décor" },
  { id: "lippan-art", label: "Lippan Art" },
  { id: "pichwai-art", label: "Pichwai Art" },
  { id: "festive-decor", label: "Festive Décor" },
  { id: "handmade-accents", label: "Handmade Accents" },
]

export const JEWELLERY_QUICK_FILTERS: CategoryQuickFilter[] = [
  { id: "under-500", label: "Under ₹500", group: "Jewellery" },
  { id: "500-1000", label: "₹500–₹1000", group: "Jewellery" },
  { id: "above-1000", label: "Above ₹1000", group: "Jewellery" },
  { id: "earrings", label: "Earrings", group: "Jewellery" },
  { id: "rings", label: "Rings", group: "Jewellery" },
  { id: "bracelets", label: "Bracelets", group: "Jewellery" },
  { id: "beaded-jewellery", label: "Beaded Jewellery", group: "Jewellery" },
  { id: "crochet-jewellery", label: "Crochet Jewellery", group: "Jewellery" },
  { id: "handmade-collection", label: "Handmade Collection", group: "Jewellery" },
  { id: "statement-pieces", label: "Statement Pieces", group: "Jewellery" },
  { id: "necklace", label: "Necklace", group: "Jewellery" },
]

export const FOOD_QUICK_FILTERS: CategoryQuickFilter[] = [
  { id: "under-500", label: "Under ₹500", group: "Food" },
  { id: "500-1000", label: "₹500–₹1000", group: "Food" },
  { id: "above-1000", label: "Above ₹1000", group: "Food" },
  { id: "savoury", label: "Savoury", group: "Food" },
  { id: "sweet-treats", label: "Sweet Treats", group: "Food" },
  { id: "healthy-organic", label: "Healthy & Organic", group: "Food" },
  { id: "regional-specialties", label: "Regional Specialties", group: "Food" },
  { id: "festive-collection", label: "Festive Collection", group: "Food" },
  { id: "gift-worthy", label: "Gift-Worthy", group: "Food" },
  { id: "bestsellers", label: "Bestsellers", group: "Food" },
  { id: "laddoo", label: "Laddoo", group: "Food" },
  { id: "protein-laddoo", label: "Protein Laddoo", group: "Food" },
  { id: "protein-bars", label: "Protein bars", group: "Food" },
  { id: "custom-food", label: "Custom", group: "Food" },
]

export const CLOTHING_QUICK_FILTERS: CategoryQuickFilter[] = [
  { id: "mens-under-1000", label: "Under ₹1000", group: "Men's Clothing" },
  { id: "mens-1000-2500", label: "₹1000–₹2500", group: "Men's Clothing" },
  { id: "mens-above-2500", label: "Above ₹2500", group: "Men's Clothing" },
  { id: "mens-shirts", label: "Shirts", group: "Men's Clothing" },
  { id: "mens-kurtas", label: "Kurtas", group: "Men's Clothing" },
  { id: "mens-casual-wear", label: "Casual Wear", group: "Men's Clothing" },
  { id: "mens-festive-wear", label: "Festive Wear", group: "Men's Clothing" },
  { id: "mens-handloom", label: "Handloom", group: "Men's Clothing" },
  { id: "mens-block-print", label: "Block Print", group: "Men's Clothing" },
  { id: "mens-hand-painted", label: "Hand-Painted", group: "Men's Clothing" },
  { id: "mens-embroidery", label: "Embroidery", group: "Men's Clothing" },
  { id: "mens-t-shirts", label: "T-Shirts", group: "Men's Clothing" },
  { id: "mens-crochet", label: "Crochet", group: "Men's Clothing" },
  { id: "womens-under-1000", label: "Under ₹1000", group: "Women's Clothing" },
  { id: "womens-1000-2500", label: "₹1000–₹2500", group: "Women's Clothing" },
  { id: "womens-above-2500", label: "Above ₹2500", group: "Women's Clothing" },
  { id: "womens-sarees", label: "Sarees", group: "Women's Clothing" },
  { id: "womens-kurtas-kurtis", label: "Kurtas & Kurtis", group: "Women's Clothing" },
  { id: "womens-dresses", label: "Dresses", group: "Women's Clothing" },
  { id: "womens-coord-sets", label: "Co-ord Sets", group: "Women's Clothing" },
  { id: "womens-tops", label: "Tops", group: "Women's Clothing" },
  { id: "womens-hand-painted", label: "Hand-Painted", group: "Women's Clothing" },
  { id: "womens-crochet", label: "Crochet", group: "Women's Clothing" },
  { id: "womens-embroidery", label: "Embroidery", group: "Women's Clothing" },
]

const LEGACY_DECOR_SUBCATEGORIES = new Set(["living", "brass"])
const LEGACY_JEWELLERY_SUBCATEGORIES: Record<string, string> = {
  beaded: "beaded-jewellery",
  crochet: "crochet-jewellery",
}
const LEGACY_FOOD_SUBCATEGORIES: Record<string, string[]> = {
  laddoos: ["laddoo", "protein-laddoo"],
  gifts: ["gift-worthy", "festive-collection"],
}
const LEGACY_CLOTHING_SUBCATEGORIES: Record<string, { gender: "mens" | "womens"; style: string }> =
  {
    loom: { gender: "mens", style: "mens-handloom" },
    textiles: { gender: "womens", style: "womens-sarees" },
  }

function hasTagOrSubcategory(product: CatalogProduct, filterId: string) {
  return product.subcategory === filterId || product.tags?.includes(filterId) === true
}

function productGender(product: CatalogProduct): "mens" | "womens" | null {
  const subcategory = product.subcategory ?? ""
  if (subcategory.startsWith("mens-") || product.tags?.includes("mens")) return "mens"
  if (subcategory.startsWith("womens-") || product.tags?.includes("womens")) return "womens"
  return null
}

export function matchesCategorySubcategory(
  product: CatalogProduct,
  categorySlug: string,
  subcategoryId: string,
) {
  if (!subcategoryId) return true

  if (categorySlug === "clothing") {
    if (subcategoryId === "mens") return productGender(product) === "mens"
    if (subcategoryId === "womens") return productGender(product) === "womens"
  }

  if (hasTagOrSubcategory(product, subcategoryId)) return true

  if (categorySlug === "jewellery") {
    const legacy = product.subcategory
      ? LEGACY_JEWELLERY_SUBCATEGORIES[product.subcategory]
      : undefined
    if (legacy === subcategoryId) return true
  }

  if (categorySlug === "custom-laddoos") {
    const legacy = product.subcategory ? LEGACY_FOOD_SUBCATEGORIES[product.subcategory] : undefined
    if (legacy?.includes(subcategoryId)) return true
  }

  return product.subcategory === subcategoryId
}

function matchesLowMidHighPrice(price: number, filterId: string) {
  if (filterId === "under-500") return price < 500
  if (filterId === "500-1000") return price >= 500 && price <= 1000
  if (filterId === "above-1000") return price > 1000
  return false
}

function matchesDecorPriceFilter(product: CatalogProduct, filterId: string) {
  const price = product.price
  if (filterId === "under-1000") return price < 1000
  if (filterId === "1000-2500") return price >= 1000 && price <= 2500
  if (filterId === "above-2500") return price > 2500
  return false
}

function matchesDecorStyleFilter(product: CatalogProduct, filterId: string) {
  if (hasTagOrSubcategory(product, filterId)) return true

  if (filterId === "home-decor") {
    return (
      !product.subcategory ||
      product.subcategory === "home-decor" ||
      LEGACY_DECOR_SUBCATEGORIES.has(product.subcategory)
    )
  }

  return false
}

function matchesJewelleryPriceFilter(product: CatalogProduct, filterId: string) {
  const price = product.price
  if (filterId === "under-500") return price < 500
  if (filterId === "500-1000") return price >= 500 && price <= 1000
  if (filterId === "above-1000") return price > 1000
  return false
}

function matchesJewelleryStyleFilter(product: CatalogProduct, filterId: string) {
  if (hasTagOrSubcategory(product, filterId)) return true

  const legacy = product.subcategory
    ? LEGACY_JEWELLERY_SUBCATEGORIES[product.subcategory]
    : undefined
  if (legacy === filterId) return true

  if (filterId === "necklace" && product.name.toLowerCase().includes("necklace")) return true
  if (filterId === "earrings" && product.name.toLowerCase().includes("earring")) return true
  if (filterId === "bracelets" && product.name.toLowerCase().includes("bracelet")) return true
  if (filterId === "rings" && product.name.toLowerCase().includes("ring")) return true

  return false
}

function matchesFoodPriceFilter(product: CatalogProduct, filterId: string) {
  return matchesLowMidHighPrice(product.price, filterId)
}

function matchesFoodStyleFilter(product: CatalogProduct, filterId: string) {
  if (hasTagOrSubcategory(product, filterId)) return true

  const legacy = product.subcategory ? LEGACY_FOOD_SUBCATEGORIES[product.subcategory] : undefined
  if (legacy?.includes(filterId)) return true

  if (filterId === "laddoo" && product.subcategory === "laddoos") return true
  if (filterId === "gift-worthy" && product.subcategory === "gifts") return true

  return false
}

function matchesClothingPriceFilter(product: CatalogProduct, filterId: string) {
  const gender = filterId.startsWith("mens-") ? "mens" : "womens"
  const productGenderValue = productGender(product)
  if (productGenderValue && productGenderValue !== gender) return false

  const price = product.price
  if (filterId === `${gender}-under-1000`) return price < 1000
  if (filterId === `${gender}-1000-2500`) return price >= 1000 && price <= 2500
  if (filterId === `${gender}-above-2500`) return price > 2500
  return false
}

function matchesClothingStyleFilter(product: CatalogProduct, filterId: string) {
  if (hasTagOrSubcategory(product, filterId)) return true

  const legacy = product.subcategory ? LEGACY_CLOTHING_SUBCATEGORIES[product.subcategory] : undefined
  if (legacy?.style === filterId) return true

  if (filterId === "mens-shirts" && product.name.toLowerCase().includes("shirt")) return true
  if (filterId === "mens-kurtas" && product.name.toLowerCase().includes("kurta")) return true
  if (filterId === "womens-sarees" && product.name.toLowerCase().includes("saree")) return true

  return false
}

export function resolveQuickFilterCategorySlug(
  pageSlug: string,
  selectedCategory = "",
): string | null {
  if (FILTERABLE_CATEGORY_SLUGS.has(pageSlug)) return pageSlug
  if (pageSlug === "collections" && FILTERABLE_CATEGORY_SLUGS.has(selectedCategory)) {
    return selectedCategory
  }
  return null
}

export function getQuickFiltersForCategory(categorySlug: string): CategoryQuickFilter[] {
  if (categorySlug === "decor") return DECOR_QUICK_FILTERS
  if (categorySlug === "jewellery") return JEWELLERY_QUICK_FILTERS
  if (categorySlug === "custom-laddoos") return FOOD_QUICK_FILTERS
  if (categorySlug === "clothing") return CLOTHING_QUICK_FILTERS
  return []
}

export function getQuickFiltersForPage(pageSlug: string, selectedCategory = "") {
  const filterCategory = resolveQuickFilterCategorySlug(pageSlug, selectedCategory)
  return filterCategory ? getQuickFiltersForCategory(filterCategory) : []
}

export function isDecorQuickFilter(filterId: string) {
  return DECOR_QUICK_FILTERS.some((filter) => filter.id === filterId)
}

export function matchesCategoryQuickFilter(
  product: CatalogProduct,
  categorySlug: string,
  filterId: string,
) {
  if (isDecorQuickFilter(filterId) && categorySlug !== "decor") {
    return false
  }

  if (categorySlug === "decor") {
    if (DECOR_PRICE_FILTERS.has(filterId)) return matchesDecorPriceFilter(product, filterId)
    return matchesDecorStyleFilter(product, filterId)
  }

  if (categorySlug === "jewellery") {
    if (JEWELLERY_PRICE_FILTERS.has(filterId)) return matchesJewelleryPriceFilter(product, filterId)
    return matchesJewelleryStyleFilter(product, filterId)
  }

  if (categorySlug === "custom-laddoos") {
    if (FOOD_PRICE_FILTERS.has(filterId)) return matchesFoodPriceFilter(product, filterId)
    return matchesFoodStyleFilter(product, filterId)
  }

  if (categorySlug === "clothing") {
    if (MENS_PRICE_FILTERS.has(filterId) || WOMENS_PRICE_FILTERS.has(filterId)) {
      return matchesClothingPriceFilter(product, filterId)
    }
    return matchesClothingStyleFilter(product, filterId)
  }

  return false
}

export function groupQuickFilters(filters: CategoryQuickFilter[]) {
  const groups: { group: string; filters: CategoryQuickFilter[] }[] = []
  const groupIndex = new Map<string, number>()

  for (const filter of filters) {
    const groupName = filter.group ?? ""
    const existingIndex = groupIndex.get(groupName)
    if (existingIndex === undefined) {
      groupIndex.set(groupName, groups.length)
      groups.push({ group: groupName, filters: [filter] })
      continue
    }
    groups[existingIndex]?.filters.push(filter)
  }

  return groups
}
