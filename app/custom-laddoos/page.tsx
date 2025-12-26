"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight } from "lucide-react"

const baseOptions = [
  { id: "base-wheat", label: "Wheat" },
  { id: "base-ragi", label: "Ragi" },
  { id: "base-oats", label: "Oats" },
  { id: "base-besan", label: "Besan (Chana dal)" },
  { id: "base-multigrain", label: "Multigrain blend" },
]

const fillingOptions = [
  { id: "fill-almonds", label: "Almonds" },
  { id: "fill-cashews", label: "Cashews" },
  { id: "fill-raisins", label: "Raisins (Kishmish)" },
  { id: "fill-dates", label: "Dates" },
  { id: "fill-seeds", label: "Seeds mix (pumpkin, sunflower, flax)" },
]

const nutrientOptions = [
  { id: "nutrient-protein", label: "Protein" },
  { id: "nutrient-fats", label: "Healthy fats" },
  { id: "nutrient-fiber", label: "Fiber" },
  { id: "nutrient-magnesium", label: "Magnesium" },
  { id: "nutrient-iron", label: "Iron" },
  { id: "nutrient-calcium", label: "Calcium" },
  { id: "nutrient-omega", label: "Omega-3" },
]

const purposeOptions = [
  { id: "goal-weight-gain", title: "Weight Gain", description: "High-protein and healthy fats" },
  { id: "goal-fitness", title: "Weight Loss / Fitness", description: "Low sugar, high fiber" },
  { id: "goal-focus", title: "Memory & Focus", description: "Nut and seed rich" },
  { id: "goal-comfort", title: "Taste & Comfort", description: "Traditional, ghar-jaisa swaad" },
]

const tasteOptions = [
  { id: "taste-less-sweet", label: "Less sweet" },
  { id: "taste-extra-ghee", label: "Extra ghee" },
  { id: "taste-nutty", label: "Nutty" },
  { id: "taste-vegan", label: "Vegan-friendly" },
]

const emotionalTaglines = [
  "Ghar ka swaad, aapke hisaab se",
  "Har laddoo mein apnapan",
  "College mein bhi maa ke haath ka laddoo",
  "Customize kiya hua pyaar",
]

