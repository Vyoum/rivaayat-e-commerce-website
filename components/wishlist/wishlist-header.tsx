import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { SiteHeader } from "@/components/site-header"

export function WishlistHeader() {
  return (
    <>
      <SiteHeader className="bg-[#F5F3E9]" />
      <section className="bg-gradient-to-b from-[#EDE8DC]/60 to-[#F5F3E9] pb-16 pt-10 lg:pb-20 lg:pt-12">
        <nav aria-label="Breadcrumb" className="mx-auto mb-8 max-w-7xl px-6 lg:px-10">
          <ol className="flex items-center gap-1.5 font-sans text-[12px] text-[#9A8070]">
            <li>
              <Link href="/" className="transition-colors hover:text-[#6B5344]">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-1.5">
              <ChevronRight className="size-3 text-[#C4B5A5]" />
              <span className="text-[#6B5344]">My Wishlist</span>
            </li>
          </ol>
        </nav>

        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="space-y-4">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-[#9A8070]">
              Your Personal Collection
            </p>
            <h1 className="font-serif text-[42px] font-normal leading-tight text-[#3D2E24] md:text-[52px] lg:text-[56px]">
              My Wishlist
            </h1>
            <p className="max-w-2xl font-serif text-[16px] leading-relaxed text-[#6B5344]">
              A curated collection of handcrafted pieces that speak to your soul. Save, organize,
              and share the artisan works you love.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
