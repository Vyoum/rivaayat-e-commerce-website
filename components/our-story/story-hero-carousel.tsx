"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

import type { StoryHeroSlide } from "@/lib/our-story-content-shared"
import { cn } from "@/lib/utils"

type StoryHeroCarouselProps = {
  slides: StoryHeroSlide[]
  priority?: boolean
  className?: string
  imageAlt?: string
  imageSizes?: string
}

export function StoryHeroCarousel({
  slides,
  priority = false,
  className,
  imageAlt = "Our Story hero",
  imageSizes = "100vw",
}: StoryHeroCarouselProps) {
  const activeSlides = slides.filter((slide) => slide.isActive && slide.imageUrl.trim())
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    setCurrentSlide(0)
  }, [slides])

  useEffect(() => {
    if (activeSlides.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [activeSlides.length])

  if (activeSlides.length === 0) return null

  return (
    <div
      className={cn(
        "relative min-h-[360px] overflow-hidden sm:min-h-[420px] lg:min-h-[480px]",
        className,
      )}
    >
      {activeSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-[1500ms] ease-in-out",
            index === currentSlide ? "opacity-100" : "opacity-0",
          )}
        >
          {slide.mediaType === "video" ? (
            <video
              src={slide.imageUrl}
              autoPlay
              muted
              loop
              playsInline
              className="size-full object-cover"
            />
          ) : (
            <Image
              src={slide.imageUrl}
              alt={slide.alt || imageAlt}
              fill
              className="object-cover"
              sizes={imageSizes}
              priority={priority && index === 0}
            />
          )}
        </div>
      ))}

      {activeSlides.length > 1 ? (
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {activeSlides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to hero slide ${index + 1}`}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === currentSlide
                  ? "w-6 bg-white/90"
                  : "w-1.5 bg-white/40 hover:bg-white/60",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
