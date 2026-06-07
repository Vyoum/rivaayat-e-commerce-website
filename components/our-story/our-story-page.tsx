import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { SiteHeader } from "@/components/site/site-header"
import type { OurStoryContent } from "@/lib/our-story-content-shared"

function TornPaperDivider({ fill }: { fill: string }) {
  return (
    <div className="relative z-10 -mt-px h-8 w-full sm:h-10">
      <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
        <path
          d="M0,20 C120,32 240,8 360,18 C480,28 600,6 720,16 C840,26 960,10 1080,18 C1200,26 1320,12 1440,22 L1440,40 L0,40 Z"
          fill={fill}
        />
      </svg>
    </div>
  )
}

function BotanicalIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden
    >
      <circle cx="24" cy="24" r="22" strokeOpacity="0.5" />
      <path d="M24 34V18M24 18C24 18 16 16 14 10C18 12 24 18 24 18ZM24 18C24 18 32 16 34 10C30 12 24 18 24 18Z" />
      <path d="M20 28C18 26 16 24 14 24" strokeOpacity="0.7" />
      <path d="M28 28C30 26 32 24 34 24" strokeOpacity="0.7" />
    </svg>
  )
}

function LeafIllustration() {
  return (
    <div className="flex h-full min-h-[220px] items-center justify-center border border-white/35 bg-[#9A4A2A]/40 p-6 sm:min-h-[280px]">
      <svg
        viewBox="0 0 120 160"
        className="h-[140px] w-auto text-white/90"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        aria-hidden
      >
        <path d="M60 150V40" />
        <path d="M60 40C60 40 20 30 15 10C35 25 60 55 60 55Z" />
        <path d="M60 55C60 55 85 45 95 25C75 40 60 70 60 70Z" />
        <path d="M60 70C60 70 25 65 18 48C38 58 60 90 60 90Z" />
        <path d="M60 90C60 90 95 82 102 62C82 75 60 110 60 110Z" />
        <path d="M60 110C60 110 30 108 22 95C42 100 60 130 60 130Z" />
        <path d="M60 130C60 130 90 125 98 108C78 115 60 150 60 150Z" />
      </svg>
    </div>
  )
}

