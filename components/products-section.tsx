"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const collections = [
  {
    id: 1,
    title: "Custom Food",
    subtitle: "नीरोग",
    tagline: "Tasteful, Thoughtful, Handmade",
    description:
      "Nourish your body with custom protein bars, traditional ladoos, and artisan achaars.",
    highlight: "Craft Your Own Ladoo",
    image: "/indian-woman-making-traditional-ladoo-sweets-warm-.jpg",
    accent: "from-amber-900/80",
    products: 8,
    artisans: 24,
    cta: "Explore Custom Food",
    href: "/custom-laddoos",
  },
  {
    id: 2,
    title: "Handwoven Clothing",
    subtitle: "वस्त्र",
    tagline: "Threads of Tradition",
    description:
      "Fabrics woven on ancient looms by skilled hands that have mastered the art over generations. Each garment carries the warmth of its maker's soul.",
    highlight: null,
    image: "/indian-artisan-woman-weaving-traditional-handloom-.jpg",
    accent: "from-indigo-900/80",
    products: 12,
    artisans: 32,
    cta: "Explore Clothing",
  },
  {
    id: 3,
    title: "Jewellery",
    subtitle: "आभूषण",
    tagline: "Curated Treasures",
    description: "Discover unique pieces from skilled artisans across Jaipur and beyond.",
    highlight: null,
    image: "/indian-artisan-hands-crafting-traditional-jewelry-.jpg",
    accent: "from-rose-900/80",
    products: 15,
    artisans: 38,
    cta: "Explore Jewellery",
    href: "/jewellery",
  },
  {
    id: 4,
    title: "Décor",
    subtitle: "विरासत",
    tagline: "Lippan & Pichvai Art",
    description:
      "Transform your space with mirrors, frames, and vessels that reflect India's artistic heritage.",
    highlight: null,
    image: "/indian-brass-craftsman-working-traditional-temple-.jpg",
    accent: "from-orange-900/80",
    products: 10,
    artisans: 18,
    cta: "Explore Décor",
    href: "/decor",
  },
]

export function ProductsSection() {
  const [hoveredCollection, setHoveredCollection] = useState<number | null>(null)

  return (
    <section id="products" className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <span className="text-sm font-sans tracking-[0.3em] uppercase text-primary mb-4 block">Our Collections</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light leading-tight mb-6">
            Four Stories, <span className="italic text-primary">One Vision</span>
          </h2>
          <p className="text-lg md:text-xl font-sans text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Each collection is a chapter in our shared story — of hands that create, hearts that heal, and communities
            that rise. Which story will you be part of?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {collections.map((collection, index) => (
            <div
              key={collection.id}
              className="group relative h-[500px] md:h-[550px] rounded-2xl overflow-hidden cursor-pointer"
              onMouseEnter={() => setHoveredCollection(collection.id)}
              onMouseLeave={() => setHoveredCollection(null)}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={collection.image || "/placeholder.svg"}
                  alt={collection.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>

              {/* Gradient Overlay */}
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-t via-foreground/40 to-transparent transition-opacity duration-500",
                  collection.accent,
                  hoveredCollection === collection.id ? "opacity-90" : "opacity-70",
                )}
              />

              {/* Content */}
              <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end">
                {/* Hindi subtitle floating at top */}
                <span
                  className={cn(
                    "absolute top-8 right-8 text-6xl md:text-7xl font-serif text-white/10 transition-all duration-700",
                    hoveredCollection === collection.id ? "opacity-30 scale-110" : "opacity-20",
                  )}
                >
                  {collection.subtitle}
                </span>

                {/* Collection Number */}
                <span className="text-white/50 font-sans text-sm tracking-widest mb-4">0{index + 1} / 04</span>

                {/* Title */}
                <h3 className="text-3xl md:text-4xl font-serif text-white mb-2 transition-transform duration-500 group-hover:-translate-y-2">
                  {collection.title}
                </h3>

                {/* Tagline */}
                <p className="text-white/80 font-serif italic text-lg mb-4">{collection.tagline}</p>

                {/* Highlight Badge */}
                {collection.highlight && (
                  <span className="inline-block mb-4 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-sans tracking-wide border border-white/30">
                    ✦ {collection.highlight}
                  </span>
                )}

                {/* Description - appears on hover */}
                <p
                  className={cn(
                    "text-white/70 font-sans text-sm md:text-base leading-relaxed max-w-md transition-all duration-500",
                    hoveredCollection === collection.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                  )}
                >
                  {collection.description}
                </p>

                {/* Stats */}
                <div
                  className={cn(
                    "flex items-center gap-6 mt-6 transition-all duration-500 delay-100",
                    hoveredCollection === collection.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                  )}
                >
                  <div className="text-center">
                    <span className="block text-2xl font-serif text-white">{collection.products}</span>
                    <span className="text-xs font-sans text-white/60 uppercase tracking-wider">Products</span>
                  </div>
                  <div className="w-px h-10 bg-white/30" />
                  <div className="text-center">
                    <span className="block text-2xl font-serif text-white">{collection.artisans}</span>
                    <span className="text-xs font-sans text-white/60 uppercase tracking-wider">Artisans</span>
                  </div>
                </div>

              </div>

              {/* Decorative corner accent */}
              <div
                className={cn(
                  "absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-white/20 transition-all duration-500 m-6",
                  hoveredCollection === collection.id ? "scale-100 opacity-100" : "scale-75 opacity-0",
                )}
              />
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <blockquote className="text-xl md:text-2xl font-serif italic text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            "When you choose a collection, you don&apos;t just buy a product —<br />
            <span className="text-foreground">you become part of someone&apos;s story.</span>"
          </blockquote>
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-10 py-6 font-sans text-lg border-foreground/30 hover:bg-foreground/5 bg-transparent"
          >
            View All Products
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
