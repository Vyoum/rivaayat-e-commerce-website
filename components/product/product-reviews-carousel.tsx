"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"

import { MOCK_PRODUCT_TESTIMONIALS, type ProductTestimonial } from "@/lib/product-testimonials"
import { cn } from "@/lib/utils"

type ProductReviewsCarouselProps = {
  productName?: string
  testimonials?: ProductTestimonial[]
  autoPlayMs?: number
}

export function ProductReviewsCarousel({
  productName,
  testimonials = MOCK_PRODUCT_TESTIMONIALS,
  autoPlayMs = 6000,
}: ProductReviewsCarouselProps) {
  const [active, setActive] = useState(0)
  const current = testimonials[active]

  useEffect(() => {
    if (testimonials.length <= 1) return
    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length)
    }, autoPlayMs)
    return () => window.clearInterval(timer)
  }, [testimonials.length, autoPlayMs])

  return (
    <div className="relative">
      <div className="rounded-2xl border border-[#E8E0D4] bg-[#EDE8DC]/50 px-6 py-7 sm:px-8 sm:py-8">
        <p className="font-sans text-[10px] font-medium tracking-[0.2em] text-[#9A8070] uppercase">
          Customer Stories
        </p>

        <div className="mt-4 flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "size-3.5",
                i < current.rating ? "fill-[#C9A227] text-[#C9A227]" : "fill-[#E8E0D4] text-[#E8E0D4]",
              )}
            />
          ))}
        </div>

        <h3 className="mt-4 font-serif text-[20px] text-[#3D2E24] sm:text-[22px]">{current.title}</h3>

        <p className="mt-4 font-serif text-[15px] leading-[1.75] text-[#5C4332]">
          &ldquo;{current.quote}&rdquo;
        </p>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-[#8A9DAA]/20 font-sans text-[11px] font-semibold text-[#5C4332]">
              {current.initials}
            </span>
            <div>
              <p className="font-sans text-[13px] font-medium text-[#3D2E24]">{current.name}</p>
              <p className="font-sans text-[11px] text-[#9A8070]">{current.location}</p>
            </div>
          </div>
          <span className="inline-flex w-fit rounded-full border border-[#D9CFC0] bg-white/70 px-3 py-1.5 font-sans text-[10px] tracking-wide text-[#7A6658]">
            {productName ? `Inspired by ${productName}` : current.purchased}
          </span>
        </div>
      </div>

      <div className="mt-5 flex justify-center gap-2">
        {testimonials.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to story ${i + 1}`}
            onClick={() => setActive(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === active ? "w-6 bg-[#846246]" : "w-1.5 bg-[#3D2E24]/20 hover:bg-[#3D2E24]/35",
            )}
          />
        ))}
      </div>
    </div>
  )
}
