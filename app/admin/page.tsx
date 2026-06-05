import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminTopbar } from "@/components/admin/admin-topbar"
import { GreetingBanner } from "@/components/admin/greeting-banner"
import { MetricCards } from "@/components/admin/metric-cards"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { CustomOrders } from "@/components/admin/custom-orders"
import { RecentOrders } from "@/components/admin/recent-orders"
import { LowStockAlerts } from "@/components/admin/low-stock-alerts"
import { QuickActions } from "@/components/admin/quick-actions"

export default function AdminPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="ml-[220px] flex min-h-screen flex-1 flex-col">
        <AdminTopbar />

        <main className="flex-1 space-y-5 p-6">
          <GreetingBanner />
          <MetricCards />

          <div className="grid grid-cols-[1fr_340px] gap-5">
            <RevenueChart />
            <CustomOrders />
          </div>

          <div className="grid grid-cols-[1fr_340px] gap-5">
            <RecentOrders />
            <LowStockAlerts />
          </div>

          <QuickActions />
        </main>
      </div>
    </div>
  )
}
