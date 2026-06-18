export type ProductReview = {
  id: string
  rating: number
  title: string | null
  body: string
  imageUrls: string[]
  createdAt: string
  authorName: string
  authorInitials: string
}

export type ProductReviewSummary = {
  averageRating: number
  totalCount: number
  distribution: Record<1 | 2 | 3 | 4 | 5, number>
}

export type ProductReviewsData = {
  reviews: ProductReview[]
  summary: ProductReviewSummary
  userReview: ProductReview | null
}

export const EMPTY_REVIEW_SUMMARY: ProductReviewSummary = {
  averageRating: 0,
  totalCount: 0,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
}

export function createEmptyReviewsData(): ProductReviewsData {
  return {
    reviews: [],
    summary: EMPTY_REVIEW_SUMMARY,
    userReview: null,
  }
}
