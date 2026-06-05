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

const data = [
  { day: "Mon", revenue: 12000 },
  { day: "Tue", revenue: 18500 },
  { day: "Wed", revenue: 14000 },
  { day: "Thu", revenue: 22000 },
  { day: "Fri", revenue: 19500 },
  { day: "Sat", revenue: 28000 },
  { day: "Sun", revenue: 24000 },
]

function formatYAxis(value: number) {
  if (value === 0) return "0"
  return `${value / 1000}k`
}

export function RevenueChart() {
  return (
    <div className="rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-[18px] font-semibold text-[#2D1E17]">
          Revenue Overview
        </h3>
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
          <p className="text-[14px] font-semibold text-[#2D1E17]">₹1,24,500</p>
        </div>
        <div>
          <p className="text-[11px] text-[#9A8070]">Avg. Order Value</p>
          <p className="text-[14px] font-semibold text-[#2D1E17]">₹3,450</p>
        </div>
        <div>
          <p className="text-[11px] text-[#9A8070]">Conversion Rate</p>
          <p className="text-[14px] font-semibold text-[#2D1E17]">2.4%</p>
        </div>
      </div>

      <div className="mt-4 h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B6F47" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#8B6F47" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="0"
              vertical={false}
              stroke="#F0E8DC"
            />
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
              domain={[0, 30000]}
              ticks={[0, 10000, 20000, 30000]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#2D1E17",
                border: "none",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#fff",
              }}
              formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Revenue"]}
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
      </div>
    </div>
  )
}
