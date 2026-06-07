import type { Metadata } from "next"
import { ArtisanProfileHeader } from "@/components/artisans/artisan-profile-header"
import { ArtisanProfileContent } from "@/components/artisans/artisan-profile-content"
import { getArtisanPageContent } from "@/lib/artisan-page-content"
import { HOUSE_OF_INDIKA } from "@/lib/brand"

export async function generateMetadata(): Promise<Metadata> {
  const content = await getArtisanPageContent()

  return {
    title: `${content.name} — Master Artisan | ${HOUSE_OF_INDIKA}`,
    description: content.biographyParagraphs[0],
  }
}

export default async function DevendraKhatriPage() {
  const content = await getArtisanPageContent()

  return (
    <main className="relative min-h-screen bg-[#FDF8F4]">
      <ArtisanProfileHeader overHero />
      <ArtisanProfileContent content={content} />
    </main>
  )
}
