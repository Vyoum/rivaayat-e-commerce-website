"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  X,
  ChevronDown,
  Sparkles,
  MessageCircle,
} from "lucide-react"
import { AdminSidebar } from "./admin-sidebar"
import { CommerceSubnav } from "./commerce-subnav"
import { HOUSE_OF_INDIKA } from "@/lib/brand"

const tabs = [
  { label: "All", count: 127 },
  { label: "Pending", count: 8 },
  { label: "Processing", count: 34, active: true },
  { label: "Shipped", count: 52 },
  { label: "Delivered", count: 28 },
  { label: "Cancelled", count: 5 },
]

const orders = [
  {
    id: "#HOI-2487",
    customer: "Aanya Sharma",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    badge: "WhatsApp Connected",
    product: "Terracotta Amphora",
    productImage:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=80&h=80&fit=crop",
    qty: 2,
    category: "Ceramics",
    amount: "₹ 4,250.00",
    payment: "Paid",
    status: "Processing",
    selected: true,
  },
  {
    id: "#HOI-2486",
    customer: "Rahul Kapoor",
    initials: "RK",
    email: "rahul.k@email.com",
    product: "Linen Throw Blanket",
    productIcon: true,
    qty: 1,
    category: "Textiles",
    amount: "₹ 2,800.00",
    payment: "Unpaid",
    status: "Pending",
    selected: false,
  },
]

