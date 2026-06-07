import Link from "next/link"
import { Hammer, Users } from "lucide-react"

import { AdminSidebar } from "./admin-sidebar"
import { AdminTopbar } from "./admin-topbar"
import { CommunitySubnav } from "./community-subnav"
import { CommunityUsersBlock } from "./community-users-block"
import { HOUSE_OF_INDIKA } from "@/lib/brand"

export function CommunityPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="ml-[220px] flex min-h-screen flex-1 flex-col bg-[#F5F2ED]">
        <AdminTopbar />

        <main className="flex-1 space-y-5 p-6">
          <div>
            <h1 className="font-serif text-[26px] font-semibold text-[#2D1E17]">
              Community
            </h1>
            <p className="mt-1 text-[13px] text-[#9A8070]">
              Artisans, makers, and customers across {HOUSE_OF_INDIKA}.
            </p>
          </div>

          <CommunitySubnav />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <CommunityUsersBlock />

            <Link
              href="/admin/community/artisans"
              className="group block rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm transition-all hover:border-[#C4A882] hover:shadow-md"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-[#F5EDE3]">
                <Hammer className="size-5 text-[#6B5344]" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 font-serif text-[18px] font-semibold text-[#2D1E17]">
                Artisans
              </h3>
              <p className="mt-1 text-[12px] leading-relaxed text-[#9A8070]">
                Manage artisan profiles, craft stories, and product credits.
              </p>
              <p className="mt-4 text-[28px] font-semibold text-[#2D1E17]">12</p>
              <p className="mt-1 text-[11px] text-[#9A8070]">active artisan profiles</p>
            </Link>

            <div className="rounded-xl border border-dashed border-[#D4C4A8] bg-[#FAF7F2]/80 p-5">
              <div className="flex size-10 items-center justify-center rounded-lg bg-[#EDE5D8]">
                <Users className="size-5 text-[#9A8070]" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 font-serif text-[18px] font-semibold text-[#2D1E17]">
                Workshops
              </h3>
              <p className="mt-1 text-[12px] leading-relaxed text-[#9A8070]">
                Live craft sessions and community events — coming soon.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
