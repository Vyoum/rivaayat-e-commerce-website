import { LandingHeader } from "@/components/landing/landing-header"
import { LandingHero } from "@/components/landing/landing-hero"
import { LandingStory } from "@/components/landing/landing-story"
import { LandingCategories } from "@/components/landing/landing-categories"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingTextureBg } from "@/components/landing/landing-texture-bg"
import { getCategoryCards } from "@/lib/category-cards"
import { getActiveHeroSlides } from "@/lib/hero-slides"
import { getHomepageStory } from "@/lib/homepage-story"

export default async function Home() {
  const [heroSlides, homepageStory, categoryCards] = await Promise.all([
    getActiveHeroSlides(),
    getHomepageStory(),
    getCategoryCards(),
  ])

  return (
    <main className="landing-root min-h-screen overflow-x-hidden bg-[#ede0d0]">
      <LandingHeader />
      <LandingHero slides={heroSlides} />
      <div className="landing-texture-wrap">
        <LandingTextureBg />
        <LandingStory content={homepageStory} />
      </div>
      <LandingCategories cards={categoryCards} />
      <LandingFooter />
    </main>
  )
}
