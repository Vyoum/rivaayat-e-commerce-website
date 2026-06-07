import { Calendar } from "lucide-react"

import { HOUSE_OF_INDIKA } from "@/lib/brand"
import type { DashboardOverview } from "@/lib/dashboard-admin-server"

const periodLabels = {
  morning: "Good morning",
  afternoon: "Good afternoon",
  evening: "Good evening",
} as const

type GreetingBannerProps = {
  greeting: DashboardOverview["greeting"]
  adminName: string
}

export function GreetingBanner({ greeting, adminName }: GreetingBannerProps) {
  const firstName = adminName.trim().split(/\s+/)[0] || adminName

  return (
    <div className="flex items-center justify-between rounded-xl bg-[#E8D8C3] px-6 py-5">
      <div>
        <h2 className="font-serif text-[26px] leading-tight font-semibold text-[#2D1E17]">
          {periodLabels[greeting.period]}, {firstName}.
        </h2>
        <p className="mt-1 text-[13px] text-[#6B5344]">
          Here&apos;s how {HOUSE_OF_INDIKA} is doing today.
        </p>
      </div>
      <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
        <Calendar className="size-4 text-[#6B5344]" strokeWidth={1.75} />
        <span className="text-[13px] font-medium text-[#2D1E17]">{greeting.dateLabel}</span>
      </div>
    </div>
  )
}
