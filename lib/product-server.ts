import type { Category } from "@prisma/client"

import { getCategoryMeta, mapDbProductToCatalog } from "@/lib/product-catalog"
import { getPrisma } from "@/lib/prisma"
import type { StoreProductDetail } from "@/types/product"
import { CATEGORY_ENUM_TO_ROUTE, CATEGORY_LABELS } from "@/lib/product-catalog"
import { categoryCatalog } from "@/lib/category-catalog"

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
  const products = await prisma.product.findMany({
    where: { category: dbCategory, isPublished: true },
    orderBy: { createdAt: "desc" },
    select: productSelect,
  })

  return {
    meta,
    products: products.map(mapDbProductToCatalog),
  }
}

export async function getPublishedProductBySlug(slug: string) {
  const prisma = getPrisma()
  const product = await prisma.product.findFirst({
    where: { slug, isPublished: true },
    select: productSelect,
  })

  if (!product) return null
  return mapDbProductToDetail(product)
}