export default function CustomLaddoosPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="relative overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0">
          <img
            src="/elderly-indian-grandmother-making-ladoo-golden-hour.jpg"
            alt="Homemade laddoos being prepared"
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-background/95" />
        </div>

        <div className="container relative z-10 mx-auto px-6">
          <div className="max-w-4xl">
            <span className="text-sm font-sans tracking-[0.3em] uppercase text-primary">Rivaayat Customizable Laddoos</span>
            <h1 className="mt-4 text-4xl font-serif font-light text-foreground sm:text-5xl lg:text-6xl">
              Ghar ka Swaad, Aapke Hisaab Se
            </h1>
            <p className="mt-6 text-lg font-sans text-muted-foreground leading-relaxed">
              At Rivaayat, laddoos are more than sweets -- they are homemade comfort, nutrition, and emotion rolled
              together. Freshly prepared, preservative-free, and fully customizable, our laddoos are made to suit your
              body, lifestyle, and taste.
            </p>
            <blockquote className="mt-8 border-l-2 border-primary/40 pl-4 text-xl font-serif italic text-foreground/80">
              "Har laddoo sirf mithai nahi -- ek yaad hota hai."
            </blockquote>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6">
          <Card className="border-border/50 bg-card/70 backdrop-blur-sm">
            <CardHeader className="space-y-3">
              <CardTitle className="font-serif text-3xl">Fully Customizable -- Because Everyone Is Different</CardTitle>
              <CardDescription className="font-sans text-base text-muted-foreground">
                Aap batayein, hum banaayenge.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <ul className="space-y-3 font-sans text-base text-foreground/90">
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-accent" />
                  Ingredient allergies or restrictions
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-accent" />
                  Ingredients you want more or less of
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-accent" />
                  Taste preference (less sweet, extra ghee, nutty, vegan-friendly)
                </li>
              </ul>
              <ul className="space-y-3 font-sans text-base text-foreground/90">
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-accent" />
                  Your goal -- fitness, health, or comfort
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-accent" />
                  Freshly prepared, preservative-free, small-batch goodness
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-accent" />
                  Crafted by women homemakers with care and tradition
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="build-your-laddoo" className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="space-y-2">
                <CardTitle className="font-serif text-3xl">Build Your Own Laddoo</CardTitle>
                <CardDescription className="font-sans text-base text-muted-foreground">
                  You share your requirement, the idea will be discussed first, and laddoos will be prepared fresh.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <p className="text-sm font-sans tracking-[0.3em] uppercase text-primary">Different Bases</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {baseOptions.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/60 p-3 transition-colors hover:border-primary/40"
                      >
                        <Checkbox id={option.id} />
                        <Label htmlFor={option.id} className="cursor-pointer font-sans text-sm text-foreground">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-sans tracking-[0.3em] uppercase text-primary">Different Fillings</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {fillingOptions.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/60 p-3 transition-colors hover:border-primary/40"
                      >
                        <Checkbox id={option.id} />
                        <Label htmlFor={option.id} className="cursor-pointer font-sans text-sm text-foreground">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-sans tracking-[0.3em] uppercase text-primary">
                    Different Nutrients (As Per Requirement)
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {nutrientOptions.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/60 p-3 transition-colors hover:border-primary/40"
                      >
                        <Checkbox id={option.id} />
                        <Label htmlFor={option.id} className="cursor-pointer font-sans text-sm text-foreground">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-sans tracking-[0.3em] uppercase text-primary">Taste Preferences</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {tasteOptions.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/60 p-3 transition-colors hover:border-primary/40"
                      >
                        <Checkbox id={option.id} />
                        <Label htmlFor={option.id} className="cursor-pointer font-sans text-sm text-foreground">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-sans tracking-[0.3em] uppercase text-primary">Your Goal</p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {purposeOptions.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-start gap-3 rounded-lg border border-border/50 bg-background/60 p-4 transition-colors hover:border-primary/40"
                      >
                        <Checkbox id={option.id} />
                        <Label htmlFor={option.id} className="cursor-pointer">
                          <span className="block font-sans text-sm font-semibold text-foreground">{option.title}</span>
                          <span className="block font-sans text-xs text-muted-foreground">{option.description}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="allergies" className="font-sans text-sm font-medium">
                      Ingredient allergies or restrictions
                    </Label>
                    <Input id="allergies" placeholder="e.g., no nuts, lactose-free" className="font-sans h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="more-less" className="font-sans text-sm font-medium">
                      Ingredients you want more or less of
                    </Label>
                    <Input id="more-less" placeholder="e.g., extra dates, less jaggery" className="font-sans h-11" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="font-sans text-sm font-medium">
                    Tell us your requirement
                  </Label>
                  <textarea
                    id="notes"
                    placeholder="Share your taste, nutrition goals, and any special requests"
                    className="min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm font-sans text-foreground shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  />
                </div>

                <Button size="lg" className="w-full font-sans text-base group">
                  Send My Laddoo Request
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Laddoos for Every Purpose</CardTitle>
                  <CardDescription className="font-sans text-base text-muted-foreground">
                    Har goal ka apna laddoo hota hai.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {purposeOptions.map((option) => (
                    <div key={option.id} className="rounded-lg border border-border/40 bg-background/70 p-4">
                      <p className="font-serif text-lg text-foreground">{option.title}</p>
                      <p className="font-sans text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Why Rivaayat Laddoos?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 font-sans text-sm text-foreground/90">
                  {[
                    "Homemade and small-batch",
                    "Allergy-friendly options",
                    "Made by women home-makers",
                    "Packed with care and handwritten notes",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-accent" />
                      {item}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">Special for College Students</h2>
              <p className="font-sans text-lg text-muted-foreground leading-relaxed">
                Living away from home? Rivaayat brings "College mein Ghar ka Swaad".
              </p>
              <div className="space-y-3 font-sans text-base text-foreground/90">
                {[
                  "Homemade laddoos for hostel and PG students",
                  "Nutritious, filling, and pocket-friendly",
                  "Perfect for exams, late nights, and homesick days",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-accent" />
                    {item}
                  </div>
                ))}
              </div>
              <blockquote className="border-l-2 border-primary/40 pl-4 font-serif italic text-foreground/80">
                "Hostel ke kamre mein bhi maa ke haath ka swaad."
              </blockquote>
            </div>

            <Card className="border-border/50 bg-card/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-serif text-2xl">Emotional Taglines</CardTitle>
                <CardDescription className="font-sans text-base text-muted-foreground">
                  Rivaayat -- kyunki parampara sirf sambhali nahi jaati, jee jaati hai.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {emotionalTaglines.map((tagline) => (
                    <span
                      key={tagline}
                      className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-sans text-foreground"
                    >
                      {tagline}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
