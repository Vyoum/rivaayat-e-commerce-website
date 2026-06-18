"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, Play } from "lucide-react"
import type { HeroCopy, HeroSlide } from "@/lib/hero-slides-shared"
import { DEFAULT_HERO_COPY, DEFAULT_HERO_SLIDES } from "@/lib/hero-slides-shared"

function TornPaperEdge() {
  return (
    <div className="absolute -bottom-px left-0 right-0 z-20 h-10 sm:h-12">
      <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
        <path
          d="M0,24 C180,38 360,12 540,22 C720,32 900,10 1080,22 C1260,34 1350,18 1440,26 L1440,48 L0,48 Z"
          fill="#f0e4d4"
        />
      </svg>
    </div>
  )
}

type LandingHeroProps = {
  slides?: HeroSlide[]
  copy?: HeroCopy
}

export function LandingHero({ slides: initialSlides, copy: initialCopy }: LandingHeroProps) {
  const slides =
    initialSlides && initialSlides.length > 0 ? initialSlides : DEFAULT_HERO_SLIDES
  const copy = initialCopy ?? DEFAULT_HERO_COPY
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [slides.length])

  useEffect(() => {
    setCurrentSlide(0)
  }, [slides])

  return (
    <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden sm:min-h-[92vh]">
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {slide.mediaType === "video" ? (
              <video
                src={slide.imageUrl}
                autoPlay
                muted
                loop
                playsInline
                className="size-full object-cover object-center brightness-[0.92] saturate-[1.05]"
              />
            ) : (
              <Image
                src={slide.imageUrl}
                alt={slide.alt}
                fill
                className="object-cover object-center brightness-[0.92] saturate-[1.05]"
                priority={index === 0}
                sizes="100vw"
              />
            )}
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/45" />
      </div>

      <div className="relative z-10 mx-auto max-w-[640px] px-5 pb-24 pt-28 text-center sm:pt-32">
        <p className="landing-label text-[10px] text-white/88">{copy.tagline}</p>

        <h1 className="mt-5">
          <span className="landing-display block text-[34px] leading-[1.1] text-white sm:text-[42px] lg:text-[50px]">
            {copy.titleLine1}
          </span>
          <span className="landing-display-italic mt-1 block text-[34px] leading-[1.1] text-[#E8D0BC] sm:text-[42px] lg:text-[50px]">
            {copy.titleLine2}
          </span>
        </h1>

        <p
          className="landing-body mx-auto mt-5 max-w-[420px] text-[15px] leading-[1.7]"
          style={{ color: "#FF0000" }}
        >
          {copy.subtitle}
        </p>

        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-3.5">
          <Link
            href="/collections"
            className="landing-btn inline-flex h-9 min-w-[168px] items-center justify-center bg-[#B85A32] px-6 text-white transition-colors hover:bg-[#A04E2A]"
          >
            Explore Collections
          </Link>
          <Link
            href="/outerboxdesign"
            className="landing-btn inline-flex h-9 min-w-[168px] items-center justify-center gap-2 border border-white/75 bg-white/5 px-6 text-white backdrop-blur-[2px] transition-colors hover:bg-white/12"
          >
            <Play className="size-2.5 fill-white text-white" />
            Our Story
          </Link>
        </div>

        {slides.length > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "w-6 bg-white/90"
                    : "w-1.5 bg-white/35 hover:bg-white/55"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="absolute bottom-16 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 sm:bottom-20">
        <span className="landing-label text-[9px] text-white/60">Scroll to Explore</span>
        <ChevronDown className="size-3.5 text-white/60 animate-bounce" strokeWidth={1.5} />
      </div>

      <TornPaperEdge />
    </section>
  )
}
