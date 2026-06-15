import { OurStoryPage } from "@/components/our-story/our-story-page"
import { getOurStoryPageContent } from "@/lib/our-story-page-content"

export default async function OurStoryRoute() {
  const content = await getOurStoryPageContent()

  return <OurStoryPage content={content} />
}
