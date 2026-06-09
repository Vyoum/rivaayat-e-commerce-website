import { LandingHeader } from "@/components/landing/landing-header"
import { LandingHero } from "@/components/landing/landing-hero"
import { LandingStory } from "@/components/landing/landing-story"
import { LandingCategories } from "@/components/landing/landing-categories"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingTextureBg } from "@/components/landing/landing-texture-bg"
import { getCategoryCardsContent } from "@/lib/category-cards"
import { getActiveHeroSlides } from "@/lib/hero-slides"
import { getHomepageStory } from "@/lib/homepage-story"

export default async function Home() {
  const [heroSlides, homepageStory, categoryContent] = await Promise.all([
    getActiveHeroSlides(),
    getHomepageStory(),
    getCategoryCardsContent(),
  ])

  return (
    <main className="landing-root min-h-screen overflow-x-hidden bg-[#ede0d0]">
      <LandingHeader />
      <LandingHero slides={heroSlides} />
      <div className="landing-texture-wrap">
        <LandingTextureBg />
        <LandingStory content={homepageStory} />
      </div>
      <LandingCategories
        cards={categoryContent.cards}
        sectionHeading={categoryContent.sectionHeading}
      />
      <LandingFooter />
    </main>
  )
}
