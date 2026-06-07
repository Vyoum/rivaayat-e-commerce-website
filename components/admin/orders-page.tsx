"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import {
  Search,
  X,
  ChevronDown,
  Sparkles,
  Loader2,
} from "lucide-react"
import { AdminSidebar } from "./admin-sidebar"
import { CommerceSubnav } from "./commerce-subnav"
import { HOUSE_OF_INDIKA } from "@/lib/brand"
import { formatCurrency } from "@/lib/profile-utils"
import {
  ADMIN_ORDER_TABS,
  type AdminOrderTab,
} from "@/lib/order-admin-constants"
import type { AdminOrder, AdminOrderStatusCounts } from "@/types/admin-order"

const emptyCounts: AdminOrderStatusCounts = {
  all: 0,
  pending: 0,
  processing: 0,
  shipped: 0,
  delivered: 0,
  cancelled: 0,
}

const tabCountKeys: Record<AdminOrderTab, keyof AdminOrderStatusCounts> = {
  All: "all",
  Pending: "pending",
  Processing: "processing",
  Shipped: "shipped",
  Delivered: "delivered",
  Cancelled: "cancelled",
}

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
] as const

function statusBadgeClass(status: string) {
  switch (status) {
    case "Processing":
      return "bg-[#F5D7B5] text-[#6B5344]"
    case "Shipped":
      return "bg-[#E6F4EA] text-[#1E7E34]"
    case "Delivered":
      return "bg-[#E6F4EA] text-[#1E7E34]"
    case "Cancelled":
      return "bg-[#FCE8E6] text-[#C5221F]"
    case "Pending":
      return "bg-[#F0EDE8] text-[#6B5344]"
    default:
      return "bg-[#F0EDE8] text-[#6B5344]"
  }
}

function formatPlacedAt(isoDate: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(isoDate))
}

