import { HOUSE_OF_INDIKA } from "@/lib/brand"

export type StoryGalleryImage = {
  src: string
  alt: string
  caption?: string
}

export type StoryValue = {
  title: string
  description: string
}

export type OurStoryContent = {
  heroImageUrl: string
  heroTitleLine1: string
  heroTitleLine2: string
  craftsmanshipIntro: string
  craftsmanshipImages: [StoryGalleryImage, StoryGalleryImage, StoryGalleryImage]
  craftsmanshipClosing: string
  heritageImageUrl: string
  heritageTitle: string
  heritageBody: string
  heritageCtaLabel: string
  heritageCtaHref: string
  symphonyImageUrl: string
  symphonyTitle: string
  symphonyTitleAccent: string
  symphonyBody: string
  symphonyCtaLabel: string
  symphonyCtaHref: string
  values: [StoryValue, StoryValue, StoryValue]
  footerBackgroundUrl: string
  footerThumbLeftUrl: string
  footerThumbRightUrl: string
  footerText: string
  footerCtaLabel: string
  footerCtaHref: string
  /** @deprecated legacy admin field — mapped to hero titles */
  eyebrow: string
  /** @deprecated legacy admin field */
  title: string
  /** @deprecated legacy admin field — mapped to craftsmanshipIntro */
  intro: string
  /** @deprecated legacy admin field — mapped to heritageTitle */
  sectionTitle: string
  /** @deprecated legacy admin field — mapped to heritageBody */
  sectionSubtitle: string
  /** @deprecated legacy admin field */
  bodyParagraphs: [string, string]
  /** @deprecated legacy admin field — mapped to symphonyBody */
  quote: string
}

export const DEFAULT_OUR_STORY_CONTENT: OurStoryContent = {
  heroImageUrl: "/landing-watercolor-bg-full.jpg",
  heroTitleLine1: "From Craft",
  heroTitleLine2: "to Collection",
  craftsmanshipIntro:
    "We celebrate timeless craftsmanship through pieces made to be cherished for generations.",
  craftsmanshipImages: [
    {
      src: "/indian-artisan-hands-creating-traditional-craft-wi.jpg",
      alt: "Artisan working in a sunlit workshop",
      caption:
        "Rooted in tradition, every piece is thoughtfully crafted using time-honored techniques.",
    },
    {
      src: "/landing/stamp-frame.png",
      alt: "Botanical illustration",
    },
    {
      src: "/landing/cat-textiles.jpg",
      alt: "Hands working on traditional textiles",
      caption: "Guided by detail, shaped by passion, made to last.",
    },
  ],
  craftsmanshipClosing: "Crafted with care. Collected with meaning.",
  heritageImageUrl: "/landing/categories-section-ref.jpg",
  heritageTitle: "The Heritage Collection",
  heritageBody:
    "Inspired by history. Designed for today. A tribute to artistry passed down through time.",
  heritageCtaLabel: "View Collection",
  heritageCtaHref: "/jewellery",
  symphonyImageUrl: "/realistic-indian-woman-crafting-jewelry.jpg",
  symphonyTitle: "A Symphony of Skill and ",
  symphonyTitleAccent: "Soul",
  symphonyBody:
    "Each creation is the result of patience, precision, and deep respect for the craft.",
  symphonyCtaLabel: "Our Process",
  symphonyCtaHref: "/artisans",
  values: [
    {
      title: "Timeless Materials",
      description: "We use natural, enduring materials that age beautifully with time.",
    },
    {
      title: "Thoughtful Design",
      description: "Each piece is designed with purpose, balancing history and function.",
    },
    {
      title: "Made to Last",
      description: "Crafted to be used, well-loved, and passed down.",
    },
  ],
  footerBackgroundUrl: "/landing/categories-bg-full.jpg",
  footerThumbLeftUrl: "/indian-artisan-hands-creating-traditional-craft-wi.jpg",
  footerThumbRightUrl: "/landing/categories-section-ref.jpg",
  footerText:
    "For every reason, a piece of hands — for every object, a story waiting — we love the timeless.",
  footerCtaLabel: "Shop Collection",
  footerCtaHref: "/jewellery",
  eyebrow: "Our Story",
  title: "From Craft to Collection",
  intro:
    "We celebrate timeless craftsmanship through pieces made to be cherished for generations.",
  sectionTitle: "The Heritage Collection",
  sectionSubtitle:
    "Inspired by history. Designed for today. A tribute to artistry passed down through time.",
  bodyParagraphs: [
    `${HOUSE_OF_INDIKA} exists to bridge tradition and modern living — bringing artisanal clothing, decor, jewellery, and food to people who value authenticity and style.`,
    `Every item is either handmade or carefully curated to reflect thoughtful design. ${HOUSE_OF_INDIKA} is as much about the people behind the products as it is about the customers who choose to wear, use, and gift these pieces.`,
  ],
  quote:
    "Each creation is the result of patience, precision, and deep respect for the craft.",
}

export function mergeOurStoryContent(content: Partial<OurStoryContent>): OurStoryContent {
  const merged = { ...DEFAULT_OUR_STORY_CONTENT, ...content }

  merged.heroTitleLine1 = content.heroTitleLine1 ?? merged.heroTitleLine1
  merged.heroTitleLine2 = content.heroTitleLine2 ?? merged.heroTitleLine2

  if (!content.heroTitleLine1 && content.title) {
    const parts = content.title.replace(/^Our Story\s*[—–-]\s*/i, "").split(/\s+to\s+/i)
    if (parts.length >= 2) {
      merged.heroTitleLine1 = parts[0].trim()
      merged.heroTitleLine2 = `to ${parts.slice(1).join(" to ").trim()}`
    }
  }

  merged.craftsmanshipIntro = content.craftsmanshipIntro ?? content.intro ?? merged.craftsmanshipIntro
  merged.heritageTitle = content.heritageTitle ?? content.sectionTitle ?? merged.heritageTitle
  merged.heritageBody =
    content.heritageBody ?? content.sectionSubtitle ?? merged.heritageBody
  merged.symphonyBody = content.symphonyBody ?? content.quote ?? merged.symphonyBody

  merged.craftsmanshipImages = [
    content.craftsmanshipImages?.[0] ?? DEFAULT_OUR_STORY_CONTENT.craftsmanshipImages[0],
    content.craftsmanshipImages?.[1] ?? DEFAULT_OUR_STORY_CONTENT.craftsmanshipImages[1],
    content.craftsmanshipImages?.[2] ?? DEFAULT_OUR_STORY_CONTENT.craftsmanshipImages[2],
  ]

  merged.values = [
    content.values?.[0] ?? DEFAULT_OUR_STORY_CONTENT.values[0],
    content.values?.[1] ?? DEFAULT_OUR_STORY_CONTENT.values[1],
    content.values?.[2] ?? DEFAULT_OUR_STORY_CONTENT.values[2],
  ]

  merged.bodyParagraphs = [
    content.bodyParagraphs?.[0] ?? DEFAULT_OUR_STORY_CONTENT.bodyParagraphs[0],
    content.bodyParagraphs?.[1] ?? DEFAULT_OUR_STORY_CONTENT.bodyParagraphs[1],
  ]

  return merged
}
