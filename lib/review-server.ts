import { getInitials } from "@/lib/profile-utils"
import { getPrisma } from "@/lib/prisma"
import { normalizeReviewImageUrls } from "@/lib/review-images"
import type { ProductReview, ProductReviewsData } from "@/types/review"

function mapReview(review: {
  id: string
  rating: number
  title: string | null
  body: string
  imageUrls: string[]
  createdAt: Date
  user: { name: string }
}): ProductReview {
  return {
    id: review.id,
    rating: review.rating,
    title: review.title,
    body: review.body,
    imageUrls: review.imageUrls ?? [],
    createdAt: review.createdAt.toISOString(),
    authorName: review.user.name,
    authorInitials: getInitials(review.user.name),
  }
}

function buildSummary(reviews: { rating: number }[]) {
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as ProductReviewsData["summary"]["distribution"]
  let total = 0

  for (const review of reviews) {
    const rating = Math.min(5, Math.max(1, review.rating)) as 1 | 2 | 3 | 4 | 5
    distribution[rating] += 1
    total += review.rating
  }

  const totalCount = reviews.length
  const averageRating =
    totalCount > 0 ? Math.round((total / totalCount) * 10) / 10 : 0

  return { averageRating, totalCount, distribution }
}

export async function getProductReviewsBySlug(
  slug: string,
  userId?: string | null,
): Promise<ProductReviewsData | null> {
  const prisma = getPrisma()
  if (!prisma) return null

  const product = await prisma.product.findFirst({
    where: { slug, isPublished: true },
    select: { id: true },
  })

  if (!product) return null

  const reviews = await prisma.review.findMany({
    where: { productId: product.id },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  })

  const mapped = reviews.map(mapReview)
  const ownReview = userId ? reviews.find((entry) => entry.userId === userId) : undefined

  return {
    reviews: mapped,
    summary: buildSummary(reviews),
    userReview: ownReview ? mapReview(ownReview) : null,
  }
}

export async function createOrUpdateProductReview(input: {
  slug: string
  userId: string
  rating: number
  title?: string
  body: string
  imageUrls?: string[]
}): Promise<ProductReview | null> {
  const prisma = getPrisma()
  if (!prisma) return null

  const product = await prisma.product.findFirst({
    where: { slug: input.slug, isPublished: true },
    select: { id: true },
  })

  if (!product) return null

  const imageUrls = normalizeReviewImageUrls(input.imageUrls)

  const review = await prisma.review.upsert({
    where: {
      productId_userId: {
        productId: product.id,
        userId: input.userId,
      },
    },
    create: {
      productId: product.id,
      userId: input.userId,
      rating: input.rating,
      title: input.title?.trim() || null,
      body: input.body.trim(),
      imageUrls,
    },
    update: {
      rating: input.rating,
      title: input.title?.trim() || null,
      body: input.body.trim(),
      imageUrls,
    },
    include: { user: { select: { name: true } } },
  })

  return mapReview(review)
}

