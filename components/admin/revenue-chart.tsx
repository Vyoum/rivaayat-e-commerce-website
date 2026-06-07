"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ChevronDown } from "lucide-react"

import { formatCurrency } from "@/lib/profile-utils"
import type { DashboardOverview } from "@/lib/dashboard-admin-server"

type RevenueChartProps = {
  revenue: DashboardOverview["revenue"]
}

function formatYAxis(value: number) {
  if (value === 0) return "0"
  if (value >= 1000) return `${Math.round(value / 1000)}k`
  return String(value)
}

function buildYAxisTicks(max: number) {
  const ceiling = Math.max(Math.ceil(max / 1000) * 1000, 1000)
  const step = ceiling / 3
  return [0, step, step * 2, ceiling]
}

export function RevenueChart({ revenue }: RevenueChartProps) {
  const yTicks = buildYAxisTicks(revenue.maxDailyRevenue)

  return (
    <div className="rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-[18px] font-semibold text-[#2D1E17]">Revenue Overview</h3>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg border border-[#EDE5D8] bg-white px-3 py-1.5 text-[12px] font-medium text-[#6B5344] transition-colors hover:bg-[#FAF7F2]"
        >
          Last 7 Days
          <ChevronDown className="size-3.5" />
        </button>
      </div>

      <div className="mt-4 flex gap-8">
        <div>
          <p className="text-[11px] text-[#9A8070]">Total Revenue</p>
          <p className="text-[14px] font-semibold text-[#2D1E17]">
            {formatCurrency(revenue.totalRevenue)}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-[#9A8070]">Avg. Order Value</p>
          <p className="text-[14px] font-semibold text-[#2D1E17]">
            {formatCurrency(revenue.avgOrderValue)}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-[#9A8070]">Paid Order Rate</p>
          <p className="text-[14px] font-semibold text-[#2D1E17]">{revenue.paidOrderRate}%</p>
        </div>
      </div>

      <div className="mt-4 h-[220px] w-full">
        {revenue.daily.every((point) => point.revenue === 0) ? (
          <div className="flex h-full items-center justify-center text-[13px] text-[#9A8070]">
            No paid revenue in the last 7 days yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenue.daily}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B6F47" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#8B6F47" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F0E8DC" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#9A8070" }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#9A8070" }}
                tickFormatter={formatYAxis}
                domain={[0, yTicks[yTicks.length - 1]]}
                ticks={yTicks}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#2D1E17",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#fff",
                }}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.label ?? ""}
                formatter={(value: number) => [
                  formatCurrency(value),
                  "Revenue",
                ]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#8B6F47"
                strokeWidth={2.5}
                fill="url(#revenueGradient)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: "#8B6F47",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
