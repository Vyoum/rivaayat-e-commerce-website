import { formatCurrency } from "@/lib/profile-utils"
import { getPrisma } from "@/lib/prisma"

export type DashboardMetricCard = {
  label: string
  value: string
  badge: string
  badgeType: "positive" | "negative" | "warning" | "progress" | "neutral"
  progress?: number
}

export type DashboardRevenuePoint = {
  day: string
  label: string
  revenue: number
}

export type DashboardCustomOrder = {
  id: string
  title: string
  timeAgo: string
  description: string
  showAssign: boolean
}

export type DashboardLowStockProduct = {
  id: string
  name: string
  slug: string
  image: string
  stockLabel: string
}

export type DashboardOverview = {
  greeting: {
    period: "morning" | "afternoon" | "evening"
    dateLabel: string
  }
  metrics: DashboardMetricCard[]
  revenue: {
    totalRevenue: number
    avgOrderValue: number
    paidOrderRate: number
    daily: DashboardRevenuePoint[]
    maxDailyRevenue: number
  }
  customOrders: DashboardCustomOrder[]
  pendingCustomCount: number
  lowStock: DashboardLowStockProduct[]
}

function startOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function endOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

function dayRange(offsetDays: number) {
  const day = new Date()
  day.setDate(day.getDate() - offsetDays)
  return { start: startOfDay(day), end: endOfDay(day) }
}

function formatChangePercent(current: number, previous: number) {
  if (previous === 0) {
    return current > 0 ? "+100%" : "No change"
  }
  const change = Math.round(((current - previous) / previous) * 100)
  if (change === 0) return "No change"
  return `${change > 0 ? "+" : ""}${change}% vs yesterday`
}

function formatCountChange(current: number, previous: number) {
  const diff = current - previous
  if (diff === 0) return "Same as yesterday"
  return diff > 0 ? `↑ +${diff}` : `↓ ${diff}`
}

function formatRelativeTime(date: Date) {
  const diffMs = Date.now() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  if (diffMinutes < 60) return `${Math.max(diffMinutes, 1)} min ago`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} hr ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return "1 day ago"
  if (diffDays < 7) return `${diffDays} days ago`
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(date)
}

function greetingPeriod(): DashboardOverview["greeting"]["period"] {
  const hour = new Date().getHours()
  if (hour < 12) return "morning"
  if (hour < 17) return "afternoon"
  return "evening"
}

function greetingDateLabel() {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date())
}

async function sumPaidRevenue(from: Date, to: Date) {
  const prisma = getPrisma()
  if (!prisma) return 0

  const result = await prisma.order.aggregate({
    where: {
      paymentStatus: "paid",
      status: { not: "cancelled" },
      createdAt: { gte: from, lte: to },
    },
    _sum: { total: true },
  })

  return Number(result._sum.total ?? 0)
}

async function countOrders(from: Date, to: Date) {
  const prisma = getPrisma()
  if (!prisma) return 0

  return prisma.order.count({
    where: {
      createdAt: { gte: from, lte: to },
      status: { not: "cancelled" },
    },
  })
}

