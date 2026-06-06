import { LandingHeader } from "@/components/landing/landing-header"
import { LandingHero } from "@/components/landing/landing-hero"
import { LandingStory } from "@/components/landing/landing-story"
import { LandingCategories } from "@/components/landing/landing-categories"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingTextureBg } from "@/components/landing/landing-texture-bg"
import { getActiveHeroSlides } from "@/lib/hero-slides"

export default async function Home() {
  const heroSlides = await getActiveHeroSlides()

  return (
    <main className="landing-root min-h-screen overflow-x-hidden bg-[#ede0d0]">
      <LandingHeader />
      <LandingHero slides={heroSlides} />
      <div className="landing-texture-wrap">
        <LandingTextureBg />
        <LandingStory />
      </div>
      <LandingCategories />
      <LandingFooter />
    </main>
  )
}
