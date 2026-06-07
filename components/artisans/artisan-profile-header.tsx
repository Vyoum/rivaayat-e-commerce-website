"use client"

import { SiteHeader } from "@/components/site-header"

export function ArtisanProfileHeader({ overHero = false }: { overHero?: boolean }) {
  return <SiteHeader variant={overHero ? "hero" : "solid"} />
}
