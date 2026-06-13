export type ArtisanCredential = {
  title: string
  description: string
}

export type ArtisanPageContent = {
  id: string
  slug: string
  isPublished: boolean
  sortOrder: number
  heroImageUrl: string
  eyebrow: string
  name: string
  tagline: string
  biographyTitle: string
  biographyParagraphs: [string, string, string]
  quote: string
  credentials: [ArtisanCredential, ArtisanCredential, ArtisanCredential]
  videoTitle: string
  videoSubtitle: string
  videoThumbnailUrl: string
  videoUrl: string
  videoCtaLabel: string
  handpickedTitle: string
  handpickedSubtitle: string
}

export const MAX_ARTISAN_PROFILES = 10

export const DEFAULT_ARTISAN_PAGE_CONTENT: Omit<
  ArtisanPageContent,
  "id" | "slug" | "sortOrder"
> = {
  isPublished: true,
  heroImageUrl: "/indian-artisan-weaving-handloom-fabric.jpg",
  eyebrow: "Master Weaver · Maheshwar",
  name: "Devendra Khatri",
  tagline: "Weaving the Threads of Tradition",
  biographyTitle: "The Loom as a Sanctuary",
  biographyParagraphs: [
    "In the quiet lanes of Maheshwar, where the Narmada flows with ancient grace, Devendra Khatri has spent more than two decades at his loom — not merely weaving fabric, but preserving a lineage of Maheshwari craft passed down through generations of master weavers.",
    "Each saree, dupatta, and stole that leaves his workshop carries the rhythm of the shuttle, the patience of hand-spun thread, and the distinctive geometry of borders that have made Maheshwar textiles beloved across India and beyond.",
    "For Devendra, the loom is not a machine of production. It is a place of meditation, memory, and meaning — where every warp and weft holds the story of a craft that refuses to be hurried.",
  ],
  quote:
    "When I weave, I am not just creating cloth. I am holding a conversation with my ancestors. The loom is my sanctuary, and the thread is my voice.",
  credentials: [
    {
      title: "100% Handloomed",
      description: "Authentic handloom weaving process.",
    },
    {
      title: "25+ Years Experience",
      description: "A lifetime dedicated to mastering the craft.",
    },
    {
      title: "Honored Techniques",
      description: "Hansa-Zari borders, Chata-Dandi patterns.",
    },
  ],
  videoTitle: "The Rhythm of the Loom in Motion",
  videoSubtitle: "A symphony of shuttle and thread, woven slow to the pace of the heartbeat.",
  videoThumbnailUrl: "/indian-artisan-woman-weaving-traditional-handloom-.jpg",
  videoUrl: "",
  videoCtaLabel: "Watch the Weaver's Song",
  handpickedTitle: "Handpicked by Devendra",
  handpickedSubtitle: "Discover the signature weaves that define his legacy…",
}

export const DEFAULT_ARTISAN_PROFILES: ArtisanPageContent[] = [
  {
    id: "default-devendra-khatri",
    slug: "devendra-khatri",
    sortOrder: 0,
    ...DEFAULT_ARTISAN_PAGE_CONTENT,
  },
]
