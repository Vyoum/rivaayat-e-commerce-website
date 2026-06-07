import type { Metadata } from "next"
import { ArtisanProfileHeader } from "@/components/artisans/artisan-profile-header"
import { ArtisanProfileContent } from "@/components/artisans/artisan-profile-content"

export const metadata: Metadata = {
  title: "Devendra Khatri — Master Weaver | House of Indika",
  description:
    "Meet Devendra Khatri, master weaver from Maheshwar. Discover handloomed Maheshwari sarees, dupattas, and stoles woven with generations of tradition.",
}

export default function DevendraKhatriPage() {
  return (
    <main className="relative min-h-screen bg-[#FDF8F4]">
      <ArtisanProfileHeader overHero />
      <ArtisanProfileContent />
    </main>
  )
}
