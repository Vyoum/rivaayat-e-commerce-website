export const DEFAULT_CATEGORY_SECTION_HEADING = "A Heritage of Four Worlds"

export type CategoryCardKey = "clothing" | "decor" | "jewellery" | "custom-laddoos"

export type CategoryCard = {
  id: CategoryCardKey
  title: string
  description: string
  href: string
  imageUrl: string
}

export const CATEGORY_CARD_KEYS: CategoryCardKey[] = [
  "clothing",
  "decor",
  "jewellery",
  "custom-laddoos",
]

export const DEFAULT_CATEGORY_CARDS: CategoryCard[] = [
  {
    id: "clothing",
    title: "Textiles",
    description: "Softness. Tradition. Woven with Purpose.",
    href: "/clothing",
    imageUrl: "/landing/cat-textiles.jpg",
  },
  {
    id: "decor",
    title: "Décor",
    description: "Soulful Spaces for Everyday Living.",
    href: "/decor",
    imageUrl: "/landing/cat-decor.jpg",
  },
  {
    id: "jewellery",
    title: "Jewellery",
    description: "Handcrafted Adornments. Timeless & Meaningful.",
    href: "/jewellery",
    imageUrl: "/landing/cat-jewellery.jpg",
  },
  {
    id: "custom-laddoos",
    title: "Kitchen & Dining",
    description: "Rooted in Rituals. Made for Togetherness.",
    href: "/custom-laddoos",
    imageUrl: "/landing/cat-kitchen.jpg",
  },
]

export const CATEGORY_CARD_LABELS: Record<CategoryCardKey, string> = {
  clothing: "Textiles",
  decor: "Décor",
  jewellery: "Jewellery",
  "custom-laddoos": "Kitchen & Dining",
}
