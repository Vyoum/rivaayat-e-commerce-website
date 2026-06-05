import {
  Wallet,
  ShoppingBag,
  Scissors,
  UserPlus,
  Eye,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"

const metrics = [
  {
    label: "Revenue Today",
    value: "₹18,450",
    badge: "+12% vs yesterday",
    badgeType: "positive" as const,
    icon: Wallet,
  },
  {
    label: "Orders Today",
    value: "34",
    badge: "↑ +5",
    badgeType: "positive" as const,
    icon: ShoppingBag,
  },
  {
    label: "Pending Custom",
    value: "7",
    badge: "⚠ Action Needed",
    badgeType: "warning" as const,
    icon: Scissors,
  },
  {
    label: "Active Artisans",
    value: "12",
    badge: "↑ +3",
    badgeType: "positive" as const,
    icon: UserPlus,
  },
  {
    label: "Visitors This Month",
    value: "3,241",
    badge: "32% of goal",
    badgeType: "progress" as const,
    icon: Eye,
    progress: 32,
  },
]

export function MetricCards() {
  return (
    <div className="grid grid-cols-5 gap-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="relative rounded-xl border border-[#EDE5D8] bg-white p-4 shadow-sm"
        >
          <div className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-lg bg-[#F5EDE3]">
            <metric.icon
              className="size-4 text-[#6B5344]"
              strokeWidth={1.75}
            />
          </div>

          <p className="text-[12px] font-medium text-[#9A8070]">
            {metric.label}
          </p>
          <p className="mt-2 text-[22px] font-semibold text-[#2D1E17]">
            {metric.value}
          </p>

          {metric.badgeType === "positive" && (
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp className="size-3 text-[#1E7E34]" />
              <span className="text-[11px] font-medium text-[#1E7E34]">
                {metric.badge}
              </span>
            </div>
          )}

          {metric.badgeType === "warning" && (
            <div className="mt-2 flex items-center gap-1">
              <AlertTriangle className="size-3 text-[#C5221F]" />
              <span className="text-[11px] font-medium text-[#C5221F]">
                Action Needed
              </span>
            </div>
          )}

          {metric.badgeType === "progress" && (
            <div className="mt-2">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EDE5D8]">
                <div
                  className="h-full rounded-full bg-[#8B6F47]"
                  style={{ width: `${metric.progress}%` }}
                />
              </div>
              <p className="mt-1.5 text-[11px] font-medium text-[#9A8070]">
                {metric.badge}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
