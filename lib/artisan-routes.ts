import type { ArtisanPageContent } from "@/lib/artisan-page-content-shared"
import { slugify } from "@/lib/product-utils"

const ARTISAN_SLUG_ALIASES: Record<string, string> = {
  devendra: "devendra-khatri",
  "devendra-khatri": "devendra-khatri",
}

type ArtisanLookup = Pick<ArtisanPageContent, "name" | "slug" | "isPublished">

function normalizeName(value: string) {
  return value.trim().toLowerCase()
}

function firstToken(value: string) {
  return normalizeName(value).split(/\s+/)[0] ?? ""
}

export function resolveArtisanSlugForName(
  artisanName: string,
  profiles: ArtisanLookup[],
): string | null {
  const normalized = normalizeName(artisanName)
  if (!normalized) return null

  const published = profiles.filter((profile) => profile.isPublished)
  if (published.length === 0) return null

  const exact = published.find((profile) => normalizeName(profile.name) === normalized)
  if (exact) return exact.slug

  const token = firstToken(artisanName)
  const byFirstName = published.find((profile) => firstToken(profile.name) === token)
  if (byFirstName) return byFirstName.slug

  const partial = published.find(
    (profile) =>
      normalizeName(profile.name).includes(normalized) ||
      normalized.includes(firstToken(profile.name)),
  )
  if (partial) return partial.slug

  const slugCandidate = slugify(artisanName)
  const alias = ARTISAN_SLUG_ALIASES[slugCandidate] ?? slugCandidate
  const bySlug = published.find((profile) => profile.slug === alias || profile.slug === slugCandidate)
  if (bySlug) return bySlug.slug

  return null
}

export function getArtisanProfileHref(artisanName: string, artisanSlug?: string | null) {
  if (artisanSlug) {
    return `/artisans/${artisanSlug}`
  }

  const slug = slugify(artisanName)
  const resolved = ARTISAN_SLUG_ALIASES[slug] ?? slug
  return `/artisans/${resolved}`
}
