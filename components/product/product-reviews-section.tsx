"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { ProductReviewsCarousel } from "@/components/product/product-reviews-carousel"
import { InteractiveStarRating, StarRating } from "@/components/product/star-rating"
import { useWishlist } from "@/components/providers/wishlist-provider"
import { MOCK_REVIEW_SUMMARY } from "@/lib/product-testimonials"
import type { ProductReview, ProductReviewsData } from "@/types/review"
import { createEmptyReviewsData } from "@/types/review"

function formatReviewDate(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso))
}

function ReviewCard({ review }: { review: ProductReview }) {
  return (
    <article className="rounded-2xl border border-[#E8E0D4] bg-white px-5 py-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-[#EDE8DC] font-sans text-[12px] font-semibold text-[#6B5344]">
            {review.authorInitials}
          </span>
          <div>
            <p className="font-sans text-[14px] font-semibold text-[#3D2E24]">{review.authorName}</p>
            <p className="font-sans text-[11px] text-[#9A8070]">{formatReviewDate(review.createdAt)}</p>
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>
      {review.title ? (
        <h4 className="mt-4 font-serif text-[16px] text-[#3D2E24]">{review.title}</h4>
      ) : null}
      <p className="mt-2 font-serif text-[14px] leading-relaxed text-[#6B5344]">{review.body}</p>
    </article>
  )
}

type ProductReviewsSectionProps = {
  slug: string
  productName: string
  reviewsEnabled: boolean
  initialData: ProductReviewsData | null
}

export function ProductReviewsSection({
  slug,
  productName,
  reviewsEnabled,
  initialData,
}: ProductReviewsSectionProps) {
  const router = useRouter()
  const { isLoggedIn } = useWishlist()
  const [data, setData] = useState<ProductReviewsData>(initialData ?? createEmptyReviewsData())
  const [rating, setRating] = useState(initialData?.userReview?.rating ?? 5)
  const [title, setTitle] = useState(initialData?.userReview?.title ?? "")
  const [body, setBody] = useState(initialData?.userReview?.body ?? "")
  const [submitting, setSubmitting] = useState(false)

  const hasRealReviews = data.summary.totalCount > 0
  const showMockCarousel = !hasRealReviews

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (!isLoggedIn) {
      router.push(`/login?next=/products/${slug}`)
      toast.info("Sign in to leave a review")
      return
    }

    if (!reviewsEnabled) {
      toast.error("Reviews are available for catalogue products only")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(`/api/products/${slug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, title, body }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Failed to submit review")

      if (json.data) setData(json.data)
      toast.success(initialData?.userReview ? "Review updated" : "Thank you for your review")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit review")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="border-t border-[#E8E0D4] bg-white/40">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-sans text-[11px] font-medium tracking-[0.22em] text-[#9A8070] uppercase">
              Reviews
            </p>
            <h2 className="mt-2 font-serif text-[28px] text-[#3D2E24] md:text-[32px]">
              {hasRealReviews ? "What Patrons Say" : "Stories From Those Who Care"}
            </h2>
          </div>
          {hasRealReviews ? (
            <div className="flex items-center gap-3">
              <StarRating rating={data.summary.averageRating} size="md" />
              <span className="font-sans text-[13px] text-[#9A8070]">
                {data.summary.averageRating.toFixed(1)} ({data.summary.totalCount}{" "}
                {data.summary.totalCount === 1 ? "Review" : "Reviews"})
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <StarRating rating={MOCK_REVIEW_SUMMARY.averageRating} size="md" />
              <span className="font-sans text-[13px] text-[#9A8070]">
                {MOCK_REVIEW_SUMMARY.averageRating} ({MOCK_REVIEW_SUMMARY.totalCount} Reviews)
              </span>
            </div>
          )}
        </div>

        {showMockCarousel ? (
          <div className="mt-10">
            <ProductReviewsCarousel productName={productName} />
            <p className="mt-4 text-center font-sans text-[12px] text-[#9A8070]">
              Sample stories from our community — be the first to review {productName}.
            </p>
          </div>
        ) : (
          <div className="mt-10 space-y-4">
            {data.reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}

        {reviewsEnabled ? (
          <div className="mt-12 rounded-2xl border border-[#E8E0D4] bg-[#F5F3E9] px-6 py-7">
            <h3 className="font-serif text-[20px] text-[#3D2E24]">
              {data.userReview ? "Update your review" : "Write a review"}
            </h3>
            <p className="mt-1 font-sans text-[13px] text-[#9A8070]">
              Share your experience with {productName}.
            </p>

            {isLoggedIn ? (
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                  <p className="mb-2 font-sans text-[12px] font-medium text-[#6B5344]">Your rating</p>
                  <InteractiveStarRating rating={rating} onChange={setRating} />
                </div>
                <div>
                  <label
                    htmlFor="review-title"
                    className="mb-2 block font-sans text-[12px] font-medium text-[#6B5344]"
                  >
                    Headline (optional)
                  </label>
                  <input
                    id="review-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    maxLength={120}
                    placeholder="Summarise your experience"
                    className="h-11 w-full rounded-lg border border-[#D9CFC0] bg-white px-4 font-sans text-[14px] text-[#3D2E24] outline-none focus:border-[#846246]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="review-body"
                    className="mb-2 block font-sans text-[12px] font-medium text-[#6B5344]"
                  >
                    Your review
                  </label>
                  <textarea
                    id="review-body"
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    required
                    minLength={10}
                    rows={4}
                    placeholder="Tell others about the craftsmanship, packaging, or how you use this piece..."
                    className="w-full resize-y rounded-lg border border-[#D9CFC0] bg-white px-4 py-3 font-serif text-[14px] leading-relaxed text-[#3D2E24] outline-none focus:border-[#846246]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#5C4332] px-6 py-3 font-sans text-[11px] font-semibold tracking-[0.18em] text-white uppercase transition-colors hover:bg-[#4A3528] disabled:opacity-60"
                >
                  {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
                  {data.userReview ? "Update Review" : "Submit Review"}
                </button>
              </form>
            ) : (
              <p className="mt-5 font-sans text-[14px] text-[#6B5344]">
                <Link href={`/login?next=/products/${slug}`} className="font-semibold text-[#846246] underline">
                  Sign in
                </Link>{" "}
                to share your thoughts on this piece.
              </p>
            )}
          </div>
        ) : null}
      </div>
    </section>
  )
}
