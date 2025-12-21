"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { cn } from "@/lib/utils"

const artisans = [
  {
    id: 1,
    name: "Kamla Devi",
    age: 67,
    craft: "Protein Ladoo Maker",
    location: "Udaipur, Rajasthan",
    ngo: "Seva Kutir Foundation",
    image: "/elderly-indian-woman-in-traditional-orange-sari-sm.jpg",
    quote:
      "After my husband passed, I thought my life was over. Then Rivaayat came. Now, 43 women learn these recipes from me. My grandmother's legacy lives on.",
    story:
      "Kamla ji lost everything in a flood — her home, her savings, her hope. At 60, she joined Seva Kutir's livelihood program. Today, she trains younger women in traditional recipes, transforming grief into generosity.",
    years: "7 years with Rivaayat",
  },
  {
    id: 2,
    name: "Priya & The Sisters",
    age: null,
    craft: "Kantha Jewelry Artisans",
    location: "Kolkata, West Bengal",
    ngo: "Apne Aap Women Worldwide",
    image: "/group-of-young-indian-women-working-together-on-be.jpg",
    quote:
      "These hands knew darkness. Now they create light. Every bead I string is a prayer for girls who are still waiting to be found.",
    story:
      "The Sisters Collective comprises 28 trafficking survivors. Through jewelry-making, they've rebuilt their lives, funded their education, and now mentor newly rescued girls. Their creations carry profound meaning.",
    years: "4 years with Rivaayat",
  },
  {
    id: 3,
    name: "Rajan Murugan",
    age: 52,
    craft: "Temple Brass Artisan",
    location: "Kumbakonam, Tamil Nadu",
    ngo: "Craft Revival Trust",
    image: "/indian-craftsman-working-on-brass-metalwork--focus.jpg",
    quote:
      "My great-great-grandfather made jewelry for the Brihadeeswara Temple. I am the fifth generation. This art must not die with me.",
    story:
      "The Murugan family has crafted brass for 200 years. When cheap imports threatened their livelihood, Rivaayat stepped in. Now, Rajan's sons are learning the craft, ensuring it survives another century.",
    years: "5 years with Rivaayat",
  },
  {
    id: 4,
    name: "Lakshmi Collective",
    age: null,
    craft: "Seed Calendar Creators",
    location: "Mumbai, Maharashtra",
    ngo: "National Association for the Blind",
    image: "/placeholder.svg?height=800&width=600",
    quote:
      "I cannot see the flowers that will bloom from my calendars. But I can feel them — in my heart, in my hope, in every seed I press.",
    story:
      "These extraordinary artisans create beauty they cannot see. Each calendar is made with meticulous care, pressing seeds into handmade paper. When customers send photos of blooming gardens, the joy is indescribable.",
    years: "3 years with Rivaayat",
  },
]

export function ArtisanStories() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextArtisan = () => {
    setCurrentIndex((prev) => (prev + 1) % artisans.length)
  }

  const prevArtisan = () => {
    setCurrentIndex((prev) => (prev - 1 + artisans.length) % artisans.length)
  }

  const currentArtisan = artisans[currentIndex]

  return (
    <section id="artisans" className="py-24 md:py-32 bg-card relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-sans tracking-[0.3em] uppercase text-primary mb-4 block">
            The Hands Behind The Craft
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light leading-tight mb-6">
            Stories of <span className="italic text-primary">Resilience</span>
          </h2>
          <p className="text-lg font-sans text-muted-foreground leading-relaxed">
            Meet the artisans who pour their hearts into every creation. Their journeys are ones of struggle, survival,
            and extraordinary strength.
          </p>
        </div>

        {/* Artisan Showcase */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
              <img
                src={currentArtisan.image || "/placeholder.svg"}
                alt={currentArtisan.name}
                className="w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
            </div>

            {/* Floating Info Card */}
            <div className="absolute -bottom-6 -right-6 md:right-8 bg-background p-6 rounded-lg shadow-xl max-w-xs">
              <span className="text-xs font-sans tracking-wider uppercase text-primary">{currentArtisan.years}</span>
              <h4 className="text-lg font-serif mt-1">{currentArtisan.name}</h4>
              <p className="text-sm font-sans text-muted-foreground">{currentArtisan.location}</p>
            </div>
          </div>

          {/* Content */}
          <div className="lg:pl-8">
            <div className="mb-6">
              <span className="text-xs font-sans tracking-wider uppercase text-muted-foreground">
                {currentArtisan.craft}
              </span>
              <h3 className="text-3xl md:text-4xl font-serif mt-2">
                {currentArtisan.name}
                {currentArtisan.age && <span className="text-muted-foreground">, {currentArtisan.age}</span>}
              </h3>
              <p className="text-sm font-sans text-primary mt-1">Partner: {currentArtisan.ngo}</p>
            </div>

            {/* Quote */}
            <div className="relative mb-8">
              <Quote className="absolute -top-4 -left-4 w-10 h-10 text-primary/20" />
              <blockquote className="text-xl md:text-2xl font-serif italic text-foreground leading-relaxed pl-6 border-l-2 border-primary">
                {currentArtisan.quote}
              </blockquote>
            </div>

            {/* Story */}
            <p className="text-lg font-sans text-muted-foreground leading-relaxed mb-8">{currentArtisan.story}</p>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {artisans.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      index === currentIndex ? "w-8 bg-primary" : "bg-border hover:bg-primary/50",
                    )}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={prevArtisan} className="rounded-full bg-transparent">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextArtisan} className="rounded-full bg-transparent">
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