export async function loadDashboardOverview(): Promise<DashboardOverview> {
  const prisma = getPrisma()

  const empty: DashboardOverview = {
    greeting: { period: greetingPeriod(), dateLabel: greetingDateLabel() },
    metrics: [],
    revenue: {
      totalRevenue: 0,
      avgOrderValue: 0,
      paidOrderRate: 0,
      daily: [],
      maxDailyRevenue: 0,
    },
    customOrders: [],
    pendingCustomCount: 0,
    lowStock: [],
  }

  if (!prisma) return empty

  const today = dayRange(0)
  const yesterday = dayRange(1)
  const monthStart = startOfDay(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const lastMonthStart = startOfDay(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1))

  const [
    revenueToday,
    revenueYesterday,
    ordersToday,
    ordersYesterday,
    pendingCustomCount,
    activeArtisans,
    newPatronsThisMonth,
    newPatronsLastMonth,
    customOrdersRaw,
    lowStockProducts,
    last7DaysOrders,
  ] = await Promise.all([
    sumPaidRevenue(today.start, today.end),
    sumPaidRevenue(yesterday.start, yesterday.end),
    countOrders(today.start, today.end),
    countOrders(yesterday.start, yesterday.end),
    prisma.customOrder.count({ where: { status: "pending" } }),
    prisma.artisan.count(),
    prisma.user.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.user.count({
      where: { createdAt: { gte: lastMonthStart, lt: monthStart } },
    }),
    prisma.customOrder.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "desc" },
      take: 2,
      include: { artisan: true },
    }),
    prisma.product.findMany({
      where: { isPublished: true, inStock: false },
      orderBy: { updatedAt: "desc" },
      take: 4,
      select: { id: true, name: true, slug: true, imageUrls: true },
    }),
    Promise.all(
      Array.from({ length: 7 }, (_, index) => {
        const offset = 6 - index
        const range = dayRange(offset)
        return Promise.all([
          sumPaidRevenue(range.start, range.end),
          countOrders(range.start, range.end),
          prisma.order.count({
            where: {
              createdAt: { gte: range.start, lte: range.end },
              paymentStatus: "paid",
              status: { not: "cancelled" },
            },
          }),
        ]).then(([revenue, totalOrders, paidOrders]) => ({
          offset,
          revenue,
          totalOrders,
          paidOrders,
        }))
      }),
    ),
  ])

  const revenueChange = formatChangePercent(revenueToday, revenueYesterday)
  const revenueBadgeType: DashboardMetricCard["badgeType"] =
    revenueToday >= revenueYesterday ? "positive" : revenueYesterday > revenueToday ? "negative" : "neutral"

  const ordersBadgeType: DashboardMetricCard["badgeType"] =
    ordersToday >= ordersYesterday ? "positive" : ordersYesterday > ordersToday ? "negative" : "neutral"

  const patronGoal = Math.max(newPatronsLastMonth, 10)
  const patronProgress = Math.min(Math.round((newPatronsThisMonth / patronGoal) * 100), 100)

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const daily: DashboardRevenuePoint[] = last7DaysOrders.map(({ offset, revenue }) => {
    const date = new Date()
    date.setDate(date.getDate() - offset)
    return {
      day: dayLabels[date.getDay()],
      label: new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(date),
      revenue,
    }
  })

  const totalRevenue = daily.reduce((sum, point) => sum + point.revenue, 0)
  const totalOrders7d = last7DaysOrders.reduce((sum, row) => sum + row.totalOrders, 0)
  const paidOrders7d = last7DaysOrders.reduce((sum, row) => sum + row.paidOrders, 0)
  const avgOrderValue = paidOrders7d > 0 ? Math.round(totalRevenue / paidOrders7d) : 0
  const paidOrderRate =
    totalOrders7d > 0 ? Math.round((paidOrders7d / totalOrders7d) * 1000) / 10 : 0
  const maxDailyRevenue = Math.max(...daily.map((point) => point.revenue), 1)

  const metrics: DashboardMetricCard[] = [
    {
      label: "Revenue Today",
      value: formatCurrency(revenueToday),
      badge: revenueChange,
      badgeType: revenueBadgeType,
    },
    {
      label: "Orders Today",
      value: String(ordersToday),
      badge: formatCountChange(ordersToday, ordersYesterday),
      badgeType: ordersBadgeType,
    },
    {
      label: "Pending Custom",
      value: String(pendingCustomCount),
      badge: pendingCustomCount > 0 ? "Action Needed" : "All clear",
      badgeType: pendingCustomCount > 0 ? "warning" : "neutral",
    },
    {
      label: "Active Artisans",
      value: String(activeArtisans),
      badge: activeArtisans > 0 ? "On catalogue" : "Add artisans",
      badgeType: "neutral",
    },
    {
      label: "New Patrons This Month",
      value: newPatronsThisMonth.toLocaleString("en-IN"),
      badge: `${patronProgress}% of monthly goal`,
      badgeType: "progress",
      progress: patronProgress,
    },
  ]

  const customOrders: DashboardCustomOrder[] = customOrdersRaw.map((order) => ({
    id: order.id,
    title: order.description.split(/[.!?\n]/)[0]?.trim().slice(0, 48) || "Custom Request",
    timeAgo: formatRelativeTime(order.createdAt),
    description: order.description,
    showAssign: !order.artisanId,
  }))

  const lowStock: DashboardLowStockProduct[] = lowStockProducts.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    image: product.imageUrls[0] ?? "/placeholder.svg",
    stockLabel: "Out of stock",
  }))

  return {
    greeting: { period: greetingPeriod(), dateLabel: greetingDateLabel() },
    metrics,
    revenue: {
      totalRevenue,
      avgOrderValue,
      paidOrderRate,
      daily,
      maxDailyRevenue,
    },
    customOrders,
    pendingCustomCount,
    lowStock,
  }
}
