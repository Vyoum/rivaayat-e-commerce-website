"use client"

import { Bell, Search } from "lucide-react"

import { AdminUserAvatar } from "./admin-user-avatar"
import { useAdminProfile } from "./admin-session-provider"

export function AdminTopbar() {
  const profile = useAdminProfile()

  return (
    <header className="sticky top-0 z-20 flex h-[60px] items-center gap-6 border-b border-[#EDE5D8] bg-white px-6">
      <h1 className="shrink-0 text-[15px] font-semibold text-[#2D1E17]">
        Dashboard
      </h1>

      <div className="relative mx-auto w-full max-w-[480px]">
        <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#9A8070]" />
        <input
          type="search"
          placeholder="Search orders, artisans, products..."
          className="h-10 w-full rounded-xl border border-[#EDE5D8] bg-[#FAF7F2] pr-4 pl-10 text-[13px] text-[#2D1E17] placeholder:text-[#9A8070] outline-none focus:border-[#C4A882] focus:ring-1 focus:ring-[#C4A882]/30"
        />
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <button
          type="button"
          className="relative flex size-9 items-center justify-center rounded-full text-[#6B5344] transition-colors hover:bg-[#F5EDE3]"
          aria-label="Notifications"
        >
          <Bell className="size-[18px]" strokeWidth={1.75} />
        </button>
        {profile ? <AdminUserAvatar profile={profile} size="sm" /> : null}
      </div>
    </header>
  )
}
