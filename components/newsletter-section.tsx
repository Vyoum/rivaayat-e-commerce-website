"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Heart } from "lucide-react"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
    }
  }

  return (
    <section className="py-24 md:py-32 bg-primary relative overflow-hidden">
      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill="currentColor" />
          </pattern>
          <rect x="0" y="0" width="100" height="100" fill="url(#pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-primary-foreground/10 flex items-center justify-center mx-auto mb-8">
            <Heart className="w-8 h-8 text-primary-foreground" />
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light leading-tight mb-6 text-primary-foreground">
            Join Our <span className="italic">परिवार</span>
          </h2>
          <p className="text-lg md:text-xl font-sans text-primary-foreground/80 leading-relaxed mb-10">
            Receive stories of hope, artisan updates, and early access to new collections. Every email is a window into
            the lives you&apos;re helping transform.
          </p>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 rounded-none h-14 text-lg font-sans"
                required
              />
              <Button
                type="submit"
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-none h-14 px-8 font-sans"
              >
                Subscribe
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </form>
          ) : (
            <div className="bg-primary-foreground/10 rounded-lg p-8 max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-full bg-sage flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-primary-foreground fill-primary-foreground" />
              </div>
              <h3 className="text-2xl font-serif text-primary-foreground mb-2">Welcome to the family! 🙏</h3>
              <p className="text-primary-foreground/80 font-sans">
                Your first story is on its way. Thank you for caring.
              </p>
            </div>
          )}

          <p className="text-sm font-sans text-primary-foreground/60 mt-6">
            We respect your inbox. Only meaningful stories, never spam.
          </p>
        </div>
      </div>
    </section>
  )
}
