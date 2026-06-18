"use client"

import { useState } from "react"
import Link from "next/link"

import { ArtisanProfilesManager } from "@/components/admin/artisan-profiles-manager"
import { OurStoryPhotosManager } from "@/components/admin/our-story-photos-manager"
import { cn } from "@/lib/utils"

type AdminStoryTab = "story" | "artisans"

export function OurStoryAdminEditors() {
  const [tab, setTab] = useState<AdminStoryTab>("story")

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-1 border-b border-[#EDE5D8]">
        <button
          type="button"
          onClick={() => setTab("story")}
          className={cn(
            "px-4 py-2.5 text-[13px] font-medium transition-colors",
            tab === "story"
              ? "border-b-2 border-[#2B1B12] text-[#2B1B12]"
              : "text-[#9A8070] hover:text-[#2B1B12]",
          )}
        >
          Our Story Page
        </button>
        <button
          type="button"
          onClick={() => setTab("artisans")}
          className={cn(
            "px-4 py-2.5 text-[13px] font-medium transition-colors",
            tab === "artisans"
              ? "border-b-2 border-[#2B1B12] text-[#2B1B12]"
              : "text-[#9A8070] hover:text-[#2B1B12]",
          )}
        >
          Artisans Page
        </button>
      </div>

      {tab === "story" ? (
        <OurStoryPhotosManager />
      ) : (
        <div className="space-y-3">
          <p className="text-[13px] text-[#9A8070]">
            Edit each artisan&apos;s photo, name, biography, credentials, and video. Published
            profiles appear when customers visit{" "}
            <Link href="/artisans" target="_blank" className="text-[#6B5344] underline">
              /artisans
            </Link>
            .
          </p>
          <ArtisanProfilesManager />
        </div>
      )}
    </div>
  )
}
