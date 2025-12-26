import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ClothingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="relative overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0">
          <img
            src="/indian-artisan-woman-weaving-traditional-handloom-.jpg"
            alt="Handwoven clothing on traditional loom"
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-background/95" />
        </div>

        <div className="container relative z-10 mx-auto px-6">
          <div className="max-w-4xl">
            <span className="text-sm font-sans tracking-[0.3em] uppercase text-primary">Clothing Collection</span>
            <h1 className="mt-4 text-4xl font-serif font-light text-foreground sm:text-5xl lg:text-6xl">
              Handwoven Clothing – Threads of Tradition
            </h1>
            <p className="mt-6 text-lg font-sans text-muted-foreground leading-relaxed">
              Fabrics woven on ancient looms by skilled hands that have mastered the art over generations. Each garment
              carries the warmth of its maker&apos;s soul.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-serif text-3xl">Clothing Highlights</CardTitle>
              <CardDescription className="font-sans text-base text-muted-foreground">
                Handwoven textiles crafted with heritage techniques and thoughtful design.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {["Handwoven", "Heritage looms", "Artisan made", "Natural textures"].map((item) => (
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
