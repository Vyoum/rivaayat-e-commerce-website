import { redirect } from "next/navigation"

import { getRandomPublishedArtisanProfile } from "@/lib/artisan-page-content"

export const dynamic = "force-dynamic"

export default async function ArtisansShufflePage() {
  const profile = await getRandomPublishedArtisanProfile()

  if (!profile) {
    redirect("/")
  }

  redirect(`/artisans/${profile.slug}`)
}
