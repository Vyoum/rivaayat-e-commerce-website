import type { CatalogProduct } from "@/lib/category-catalog"
import { getAllPublishedProducts } from "@/lib/product-server"
import { getPrisma } from "@/lib/prisma"

const BEST_SELLER_TAG_HINTS = ["bestseller", "best-seller", "best selling", "best-selling"]

function isBestSellerTag(tag: string) {
  const normalized = tag.trim().toLowerCase()
  return BEST_SELLER_TAG_HINTS.some(
    (hint) => normalized === hint || normalized.includes("bestseller") || normalized.includes("best-seller"),
  )
}

function scoreProduct(
  product: CatalogProduct,
  salesRank: Map<string, number>,
  options?: { categoryRoute?: string },
) {
  let score = salesRank.get(product.id) ?? 0

  if (product.tags?.some(isBestSellerTag)) {
    score += 120
  }

  if (options?.categoryRoute && product.categoryRoute === options.categoryRoute) {
    score += 40
  }

  if (product.inStock === false) {
    score -= 200
  }

  return score
}

export async function getBestSellingProducts(options?: {
  limit?: number
  excludeIds?: string[]
  excludeSlugs?: string[]
  categoryRoute?: string
}): Promise<CatalogProduct[]> {
  const limit = options?.limit ?? 12
  const excludeIds = new Set(options?.excludeIds ?? [])
  const excludeSlugs = new Set(options?.excludeSlugs ?? [])
  const salesRank = new Map<string, number>()

  const prisma = getPrisma()

  if (prisma) {
    try {
      const salesGroups = await prisma.orderItem.groupBy({
        by: ["productId"],
        where: {
          productId: { not: null },
          order: { paymentStatus: "paid" },
        },
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 40,
      })

      salesGroups.forEach((group, index) => {
        if (!group.productId) return
        const quantity = group._sum.quantity ?? 0
        salesRank.set(group.productId, 500 - index * 10 + quantity)
      })
    } catch (error) {
      console.error("[best-selling-products] failed to load sales ranks:", error)
    }
  }

  let products = await getAllPublishedProducts()

  products = products.filter(
    (product) => !excludeIds.has(product.id) && !excludeSlugs.has(product.slug),
  )

  if (products.length === 0) return []

  const ranked = [...products].sort((a, b) => {
    const scoreDiff =
      scoreProduct(b, salesRank, options) - scoreProduct(a, salesRank, options)
    if (scoreDiff !== 0) return scoreDiff
    return a.name.localeCompare(b.name)
  })

  return ranked.slice(0, limit)
}
