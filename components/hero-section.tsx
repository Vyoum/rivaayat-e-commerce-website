"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDown, Play } from "lucide-react"

const heroSlides = [
  {
    image: "/indian-artisan-hands-creating-traditional-craft-wi.jpg",
    taglineTop: "Traditions Woven",
    taglineBottom: "with Love",
    subtitle: "Every thread carries the warmth of generations. Every weave holds a story of resilience.",
  },
  {
    image: "/realistic-indian-woman-crafting-jewelry.jpg",
    taglineTop: "Heritage Shaped",
    taglineBottom: "by Her Hands",
    subtitle: "Behind every piece is a grandmother's blessing. Behind every bead is a daughter's dream.",
  },
  {
    image: "/indian-grandmother-making-protein-ladoo.jpg",
    taglineTop: "Nourishment Made",
    taglineBottom: "with Blessings",
    subtitle: "Recipes passed through generations. Strength rolled with love in every ladoo.",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000) // Change every 6 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image || "/placeholder.svg"}
              alt="Artisan hands creating traditional craft"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/40" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 opacity-20 animate-float">
        <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
      <div className="absolute bottom-1/4 right-10 w-32 h-32 opacity-10 animate-float" style={{ animationDelay: "1s" }}>
        <svg viewBox="0 0 100 100" className="w-full h-full text-accent">
          <polygon
            points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto text-center px-6">
        <div className="max-w-5xl mx-auto">
          {/* Tagline */}
          <p className="text-sm md:text-base font-sans tracking-[0.3em] uppercase mb-6 animate-fade-in-up text-foreground mt-3.5">
            Where Every Purchase Tells a Story
          </p>

          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-light leading-tight mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <span className="block transition-opacity duration-700">{heroSlides[currentSlide].taglineTop}</span>
            <span className="block text-primary italic transition-opacity duration-700">
              {heroSlides[currentSlide].taglineBottom}
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg md:text-xl lg:text-2xl font-sans text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up font-bold"
            style={{ animationDelay: "0.4s" }}
          >
            <span className="transition-opacity duration-700">{heroSlides[currentSlide].subtitle}</span>
            <span className="text-foreground font-medium"> Welcome to Rivaayat — where craft meets compassion.</span>
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <Button
              size="lg"
              className="text-lg px-10 py-6 font-sans bg-primary hover:bg-primary/90 text-primary-foreground rounded-none"
            >
              Explore Our Stories
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-10 py-6 font-sans rounded-none border-foreground/30 hover:bg-foreground/5 group bg-transparent"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Watch Our Journey
            </Button>
          </div>

          <div className="flex justify-center gap-3 mt-8">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-primary w-8" : "bg-foreground/30 hover:bg-foreground/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-border/30 animate-fade-in-up"
            style={{ animationDelay: "0.8s" }}
          >
            <div className="text-center">
              <span className="block text-4xl md:text-5xl font-serif text-primary">500+</span>
              <span className="block text-sm font-sans text-muted-foreground mt-2 tracking-wide">Artisan Families</span>
            </div>
            <div className="text-center">
              <span className="block text-4xl md:text-5xl font-serif text-primary">12</span>
              <span className="block text-sm font-sans text-muted-foreground mt-2 tracking-wide">Partner NGOs</span>
            </div>
            <div className="text-center">
              <span className="block text-4xl md:text-5xl font-serif text-primary">₹2Cr+</span>
              <span className="block text-sm font-sans text-muted-foreground mt-2 tracking-wide">Lives Touched</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs font-sans tracking-wider text-muted-foreground">Scroll to Discover</span>
        <ArrowDown className="w-5 h-5 text-muted-foreground" />
      </div>
    </section>
  )
}
