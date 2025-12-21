"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

const impactStats = [
  { number: 12847, suffix: "+", label: "Lives Transformed", description: "Families who found dignity through craft" },
  { number: 500, suffix: "+", label: "Artisan Partners", description: "Skilled hands creating with purpose" },
  { number: 12, suffix: "", label: "NGO Partnerships", description: "Grassroots organizations we empower" },
  { number: 28, suffix: "", label: "States Reached", description: "Communities across India touched" },
]

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          const duration = 2000
          const steps = 60
          const increment = target / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.5 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [target, hasAnimated])

  return (
    <span ref={ref} className="text-5xl md:text-6xl lg:text-7xl font-serif text-primary">
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export function ImpactSection() {
  return (
    <section id="impact" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src="/aerial-view-of-colorful-indian-village-with-artisa.jpg" alt="Community of artisans" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/85" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-sm font-sans tracking-[0.3em] uppercase text-primary mb-4 block">Our Impact</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light leading-tight mb-8 text-background">
            Numbers That <span className="italic">Breathe</span>
          </h2>
          <p className="text-lg font-sans text-background/80 leading-relaxed">
            Behind every statistic is a story. A child who went to school because her mother found work. A tradition
            that didn&apos;t die because someone cared. A dream that found wings.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impactStats.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                "text-center p-8 rounded-lg transition-all duration-500",
                "bg-background/5 backdrop-blur-sm hover:bg-background/10",
                "border border-background/10",
              )}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <AnimatedCounter target={stat.number} suffix={stat.suffix} />
              <h3 className="text-xl font-serif text-background mt-4 mb-2">{stat.label}</h3>
              <p className="text-sm font-sans text-background/60">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Emotional Quote */}
        <div className="mt-20 max-w-4xl mx-auto text-center">
          <svg className="w-12 h-12 text-primary mx-auto mb-6 opacity-50" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-serif italic text-background leading-relaxed mb-8">
            When you buy from Rivaayat, you don&apos;t just receive a product. You receive a piece of someone&apos;s
            healing, a fragment of their hope, and the silent thank you of hands that found purpose again.
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-[1px] bg-background/30" />
            <span className="text-sm font-sans text-background/60 tracking-wider uppercase">Meera Sharma, Founder</span>
            <div className="w-16 h-[1px] bg-background/30" />
          </div>
        </div>
      </div>
    </section>
  )
}
