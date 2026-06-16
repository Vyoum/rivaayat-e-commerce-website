import type { Category } from "@prisma/client"

import type { CatalogProduct, CategoryConfig } from "@/lib/category-catalog"
import { categoryCatalog } from "@/lib/category-catalog"

export const CATEGORY_ROUTE_TO_ENUM: Record<string, Category> = {
  jewellery: "jewellery",
  clothing: "clothing",
  decor: "decor",
  "custom-laddoos": "custom_food",
}

export const CATEGORY_ENUM_TO_ROUTE: Record<Category, string> = {
  jewellery: "jewellery",
  clothing: "clothing",
  decor: "decor",
  custom_food: "custom-laddoos",
}

export const CATEGORY_LABELS: Record<Category, string> = {
  jewellery: "Jewellery",
  clothing: "Clothing",
  decor: "Décor",
  custom_food: "Custom Food",
}

export const ADMIN_CATEGORY_COLORS: Record<Category, string> = {
  jewellery: "bg-[#E3F2FD] text-[#1565C0]",
  clothing: "bg-[#F3E5F5] text-[#7B1FA2]",
  decor: "bg-[#FFF3E0] text-[#E65100]",
  custom_food: "bg-[#E8F5E9] text-[#2E7D32]",
}

export function getCategoryMeta(slug: string): Omit<CategoryConfig, "products"> | null {
  const config = categoryCatalog[slug]
  if (!config) return null

  const { products: _products, ...meta } = config
  return meta
}

export function buildCategoryConfig(slug: string, products: CatalogProduct[]): CategoryConfig | null {
  const meta = getCategoryMeta(slug)
  if (!meta) return null
  return { ...meta, products }
}

export function buildCategoryConfigFromMeta(
  meta: Omit<CategoryConfig, "products">,
  products: CatalogProduct[],
): CategoryConfig {
  return { ...meta, products }
}

export function dbCategoryToRouteSlug(category: Category) {
  return CATEGORY_ENUM_TO_ROUTE[category]
}

export function routeSlugToDbCategory(slug: string): Category | null {
  return CATEGORY_ROUTE_TO_ENUM[slug] ?? null
}

function getSubcategoryLabel(categoryRoute: string, subcategory: string | null | undefined) {
  if (!subcategory) return undefined
  const config = categoryCatalog[categoryRoute]
  return config?.subcategories.find((entry) => entry.id === subcategory)?.label ?? subcategory
}

export function enrichCatalogProduct(
  product: CatalogProduct,
  categoryRoute: string,
): CatalogProduct {
  const meta = getCategoryMeta(categoryRoute)
  const dbCategory = routeSlugToDbCategory(categoryRoute)

  return {
    ...product,
    categoryRoute,
    categoryLabel: meta?.breadcrumb ?? (dbCategory ? CATEGORY_LABELS[dbCategory] : categoryRoute),
    subcategoryLabel: getSubcategoryLabel(categoryRoute, product.subcategory),
    inStock: product.inStock ?? true,
  }
}

export function storeProductDetailToCatalog(product: {
  id: string
  name: string
  slug: string
  price: number
  artisanName: string
  artisanSlug?: string
  location: string
  imageUrls: string[]
  badge: string | null
  subcategory: string | null
  subcategoryLabel?: string | null
  categoryRoute?: string
  categoryLabel?: string
  inStock?: boolean
  tags?: string[]
}): CatalogProduct {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    artisan: product.artisanName,
    artisanSlug: product.artisanSlug,
    location: product.location,
    image: product.imageUrls[0] ?? "/placeholder.svg",
    badge: product.badge as CatalogProduct["badge"],
    subcategory: product.subcategory ?? undefined,
    subcategoryLabel: product.subcategoryLabel ?? undefined,
    categoryRoute: product.categoryRoute,
    categoryLabel: product.categoryLabel,
    inStock: product.inStock ?? true,
    tags: product.tags,
    association: product.location
      ? [`associated with ${product.location}`, "and artisan textures"]
      : undefined,
  }
}

export function mapDbProductToCatalog(
  product: {
    id: string
    name: string
    slug: string
    price: unknown
    artisanName: string | null
    location: string | null
    imageUrls: string[]
    badge: string | null
    handcrafted?: boolean
    inStock?: boolean
    subcategory: string | null
    tags: string[]
    artisan?: { name: string } | null
  },
  categoryRoute?: string,
): CatalogProduct {
  const artisan = product.artisanName ?? product.artisan?.name ?? "Artisan"
  const location = product.location ?? ""
  const badge =
    (product.badge as CatalogProduct["badge"]) ??
    (product.handcrafted ? "HANDCRAFTED" : undefined)

  const base: CatalogProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(product.price),
    artisan,
    location,
    image: product.imageUrls[0] ?? "/placeholder.svg",
    badge,
    subcategory: product.subcategory ?? undefined,
    tags: product.tags.length > 0 ? product.tags : undefined,
    inStock: product.inStock ?? true,
    association: location ? [`associated with ${location}`, "and artisan textures"] : undefined,
  }

  return categoryRoute ? enrichCatalogProduct(base, categoryRoute) : base
}
