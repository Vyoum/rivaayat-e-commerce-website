import {
  Wallet,
  ShoppingBag,
  Scissors,
  UserPlus,
  Eye,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from "lucide-react"

import type { DashboardMetricCard } from "@/lib/dashboard-admin-server"

type MetricCardsProps = {
  metrics: DashboardMetricCard[]
}

export function MetricCards({ metrics }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-5 gap-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="relative rounded-xl border border-[#EDE5D8] bg-white p-4 shadow-sm"
        >
          <div className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-lg bg-[#F5EDE3]">
            {metric.label.includes("Revenue") && (
              <Wallet className="size-4 text-[#6B5344]" strokeWidth={1.75} />
            )}
            {metric.label.includes("Orders Today") && (
              <ShoppingBag className="size-4 text-[#6B5344]" strokeWidth={1.75} />
            )}
            {metric.label.includes("Custom") && (
              <Scissors className="size-4 text-[#6B5344]" strokeWidth={1.75} />
            )}
            {metric.label.includes("Artisans") && (
              <UserPlus className="size-4 text-[#6B5344]" strokeWidth={1.75} />
            )}
            {metric.label.includes("Patrons") && (
              <Eye className="size-4 text-[#6B5344]" strokeWidth={1.75} />
            )}
          </div>

          <p className="text-[12px] font-medium text-[#9A8070]">{metric.label}</p>
          <p className="mt-2 text-[22px] font-semibold text-[#2D1E17]">{metric.value}</p>

          {metric.badgeType === "positive" && (
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp className="size-3 text-[#1E7E34]" />
              <span className="text-[11px] font-medium text-[#1E7E34]">{metric.badge}</span>
            </div>
          )}

          {metric.badgeType === "negative" && (
            <div className="mt-2 flex items-center gap-1">
              <TrendingDown className="size-3 text-[#C5221F]" />
              <span className="text-[11px] font-medium text-[#C5221F]">{metric.badge}</span>
            </div>
          )}

          {metric.badgeType === "warning" && (
            <div className="mt-2 flex items-center gap-1">
              <AlertTriangle className="size-3 text-[#C5221F]" />
              <span className="text-[11px] font-medium text-[#C5221F]">{metric.badge}</span>
            </div>
          )}

          {metric.badgeType === "neutral" && (
            <p className="mt-2 text-[11px] font-medium text-[#9A8070]">{metric.badge}</p>
          )}

          {metric.badgeType === "progress" && (
            <div className="mt-2">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EDE5D8]">
                <div
                  className="h-full rounded-full bg-[#8B6F47]"
                  style={{ width: `${metric.progress ?? 0}%` }}
                />
              </div>
              <p className="mt-1.5 text-[11px] font-medium text-[#9A8070]">{metric.badge}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
