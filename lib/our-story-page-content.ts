import { HOUSE_OF_INDIKA } from "@/lib/brand"

export type StoryMaker = {
  id: string
  name: string
  role: string
  location: string
  quote: string
  imageUrl: string
}

export type StoryJourneyStep = {
  id: string
  title: string
  description: string
}

export type StoryStat = {
  id: string
  value: string
  label: string
}

export type StoryRegion = {
  id: string
  name: string
  craft: string
  imageUrl: string
}

export type StoryCollection = {
  id: string
  name: string
  imageUrl: string
  href: string
}

export type StoryPromise = {
  id: string
  title: string
  description: string
}

export type OurStoryPageContent = {
  whyExists: {
    session: string
    title: string
    paragraphs: string[]
    imageUrl: string
  }
  makers: {
    session: string
    title: string
    items: StoryMaker[]
  }
  journey: {
    session: string
    title: string
    steps: StoryJourneyStep[]
  }
  impact: {
    session: string
    title: string
    stats: StoryStat[]
  }
  heritage: {
    session: string
    title: string
    regions: StoryRegion[]
  }
  collections: {
    session: string
    title: string
    items: StoryCollection[]
    ctaLabel: string
    ctaHref: string
  }
  promise: {
    session: string
    title: string
    items: StoryPromise[]
  }
  cta: {
    session: string
    imageUrl: string
    headline: string
    subheadline: string
    buttonLabel: string
    buttonHref: string
  }
}

export async function getOurStoryPageContent(): Promise<OurStoryPageContent> {
  return DEFAULT_OUR_STORY_PAGE_CONTENT
}

export const DEFAULT_OUR_STORY_PAGE_CONTENT: OurStoryPageContent = {
  whyExists: {
    session: "SESSION 2",
    title: `Why ${HOUSE_OF_INDIKA} Exists`,
    paragraphs: [
      `Many traditional Indian crafts are disappearing with time. ${HOUSE_OF_INDIKA} works directly with artisans and craft communities to preserve heritage while creating products that belong in modern homes.`,
    ],
    imageUrl: "/landing/categories-section-ref.jpg",
  },
  makers: {
    session: "SESSION 3",
    title: "Meet The Makers",
    items: [
      {
        id: "m1",
        name: "Ramesh Kumar",
        role: "5th Generation Potter",
        location: "Rajasthan",
        quote:
          '"My grandfather taught me pottery when I was ten. Every piece I create carries our family\'s legacy."',
        imageUrl: "/indian-brass-craftsman-working-traditional-temple-.jpg",
      },
      {
        id: "m2",
        name: "Shabnam Bano",
        role: "Papier-Mâché Artisan",
        location: "Kashmir",
        quote:
          '"Each design is inspired by the beauty around us. I love keeping this delicate art alive."',
        imageUrl: "/indian-artisan-woman-weaving-traditional-handloom-.jpg",
      },
      {
        id: "m3",
        name: "Prakash Rao",
        role: "Kalamkari Artist",
        location: "Andhra Pradesh",
        quote:
          '"Nature, stories and tradition come together in Kalamkari. It\'s more than art—it\'s our culture."',
        imageUrl: "/indian-artisan-hands-creating-traditional-craft-wi.jpg",
      },
    ],
  },
  journey: {
    session: "SESSION 4",
    title: "The Craft Journey",
    steps: [
      {
        id: "s1",
        title: "Design",
        description: "Inspiration meets imagination.",
      },
      {
        id: "s2",
        title: "Material Selection",
        description: "We source the finest natural materials ethically.",
      },
      {
        id: "s3",
        title: "Handcrafting",
        description: "Skilled hands shape every piece with care.",
      },
      {
        id: "s4",
        title: "Quality Inspection",
        description: "Each piece is carefully checked for perfection.",
      },
      {
        id: "s5",
        title: "Packaging",
        description: "Thoughtful packaging that respects our planet.",
      },
      {
        id: "s6",
        title: "Delivery",
        description: "Delivered to your home, with love.",
      },
    ],
  },
  impact: {
    session: "SESSION 5",
    title: "Impact & Trust",
    stats: [
      { id: "i1", value: "50+", label: "Artisans Supported" },
      { id: "i2", value: "8+", label: "Craft Clusters" },
      { id: "i3", value: "100%", label: "Handmade Products" },
      { id: "i4", value: "Thousands", label: "of Craft Hours Preserved" },
    ],
  },
  heritage: {
    session: "SESSION 6",
    title: "Explore India's Craft Heritage",
    regions: [
      {
        id: "r1",
        name: "Rajasthan",
        craft: "Pottery & Stone Craft",
        imageUrl: "/landing/categories-section-ref.jpg",
      },
      {
        id: "r2",
        name: "Kashmir",
        craft: "Papier-Mâché",
        imageUrl: "/landing-watercolor-bg-full.jpg",
      },
      {
        id: "r3",
        name: "Andhra Pradesh",
        craft: "Kalamkari",
        imageUrl: "/indian-artisan-hands-creating-traditional-craft-wi.jpg",
      },
      {
        id: "r4",
        name: "Gujarat",
        craft: "Bandhani",
        imageUrl: "/landing/cat-textiles.jpg",
      },
      {
        id: "r5",
        name: "West Bengal",
        craft: "Kantha",
        imageUrl: "/realistic-indian-woman-crafting-jewelry.jpg",
      },
    ],
  },
  collections: {
    session: "SESSION 7",
    title: "Featured Collections",
    items: [
      {
        id: "c1",
        name: "Jewellery",
        imageUrl: "/landing/cat-jewellery.jpg",
        href: "/jewellery",
      },
      {
        id: "c2",
        name: "Custom Food",
        imageUrl: "/landing/cat-kitchen.jpg",
        href: "/custom-laddoos",
      },
      {
        id: "c3",
        name: "The Loom Series",
        imageUrl: "/landing/cat-textiles.jpg",
        href: "/clothing",
      },
      {
        id: "c4",
        name: "Home & Living",
        imageUrl: "/landing/cat-decor.jpg",
        href: "/decor",
      },
      {
        id: "c5",
        name: "New Arrivals",
        imageUrl: "/landing/categories-bg-full.jpg",
        href: "/jewellery",
      },
    ],
    ctaLabel: "View All Collections",
    ctaHref: "/jewellery",
  },
  promise: {
    session: "SESSION 8",
    title: "Our Promise",
    items: [
      {
        id: "p1",
        title: "Authentic Craftsmanship",
        description: "True to tradition. Made with pride.",
      },
      {
        id: "p2",
        title: "Ethical Sourcing",
        description: "Responsibly sourced materials only.",
      },
      {
        id: "p3",
        title: "Direct Artisan Partnerships",
        description: "Fair pay. Long-term relationships.",
      },
      {
        id: "p4",
        title: "Quality Assurance",
        description: "Every piece meets our highest standards.",
      },
    ],
  },
  cta: {
    session: "SESSION 9",
    imageUrl: "/indian-artisan-hands-creating-traditional-craft-wi.jpg",
    headline: "Every purchase helps preserve India's living heritage.",
    subheadline: "Become part of the story.",
    buttonLabel: "Explore Collections",
    buttonHref: "/jewellery",
  },
}
