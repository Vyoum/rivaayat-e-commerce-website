import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Shuffle } from "lucide-react"

import { ArtisanProfileHeader } from "@/components/artisans/artisan-profile-header"
import { ArtisanProfileContent } from "@/components/artisans/artisan-profile-content"
import {
  getArtisanProfileBySlug,
  getPublishedArtisanProfiles,
} from "@/lib/artisan-page-content"
import { HOUSE_OF_INDIKA } from "@/lib/brand"

type ArtisanProfilePageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const profiles = await getPublishedArtisanProfiles()
  return profiles.map((profile) => ({ slug: profile.slug }))
}

export async function generateMetadata({ params }: ArtisanProfilePageProps): Promise<Metadata> {
  const { slug } = await params
  const content = await getArtisanProfileBySlug(slug)

  if (!content || !content.isPublished) {
    return { title: `Artisan | ${HOUSE_OF_INDIKA}` }
  }

  return {
    title: `${content.name} — Master Artisan | ${HOUSE_OF_INDIKA}`,
    description: content.biographyParagraphs[0],
  }
}

export default async function ArtisanProfilePage({ params }: ArtisanProfilePageProps) {
  const { slug } = await params
  const content = await getArtisanProfileBySlug(slug)

  if (!content || !content.isPublished) {
    notFound()
  }

  const publishedCount = (await getPublishedArtisanProfiles()).length

  return (
    <main className="relative min-h-screen bg-[#FDF8F4]">
      <ArtisanProfileHeader overHero />
      <ArtisanProfileContent content={content} />

      {publishedCount > 1 ? (
        <section className="border-t border-[#E8E0D4] bg-[#FDF8F4] px-6 py-14 lg:px-10">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <p className="font-serif text-[22px] text-[#3D2E24] sm:text-[24px]">
              Meet another artisan
            </p>
            <p className="mt-3 max-w-lg font-serif text-[15px] leading-relaxed text-[#9A8070]">
              Each visit reveals a different maker from our circle of master craftspeople.
            </p>
            <Link
              href="/artisans"
              className="mt-8 inline-flex items-center gap-2.5 bg-[#7B5E43] px-8 py-3.5 font-sans text-[11px] font-semibold tracking-[0.18em] text-white uppercase transition-colors hover:bg-[#6B5344]"
            >
              <Shuffle className="size-4" strokeWidth={1.5} />
              Shuffle artisan
            </Link>
          </div>
        </section>
      ) : null}
    </main>
  )
}
