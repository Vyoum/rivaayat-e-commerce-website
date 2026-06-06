import type React from "react"
import type { Metadata } from "next"
import { Cormorant_Garamond, DM_Sans, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
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
  title: "House of Indika — Stories Crafted by Hand",
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
        {children}
        <Analytics />
      </body>
    </html>
  )
}
