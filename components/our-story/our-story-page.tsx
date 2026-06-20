"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Hand,
  Leaf,
  Package,
  PenLine,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
} from "lucide-react"

import { StoryHeroCarousel } from "@/components/our-story/story-hero-carousel"
import { SiteHeader } from "@/components/site-header"
import {
  DEFAULT_OUR_STORY_PAGE_CONTENT,
  type OurStoryPageContent,
} from "@/lib/our-story-page-content"
import { cn } from "@/lib/utils"

function SessionHeading({
  title,
  align = "center",
  size = "default",
}: {
  title: string
  align?: "left" | "center"
  size?: "default" | "large" | "xlarge"
}) {
  return (
    <div className={align === "left" ? "text-left" : "text-center"}>
      <h2
        className={cn(
          "font-serif font-normal leading-[1.2] text-[#2D1A12]",
          size === "xlarge"
            ? "text-[clamp(2.5rem,5.5vw,3.5rem)] sm:text-[clamp(2.85rem,5vw,4rem)] lg:text-[clamp(3.25rem,4.5vw,4.75rem)]"
            : size === "large"
              ? "text-[clamp(1.75rem,3.2vw,2.5rem)] lg:text-[clamp(2rem,2.8vw,2.75rem)]"
              : "text-[clamp(1.35rem,2.4vw,1.85rem)] lg:text-[clamp(1.5rem,2.2vw,2rem)]",
        )}
      >
        {title}
      </h2>
    </div>
  )
}

function GhostButton({ href, label, className }: { href: string; label: string; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 border border-[#2D1A12]/55 px-6 py-2.5 font-sans text-[10px] font-medium tracking-[0.22em] text-[#2D1A12] uppercase transition-colors hover:bg-[#2D1A12] hover:text-[#F5F2ED]",
        className,
      )}
    >
      {label}
      <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}

function SolidCtaButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2.5 bg-[#F5EDE3] px-8 py-3 font-sans text-[10px] font-semibold tracking-[0.22em] text-[#2D1A12] uppercase transition-colors hover:bg-[#EDE0CE]"
    >
      {label}
      <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}

const journeyIcons = [PenLine, Leaf, Hand, Search, Package, Truck]
const impactIcons = [Users, Sparkles, ShieldCheck, Leaf]
const promiseIcons = [Sparkles, Leaf, Users, ShieldCheck]

function MakerCard({
  maker,
  flush = false,
}: {
  maker: OurStoryPageContent["makers"]["items"][number]
  flush?: boolean
}) {
  const cardClassName = cn(
    "overflow-hidden bg-[#FAF7F2]/90 transition-colors",
    flush
      ? "story-maker-card border-0"
      : "border border-[#D4C4A8] hover:border-[#9A8070]",
  )

  const inner = (
    <>
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#EDE8DC]">
        <Image
          src={maker.imageUrl}
          alt={maker.name}
          fill
          className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
          sizes="(max-width: 1024px) 28vw, 220px"
        />
      </div>
      <div className="px-4 py-4 lg:px-5 lg:py-5">
        <h3 className="font-serif text-[14px] font-normal text-[#2D1A12] sm:text-[15px] lg:text-[16px]">
          {maker.name}
        </h3>
        <p className="mt-1 font-sans text-[9px] tracking-[0.08em] text-[#6B5344] uppercase sm:text-[10px] lg:text-[11px]">
          {maker.role}
          {maker.location ? `, ${maker.location}` : ""}
        </p>
        <p className="mt-2.5 font-serif text-[11px] italic leading-[1.55] text-[#7D5A44] sm:text-[12px] lg:text-[13px]">
          {maker.quote}
        </p>
      </div>
    </>
  )

  if (maker.profileSlug) {
    return (
      <Link
        href={`/artisans/${maker.profileSlug}`}
        className={cn("group block", cardClassName)}
      >
        {inner}
      </Link>
    )
  }

  return <article className={cardClassName}>{inner}</article>
}

function StoryHeroImageSection({
  content,
  priority = false,
}: {
  content: OurStoryPageContent["cta"]
  priority?: boolean
}) {
  return (
    <StoryHeroCarousel
      slides={content.carouselSlides}
      priority={priority}
    />
  )
}

