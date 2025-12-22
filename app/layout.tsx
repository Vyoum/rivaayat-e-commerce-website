import type React from "react"
import type { Metadata } from "next"
import { Cormorant_Garamond, DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "RIVAAYAT — Stories Crafted by Heart",
  description:
    "Discover handcrafted treasures from Indian NGOs. Every purchase nurtures a life, preserves a tradition, and weaves a story of hope.",
  generator: "v0.app",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${dmSans.variable} font-serif antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
