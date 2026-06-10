"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  ChevronRight,
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

import { SiteHeader } from "@/components/site-header"
import {
  DEFAULT_OUR_STORY_PAGE_CONTENT,
  type OurStoryPageContent,
} from "@/lib/our-story-page-content"
import { cn } from "@/lib/utils"

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="text-center font-serif text-[clamp(1.75rem,3.2vw,2.35rem)] font-normal leading-[1.2] text-[#2D1A12]">
      {children}
    </h2>
  )
}

function GhostButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2.5 border border-[#2D1A12]/55 px-7 py-2.5 font-sans text-[10px] font-medium tracking-[0.22em] text-[#2D1A12] uppercase transition-colors hover:bg-[#2D1A12] hover:text-[#F5F2ED]"
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
      className="group inline-flex items-center gap-2.5 bg-white px-7 py-3 font-sans text-[10px] font-semibold tracking-[0.22em] text-[#2D1A12] uppercase transition-colors hover:bg-[#F5F2ED]"
    >
      {label}
      <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}

function HorizontalScroller({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  function scrollNext() {
    ref.current?.scrollBy({ left: 340, behavior: "smooth" })
  }

  return (
    <div className={cn("relative pr-10", className)}>
      <div
        ref={ref}
        className="flex gap-5 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <button
        type="button"
        onClick={scrollNext}
        aria-label="Scroll to see more"
        className="absolute top-[42%] right-0 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#D8CFC4] bg-[#F5F2ED] text-[#6B5344] transition-colors hover:border-[#2D1A12] hover:text-[#2D1A12]"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  )
}

const journeyIcons = [PenLine, Leaf, Hand, Search, Package, Truck]
const impactIcons = [Users, Sparkles, ShieldCheck, Leaf]
const promiseIcons = [Sparkles, Leaf, Users, ShieldCheck]

type OurStoryPageProps = {
  content?: OurStoryPageContent
}

export function OurStoryPage({ content = DEFAULT_OUR_STORY_PAGE_CONTENT }: OurStoryPageProps) {
  return (
    <main className="story-page-root min-h-screen bg-[#F5F2ED] text-[#2D1A12]">
      <SiteHeader className="!bg-[#F5F2ED]" />

      {/* SESSION 2 */}
      <section className="mx-auto max-w-[1120px] px-5 pb-20 pt-14 lg:px-8 lg:pb-24 lg:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <div>
            <h1 className="font-serif text-[clamp(2rem,4vw,2.65rem)] font-normal leading-[1.15] text-[#2D1A12]">
              {content.whyExists.title}
            </h1>
            <div className="mt-7 space-y-5 font-serif text-[15px] leading-[1.85] text-[#5C4332]">
              {content.whyExists.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/5] w-full overflow-hidden lg:max-h-[520px] lg:justify-self-end">
            <Image
              src={content.whyExists.imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 90vw, 520px"
              priority
            />
          </div>
        </div>
      </section>

      {/* SESSION 3 */}
      <section className="mx-auto max-w-[1120px] px-5 py-20 lg:px-8 lg:py-24">
        <SectionTitle>{content.makers.title}</SectionTitle>

        <div className="mt-12">
          <HorizontalScroller>
            {content.makers.items.map((maker) => (
              <article
                key={maker.id}
                className="w-[min(100%,292px)] shrink-0 border border-[#E0D8CC] bg-[#FAF7F2]"
              >
                <div className="relative aspect-[5/4] overflow-hidden bg-[#EDE8DC]">
                  <Image
                    src={maker.imageUrl}
                    alt={maker.name}
                    fill
                    className="object-cover"
                    sizes="292px"
                  />
                </div>
                <div className="px-5 py-5">
                  <h3 className="font-serif text-[17px] font-normal text-[#2D1A12]">{maker.name}</h3>
                  <p className="mt-1 font-sans text-[10px] tracking-[0.1em] text-[#6B5344] uppercase">
                    {maker.role}, {maker.location}
                  </p>
                  <p className="mt-4 font-serif text-[13px] italic leading-[1.65] text-[#7D5A44]">
                    {maker.quote}
                  </p>
                </div>
              </article>
            ))}
          </HorizontalScroller>
        </div>
      </section>

      {/* SESSION 4 */}
      <section className="mx-auto max-w-[1120px] px-5 py-20 lg:px-8 lg:py-24">
        <SectionTitle>{content.journey.title}</SectionTitle>

        <div className="mt-14 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="mx-auto flex min-w-[980px] max-w-[1060px] items-start justify-between px-1">
            {content.journey.steps.map((step, index) => {
              const Icon = journeyIcons[index] ?? Sparkles
              return (
                <div key={step.id} className="flex w-[150px] flex-col items-center text-center">
                  <div className="relative flex w-full items-center justify-center">
                    {index > 0 ? (
                      <span className="absolute top-1/2 right-1/2 left-0 h-px -translate-y-1/2 bg-[#C4B5A5]" />
                    ) : null}
                    {index < content.journey.steps.length - 1 ? (
                      <span className="absolute top-1/2 right-0 left-1/2 h-px -translate-y-1/2 bg-[#C4B5A5]" />
                    ) : null}
                    <div className="relative z-10 flex size-[52px] items-center justify-center rounded-full border border-[#C4B5A5] bg-[#F5F2ED]">
                      <Icon className="size-[18px] text-[#6B5344]" strokeWidth={1.25} />
                    </div>
                  </div>
                  <h3 className="mt-5 font-serif text-[13px] font-normal text-[#2D1A12]">{step.title}</h3>
                  <p className="mt-2 font-sans text-[10px] leading-[1.55] text-[#8B7355]">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* SESSION 5 */}
      <section className="mx-auto max-w-[1120px] px-5 py-20 lg:px-8 lg:py-24">
        <SectionTitle>{content.impact.title}</SectionTitle>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {content.impact.stats.map((stat, index) => {
            const Icon = impactIcons[index] ?? Sparkles
            return (
              <div
                key={stat.id}
                className="flex min-h-[190px] flex-col items-center justify-center border border-[#E0D8CC] bg-[#FAF7F2] px-5 py-9 text-center"
              >
                <Icon className="mb-5 size-[18px] text-[#8B7355]" strokeWidth={1.25} />
                <p className="font-serif text-[clamp(1.65rem,2.8vw,2.1rem)] leading-none text-[#2D1A12]">
                  {stat.value}
                </p>
                <p className="mt-3 max-w-[140px] font-sans text-[10px] leading-snug tracking-[0.1em] text-[#6B5344] uppercase">
                  {stat.label}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* SESSION 6 */}
      <section className="mx-auto max-w-[1120px] px-5 py-20 lg:px-8 lg:py-24">
        <SectionTitle>{content.heritage.title}</SectionTitle>

        <div className="mt-12">
          <HorizontalScroller>
            {content.heritage.regions.map((region) => (
              <article key={region.id} className="w-[min(100%,200px)] shrink-0">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#EDE8DC]">
                  <Image
                    src={region.imageUrl}
                    alt={region.name}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
                <h3 className="mt-3.5 font-serif text-[14px] text-[#2D1A12]">{region.name}</h3>
                <p className="mt-0.5 font-sans text-[10px] text-[#8B7355]">{region.craft}</p>
              </article>
            ))}
          </HorizontalScroller>
        </div>
      </section>

      {/* SESSION 7 */}
      <section className="mx-auto max-w-[1120px] px-5 py-20 lg:px-8 lg:py-24">
        <SectionTitle>{content.collections.title}</SectionTitle>

        <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
          {content.collections.items.map((item) => (
            <Link key={item.id} href={item.href} className="group text-center">
              <div className="relative aspect-square overflow-hidden bg-[#EDE8DC]">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 45vw, 180px"
                />
              </div>
              <p className="mt-3.5 font-serif text-[13px] text-[#2D1A12] transition-colors group-hover:text-[#6B5344]">
                {item.name}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-11 flex justify-center">
          <GhostButton href={content.collections.ctaHref} label={content.collections.ctaLabel} />
        </div>
      </section>

      {/* SESSION 8 */}
      <section className="mx-auto max-w-[1120px] px-5 py-20 lg:px-8 lg:py-24">
        <SectionTitle>{content.promise.title}</SectionTitle>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {content.promise.items.map((item, index) => {
            const Icon = promiseIcons[index] ?? Sparkles
            return (
              <div
                key={item.id}
                className="flex min-h-[170px] flex-col items-center justify-center border border-[#E0D8CC] bg-[#FAF7F2] px-5 py-8 text-center"
              >
                <Icon className="mb-4 size-[18px] text-[#8B7355]" strokeWidth={1.25} />
                <h3 className="font-serif text-[14px] leading-snug text-[#2D1A12]">{item.title}</h3>
                <p className="mt-2.5 font-sans text-[11px] leading-relaxed text-[#7D5A44]">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* SESSION 9 */}
      <section className="relative mt-2 min-h-[360px] overflow-hidden sm:min-h-[420px] lg:min-h-[480px]">
        <Image
          src={content.cta.imageUrl}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/25" />
        <div className="relative z-10 mx-auto flex h-full min-h-[360px] max-w-[1120px] items-center px-5 py-16 sm:min-h-[420px] lg:min-h-[480px] lg:px-8">
          <div className="max-w-[540px] text-white">
            <h2 className="font-serif text-[clamp(1.85rem,3.6vw,2.55rem)] font-normal leading-[1.22] text-white">
              {content.cta.headline}
            </h2>
            <p className="mt-4 font-serif text-[15px] italic text-white/90">{content.cta.subheadline}</p>
            <div className="mt-8">
              <SolidCtaButton href={content.cta.buttonHref} label={content.cta.buttonLabel} />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
