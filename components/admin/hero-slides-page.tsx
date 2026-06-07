"use client"

import { HeroSlideshowManager } from "./hero-slideshow-manager"
import { AdminSidebar } from "./admin-sidebar"
import { AdminTopbar } from "./admin-topbar"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export function HeroSlidesPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="ml-[220px] flex min-h-screen flex-1 flex-col">
        <AdminTopbar />

        <main className="flex-1 space-y-5 p-6">
          <Link
            href="/admin/content"
            className="inline-flex items-center gap-1.5 text-[12px] text-[#9A8070] hover:text-[#6B5344]"
          >
            <ArrowLeft className="size-3.5" />
            Back to Content
          </Link>

          <HeroSlideshowManager />
        </main>
      </div>
    </div>
  )
}
