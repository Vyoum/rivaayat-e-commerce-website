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

export function storeProductDetailToCatalog(product: {
  id: string
  name: string
  slug: string
  price: number
  artisanName: string
  location: string
  imageUrls: string[]
  badge: string | null
  subcategory: string | null
  tags?: string[]
}): CatalogProduct {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    artisan: product.artisanName,
    location: product.location,
    image: product.imageUrls[0] ?? "/placeholder.svg",
    badge: product.badge as CatalogProduct["badge"],
    subcategory: product.subcategory ?? undefined,
    tags: product.tags,
    association: product.location
      ? [`associated with ${product.location}`, "and artisan textures"]
      : undefined,
  }
}

export function mapDbProductToCatalog(product: {
  id: string
  name: string
  slug: string
  price: unknown
  artisanName: string | null
  location: string | null
  imageUrls: string[]
  badge: string | null
  handcrafted?: boolean
  subcategory: string | null
  tags: string[]
  artisan?: { name: string } | null
}): CatalogProduct {
  const artisan = product.artisanName ?? product.artisan?.name ?? "Artisan"
  const location = product.location ?? ""
  const badge =
    (product.badge as CatalogProduct["badge"]) ??
    (product.handcrafted ? "HANDCRAFTED" : undefined)

  return {
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
    association: location ? [`associated with ${location}`, "and artisan textures"] : undefined,
  }
}
