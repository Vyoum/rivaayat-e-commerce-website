"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    id: 1,
    name: "Ananya Krishnan",
    location: "Bangalore",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
    title: "More Than a Purchase",
    review:
      "I bought the protein ladoos for my mother. When I told her about Kamla Devi's story, she cried. Now she orders every month — not for the taste alone, but to keep that connection alive.",
    product: "Dadi's Protein Ladoo",
  },
  {
    id: 2,
    name: "Rahul Mehta",
    location: "Mumbai",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
    title: "The Calendar That Changed Everything",
    review:
      "I gave the seed calendar to my daughter. Watching her plant each page, seeing marigolds bloom in our balcony — she learned more about life, hope, and perseverance than any textbook could teach.",
    product: "Bloom Calendar 2025",
  },
  {
    id: 3,
    name: "Prerna Sharma",
    location: "Delhi",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
    title: "Wearing Stories",
    review:
      "Every time someone compliments my Kantha necklace, I share the Sisters' story. Three friends have since become customers. This is how change spreads — one story at a time.",
    product: "Kantha Bead Necklace",
  },
  {
    id: 4,
    name: "Dr. Sanjay Rao",
    location: "Chennai",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
    title: "Supporting Heritage",
    review:
      "As someone who grew up in Kumbakonam, the temple brass earrings brought tears to my eyes. The craftsmanship is exactly what I remember from my grandmother's collection. Thank you for preserving this.",
    product: "Temple Brass Earrings",
  },
]

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 text-[200px] font-serif text-primary/5 select-none">&ldquo;</div>
      <div className="absolute bottom-20 right-10 text-[200px] font-serif text-primary/5 select-none rotate-180">
        &ldquo;
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-sans tracking-[0.3em] uppercase text-primary mb-4 block">
            Voices of Our Family
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light leading-tight mb-6">
            Stories From <span className="italic text-primary">Those Who Care</span>
          </h2>
        </div>

        {/* Testimonials */}
        <div className="max-w-4xl mx-auto">
          <div className="relative min-h-[400px]">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={cn(
                  "absolute inset-0 transition-all duration-700",
                  index === activeIndex ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none",
                )}
              >
                <div className="bg-card rounded-2xl p-8 md:p-12 shadow-lg">
                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-saffron text-saffron" />
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-serif mb-4">{testimonial.title}</h3>

                  {/* Review */}
                  <p className="text-lg font-sans text-muted-foreground leading-relaxed mb-8">
                    &ldquo;{testimonial.review}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-serif text-lg">{testimonial.name}</h4>
                        <p className="text-sm font-sans text-muted-foreground">{testimonial.location}</p>
                      </div>
                    </div>
                    <span className="text-sm font-sans text-primary bg-primary/10 px-4 py-2 rounded-full">
                      Purchased: {testimonial.product}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === activeIndex ? "w-8 bg-primary" : "bg-border hover:bg-primary/50",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
