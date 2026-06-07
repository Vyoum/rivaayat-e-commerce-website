import type React from "react"
import type { Metadata } from "next"
import { Cormorant_Garamond, DM_Sans, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AppProviders } from "@/components/providers/app-providers"
import { SiteFooterGate } from "@/components/site-footer-gate"
import { HOUSE_OF_INDIKA } from "@/lib/brand"
import "./globals.css"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
})

export const metadata: Metadata = {
  title: `${HOUSE_OF_INDIKA} — Stories Crafted by Hand`,
  description:
    "Discover timeless handcrafted treasures from rural artisans across India. Each purchase tells a story.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${dmSans.variable} ${playfair.variable} font-serif antialiased`}
      >
        <AppProviders>
          {children}
          <SiteFooterGate />
        </AppProviders>
        <Analytics />
      </body>
    </html>
  )
}
