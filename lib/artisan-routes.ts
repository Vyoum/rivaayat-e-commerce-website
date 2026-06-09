import { slugify } from "@/lib/product-utils"

const ARTISAN_SLUG_ALIASES: Record<string, string> = {
  devendra: "devendra-khatri",
  "devendra-khatri": "devendra-khatri",
}

export function getArtisanProfileHref(artisanName: string) {
  const slug = slugify(artisanName)
  const resolved = ARTISAN_SLUG_ALIASES[slug] ?? slug
  return `/artisans/${resolved}`
}