export function OrdersPage() {
  const [activeTab, setActiveTab] = useState<AdminOrderTab>("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [counts, setCounts] = useState<AdminOrderStatusCounts>(emptyCounts)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [searchQuery])

  const loadOrders = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ tab: activeTab })
      if (debouncedQuery) params.set("q", debouncedQuery)

      const res = await fetch(`/api/admin/orders?${params.toString()}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load orders")

      setOrders(data.orders ?? [])
      setCounts(data.counts ?? emptyCounts)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders")
      if (!options?.silent) setOrders([])
    } finally {
      if (!options?.silent) setLoading(false)
    }
  }, [activeTab, debouncedQuery])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedOrderId) ?? null,
    [orders, selectedOrderId],
  )

  function handleSelectOrder(order: AdminOrder) {
    setSelectedOrderId(order.id)
    setDrawerOpen(true)
  }

  async function handleStatusChange(nextStatus: string) {
    if (!selectedOrder) return

    setUpdatingStatus(true)
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update status")

      setOrders((prev) =>
        prev.map((order) => (order.id === data.order.id ? data.order : order)),
      )
      await loadOrders({ silent: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status")
    } finally {
      setUpdatingStatus(false)
    }
  }

  const tabLabel =
    activeTab === "All" ? "all" : activeTab.toLowerCase()

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="ml-[220px] flex min-h-screen flex-1 flex-col bg-[#FDF9F3]">
        <header className="flex h-[52px] items-center border-b border-[#EDE5D8] bg-white px-6">
          <span className="font-serif text-[15px] text-[#2B1B12]">
            {HOUSE_OF_INDIKA}
          </span>
        </header>

        <main className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-5 flex items-center gap-2">
              <Sparkles className="size-4 text-[#C4A882]" />
              <div>
                <h1 className="font-serif text-[24px] font-semibold text-[#2B1B12]">
                  Orders
                </h1>
                <p className="text-[12px] text-[#9A8070]">
                  Manage, track, and fulfill all customer orders.
                </p>
              </div>
            </div>

            <CommerceSubnav />

            <div className="mb-5 flex items-center gap-1 border-b border-[#EDE5D8]">
              {ADMIN_ORDER_TABS.map((tab) => {
                const isActive = activeTab === tab
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium transition-colors ${
                      isActive
                        ? "border-b-2 border-[#2B1B12] text-[#2B1B12]"
                        : "text-[#9A8070] hover:text-[#2B1B12]"
                    }`}
                  >
                    {tab}
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                        isActive
                          ? "bg-[#2B1B12] text-white"
                          : "bg-[#EDE5D8] text-[#6B5344]"
                      }`}
                    >
                      {counts[tabCountKeys[tab]]}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="mb-4 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#9A8070]" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search orders, customers, or IDs..."
                  className="h-10 w-full rounded-xl border border-[#EDE5D8] bg-white pr-4 pl-10 text-[13px] outline-none focus:border-[#C4A882]"
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-[#F5C6C6] bg-[#FEF2F2] px-4 py-3 text-[13px] text-[#B91C1C]">
                {error}
              </div>
            )}

            <div className="overflow-hidden rounded-xl border border-[#EDE5D8] bg-white">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#EDE5D8] bg-[#FAF7F2]">
                    {["Order ID", "Customer", "Products", "Amount", "Status"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-[11px] font-semibold tracking-wide text-[#9A8070] uppercase"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-16 text-center">
                        <Loader2 className="mx-auto size-6 animate-spin text-[#9A8070]" />
                        <p className="mt-3 text-[13px] text-[#9A8070]">Loading orders…</p>
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-16 text-center">
                        <p className="font-serif text-[18px] text-[#6B5344]">No orders yet</p>
                        <p className="mt-2 text-[13px] text-[#9A8070]">
                          Orders will appear here once customers complete checkout.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => {
                      const isSelected = selectedOrderId === order.id
                      const firstItem = order.firstItem

                      return (
                        <tr
                          key={order.id}
                          onClick={() => handleSelectOrder(order)}
                          className={`cursor-pointer border-b border-[#F5EDE3] transition-colors hover:bg-[#FAF7F2] ${
                            isSelected ? "bg-[#FAF7F2]" : ""
                          }`}
                        >
                          <td className="px-4 py-4 text-[13px] font-medium text-[#2B1B12]">
                            {order.displayId}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2.5">
                              {order.customer.avatarUrl ? (
                                <Image
                                  src={order.customer.avatarUrl}
                                  alt=""
                                  width={32}
                                  height={32}
                                  className="size-8 rounded-full object-cover"
                                />
                              ) : (
                                <div className="flex size-8 items-center justify-center rounded-full bg-[#E8D8C3] text-[11px] font-semibold text-[#6B5344]">
                                  {order.customer.initials}
                                </div>
                              )}
                              <div>
                                <p className="text-[13px] font-medium text-[#2B1B12]">
                                  {order.customer.name}
                                </p>
                                <p className="text-[11px] text-[#9A8070]">
                                  {order.customer.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            {firstItem ? (
                              <div className="flex items-center gap-2.5">
                                {firstItem.image ? (
                                  <Image
                                    src={firstItem.image}
                                    alt=""
                                    width={36}
                                    height={36}
                                    className="size-9 rounded-lg object-cover"
                                  />
                                ) : (
                                  <div className="flex size-9 items-center justify-center rounded-lg bg-[#F5EDE3] text-[#9A8070]">
                                    <Sparkles className="size-4" />
                                  </div>
                                )}
                                <div>
                                  <p className="text-[13px] font-medium text-[#2B1B12]">
                                    {firstItem.productName}
                                    {order.items.length > 1
                                      ? ` +${order.items.length - 1} more`
                                      : ""}
                                  </p>
                                  <p className="text-[11px] text-[#9A8070]">
                                    Qty: {order.totalQuantity} · {firstItem.category}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <span className="text-[13px] text-[#9A8070]">—</span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-[13px] font-semibold text-[#2B1B12]">
                              {formatCurrency(order.total)}
                            </p>
                            <span
                              className={`text-[10px] font-medium ${
                                order.paymentLabel === "Paid"
                                  ? "text-[#1E7E34]"
                                  : "text-[#C5221F]"
                              }`}
                            >
                              {order.paymentLabel}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusBadgeClass(order.status)}`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
              {!loading && orders.length > 0 && (
                <p className="border-t border-[#EDE5D8] px-4 py-3 text-[12px] text-[#9A8070]">
                  Showing {orders.length} {tabLabel} order{orders.length === 1 ? "" : "s"}
                </p>
              )}
            </div>
          </div>

          {drawerOpen && selectedOrder && (
            <div className="flex w-[400px] shrink-0 flex-col border-l border-[#EDE5D8] bg-white shadow-xl">
              <div className="border-b border-[#EDE5D8] p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-serif text-[20px] font-semibold text-[#2B1B12]">
                      Order {selectedOrder.displayId}
                    </h2>
                    <p className="mt-0.5 text-[12px] text-[#9A8070]">
                      Placed on {formatPlacedAt(selectedOrder.createdAt)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="text-[#9A8070] hover:text-[#2B1B12]"
                  >
                    <X className="size-5" />
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between rounded-lg bg-[#F5D7B5]/40 px-4 py-2.5">
                  <span className="text-[12px] font-bold tracking-wide text-[#6B5344] uppercase">
                    {selectedOrder.status}
                  </span>
                  <div className="relative">
                    <select
                      value={selectedOrder.statusKey}
                      disabled={updatingStatus}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="appearance-none rounded-lg border border-[#EDE5D8] bg-white py-1.5 pr-8 pl-3 text-[12px] font-medium text-[#2B1B12] outline-none focus:border-[#C4A882] disabled:opacity-60"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-[#9A8070]" />
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-5">
                <section className="rounded-xl border border-[#EDE5D8] p-4">
                  <h3 className="mb-3 text-[11px] font-bold tracking-wide text-[#9A8070] uppercase">
                    Customer Details
                  </h3>
                  <div className="flex items-center gap-3">
                    {selectedOrder.customer.avatarUrl ? (
                      <Image
                        src={selectedOrder.customer.avatarUrl}
                        alt=""
                        width={40}
                        height={40}
                        className="size-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex size-10 items-center justify-center rounded-full bg-[#E8D8C3] text-[12px] font-semibold text-[#6B5344]">
                        {selectedOrder.customer.initials}
                      </div>
                    )}
                    <div>
                      <p className="text-[14px] font-semibold text-[#2B1B12]">
                        {selectedOrder.customer.name}
                      </p>
                      <p className="text-[12px] text-[#9A8070]">
                        {selectedOrder.customer.email}
                      </p>
                      {selectedOrder.customer.phone && (
                        <p className="text-[12px] text-[#9A8070]">
                          {selectedOrder.customer.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                <section className="rounded-xl border border-[#EDE5D8] p-4">
                  <h3 className="mb-3 text-[11px] font-bold tracking-wide text-[#9A8070] uppercase">
                    Order Items
                  </h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt=""
                            width={56}
                            height={56}
                            className="size-14 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex size-14 items-center justify-center rounded-lg bg-[#F5EDE3]">
                            <Sparkles className="size-5 text-[#9A8070]" />
                          </div>
                        )}
                        <div>
                          <p className="text-[14px] font-semibold text-[#2B1B12]">
                            {item.productName}
                          </p>
                          <p className="text-[12px] text-[#9A8070]">
                            Quantity: {item.quantity}
                            {item.variant ? ` · ${item.variant}` : ""}
                          </p>
                          <p className="text-[14px] font-semibold text-[#2B1B12]">
                            {formatCurrency(item.unitPrice * item.quantity)}
                          </p>
                          {item.artisan && (
                            <span className="mt-1 inline-block rounded-full bg-[#F5EDE3] px-2 py-0.5 text-[10px] font-medium text-[#6B5344]">
                              Artisan: {item.artisan}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 space-y-1 border-t border-[#EDE5D8] pt-3 text-[12px]">
                    <div className="flex justify-between text-[#6B5344]">
                      <span>Subtotal</span>
                      <span>{formatCurrency(selectedOrder.subtotal)}</span>
                    </div>
                    {selectedOrder.artisanTip > 0 && (
                      <div className="flex justify-between text-[#6B5344]">
                        <span>Artisan tip</span>
                        <span>{formatCurrency(selectedOrder.artisanTip)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-[#2B1B12]">
                      <span>Total</span>
                      <span>{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>
                </section>

                {selectedOrder.giftMessage && (
                  <section className="relative overflow-hidden rounded-xl border border-[#EDE5D8] bg-[#FAF7F2] p-5">
                    <span className="absolute top-2 right-4 font-serif text-[48px] leading-none text-[#E8D8C3]">
                      &ldquo;
                    </span>
                    <h3 className="mb-2 text-[11px] font-bold tracking-wide text-[#9A8070] uppercase">
                      Gift Message
                    </h3>
                    <p className="relative text-[13px] leading-relaxed text-[#6B5344] italic">
                      {selectedOrder.giftMessage}
                    </p>
                    <p className="mt-2 text-[11px] text-[#9A8070]">
                      — Note for packaging
                    </p>
                  </section>
                )}

                {selectedOrder.shippingAddress && (
                  <section className="rounded-xl border border-[#EDE5D8] p-4">
                    <h3 className="mb-2 text-[11px] font-bold tracking-wide text-[#9A8070] uppercase">
                      Shipping Address
                    </h3>
                    <p className="text-[13px] leading-relaxed text-[#6B5344]">
                      {selectedOrder.shippingAddress}
                    </p>
                  </section>
                )}
              </div>

              <div className="flex gap-3 border-t border-[#EDE5D8] p-5">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 rounded-xl border border-[#2B1B12] py-2.5 text-[13px] font-medium text-[#2B1B12] hover:bg-[#FAF7F2]"
                >
                  Print Slip
                </button>
                <button
                  type="button"
                  disabled={
                    updatingStatus ||
                    selectedOrder.statusKey === "shipped" ||
                    selectedOrder.statusKey === "delivered" ||
                    selectedOrder.statusKey === "cancelled"
                  }
                  onClick={() => {
                    const next =
                      selectedOrder.statusKey === "pending"
                        ? "processing"
                        : selectedOrder.statusKey === "confirmed"
                          ? "processing"
                          : selectedOrder.statusKey === "processing"
                            ? "shipped"
                            : "processing"
                    handleStatusChange(next)
                  }}
                  className="flex-1 rounded-xl bg-[#2B1B12] py-2.5 text-[13px] font-medium text-white hover:bg-[#3D2B21] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updatingStatus ? "Updating…" : "Advance Stage"}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
