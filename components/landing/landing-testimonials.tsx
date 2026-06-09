"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { MOCK_PRODUCT_TESTIMONIALS } from "@/lib/product-testimonials"

export function LandingTestimonials() {
  const [active, setActive] = useState(0)
  const current = MOCK_PRODUCT_TESTIMONIALS[active]

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % MOCK_PRODUCT_TESTIMONIALS.length)
    }, 6000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <section className="relative overflow-hidden bg-[#ede0d0] px-5 py-14 lg:px-8 lg:py-16">
      <span
        className="landing-display pointer-events-none absolute left-6 top-8 select-none text-[80px] leading-none text-[#3D2E24]/[0.06] lg:left-12 lg:text-[120px]"
        aria-hidden
      >
        &ldquo;
      </span>
      <span
        className="landing-display pointer-events-none absolute bottom-8 right-6 select-none text-[80px] leading-none text-[#3D2E24]/[0.06] lg:right-12 lg:text-[120px]"
        aria-hidden
      >
        &rdquo;
      </span>

      <div className="relative z-10 mx-auto max-w-[820px]">
        <h2 className="landing-display text-center text-[26px] text-[#2D1A12] sm:text-[30px]">
          Stories From <span className="landing-display-italic text-[#7D5A44]">Those Who Care</span>
        </h2>

        <div className="relative mt-10 rounded-2xl bg-[#E6D6C4] px-5 py-7 shadow-[0_2px_10px_rgba(94,68,48,0.12)] sm:px-8 sm:py-8">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-3.5 fill-[#C9A227] text-[#C9A227]" />
            ))}
          </div>

          <h3 className="landing-display mt-4 text-[20px] text-[#2D1A12] sm:text-[22px]">
            {current.title}
          </h3>

          <p className="landing-body mt-4 text-[15px] leading-[1.75] text-[#5C4332]">
            &ldquo;{current.quote}&rdquo;
          </p>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-[#8A9DAA]/25 font-sans text-[11px] font-semibold text-[#5C4332]">
                {current.initials}
              </span>
              <div>
                <p className="font-sans text-[13px] font-medium text-[#2D1A12]">{current.name}</p>
                <p className="font-sans text-[11px] text-[#7A6658]">{current.location}</p>
              </div>
            </div>
            <span className="inline-flex w-fit rounded-full border border-[#8A6A55]/25 bg-[#ede0d0]/70 px-3 py-1.5 font-sans text-[10px] tracking-wide text-[#7A6658]">
              {current.purchased}
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {MOCK_PRODUCT_TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => setActive(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === active ? "w-6 bg-[#8D4225]" : "w-1.5 bg-[#3D2E24]/20 hover:bg-[#3D2E24]/35",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
