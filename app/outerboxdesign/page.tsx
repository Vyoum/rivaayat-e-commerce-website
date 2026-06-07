import { OurStoryPage } from "@/components/our-story/our-story-page"
import { getOurStoryContent } from "@/lib/our-story-content"

export default async function OurStoryRoute() {
  const content = await getOurStoryContent()

  return <OurStoryPage content={content} />
}
