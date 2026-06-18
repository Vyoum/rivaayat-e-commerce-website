import { OurStoryPage } from "@/components/our-story/our-story-page"
import { getOurStoryPageContent } from "@/lib/our-story-page-server"

export const dynamic = "force-dynamic"

export default async function OuterBoxDesignRoute() {
  const content = await getOurStoryPageContent()

  return <OurStoryPage content={content} />
}
