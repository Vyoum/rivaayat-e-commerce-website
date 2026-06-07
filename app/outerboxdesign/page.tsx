import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function OurStoryPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="relative overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0">
          <img
            src="/group-of-smiling-indian-women-artisans-in-colorful.jpg"
            alt="Artisans and makers behind Rivaayat"
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-background/95" />
        </div>

        <div className="container relative z-10 mx-auto px-6">
          <div className="max-w-4xl">
            <span className="text-sm font-sans tracking-[0.3em] uppercase text-primary">Our Story</span>
            <h1 className="mt-4 text-4xl font-serif font-light text-foreground sm:text-5xl lg:text-6xl">
              Our Story - From Craft to Collection
            </h1>
            <p className="mt-6 text-lg font-sans text-muted-foreground leading-relaxed">
              Rivaayat started with a simple idea: to keep the beauty of handmade Indian crafts alive in a world that
              moves fast. The founders saw how traditional skills, passed down through generations, were becoming
              invisible in mass-produced markets.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="space-y-2">
              <CardTitle className="font-serif text-3xl">From Craft to Collection</CardTitle>
              <CardDescription className="font-sans text-base text-muted-foreground">
                Bringing artisanal clothing, decor, jewellery, and food to people who value authenticity and style.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 text-lg font-sans text-muted-foreground leading-relaxed">
                <p>
                  Rivaayat exists to bridge that gap -- bringing artisanal clothing, decor, jewellery, and food to
                  people who value authenticity and style.
                </p>
                <p>
                  Every item is either handmade or carefully curated to reflect thoughtful design. Rivaayat is as much
                  about the people behind the products -- the artisans, makers, and small-scale creators -- as it is
                  about the customers who choose to wear, use, and gift these pieces.
                </p>
                <p className="border-l-2 border-primary/40 pl-4 text-foreground font-medium italic">
                  When you shop from Rivaayat, you are not just buying something beautiful; you are supporting stories,
                  livelihoods, and a culture of mindful consumption.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
