export type HeroSlide = {
  id: string
  imageUrl: string
  mediaType?: "image" | "video"
  alt: string
  sortOrder: number
  isActive: boolean
}

export type HeroCopy = {
  tagline: string
  titleLine1: string
  titleLine2: string
  subtitle: string
}

export const DEFAULT_HERO_COPY: HeroCopy = {
  tagline: "From Our World, For Yours",
  titleLine1: "Discover Stories",
  titleLine2: "Crafted by Hand",
  subtitle:
    "Timeless treasures, thoughtfully made and mindfully chosen to bring meaning into your everyday.",
}

export const MAX_HERO_SLIDES = 5

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: "default-1",
    imageUrl: "/indian-artisan-hands-creating-traditional-craft-wi.jpg",
    alt: "Artisan hands creating traditional craft",
    sortOrder: 0,
    isActive: true,
  },
  {
    id: "default-2",
    imageUrl: "/realistic-indian-woman-crafting-jewelry.jpg",
    alt: "Artisan crafting traditional jewellery",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "default-3",
    imageUrl: "/indian-grandmother-making-protein-ladoo.jpg",
    alt: "Grandmother making traditional ladoos",
    sortOrder: 2,
    isActive: true,
  },
]
