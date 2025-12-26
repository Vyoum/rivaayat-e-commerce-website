import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DecorPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="relative overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0">
          <img
            src="/indian-brass-craftsman-working-traditional-temple-.jpg"
            alt="Traditional décor craftsmanship"
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-background/95" />
        </div>

        <div className="container relative z-10 mx-auto px-6">
          <div className="max-w-4xl">
            <span className="text-sm font-sans tracking-[0.3em] uppercase text-primary">Décor Collection</span>
            <h1 className="mt-4 text-4xl font-serif font-light text-foreground sm:text-5xl lg:text-6xl">
              Décor – Lippan & Pichvai Art
            </h1>
            <p className="mt-6 text-lg font-sans text-muted-foreground leading-relaxed">
              Transform your space with mirrors, frames, and vessels that reflect India&apos;s artistic heritage.
            </p>
            <Button asChild size="lg" className="mt-8 font-sans text-base group">
              <Link href="#decor-highlights">
                Explore Décor
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="decor-highlights" className="py-12 md:py-16">
        <div className="container mx-auto px-6">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-serif text-3xl">Décor Highlights</CardTitle>
              <CardDescription className="font-sans text-base text-muted-foreground">
                Mirrors, frames, and vessels that reflect India&apos;s artistic heritage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {["Mirrors", "Frames", "Vessels", "Lippan", "Pichvai"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-sans text-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  )
}
