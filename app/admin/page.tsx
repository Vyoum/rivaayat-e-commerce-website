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

export default async function AdminPage() {
  const [overview, recentOrders] = await Promise.all([
    loadDashboardOverview(),
    loadAdminOrders(),
  ])

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="ml-[220px] flex min-h-screen flex-1 flex-col">
        <AdminTopbar />

        <main className="flex-1 space-y-5 p-6">
          <GreetingBanner greeting={overview.greeting} />
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
