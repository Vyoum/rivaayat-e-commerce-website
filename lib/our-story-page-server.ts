import "server-only"

import { getPublishedArtisanProfiles } from "@/lib/artisan-page-content"
import type { ArtisanPageContent } from "@/lib/artisan-page-content-shared"
import { resolveArtisanSlugForName } from "@/lib/artisan-routes"
import { getOurStoryContent } from "@/lib/our-story-content"
import {
  DEFAULT_OUR_STORY_PAGE_CONTENT,
  type OurStoryPageContent,
  type StoryMaker,
} from "@/lib/our-story-page-content"

function buildHeroHeadline(line1: string, line2: string) {
  const first = line1.trim()
  const second = line2.trim()
  if (!first && !second) return DEFAULT_OUR_STORY_PAGE_CONTENT.cta.headline
  if (!second) return first
  if (second.toLowerCase().startsWith("to ")) return `${first} ${second}`.trim()
  return `${first} to ${second}`.trim()
}

function parseArtisanEyebrow(eyebrow: string) {
  const parts = eyebrow.split("·").map((part) => part.trim()).filter(Boolean)
  return {
    role: parts[0] ?? eyebrow,
    location: parts[1] ?? "",
  }
}

function mapArtisanProfileToStoryMaker(profile: ArtisanPageContent): StoryMaker {
  const { role, location } = parseArtisanEyebrow(profile.eyebrow)

  return {
    id: profile.id,
    name: profile.name,
    role,
    location,
    quote: profile.quote,
    imageUrl: profile.heroImageUrl || profile.videoThumbnailUrl,
    profileSlug: profile.slug,
  }
}

async function buildMakersSection(
  base: OurStoryPageContent["makers"],
): Promise<OurStoryPageContent["makers"]> {
  const published = await getPublishedArtisanProfiles()

  if (published.length > 0) {
    return {
      ...base,
      items: published.map(mapArtisanProfileToStoryMaker),
    }
  }

  return {
    ...base,
    items: base.items.map((maker) => ({
      ...maker,
      profileSlug: resolveArtisanSlugForName(maker.name, published) ?? undefined,
    })),
  }
}

function mapAdminContentToPage(
  admin: Awaited<ReturnType<typeof getOurStoryContent>>,
): OurStoryPageContent {
  const base = DEFAULT_OUR_STORY_PAGE_CONTENT

  return {
    ...base,
    whyExists: {
      ...base.whyExists,
      title: admin.whyExistsTitle || base.whyExists.title,
      paragraphs: [admin.whyExistsParagraph1, admin.whyExistsParagraph2].filter(Boolean),
      imageUrl: admin.whyExistsImageUrl || base.whyExists.imageUrl,
    },
    founders: {
      ...base.founders,
      title: admin.foundersTitle || base.founders.title,
      imageUrl: admin.foundersImageUrl || base.founders.imageUrl,
    },
    cta: {
      ...base.cta,
      imageUrl: admin.heroImageUrl || base.cta.imageUrl,
      footerImageUrl: admin.footerBackgroundUrl || base.cta.footerImageUrl,
      headline: buildHeroHeadline(admin.heroTitleLine1, admin.heroTitleLine2),
    },
  }
}

export async function getOurStoryPageContent(): Promise<OurStoryPageContent> {
  try {
    const admin = await getOurStoryContent()
    const page = mapAdminContentToPage(admin)
    return {
      ...page,
      makers: await buildMakersSection(page.makers),
    }
  } catch {
    return {
      ...DEFAULT_OUR_STORY_PAGE_CONTENT,
      makers: await buildMakersSection(DEFAULT_OUR_STORY_PAGE_CONTENT.makers),
    }
  }
}
