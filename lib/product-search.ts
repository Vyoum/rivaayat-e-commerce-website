import type { CatalogProduct } from "@/lib/category-catalog"

function normalizeSearchText(value: string) {
  return value.trim().toLowerCase()
}

function getProductSearchHaystack(product: CatalogProduct) {
  return [
    product.name,
    product.artisan,
    product.location,
    product.categoryLabel,
    product.subcategoryLabel,
    product.subcategory,
    product.categoryRoute,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
}

export function matchesProductSearch(product: CatalogProduct, query: string) {
  const normalized = normalizeSearchText(query)
  if (!normalized) return true

  const haystack = getProductSearchHaystack(product)
  const tokens = normalized.split(/\s+/).filter(Boolean)
  return tokens.every((token) => haystack.includes(token))
}

export function filterCatalogProductsByQuery(products: CatalogProduct[], query: string) {
  const normalized = normalizeSearchText(query)
  if (!normalized) return products
  return products.filter((product) => matchesProductSearch(product, normalized))
}
