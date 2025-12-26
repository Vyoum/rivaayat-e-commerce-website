import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const tipOptions = ["Add ₹50", "Add ₹100", "Add ₹150"]

export default function CartPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="relative overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0">
          <img
            src="/group-of-smiling-indian-women-artisans-in-colorful.jpg"
            alt="Artisans behind Rivaayat"
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-background/95" />
        </div>

        <div className="container relative z-10 mx-auto px-6">
          <div className="grid gap-10 lg:grid-cols-[2fr_1fr] items-start">
            <div>
              <span className="text-sm font-sans tracking-[0.3em] uppercase text-primary">Cart</span>
              <h1 className="mt-4 text-4xl font-serif font-light text-foreground sm:text-5xl lg:text-6xl">
                Your Cart – Ready to Be Crafted Yours
              </h1>
              <Card className="mt-8 border-border/50 bg-card/80 backdrop-blur-sm">
                <CardContent className="space-y-6 p-8">
                  <p className="text-lg font-sans text-muted-foreground leading-relaxed">
                    These are the pieces you have chosen to be part of your story. Review your selections, adjust
                    quantities, and continue shopping or proceed to checkout when you are ready.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button asChild variant="outline" className="font-sans text-base bg-transparent">
                      <Link href="/">Continue Shopping</Link>
                    </Button>
                    <Button asChild className="font-sans text-base">
                      <Link href="/checkout">Proceed to Checkout</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="space-y-2">
                <CardTitle className="font-serif text-2xl">Tip to Our Artisans</CardTitle>
                <CardDescription className="font-sans text-base text-muted-foreground">
                  Add a little extra love for the people behind your products.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <p className="font-serif italic text-foreground/80">
                  "Add a tip for our artisans and support the hands that craft your favourites."
                </p>
                <div className="flex flex-wrap gap-3">
                  {tipOptions.map((option) => (
                    <Button key={option} variant="outline" className="font-sans bg-transparent">
                      {option}
                    </Button>
                  ))}
                </div>
                <p className="text-sm font-sans text-muted-foreground">
                  Your tip goes directly to the artisan community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
