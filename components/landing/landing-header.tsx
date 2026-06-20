"use client"

import { HOUSE_OF_INDIKA_ENGLISH } from "@/lib/brand"
import { SiteHeader } from "@/components/site-header"

export function LandingHeader() {
  return <SiteHeader variant="hero" brandLabel={HOUSE_OF_INDIKA_ENGLISH} />
}
