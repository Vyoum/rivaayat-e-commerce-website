import type { MetadataRoute } from "next"

import { absoluteUrl } from "@/lib/site-metadata"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/checkout", "/cart", "/profile", "/login", "/signup"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  }
}
