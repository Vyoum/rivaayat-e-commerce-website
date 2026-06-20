import { HOUSE_OF_INDIKA_ENGLISH } from "@/lib/brand"

export type HomepageStoryImageKey = "1" | "2" | "3" | "4"

export type HomepageStoryImage = {
  id: HomepageStoryImageKey
  src: string
  alt: string
}

export type HomepageStoryContent = {
  eyebrow: string
  headline: string
  bodyParagraphs: [string, string]
  quote: string
  ctaLabel: string
  ctaHref: string
  images: [HomepageStoryImage, HomepageStoryImage, HomepageStoryImage, HomepageStoryImage]
}

export const HOMEPAGE_STORY_IMAGE_KEYS: HomepageStoryImageKey[] = ["1", "2", "3", "4"]

export const DEFAULT_HOMEPAGE_STORY: HomepageStoryContent = {
  eyebrow: "Our Story",
  headline: "A Heritage of Hope",
  bodyParagraphs: [
    `${HOUSE_OF_INDIKA_ENGLISH} was born from a simple belief — that the beauty of handmade Indian craft deserves to live in contemporary homes, and that the artisans who create it deserve dignity, fair wages, and a platform to share their stories with the world.`,
    "We partner directly with rural makers across India — weavers, potters, jewellers, and food artisans — curating each piece with the same care they put into making it.",
  ],
  quote:
    "Each purchase you make empowers rural artisans and helps revive the beauty of India's handmade traditions.",
  ctaLabel: "Learn More About Our Journey →",
  ctaHref: "/outerboxdesign",
  images: [
    {
      id: "1",
      src: "/indian-brass-craftsman-working-traditional-temple-.jpg",
      alt: "Artisan table setting with brass vessels",
    },
    {
      id: "2",
      src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=650&fit=crop&q=80",
      alt: "Traditional living space with textiles",
    },
    {
      id: "3",
      src: "/intricate-brass-temple-jewelry-earrings-with-tradi.jpg",
      alt: "Close-up of gold traditional jewellery",
    },
    {
      id: "4",
      src: "/indian-artisan-weaving-handloom-fabric.jpg",
      alt: "Artisan hands at work on craft",
    },
  ],
}
