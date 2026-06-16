import type { MetadataRoute } from "next"

import { getPublishedArtisanProfiles } from "@/lib/artisan-page-content"
import { getPrisma } from "@/lib/prisma"
import { absoluteUrl } from "@/lib/site-metadata"

const STATIC_ROUTES = [
  "",
  "/collections",
  "/jewellery",
  "/clothing",
  "/decor",
  "/custom-laddoos",
  "/custom-orders",
  "/outerboxdesign",
  "/artisans",
  "/contact",
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }))

  const prisma = getPrisma()
  if (prisma) {
    try {
      const products = await prisma.product.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
      })

      for (const product of products) {
        entries.push({
          url: absoluteUrl(`/products/${product.slug}`),
          lastModified: product.updatedAt,
          changeFrequency: "weekly",
          priority: 0.7,
        })
      }
    } catch (error) {
      console.error("[sitemap] failed to load products:", error)
    }
  }

  try {
    const artisans = await getPublishedArtisanProfiles()
    for (const artisan of artisans) {
      entries.push({
        url: absoluteUrl(`/artisans/${artisan.slug}`),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      })
    }
  } catch (error) {
    console.error("[sitemap] failed to load artisans:", error)
  }

  return entries
}