function StoryFooterCtaSection({
  content,
  className,
}: {
  content: OurStoryPageContent["cta"]
  className?: string
}) {
  return (
    <section
      className={cn(
        "relative min-h-[360px] overflow-hidden sm:min-h-[420px] lg:min-h-[480px]",
        className,
      )}
    >
      <Image
        src={content.footerImageUrl}
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/20" />
      <div className="relative z-10 mx-auto flex h-full min-h-[360px] max-w-[1120px] items-center px-5 py-16 sm:min-h-[420px] lg:min-h-[480px] lg:px-8">
        <div className="max-w-[560px] text-white">
          <p className="font-serif text-[clamp(1.85rem,3.6vw,2.55rem)] font-normal leading-[1.22] italic text-white/95">
            {content.subheadline}
          </p>
          <div className="mt-8">
            <SolidCtaButton href={content.buttonHref} label={content.buttonLabel} />
          </div>
        </div>
      </div>
    </section>
  )
}

function StoryWhyExistsSection({ content }: { content: OurStoryPageContent["whyExists"] }) {
  return (
    <div className="story-panel story-panel--why overflow-hidden !p-0">
      <StoryHeroCarousel
        slides={content.carouselSlides}
        imageAlt="Why House of Indika Exists"
        imageSizes="(max-width: 1280px) 100vw, 1240px"
      />
    </div>
  )
}

function StoryFoundersSection({ content }: { content: OurStoryPageContent["founders"] }) {
  return (
    <StoryHeroCarousel
      slides={content.carouselSlides}
      imageAlt="Meet Our Founders"
    />
  )
}

type OurStoryPageProps = {
  content?: OurStoryPageContent
}

