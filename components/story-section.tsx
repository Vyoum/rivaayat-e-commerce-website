"use client"

import { useEffect, useRef } from "react"

export function StorySection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = sectionRef.current?.querySelectorAll(".reveal")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="our-story" className="py-24 md:py-32 bg-card relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Grid */}
          <div className="reveal grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                <img
                  src="/elderly-indian-woman-in-traditional-sari-making-la.jpg"
                  alt="Artisan making traditional ladoos"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <img
                  src="/close-up-of-hands-stringing-colorful-beads-for-tra.jpg"
                  alt="Crafting traditional jewelry"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <img
                  src="/seed-packet-with-marigold-and-tulsi-seeds--traditi.jpg"
                  alt="Seed calendar collection"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                <img
                  src="/group-of-smiling-indian-women-artisans-in-colorful.jpg"
                  alt="Community of artisans"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="reveal" style={{ transitionDelay: "0.2s" }}>
            <span className="text-sm font-sans tracking-[0.3em] uppercase text-primary mb-4 block">Our Beginning</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light leading-tight mb-8">
              रिवायत — <br />
              <span className="italic text-primary">A Heritage of Hope</span>
            </h2>
            <div className="space-y-6 text-lg font-sans text-muted-foreground leading-relaxed">
              <p>
                In the narrow lanes of Jaipur, where sunlight filters through hand-block printed curtains, we found our
                calling. A grandmother stirring ghee-laden ladoos. A young girl threading dreams into necklaces. A
                farmer pressing seeds into paper, planting futures.
              </p>
              <p className="text-foreground font-medium text-xl italic border-l-4 border-primary pl-6">
                &quot;Each product carries the warmth of hands that have known struggle, and the hope of hearts that
                refuse to give up.&quot;
              </p>
              <p>
                Rivaayat was born not in boardrooms, but in kitchens and courtyards — where India&apos;s true wealth
                resides. We partner with NGOs across 12 states, bringing you treasures made with dignity, love, and an
                unbreakable spirit.
              </p>
            </div>
            <div className="mt-10 flex items-center gap-6">
              <div className="w-16 h-[1px] bg-primary" />
              <span className="font-serif text-lg italic text-muted-foreground">Founded 2019 · Jaipur, Rajasthan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
