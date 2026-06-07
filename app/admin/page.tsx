import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminTopbar } from "@/components/admin/admin-topbar"
import { GreetingBanner } from "@/components/admin/greeting-banner"
import { MetricCards } from "@/components/admin/metric-cards"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { CustomOrders } from "@/components/admin/custom-orders"
import { RecentOrders } from "@/components/admin/recent-orders"
import { LowStockAlerts } from "@/components/admin/low-stock-alerts"
import { QuickActions } from "@/components/admin/quick-actions"
import { loadDashboardOverview } from "@/lib/dashboard-admin-server"
import { loadAdminOrders } from "@/lib/order-admin-server"
import { getAdminProfile } from "@/lib/admin-profile-server"

export default async function AdminPage() {
  const [overviewResult, ordersResult, profile] = await Promise.all([
    loadDashboardOverview().then(
      (value) => ({ status: "fulfilled" as const, value }),
      (reason) => ({ status: "rejected" as const, reason }),
    ),
    loadAdminOrders().then(
      (value) => ({ status: "fulfilled" as const, value }),
      (reason) => ({ status: "rejected" as const, reason }),
    ),
    getAdminProfile(),
  ])

  const overview =
    overviewResult.status === "fulfilled"
      ? overviewResult.value
      : {
          greeting: { period: "morning" as const, dateLabel: new Date().toLocaleDateString("en-IN") },
          metrics: [],
          revenue: {
            totalRevenue: 0,
            avgOrderValue: 0,
            paidOrderRate: 0,
            daily: [],
            maxDailyRevenue: 1,
          },
          customOrders: [],
          pendingCustomCount: 0,
          lowStock: [],
        }

  const recentOrders = ordersResult.status === "fulfilled" ? ordersResult.value : []

  if (overviewResult.status === "rejected") {
    console.error("[admin page] dashboard load failed:", overviewResult.reason)
  }
  if (ordersResult.status === "rejected") {
    console.error("[admin page] orders load failed:", ordersResult.reason)
  }

  const adminName = profile?.name ?? "Admin"

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="ml-[220px] flex min-h-screen flex-1 flex-col">
        <AdminTopbar />

        <main className="flex-1 space-y-5 p-6">
          <GreetingBanner greeting={overview.greeting} adminName={adminName} />
          <MetricCards metrics={overview.metrics} />

          <div className="grid grid-cols-[1fr_340px] gap-5">
            <RevenueChart revenue={overview.revenue} />
            <CustomOrders orders={overview.customOrders} pendingCount={overview.pendingCustomCount} />
          </div>

          <div className="grid grid-cols-[1fr_340px] gap-5">
            <RecentOrders initialOrders={recentOrders.slice(0, 5)} />
            <LowStockAlerts products={overview.lowStock} />
          </div>

          <QuickActions />
        </main>
      </div>
    </div>
  )
}
