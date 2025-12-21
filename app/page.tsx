import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { StorySection } from "@/components/story-section"
import { ProductsSection } from "@/components/products-section"
import { ImpactSection } from "@/components/impact-section"
import { ArtisanStories } from "@/components/artisan-stories"
import { TestimonialsSection } from "@/components/testimonials-section"
import { NewsletterSection } from "@/components/newsletter-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <HeroSection />
      <StorySection />
      <ProductsSection />
      <ImpactSection />
      <ArtisanStories />
      <TestimonialsSection />
      <NewsletterSection />
      <Footer />
    </main>
  )
}