export function OrdersPage() {
  const [drawerOpen, setDrawerOpen] = useState(true)

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
              {tabs.map((tab) => (
                <button
                  key={tab.label}
                  type="button"
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium transition-colors ${
                    tab.active
                      ? "border-b-2 border-[#2B1B12] text-[#2B1B12]"
                      : "text-[#9A8070] hover:text-[#2B1B12]"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                      tab.active
                        ? "bg-[#2B1B12] text-white"
                        : "bg-[#EDE5D8] text-[#6B5344]"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="mb-4 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#9A8070]" />
                <input
                  type="search"
                  placeholder="Search orders, customers, or IDs..."
                  className="h-10 w-full rounded-xl border border-[#EDE5D8] bg-white pr-4 pl-10 text-[13px] outline-none focus:border-[#C4A882]"
                />
              </div>
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-[#EDE5D8] bg-white px-4 py-2.5 text-[13px] font-medium text-[#6B5344]"
              >
                Categories
                <ChevronDown className="size-3.5" />
              </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#EDE5D8] bg-white">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#EDE5D8] bg-[#FAF7F2]">
                    <th className="w-10 px-4 py-3">
                      <input type="checkbox" className="rounded" />
                    </th>
                    {["Order ID", "Customer", "Products", "Amount", "Status"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-[11px] font-semibold tracking-wide text-[#9A8070] uppercase"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => setDrawerOpen(true)}
                      className={`cursor-pointer border-b border-[#F5EDE3] transition-colors hover:bg-[#FAF7F2] ${
                        order.selected ? "bg-[#FAF7F2]" : ""
                      }`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={order.selected}
                          readOnly
                          className="rounded"
                        />
                      </td>
                      <td className="px-4 py-4 text-[13px] font-medium text-[#2B1B12]">
                        {order.id}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2.5">
                          {order.avatar ? (
                            <img
                              src={order.avatar}
                              alt=""
                              className="size-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex size-8 items-center justify-center rounded-full bg-[#E8D8C3] text-[11px] font-semibold text-[#6B5344]">
                              {order.initials}
                            </div>
                          )}
                          <div>
                            <p className="text-[13px] font-medium text-[#2B1B12]">
                              {order.customer}
                            </p>
                            {order.badge && (
                              <span className="flex items-center gap-1 text-[10px] text-[#25D366]">
                                <MessageCircle className="size-3" />
                                {order.badge}
                              </span>
                            )}
                            {order.email && (
                              <p className="text-[11px] text-[#9A8070]">
                                {order.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2.5">
                          {order.productImage ? (
                            <img
                              src={order.productImage}
                              alt=""
                              className="size-9 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex size-9 items-center justify-center rounded-lg bg-[#F5EDE3] text-[#9A8070]">
                              <Sparkles className="size-4" />
                            </div>
                          )}
                          <div>
                            <p className="text-[13px] font-medium text-[#2B1B12]">
                              {order.product}
                            </p>
                            <p className="text-[11px] text-[#9A8070]">
                              Qty: {order.qty} · {order.category}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-[13px] font-semibold text-[#2B1B12]">
                          {order.amount}
                        </p>
                        <span
                          className={`text-[10px] font-medium ${
                            order.payment === "Paid"
                              ? "text-[#1E7E34]"
                              : "text-[#C5221F]"
                          }`}
                        >
                          {order.payment}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            order.status === "Processing"
                              ? "bg-[#F5D7B5] text-[#6B5344]"
                              : "bg-[#F0EDE8] text-[#6B5344]"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="border-t border-[#EDE5D8] px-4 py-3 text-[12px] text-[#9A8070]">
                Showing 1 to 2 of 34 processing entries
              </p>
            </div>
          </div>

          {drawerOpen && (
            <div className="flex w-[400px] shrink-0 flex-col border-l border-[#EDE5D8] bg-white shadow-xl">
              <div className="border-b border-[#EDE5D8] p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-serif text-[20px] font-semibold text-[#2B1B12]">
                      Order #HOI-2487
                    </h2>
                    <p className="mt-0.5 text-[12px] text-[#9A8070]">
                      Placed on Oct 24, 2023 at 14:32 PM
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
                    Processing
                  </span>
                  <button
                    type="button"
                    className="text-[12px] font-medium text-[#2B1B12] underline"
                  >
                    Update Status
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-5">
                <section className="rounded-xl border border-[#EDE5D8] p-4">
                  <h3 className="mb-3 text-[11px] font-bold tracking-wide text-[#9A8070] uppercase">
                    Customer Details
                  </h3>
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face"
                      alt=""
                      className="size-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-[14px] font-semibold text-[#2B1B12]">
                        Aanya Sharma
                      </p>
                      <p className="text-[12px] text-[#9A8070]">
                        aanya.sharma@gmail.com
                      </p>
                      <p className="text-[12px] text-[#9A8070]">
                        +91 98765 43210
                      </p>
                    </div>
                  </div>
                </section>

                <section className="rounded-xl border border-[#EDE5D8] p-4">
                  <h3 className="mb-3 text-[11px] font-bold tracking-wide text-[#9A8070] uppercase">
                    Order Items
                  </h3>
                  <div className="flex gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=80&h=80&fit=crop"
                      alt=""
                      className="size-14 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-[14px] font-semibold text-[#2B1B12]">
                        Terracotta Amphora
                      </p>
                      <p className="text-[12px] text-[#9A8070]">Quantity: 2</p>
                      <p className="text-[14px] font-semibold text-[#2B1B12]">
                        ₹ 4,250.00
                      </p>
                      <span className="mt-1 inline-block rounded-full bg-[#F5EDE3] px-2 py-0.5 text-[10px] font-medium text-[#6B5344]">
                        Artisan: Master Potter Dev
                      </span>
                    </div>
                  </div>
                </section>

                <section className="relative overflow-hidden rounded-xl border border-[#EDE5D8] bg-[#FAF7F2] p-5">
                  <span className="absolute top-2 right-4 font-serif text-[48px] leading-none text-[#E8D8C3]">
                    &ldquo;
                  </span>
                  <h3 className="mb-2 text-[11px] font-bold tracking-wide text-[#9A8070] uppercase">
                    Gift Message
                  </h3>
                  <p className="relative text-[13px] leading-relaxed text-[#6B5344] italic">
                    Happy Anniversary! May these earthy tones bring warmth to
                    our new home.
                  </p>
                  <p className="mt-2 text-[11px] text-[#9A8070]">
                    — Note for packaging
                  </p>
                </section>
              </div>

              <div className="flex gap-3 border-t border-[#EDE5D8] p-5">
                <button
                  type="button"
                  className="flex-1 rounded-xl border border-[#2B1B12] py-2.5 text-[13px] font-medium text-[#2B1B12] hover:bg-[#FAF7F2]"
                >
                  Print Slip
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-xl bg-[#2B1B12] py-2.5 text-[13px] font-medium text-white hover:bg-[#3D2B21]"
                >
                  Initiate Fulfillment
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
