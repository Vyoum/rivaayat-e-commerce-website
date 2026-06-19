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

export type StoryHeroSlide = {
  id: string
  imageUrl: string
  alt: string
  sortOrder: number
  isActive: boolean
  mediaType?: "image" | "video"
}

export const MAX_STORY_FRAME_SLIDES = 5
/** @deprecated use MAX_STORY_FRAME_SLIDES */
export const MAX_STORY_HERO_SLIDES = MAX_STORY_FRAME_SLIDES

export type OurStoryContent = {
  heroImageUrl: string
  heroCarouselSlides: StoryHeroSlide[]
  heroTitleLine1: string
  heroTitleLine2: string
  whyExistsImageUrl: string
  whyExistsCarouselSlides: StoryHeroSlide[]
  whyExistsTitle: string
  whyExistsParagraph1: string
  whyExistsParagraph2: string
  foundersImageUrl: string
  foundersCarouselSlides: StoryHeroSlide[]
  foundersTitle: string
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
  heroCarouselSlides: [
    {
      id: "story-hero-default",
      imageUrl: "/landing-watercolor-bg-full.jpg",
      alt: "Our Story hero",
      sortOrder: 0,
      isActive: true,
      mediaType: "image",
    },
  ],
  heroTitleLine1: "From Craft",
  heroTitleLine2: "to Collection",
  whyExistsImageUrl: "/landing/categories-section-ref.jpg",
  whyExistsCarouselSlides: [
    {
      id: "story-why-default",
      imageUrl: "/landing/categories-section-ref.jpg",
      alt: "Why House of Indika Exists",
      sortOrder: 0,
      isActive: true,
      mediaType: "image",
    },
  ],
  whyExistsTitle: `Why ${HOUSE_OF_INDIKA} Exists`,
  whyExistsParagraph1:
    `Many traditional Indian crafts are disappearing with time. ${HOUSE_OF_INDIKA} works directly with artisans and craft communities to preserve heritage while creating products that belong in modern homes.`,
  whyExistsParagraph2:
    "We believe that every handmade piece carries a story — of skill passed down through generations, of communities sustained by fair work, and of beauty that cannot be replicated by machines.",
  foundersImageUrl: "/group-of-smiling-indian-women-artisans-in-colorful.jpg",
  foundersCarouselSlides: [
    {
      id: "story-founders-default",
      imageUrl: "/group-of-smiling-indian-women-artisans-in-colorful.jpg",
      alt: "Meet Our Founders",
      sortOrder: 0,
      isActive: true,
      mediaType: "image",
    },
  ],
  foundersTitle: "Meet Our Founders",
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

function parseStoryFrameSlides(value: unknown, idPrefix = "story-frame"): StoryHeroSlide[] {
  if (!Array.isArray(value)) return []

  const slides: StoryHeroSlide[] = []

  for (const [index, entry] of value.entries()) {
    if (!entry || typeof entry !== "object") continue
    const slide = entry as Partial<StoryHeroSlide>
    const imageUrl = typeof slide.imageUrl === "string" ? slide.imageUrl.trim() : ""
    if (!imageUrl) continue

    slides.push({
      id: typeof slide.id === "string" && slide.id.trim() ? slide.id.trim() : `${idPrefix}-${index}`,
      imageUrl,
      alt: typeof slide.alt === "string" ? slide.alt.trim() : "",
      sortOrder: typeof slide.sortOrder === "number" ? slide.sortOrder : index,
      isActive: slide.isActive !== false,
      mediaType: slide.mediaType === "video" ? "video" : "image",
    })
  }

  return slides.sort((a, b) => a.sortOrder - b.sortOrder)
}

export function resolveStoryFrameSlides(
  slides: unknown,
  fallbackImageUrl?: string,
  fallbackAlt = "Our Story",
  fallbackId = "story-frame-fallback",
): StoryHeroSlide[] {
  const activeSlides = parseStoryFrameSlides(slides).filter((slide) => slide.isActive)

  if (activeSlides.length > 0) return activeSlides

  const fallbackUrl = fallbackImageUrl?.trim()
  if (!fallbackUrl) return []

  return [
    {
      id: fallbackId,
      imageUrl: fallbackUrl,
      alt: fallbackAlt,
      sortOrder: 0,
      isActive: true,
      mediaType: "image",
    },
  ]
}

export function normalizeStoryFrameSlides(
  slides: StoryHeroSlide[],
  fallbackImageUrl?: string,
  fallbackAlt = "Our Story",
  fallbackId = "story-frame-fallback",
  emptyFallbackSlides: StoryHeroSlide[] = [],
): StoryHeroSlide[] {
  const normalized: StoryHeroSlide[] = slides
    .map((slide, index) => ({
      ...slide,
      id: slide.id.trim() || `story-frame-${index}`,
      imageUrl: slide.imageUrl.trim(),
      alt: slide.alt.trim(),
      sortOrder: index,
      isActive: slide.isActive !== false,
      mediaType: (slide.mediaType === "video" ? "video" : "image") as "image" | "video",
    }))
    .filter((slide) => slide.imageUrl)
    .slice(0, MAX_STORY_FRAME_SLIDES)

  if (normalized.length > 0) return normalized

  const fallback = fallbackImageUrl?.trim()
  if (!fallback) return emptyFallbackSlides

  return [
    {
      id: fallbackId,
      imageUrl: fallback,
      alt: fallbackAlt,
      sortOrder: 0,
      isActive: true,
      mediaType: "image",
    },
  ]
}

export function resolveStoryHeroSlides(
  content: Pick<OurStoryContent, "heroCarouselSlides" | "heroImageUrl">,
): StoryHeroSlide[] {
  return resolveStoryFrameSlides(
    content.heroCarouselSlides,
    content.heroImageUrl,
    "Our Story hero",
    "story-hero-fallback",
  )
}

export function resolveWhyExistsSlides(
  content: Pick<OurStoryContent, "whyExistsCarouselSlides" | "whyExistsImageUrl">,
): StoryHeroSlide[] {
  return resolveStoryFrameSlides(
    content.whyExistsCarouselSlides,
    content.whyExistsImageUrl,
    "Why House of Indika Exists",
    "story-why-fallback",
  )
}

export function resolveFoundersSlides(
  content: Pick<OurStoryContent, "foundersCarouselSlides" | "foundersImageUrl">,
): StoryHeroSlide[] {
  return resolveStoryFrameSlides(
    content.foundersCarouselSlides,
    content.foundersImageUrl,
    "Meet Our Founders",
    "story-founders-fallback",
  )
}

export function normalizeStoryHeroSlides(
  slides: StoryHeroSlide[],
  fallbackImageUrl?: string,
): StoryHeroSlide[] {
  return normalizeStoryFrameSlides(
    slides,
    fallbackImageUrl,
    "Our Story hero",
    "story-hero-fallback",
    DEFAULT_OUR_STORY_CONTENT.heroCarouselSlides,
  )
}

export function mergeOurStoryContent(content: Partial<OurStoryContent>): OurStoryContent {
  const merged = { ...DEFAULT_OUR_STORY_CONTENT, ...content }

  merged.heroTitleLine1 = content.heroTitleLine1 ?? merged.heroTitleLine1
  merged.heroTitleLine2 = content.heroTitleLine2 ?? merged.heroTitleLine2

  merged.heroCarouselSlides = normalizeStoryHeroSlides(
    Array.isArray(content.heroCarouselSlides)
      ? parseStoryFrameSlides(content.heroCarouselSlides, "story-hero")
      : [],
    content.heroImageUrl ?? merged.heroImageUrl,
  )
  merged.heroImageUrl =
    merged.heroCarouselSlides[0]?.imageUrl ?? content.heroImageUrl ?? merged.heroImageUrl

  merged.whyExistsImageUrl =
    content.whyExistsImageUrl ?? content.heritageImageUrl ?? merged.whyExistsImageUrl
  merged.whyExistsCarouselSlides = normalizeStoryFrameSlides(
    Array.isArray(content.whyExistsCarouselSlides)
      ? parseStoryFrameSlides(content.whyExistsCarouselSlides, "story-why")
      : [],
    merged.whyExistsImageUrl,
    "Why House of Indika Exists",
    "story-why-fallback",
    DEFAULT_OUR_STORY_CONTENT.whyExistsCarouselSlides,
  )
  merged.whyExistsImageUrl =
    merged.whyExistsCarouselSlides[0]?.imageUrl ?? merged.whyExistsImageUrl
  merged.whyExistsTitle = content.whyExistsTitle ?? merged.whyExistsTitle
  merged.whyExistsParagraph1 =
    content.whyExistsParagraph1 ?? content.bodyParagraphs?.[0] ?? merged.whyExistsParagraph1
  merged.whyExistsParagraph2 =
    content.whyExistsParagraph2 ?? content.bodyParagraphs?.[1] ?? merged.whyExistsParagraph2

  merged.foundersImageUrl = content.foundersImageUrl ?? merged.foundersImageUrl
  merged.foundersCarouselSlides = normalizeStoryFrameSlides(
    Array.isArray(content.foundersCarouselSlides)
      ? parseStoryFrameSlides(content.foundersCarouselSlides, "story-founders")
      : [],
    merged.foundersImageUrl,
    "Meet Our Founders",
    "story-founders-fallback",
    DEFAULT_OUR_STORY_CONTENT.foundersCarouselSlides,
  )
  merged.foundersImageUrl =
    merged.foundersCarouselSlides[0]?.imageUrl ?? merged.foundersImageUrl
  merged.foundersTitle = content.foundersTitle ?? merged.foundersTitle

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
