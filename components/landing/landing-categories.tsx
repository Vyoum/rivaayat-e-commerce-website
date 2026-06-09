import Image from "next/image"
import Link from "next/link"

import type { CategoryCard } from "@/lib/category-cards-shared"
import {
  DEFAULT_CATEGORY_CARDS,
  DEFAULT_CATEGORY_SECTION_HEADING,
} from "@/lib/category-cards-shared"

type LandingCategoriesProps = {
  cards?: CategoryCard[]
  sectionHeading?: string
}

export function LandingCategories({
  cards = DEFAULT_CATEGORY_CARDS,
  sectionHeading = DEFAULT_CATEGORY_SECTION_HEADING,
}: LandingCategoriesProps) {
  return (
    <section className="landing-categories-section relative z-10 px-5 pb-16 pt-10 lg:px-8 lg:pb-20 lg:pt-12">
      <div className="landing-categories-hills pointer-events-none absolute inset-0" aria-hidden>
        <svg
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
          className="absolute bottom-[18%] h-[42%] w-full"
        >
          <path
            d="M0,280 C320,220 640,340 960,260 C1200,200 1320,280 1440,240 L1440,600 L0,600 Z"
            fill="#C4A078"
          />
        </svg>
        <svg
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
          className="absolute bottom-[8%] h-[38%] w-full"
        >
          <path
            d="M0,320 C280,260 560,360 840,300 C1120,240 1280,320 1440,280 L1440,600 L0,600 Z"
            fill="#B08860"
          />
        </svg>
        <svg
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
          className="absolute bottom-0 h-[32%] w-full"
        >
          <path
            d="M0,360 C300,300 600,400 900,340 C1200,280 1320,360 1440,320 L1440,600 L0,600 Z"
            fill="#9E7348"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-[820px]">
        <h2 className="landing-display text-center text-[26px] text-[#2D1A12] sm:text-[30px]">
          {sectionHeading}
        </h2>
        <div className="mx-auto mt-2.5 flex w-16 items-center gap-1.5">
          <span className="h-px flex-1 bg-[#8A6A55]/55" />
          <span className="size-1 rotate-45 bg-[#8A6A55]" />
          <span className="h-px flex-1 bg-[#8A6A55]/55" />
        </div>

        <div className="mt-7 grid max-w-[760px] gap-4 sm:mx-auto sm:grid-cols-2 sm:gap-5">
          {cards.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group overflow-hidden rounded-xl bg-[#E6D6C4] shadow-[0_2px_10px_rgba(94,68,48,0.12)] transition-shadow hover:shadow-[0_3px_16px_rgba(94,68,48,0.15)]"
            >
              <div className="relative aspect-[458/178] overflow-hidden bg-[#DCCAB6]">
                <Image
                  src={cat.imageUrl}
                  alt={cat.title}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 640px) 100vw, 360px"
                />
              </div>
              <div className="bg-[#E6D6C4] px-4 py-4 text-center">
                <h3 className="landing-display text-[19px] text-[#2D1A12] sm:text-[20px]">{cat.title}</h3>
                <p className="landing-body mt-1.5 text-[13px] leading-snug text-[#7D5A44]">
                  {cat.description}
                </p>
                <p className="landing-btn mt-3 text-[#B85A32] transition-colors group-hover:text-[#A04E2A]">
                  Explore Collection →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
