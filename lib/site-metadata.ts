import type { Metadata } from "next"

import { HOUSE_OF_INDIKA } from "@/lib/brand"

export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://houseofindika.com"

export const SITE_TITLE = `${HOUSE_OF_INDIKA} — Handcrafted Treasures from Indian Artisans`

export const SITE_DESCRIPTION =
  "Shop handcrafted jewellery, textiles, décor, and kitchen pieces from rural artisans across India. Ethically sourced, made with care, delivered to your door."

const OG_IMAGE_PATH = "/indian-artisan-hands-creating-traditional-craft-wi.jpg"

export function absoluteUrl(path = "") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${HOUSE_OF_INDIKA}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: HOUSE_OF_INDIKA,
  keywords: [
    "handcrafted jewellery India",
    "artisan textiles",
    "Indian home décor",
    "ethical shopping India",
    "House of Indika",
    "handmade gifts India",
  ],
  authors: [{ name: HOUSE_OF_INDIKA, url: SITE_URL }],
  creator: HOUSE_OF_INDIKA,
  publisher: HOUSE_OF_INDIKA,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: HOUSE_OF_INDIKA,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: absoluteUrl(OG_IMAGE_PATH),
        width: 1200,
        height: 630,
        alt: "Artisan hands creating traditional Indian craft at House of Indika",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [absoluteUrl(OG_IMAGE_PATH)],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}
