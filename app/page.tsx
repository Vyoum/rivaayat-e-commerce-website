import type { Metadata } from "next"

import { LandingHeader } from "@/components/landing/landing-header"
import { LandingHero } from "@/components/landing/landing-hero"
import { LandingStory } from "@/components/landing/landing-story"
import { LandingCategories } from "@/components/landing/landing-categories"
import { LandingFooter } from "@/components/landing/landing-footer"
import { getCategoryCardsContent } from "@/lib/category-cards"
import { getActiveHeroSlides, getHeroCopy } from "@/lib/hero-slides"
import { getHomepageStory } from "@/lib/homepage-story"
import { HOUSE_OF_INDIKA_ENGLISH } from "@/lib/brand"
import { SITE_DESCRIPTION, SITE_TITLE, absoluteUrl } from "@/lib/site-metadata"

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/"),
  },
}

const homepageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: HOUSE_OF_INDIKA_ENGLISH,
  url: absoluteUrl("/"),
  description: SITE_DESCRIPTION,
  potentialAction: {
    "@type": "SearchAction",
    target: `${absoluteUrl("/collections")}?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
}

export default async function Home() {
  const [heroSlides, heroCopy, homepageStory, categoryContent] = await Promise.all([
    getActiveHeroSlides(),
    getHeroCopy(),
    getHomepageStory(),
    getCategoryCardsContent(),
  ])

  return (
    <main className="landing-root min-h-screen overflow-x-hidden bg-[#ede0d0]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }}
      />
      <LandingHeader />
      <LandingHero slides={heroSlides} copy={heroCopy} />
      <div className="landing-texture-wrap">
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
