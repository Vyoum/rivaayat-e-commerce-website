import type { Metadata } from "next"

import { HOUSE_OF_INDIKA } from "@/lib/brand"

const PRODUCTION_SITE_URL = "https://houseofindika.com"

function resolveSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "")

  if (configured && !/localhost|127\.0\.0\.1/i.test(configured)) {
    return configured
  }

  if (process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production") {
    return PRODUCTION_SITE_URL
  }

  return configured || PRODUCTION_SITE_URL
}

export const SITE_URL = resolveSiteUrl()

export const SITE_TITLE = `${HOUSE_OF_INDIKA} — Handcrafted Treasures from Indian Artisans`

export const SITE_DESCRIPTION =
  "Timeless treasures, thoughtfully made and mindfully chosen to bring meaning into your everyday. Shop handcrafted jewellery, textiles, décor, and food from rural artisans across India."

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
