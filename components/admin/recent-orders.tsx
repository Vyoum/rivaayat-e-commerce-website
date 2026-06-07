import Link from "next/link"

import { formatCurrency } from "@/lib/profile-utils"
import type { AdminOrder } from "@/types/admin-order"

function statusBadgeClass(status: string) {
  switch (status) {
    case "Shipped":
    case "Delivered":
      return "bg-[#E6F4EA] text-[#1E7E34]"
    case "Processing":
      return "bg-[#FFF4E5] text-[#B95000]"
    case "Pending":
      return "bg-[#F0EDE8] text-[#6B5344]"
    case "Cancelled":
      return "bg-[#FCE8E6] text-[#C5221F]"
    default:
      return "bg-[#F0EDE8] text-[#6B5344]"
  }
}

function formatShortDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate))
}

type RecentOrdersProps = {
  initialOrders: AdminOrder[]
}

export function RecentOrders({ initialOrders }: RecentOrdersProps) {
  return (
    <div className="rounded-xl border border-[#EDE5D8] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-[18px] font-semibold text-[#2D1E17]">Recent Orders</h3>
        <Link
          href="/admin/commerce/orders"
          className="text-[12px] font-medium text-[#6B5344] transition-colors hover:text-[#2D1E17]"
        >
          View All
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#EDE5D8]">
              {["Order ID", "Customer", "Date", "Status", "Amount"].map((header) => (
                <th
                  key={header}
                  className="pr-6 pb-3 text-left text-[11px] font-semibold tracking-wide text-[#9A8070] uppercase last:pr-0"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {initialOrders.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-[13px] text-[#9A8070]">
                  No orders yet
                </td>
              </tr>
            ) : (
              initialOrders.map((order, index) => (
                <tr
                  key={order.id}
                  className={
                    index < initialOrders.length - 1 ? "border-b border-[#F5EDE3]" : ""
                  }
                >
                  <td className="py-3.5 pr-6 text-[13px] font-medium text-[#2D1E17]">
                    {order.displayId}
                  </td>
                  <td className="py-3.5 pr-6 text-[13px] text-[#6B5344]">{order.customer.name}</td>
                  <td className="py-3.5 pr-6 text-[13px] text-[#9A8070]">
                    {formatShortDate(order.createdAt)}
                  </td>
                  <td className="py-3.5 pr-6">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusBadgeClass(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-[13px] font-semibold text-[#2D1E17]">
                    {formatCurrency(order.total)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
