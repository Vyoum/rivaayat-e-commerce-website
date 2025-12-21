"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDown, Play } from "lucide-react"

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/indian-artisan-hands-creating-traditional-craft-wi.jpg"
          alt="Artisan hands creating traditional craft"
          className="w-full h-full object-cover"
        />
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

          {/* Main Headline */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-light leading-tight mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <span className="block">Traditions Woven</span>
            <span className="block text-primary italic">with Love</span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg md:text-xl lg:text-2xl font-sans text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up font-bold"
            style={{ animationDelay: "0.4s" }}
          >
            Behind every ladoo is a grandmother&apos;s blessing. Behind every bead is a daughter&apos;s dream.
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

          {/* Stats */}
          <div
            className="grid grid-cols-3 gap-8 mt-20 pt-12 border-t border-border/30 animate-fade-in-up"
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
