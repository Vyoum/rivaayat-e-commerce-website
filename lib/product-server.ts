import type { Category } from "@prisma/client"

import { enrichCatalogProduct, getCategoryMeta, mapDbProductToCatalog } from "@/lib/product-catalog"
import { attachArtisanSlugsToCatalogProducts, getPublishedArtisanProfiles } from "@/lib/artisan-page-content"
import { resolveArtisanSlugForName } from "@/lib/artisan-routes"
import { applyCategoryCardToMeta, getCategoryCardByRoute } from "@/lib/category-cards"
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
  storyImageUrl: true,
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
    story: `This ${product.name.toLowerCase()} is shaped slowly by ${product.artisan} in ${product.location}, using techniques passed down through generations. Each detail is intentional — from the raw materials chosen at source to the final polish that gives the piece its quiet glow.\n\nWhen you bring it home, you are not just buying an object. You are carrying forward a lineage of skill, patience, and pride in handmade work.`,
    storyImageUrl: product.image,
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
  storyImageUrl: string | null
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
}, artisanSlug?: string | null): StoreProductDetail {
  const categoryRoute = CATEGORY_ENUM_TO_ROUTE[product.category]
  const artisanName = product.artisanName ?? product.artisan?.name ?? "Artisan"

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(product.price),
    description: product.description,
    story: product.story,
    storyImageUrl: product.storyImageUrl,
    materialsCare: product.materialsCare,
    category: product.category,
    categoryRoute,
    categoryLabel: CATEGORY_LABELS[product.category],
    subcategory: product.subcategory,
    subcategoryLabel: getSubcategoryLabel(categoryRoute, product.subcategory),
    artisanName,
    artisanSlug: artisanSlug ?? undefined,
    location: product.location ?? "",
    imageUrls: product.imageUrls,
    badge: product.badge,
    handcrafted: product.handcrafted,
    inStock: product.inStock,
  }
}

export async function getPublishedProductsByCategoryRoute(categoryRoute: string) {
  const baseMeta = getCategoryMeta(categoryRoute)
  if (!baseMeta) return null

  const categoryCard = await getCategoryCardByRoute(categoryRoute)
  const meta = applyCategoryCardToMeta(baseMeta, categoryCard)

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
      products = dbProducts.map((product) => mapDbProductToCatalog(product, categoryRoute))
    } catch (error) {
      console.error("[product-server] failed to load products:", error)
    }

    products = await attachArtisanSlugsToCatalogProducts(products)
    return { meta, products }
  }

  // Demo catalog only when no database is configured
  if (products.length === 0) {
    products = getCatalogProductsForRoute(categoryRoute).map((product) =>
      enrichCatalogProduct(product, categoryRoute),
    )
  }

  products = await attachArtisanSlugsToCatalogProducts(products)

  return {
    meta,
    products,
  }
}

export async function getAllPublishedProducts(): Promise<CatalogProduct[]> {
  const prisma = getPrisma()
  let products: CatalogProduct[] = []

  if (prisma) {
    try {
      const dbProducts = await prisma.product.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        select: productSelect,
      })
      products = dbProducts.map((product) => {
        const categoryRoute = CATEGORY_ENUM_TO_ROUTE[product.category]
        return mapDbProductToCatalog(product, categoryRoute)
      })
    } catch (error) {
      console.error("[product-server] failed to load all products:", error)
    }

    return attachArtisanSlugsToCatalogProducts(products)
  }

  for (const categoryRoute of Object.keys(categoryCatalog)) {
    const routeProducts = getCatalogProductsForRoute(categoryRoute).map((product) =>
      enrichCatalogProduct(product, categoryRoute),
    )
    products.push(...routeProducts)
  }

  return attachArtisanSlugsToCatalogProducts(products)
}

export async function getPublishedProductBySlug(slug: string) {
  const prisma = getPrisma()
  const publishedArtisans = await getPublishedArtisanProfiles()

  if (prisma) {
    try {
      const product = await prisma.product.findFirst({
        where: { slug, isPublished: true },
        select: productSelect,
      })

      if (product) {
        const artisanName = product.artisanName ?? product.artisan?.name ?? "Artisan"
        const artisanSlug = resolveArtisanSlugForName(artisanName, publishedArtisans)
        return mapDbProductToDetail(product, artisanSlug)
      }
    } catch (error) {
      console.error("[product-server] failed to load product by slug:", error)
    }

    return null
  }

  const catalogHit = getProductBySlug(slug)
  if (!catalogHit) return null

  const category = CATEGORY_ROUTE_TO_ENUM[catalogHit.category.slug]
  if (!category) return null

  const detail = mapCatalogProductToDetail(catalogHit.product, catalogHit.category.slug, category)
  const artisanSlug = resolveArtisanSlugForName(detail.artisanName, publishedArtisans)
  return { ...detail, artisanSlug: artisanSlug ?? undefined }
}
