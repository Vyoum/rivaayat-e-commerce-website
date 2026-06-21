import Image from "next/image"
import Link from "next/link"
import { HOUSE_OF_INDIKA } from "@/lib/brand"
import type { HomepageStoryContent } from "@/lib/homepage-story-shared"
import { DEFAULT_HOMEPAGE_STORY } from "@/lib/homepage-story-shared"

type LandingStoryProps = {
  content?: HomepageStoryContent
}

export function LandingStory({ content = DEFAULT_HOMEPAGE_STORY }: LandingStoryProps) {
  return (
    <section className="relative z-10 px-5 py-10 lg:px-8 lg:py-14">
      <div className="mx-auto grid max-w-[960px] gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10 lg:items-start">
        <div className="mx-auto grid w-full max-w-[340px] grid-cols-2 gap-3 sm:max-w-none sm:gap-3.5 lg:max-w-[400px]">
          {content.images.map((img) => (
            <div
              key={img.id}
              className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#EDE8DC]"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 45vw, 200px"
              />
            </div>
          ))}
        </div>

        <div className="lg:pt-1">
          <p className="landing-label text-[10px] text-[#B85A32]">{content.eyebrow}</p>

          <h2 className="mt-3 text-[28px] leading-[1.22] sm:text-[32px]">
            <span className="landing-brand block text-[#8A9DAA]">{HOUSE_OF_INDIKA} —</span>
            <span className="landing-display-italic block text-[#7D5A44]">{content.headline}</span>
          </h2>

          <div className="mt-5 space-y-4 landing-body text-[15px]">
            {content.bodyParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>

          <blockquote className="landing-quote my-6 border-l border-[#B85A32]/70 pl-4 text-[14px] leading-[1.65]">
            {content.quote}
          </blockquote>

          <Link
            href={content.ctaHref}
            className="landing-btn inline-block border-b border-[#B85A32] pb-0.5 text-[#B85A32] transition-colors hover:text-[#A04E2A] hover:border-[#A04E2A]"
          >
            {content.ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}