export function OurStoryPage({ content = DEFAULT_OUR_STORY_PAGE_CONTENT }: OurStoryPageProps) {
  return (
    <main className="story-page-root min-h-screen overflow-x-hidden text-[#2D1A12]">
      <SiteHeader className="!border-[#D8CFC4]/60 !bg-[#ede0d0]/90 backdrop-blur-md" />

      {/* SESSION 1 — hero */}
      <StoryHeroImageSection content={content.cta} priority />

      {/* SESSION 2 — Why House of Indika */}
      <section className="story-page-section story-page-section--intro !pt-10 lg:!pt-14">
        <div className="story-page-inner">
          <StoryWhyExistsSection content={content.whyExists} />
        </div>
      </section>

      {/* SESSION 2B — Meet Our Founders */}
      <StoryFoundersSection content={content.founders} />

      {/* SESSION 3 — Meet The Makers */}
      <section className="story-page-section story-page-section--makers">
        <div className="story-panel story-panel--makers">
          <div className="story-makers-heading">
            <SessionHeading title={content.makers.title} />
          </div>
          <div className="story-makers-grid">
            {content.makers.items.map((maker) => (
              <MakerCard key={maker.id} maker={maker} flush />
            ))}
          </div>
        </div>
      </section>

      {/* SESSION 4 — craft journey */}
      <section className="story-page-section">
        <div className="story-page-inner">
          <SessionHeading title={content.journey.title} size="xlarge" />

          <div className="mt-14 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="mx-auto flex min-w-[1240px] max-w-[1320px] items-start justify-between px-2">
              {content.journey.steps.map((step, index) => {
                const Icon = journeyIcons[index] ?? Sparkles
                return (
                  <div key={step.id} className="flex w-[200px] flex-col items-center text-center sm:w-[220px]">
                    <div className="relative flex w-full items-center justify-center">
                      {index > 0 ? (
                        <span className="absolute top-1/2 right-1/2 left-0 h-px -translate-y-1/2 bg-[#C4B5A5]" />
                      ) : null}
                      {index < content.journey.steps.length - 1 ? (
                        <span className="absolute top-1/2 right-0 left-1/2 h-px -translate-y-1/2 bg-[#C4B5A5]" />
                      ) : null}
                      <div className="relative z-10 flex size-[72px] items-center justify-center rounded-full border border-[#C4B5A5] bg-[#F0E6DA] sm:size-[80px]">
                        <Icon className="size-[28px] text-[#6B5344] sm:size-[32px]" strokeWidth={1.25} />
                      </div>
                    </div>
                    <h3 className="mt-6 font-serif text-[20px] font-normal text-[#2D1A12] sm:text-[22px] lg:text-[24px]">
                      {step.title}
                    </h3>
                    <p className="mt-3 font-sans text-[15px] leading-[1.65] text-[#8B7355] sm:text-[16px] lg:text-[18px]">
                      {step.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SESSION 5 — Impact */}
      <section className="story-page-section story-page-section--impact">
        <div className="story-panel story-panel--impact">
          <div className="story-impact-heading">
            <SessionHeading title={content.impact.title} size="large" />
          </div>
          <div className="story-impact-grid">
            {content.impact.stats.map((stat, index) => {
              const Icon = impactIcons[index] ?? Sparkles
              return (
                <div
                  key={stat.id}
                  className="story-impact-stat flex min-h-[160px] flex-col items-center justify-center bg-[#F5EDE3]/95 px-3 py-8 text-center sm:min-h-[185px] sm:px-4"
                >
                  <Icon className="mb-4 size-[22px] text-[#8B7355] sm:size-[24px]" strokeWidth={1.25} />
                  <p className="font-serif text-[clamp(1.75rem,3.2vw,2.35rem)] leading-none text-[#2D1A12]">
                    {stat.value}
                  </p>
                  <p className="mt-3 font-sans text-[11px] leading-snug tracking-[0.08em] text-[#6B5344] uppercase sm:text-[12px] lg:text-[13px]">
                    {stat.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* SESSION 6 — Heritage */}
      <section className="story-page-section story-page-section--heritage">
        <div className="story-page-inner">
          <div className="story-panel story-panel--heritage">
            <div className="story-heritage-heading">
              <SessionHeading title={content.heritage.title} />
            </div>
            <div className="story-heritage-grid">
              {content.heritage.regions.map((region) => (
                <article key={region.id} className="story-heritage-item min-w-0">
                  <div className="story-heritage-media relative overflow-hidden bg-[#EDE8DC]">
                    <Image
                      src={region.imageUrl}
                      alt={region.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, 18vw"
                    />
                  </div>
                  <div className="story-heritage-copy">
                    <h3 className="font-serif text-[13px] text-[#2D1A12]">{region.name}</h3>
                    <p className="mt-0.5 font-sans text-[10px] leading-snug text-[#3D2E24]/85">
                      {region.craft}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SESSION 7 — Collections */}
      <section className="story-page-section">
        <div className="story-page-inner">
          <div className="story-panel story-panel--collections min-w-0">
            <SessionHeading title={content.collections.title} />
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
              {content.collections.items.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group min-w-0 text-center"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#EDE8DC]">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 45vw, 120px"
                    />
                  </div>
                  <p className="mt-2 font-serif text-[12px] text-[#2D1A12] transition-colors group-hover:text-[#6B5344] sm:text-[13px]">
                    {item.name}
                  </p>
                </Link>
              ))}
            </div>
            <div className="mt-8">
              <GhostButton
                href={content.collections.ctaHref}
                label={content.collections.ctaLabel}
                className="w-full justify-center sm:w-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SESSION 8 — Promise */}
      <section className="story-page-section">
        <div className="story-page-inner">
          <div className="story-panel story-panel--promise min-w-0">
            <SessionHeading title={content.promise.title} />
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
              {content.promise.items.map((item, index) => {
                const Icon = promiseIcons[index] ?? Sparkles
                return (
                  <div
                    key={item.id}
                    className="flex min-h-[150px] flex-col items-center justify-center border border-[#D4C4A8] bg-[#F5EDE3]/95 px-3 py-6 text-center shadow-sm sm:min-h-[165px] sm:px-4"
                  >
                    <Icon className="mb-3 size-[18px] text-[#8B7355]" strokeWidth={1.25} />
                    <h3 className="font-serif text-[13px] leading-snug text-[#2D1A12] sm:text-[14px]">
                      {item.title}
                    </h3>
                    <p className="mt-2 font-sans text-[10px] leading-relaxed text-[#7D5A44] sm:text-[11px]">
                      {item.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SESSION 9 — footer CTA */}
      <StoryFooterCtaSection content={content.cta} className="mt-2" />
    </main>
  )
}
