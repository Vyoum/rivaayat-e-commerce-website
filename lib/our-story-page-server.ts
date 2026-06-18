import "server-only"

import { getOurStoryContent } from "@/lib/our-story-content"
import {
  DEFAULT_OUR_STORY_PAGE_CONTENT,
  type OurStoryPageContent,
} from "@/lib/our-story-page-content"

function buildHeroHeadline(line1: string, line2: string) {
  const first = line1.trim()
  const second = line2.trim()
  if (!first && !second) return DEFAULT_OUR_STORY_PAGE_CONTENT.cta.headline
  if (!second) return first
  if (second.toLowerCase().startsWith("to ")) return `${first} ${second}`.trim()
  return `${first} to ${second}`.trim()
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
    cta: {
      ...base.cta,
      imageUrl: admin.heroImageUrl || base.cta.imageUrl,
      headline: buildHeroHeadline(admin.heroTitleLine1, admin.heroTitleLine2),
    },
  }
}

export async function getOurStoryPageContent(): Promise<OurStoryPageContent> {
  try {
    const admin = await getOurStoryContent()
    return mapAdminContentToPage(admin)
  } catch {
    return DEFAULT_OUR_STORY_PAGE_CONTENT
  }
}