function StoryCta({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="landing-btn group inline-flex items-center gap-2 text-[10px] tracking-[0.2em] text-[#A0522D] transition-colors hover:text-[#8B4513]"
    >
      {label}
      <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}

function StoryCtaLight({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="landing-btn group inline-flex items-center gap-2 text-[10px] tracking-[0.2em] text-white/95 transition-colors hover:text-white"
    >
      {label}
      <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}

type OurStoryPageProps = {
  content: OurStoryContent
}

export function OurStoryPage({ content }: OurStoryPageProps) {
  return (
    <main className="landing-root min-h-screen overflow-x-hidden bg-[#F5EBE0]">
      <SiteHeader
        activeLink="about"
        centerMode="story"
        storyCenterLine1={content.heroTitleLine1}
        storyCenterLine2={content.heroTitleLine2}
      />

      {/* Hero */}
      <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden sm:min-h-[92vh]">
        <div className="absolute inset-0">
          <Image
            src={content.heroImageUrl}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="relative z-10 px-6 text-center text-white">
          <h1 className="landing-display-italic text-[clamp(2.75rem,8vw,5.5rem)] leading-[1.05]">
            {content.heroTitleLine1}
          </h1>
          <p className="landing-display mt-1 text-[clamp(1.75rem,4.5vw,3rem)] leading-[1.1]">
            {content.heroTitleLine2}
          </p>
        </div>
        <TornPaperDivider fill="#A0522D" />
      </section>

      {/* Timeless Craftsmanship */}
      <section className="relative bg-[#A0522D] px-5 py-14 text-white sm:px-8 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[960px] text-center">
          <BotanicalIcon className="mx-auto mb-6 size-10 text-white/80" />
          <p className="landing-display mx-auto max-w-[640px] text-[clamp(1.125rem,2.5vw,1.5rem)] leading-[1.55] text-white/95">
            {content.craftsmanshipIntro}
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-[1fr_auto_1fr] sm:items-start sm:gap-5 lg:gap-8">
            <div className="text-left">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#8B4513]/30">
                <Image
                  src={content.craftsmanshipImages[0].src}
                  alt={content.craftsmanshipImages[0].alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 280px"
                />
              </div>
              {content.craftsmanshipImages[0].caption ? (
                <p className="mt-4 text-[13px] leading-relaxed text-white/85 sm:text-[14px]">
                  {content.craftsmanshipImages[0].caption}
                </p>
              ) : null}
            </div>

            <div className="mx-auto w-full max-w-[200px] sm:max-w-[160px] lg:max-w-[180px]">
              {content.craftsmanshipImages[1].src.endsWith(".png") ? (
                <LeafIllustration />
              ) : (
                <div className="relative aspect-[3/4] overflow-hidden border border-white/35">
                  <Image
                    src={content.craftsmanshipImages[1].src}
                    alt={content.craftsmanshipImages[1].alt}
                    fill
                    className="object-cover"
                    sizes="180px"
                  />
                </div>
              )}
            </div>

            <div className="text-left">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#8B4513]/30 sm:aspect-[3/4]">
                <Image
                  src={content.craftsmanshipImages[2].src}
                  alt={content.craftsmanshipImages[2].alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 280px"
                />
              </div>
              {content.craftsmanshipImages[2].caption ? (
                <p className="mt-4 text-[13px] leading-relaxed text-white/85 sm:text-[14px]">
                  {content.craftsmanshipImages[2].caption}
                </p>
              ) : null}
            </div>
          </div>

          <p className="landing-display-italic mt-14 text-[clamp(1.125rem,2.2vw,1.375rem)] text-white/95">
            {content.craftsmanshipClosing}
          </p>
        </div>
      </section>

      <TornPaperDivider fill="#F5EBE0" />

      {/* Heritage Collection */}
      <section className="bg-[#F5EBE0] px-5 py-14 sm:px-8 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-[960px] gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div className="relative mx-auto aspect-square w-full max-w-[420px] border border-[#C4A882]/60 p-2 lg:mx-0">
            <div className="relative h-full w-full overflow-hidden">
              <Image
                src={content.heritageImageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 420px"
              />
            </div>
          </div>
          <div className="text-center lg:text-left">
            <h2 className="landing-display text-[clamp(1.75rem,3.5vw,2.25rem)] text-[#A0522D]">
              {content.heritageTitle}
            </h2>
            <p className="landing-body mt-5 text-[15px] text-[#5C4332]">{content.heritageBody}</p>
            <div className="mt-8">
              <StoryCta href={content.heritageCtaHref} label={content.heritageCtaLabel} />
            </div>
          </div>
        </div>
      </section>

      {/* Symphony of Skill and Soul */}
      <section className="relative min-h-[420px] overflow-hidden sm:min-h-[480px] lg:min-h-[540px]">
        <div className="absolute top-0 left-0 right-0 z-20">
          <TornPaperDivider fill="#F5EBE0" />
        </div>
        <Image
          src={content.symphonyImageUrl}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/25" />
        <div className="relative z-10 flex min-h-[420px] items-center px-5 py-16 sm:min-h-[480px] sm:px-8 lg:min-h-[540px]">
          <div className="mx-auto w-full max-w-[960px]">
            <h2 className="landing-display max-w-[520px] text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.2] text-white">
              {content.symphonyTitle}
              <span className="landing-display-italic">{content.symphonyTitleAccent}</span>
            </h2>
            <p className="landing-body mt-5 max-w-[440px] text-[15px] text-white/88">
              {content.symphonyBody}
            </p>
            <div className="mt-8">
              <StoryCtaLight href={content.symphonyCtaHref} label={content.symphonyCtaLabel} />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#D4A853] px-5 py-14 text-[#2D1A12] sm:px-8 sm:py-16">
        <div className="mx-auto grid max-w-[960px] gap-10 sm:grid-cols-3 sm:gap-8">
          {content.values.map((value) => (
            <div key={value.title} className="text-center">
              <BotanicalIcon className="mx-auto mb-4 size-9 text-[#5C4332]/70" />
              <h3 className="landing-feature-title text-[#2D1A12]">{value.title}</h3>
              <p className="landing-feature-desc mt-3 text-[13px] leading-relaxed text-[#4A3728]/90">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative">
        <div className="relative h-[320px] sm:h-[380px] lg:h-[420px]">
          <Image
            src={content.footerBackgroundUrl}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>

        <div className="relative bg-[#A0522D] px-5 pb-14 pt-24 text-center text-white sm:px-8 sm:pb-16 sm:pt-28">
          <div className="pointer-events-none absolute -top-16 left-1/2 flex w-full max-w-[520px] -translate-x-1/2 gap-3 px-5 sm:-top-20 sm:gap-4">
            <div className="relative aspect-[4/3] flex-1 overflow-hidden border border-white/25 shadow-lg">
              <Image
                src={content.footerThumbLeftUrl}
                alt=""
                fill
                className="object-cover"
                sizes="240px"
              />
            </div>
            <div className="relative mt-6 aspect-[4/3] flex-1 overflow-hidden border border-white/25 shadow-lg sm:mt-8">
              <Image
                src={content.footerThumbRightUrl}
                alt=""
                fill
                className="object-cover"
                sizes="240px"
              />
            </div>
          </div>

          <p className="landing-display-italic mx-auto max-w-[640px] text-[clamp(1rem,2vw,1.25rem)] leading-[1.6] text-white/95">
            {content.footerText}
          </p>
          <div className="mt-8">
            <StoryCtaLight href={content.footerCtaHref} label={content.footerCtaLabel} />
          </div>
          <BotanicalIcon className="mx-auto mt-10 size-8 text-white/70" />
        </div>
      </section>
    </main>
  )
}
