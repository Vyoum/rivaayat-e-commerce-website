"use client"

import { Sparkles } from "lucide-react"

import { MAX_ARTISAN_PROFILES } from "@/lib/artisan-page-content-shared"
import { AdminSidebar } from "./admin-sidebar"
import { ArtisanProfilesManager } from "./artisan-profiles-manager"
import { CommunitySubnav } from "./community-subnav"

export function ArtisansPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="ml-[220px] flex min-h-screen flex-1 flex-col bg-[#F5F2ED]">
        <header className="flex h-[52px] items-center border-b border-[#EDE5D8] bg-white px-6">
          <span className="text-[14px] font-semibold text-[#2B1B12]">
            Artisan Management
          </span>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-5 flex items-center gap-2">
            <Sparkles className="size-4 text-[#8B6F47]" />
            <div>
              <h1 className="font-serif text-[24px] font-semibold text-[#2B1B12]">
                Artisans
              </h1>
              <p className="text-[12px] text-[#9A8070]">
                Manage up to {MAX_ARTISAN_PROFILES} public artisan profiles. Published artisans
                shuffle on the storefront when customers visit Artisans.
              </p>
            </div>
          </div>

          <CommunitySubnav />
          <ArtisanProfilesManager />
        </main>
      </div>
    </div>
  )
}
