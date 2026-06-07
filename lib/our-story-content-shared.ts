import { HOUSE_OF_INDIKA } from "@/lib/brand"

export type OurStoryContent = {
  heroImageUrl: string
  eyebrow: string
  title: string
  intro: string
  sectionTitle: string
  sectionSubtitle: string
  bodyParagraphs: [string, string]
  quote: string
}

export const DEFAULT_OUR_STORY_CONTENT: OurStoryContent = {
  heroImageUrl: "/group-of-smiling-indian-women-artisans-in-colorful.jpg",
  eyebrow: "Our Story",
  title: "Our Story — From Craft to Collection",
  intro: `${HOUSE_OF_INDIKA} started with a simple idea: to keep the beauty of handmade Indian crafts alive in a world that moves fast. The founders saw how traditional skills, passed down through generations, were becoming invisible in mass-produced markets.`,
  sectionTitle: "From Craft to Collection",
  sectionSubtitle:
    "Bringing artisanal clothing, decor, jewellery, and food to people who value authenticity and style.",
  bodyParagraphs: [
    `${HOUSE_OF_INDIKA} exists to bridge that gap — bringing artisanal clothing, decor, jewellery, and food to people who value authenticity and style.`,
    `Every item is either handmade or carefully curated to reflect thoughtful design. ${HOUSE_OF_INDIKA} is as much about the people behind the products — the artisans, makers, and small-scale creators — as it is about the customers who choose to wear, use, and gift these pieces.`,
  ],
  quote:
    `When you shop from ${HOUSE_OF_INDIKA}, you are not just buying something beautiful; you are supporting stories, livelihoods, and a culture of mindful consumption.`,
}
