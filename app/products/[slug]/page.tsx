import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ProductDetailHeader } from "@/components/product/product-detail-header"
import { ProductDetailContent } from "@/components/product/product-detail-content"
import { BestSellingProductsRail } from "@/components/catalog/best-selling-products-rail"
import { HOUSE_OF_INDIKA } from "@/lib/brand"
import { getBestSellingProducts } from "@/lib/best-selling-products"
import { getPrisma } from "@/lib/prisma"
import { getPublishedProductBySlug } from "@/lib/product-server"
import { getProductReviewsBySlug } from "@/lib/review-server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

type ProductPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getPublishedProductBySlug(slug)

  if (!product) {
    return { title: `Product — ${HOUSE_OF_INDIKA}` }
  }

  return {
    title: `${product.name} — ${HOUSE_OF_INDIKA}`,
    description: product.description ?? `${product.name} handcrafted by ${product.artisanName}.`,
  }
}

async function resolveDbUserId() {
  const prisma = getPrisma()
  if (!prisma) return null

  const supabase = await createSupabaseServerClient()
  if (!supabase) return null

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) return null

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    select: { id: true },
  })

  return dbUser?.id ?? null
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getPublishedProductBySlug(slug)

  if (!product) {
    notFound()
  }

  let userId: string | null = null
  let reviewsData = null
  let bestSellingProducts: Awaited<ReturnType<typeof getBestSellingProducts>> = []

  try {
    userId = await resolveDbUserId()
  } catch (error) {
    console.error("[product-page] failed to resolve user:", error)
  }

  try {
    reviewsData = await getProductReviewsBySlug(slug, userId)
  } catch (error) {
    console.error("[product-page] failed to load reviews:", error)
  }

  try {
    bestSellingProducts = await getBestSellingProducts({
      limit: 12,
      excludeIds: [product.id],
      excludeSlugs: [product.slug],
      categoryRoute: product.categoryRoute,
    })
  } catch (error) {
    console.error("[product-page] failed to load best sellers:", error)
  }

  const reviewsEnabled = reviewsData !== null

  return (
    <main className="min-h-screen bg-[#F5F3E9]">
      <ProductDetailHeader />
      <ProductDetailContent
        product={product}
        reviewsData={reviewsData}
        reviewsEnabled={reviewsEnabled}
      />
      <BestSellingProductsRail
        initialProducts={bestSellingProducts}
        categoryRoute={product.categoryRoute}
        excludeIds={[product.id]}
        excludeSlugs={[product.slug]}
      />
    </main>
  )
}
