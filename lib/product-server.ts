import type { Category } from "@prisma/client"

import { getCategoryMeta, mapDbProductToCatalog } from "@/lib/product-catalog"
import { getPrisma } from "@/lib/prisma"
import type { StoreProductDetail } from "@/types/product"
import {
  CATEGORY_ENUM_TO_ROUTE,
  CATEGORY_LABELS,
  CATEGORY_ROUTE_TO_ENUM,
} from "@/lib/product-catalog"
import { categoryCatalog, getProductBySlug, type CatalogProduct } from "@/lib/category-catalog"

const productSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  story: true,
  materialsCare: true,
  category: true,
  subcategory: true,
  price: true,
  artisanName: true,
  location: true,
  imageUrls: true,
  badge: true,
  handcrafted: true,
  inStock: true,
  tags: true,
  artisan: { select: { name: true } },
} as const

function getSubcategoryLabel(categoryRoute: string, subcategory: string | null) {
  if (!subcategory) return null
  const config = categoryCatalog[categoryRoute]
  return config?.subcategories.find((entry) => entry.id === subcategory)?.label ?? subcategory
}

function mapCatalogProductToDetail(
  product: CatalogProduct,
  categoryRoute: string,
  category: Category,
): StoreProductDetail {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    description: `${product.name} — handcrafted by ${product.artisan} in ${product.location}.`,
    story: null,
    materialsCare: null,
    category,
    categoryRoute,
    categoryLabel: CATEGORY_LABELS[category],
    subcategory: product.subcategory ?? null,
    subcategoryLabel: getSubcategoryLabel(categoryRoute, product.subcategory ?? null),
    artisanName: product.artisan,
    location: product.location,
    imageUrls: [product.image],
    badge: product.badge ?? null,
    handcrafted: product.badge === "HANDCRAFTED",
    inStock: true,
  }
}

function getCatalogProductsForRoute(categoryRoute: string): CatalogProduct[] {
  return categoryCatalog[categoryRoute]?.products ?? []
}

function mapDbProductToDetail(product: {
  id: string
  name: string
  slug: string
  description: string | null
  story: string | null
  materialsCare: string | null
  category: Category
  subcategory: string | null
  price: unknown
  artisanName: string | null
  location: string | null
  imageUrls: string[]
  badge: string | null
  handcrafted: boolean
  inStock: boolean
  artisan?: { name: string } | null
}): StoreProductDetail {
  const categoryRoute = CATEGORY_ENUM_TO_ROUTE[product.category]
  const artisanName = product.artisanName ?? product.artisan?.name ?? "Artisan"

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(product.price),
    description: product.description,
    story: product.story,
    materialsCare: product.materialsCare,
    category: product.category,
    categoryRoute,
    categoryLabel: CATEGORY_LABELS[product.category],
    subcategory: product.subcategory,
    subcategoryLabel: getSubcategoryLabel(categoryRoute, product.subcategory),
    artisanName,
    location: product.location ?? "",
    imageUrls: product.imageUrls,
    badge: product.badge,
    handcrafted: product.handcrafted,
    inStock: product.inStock,
  }
}

export async function getPublishedProductsByCategoryRoute(categoryRoute: string) {
  const meta = getCategoryMeta(categoryRoute)
  if (!meta) return null

  const dbCategory = {
    jewellery: "jewellery",
    clothing: "clothing",
    decor: "decor",
    "custom-laddoos": "custom_food",
  }[categoryRoute] as Category | undefined

  if (!dbCategory) return null

  const prisma = getPrisma()
  let products: ReturnType<typeof mapDbProductToCatalog>[] = []

  if (prisma) {
    try {
      const dbProducts = await prisma.product.findMany({
        where: { category: dbCategory, isPublished: true },
        orderBy: { createdAt: "desc" },
        select: productSelect,
      })
      products = dbProducts.map(mapDbProductToCatalog)
    } catch (error) {
      console.error("[product-server] failed to load products:", error)
    }
  }

  if (products.length === 0) {
    products = getCatalogProductsForRoute(categoryRoute)
  }

  return {
    meta,
    products,
  }
}

export async function getPublishedProductBySlug(slug: string) {
  const prisma = getPrisma()

  if (prisma) {
    try {
      const product = await prisma.product.findFirst({
        where: { slug, isPublished: true },
        select: productSelect,
      })

      if (product) return mapDbProductToDetail(product)
    } catch (error) {
      console.error("[product-server] failed to load product by slug:", error)
    }
  }

  const catalogHit = getProductBySlug(slug)
  if (!catalogHit) return null

  const category = CATEGORY_ROUTE_TO_ENUM[catalogHit.category.slug]
  if (!category) return null

  return mapCatalogProductToDetail(catalogHit.product, catalogHit.category.slug, category)
}
