"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, X, Sparkles } from "lucide-react"
import { AdminSidebar } from "./admin-sidebar"
import { CommerceSubnav } from "./commerce-subnav"

const columns = [
  {
    title: "NEW REQUESTS",
    badge: "7 NEW",
    headerBg: "bg-[#E8D5C0]",
    badgeBg: "bg-[#2B1B12] text-white",
    cards: [
      {
        id: "COI-089",
        tag: "Protein Laddoos",
        tagColor: "bg-[#EDE7F6] text-[#5E35B1]",
        due: "Due in 1 day",
        dueColor: "text-[#C5221F]",
        customer: "Ananya Sharma",
        description:
          "Custom protein laddoos with millets, wild honey, rose petals. No refined sugar.",
        showAssign: true,
      },
      {
        id: "COI-088",
        tag: "Bridal Lehenga Trim",
        tagColor: "bg-[#FCE4EC] text-[#AD1457]",
        due: "Due in 2 days",
        dueColor: "text-[#B95000]",
        customer: "Priya Sharma",
        description: "Gold zari border trim for bridal lehenga, 3 metres.",
        showAssign: true,
      },
    ],
  },
  {
    title: "ARTISAN ASSIGNED",
    badge: "12 IN PROGRESS",
    headerBg: "bg-[#D4C4A8]",
    badgeBg: "bg-[#6B5344] text-white",
    cards: [
      {
        id: "COI-084",
        tag: "Custom Pickle",
        tagColor: "bg-[#E6F4EA] text-[#1E7E34]",
        due: "Due Oct 12",
        dueColor: "text-[#6B5344]",
        customer: "Rajiv Menon",
        description: "Mango pickle with extra mustard seeds, mild spice level.",
        progress: 65,
        artisan: "Meera",
      },
    ],
  },
  {
    title: "READY TO SHIP",
    badge: "4 READY",
    headerBg: "bg-[#C8D5BC]",
    badgeBg: "bg-[#4A6741] text-white",
    cards: [],
  },
  {
    title: "DELIVERED",
    badge: "28 DONE",
    headerBg: "bg-[#D5C4C0]",
    badgeBg: "bg-[#6B5344] text-white",
    cards: [],
  },
]

export function CustomOrdersKanban() {
  const [drawerOpen, setDrawerOpen] = useState(true)

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="ml-[220px] flex min-h-screen flex-1 flex-col bg-[#F9F7F2]">
        <header className="flex h-[52px] items-center justify-between border-b border-[#EDE5D8] bg-white px-6">
          <div className="flex items-center gap-6">
            <span className="text-[13px] font-medium text-[#6B5344]">
              House of Indika
            </span>
            <nav className="flex items-center gap-5">
              {["Dashboard", "Analytics", "Reports"].map((tab) => (
                <Link
                  key={tab}
                  href="/admin/commerce/custom-orders"
                  className={`text-[13px] font-medium transition-colors ${
                    tab === "Dashboard"
                      ? "border-b-2 border-[#2B1B12] pb-0.5 text-[#2B1B12]"
                      : "text-[#9A8070] hover:text-[#2B1B12]"
                  }`}
                >
                  {tab}
                </Link>
              ))}
            </nav>
          </div>
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full border border-[#EDE5D8] text-[#6B5344] hover:bg-[#FAF7F2]"
          >
            <Search className="size-4" />
          </button>
        </header>

        <main className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-x-auto p-6">
            <CommerceSubnav />

            <div className="mb-5 flex items-center gap-2">
              <Sparkles className="size-4 text-[#C4A882]" />
              <div>
                <h1 className="font-serif text-[22px] font-semibold text-[#2B1B12]">
                  Custom Orders
                </h1>
                <p className="text-[12px] text-[#9A8070]">
                  Review, assign, and track personalised artisan orders.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              {columns.map((col) => (
                <div
                  key={col.title}
                  className="w-[260px] shrink-0 rounded-xl bg-white/50"
                >
                  <div
                    className={`flex items-center justify-between rounded-t-xl px-4 py-3 ${col.headerBg}`}
                  >
                    <span className="text-[11px] font-bold tracking-wide text-[#2B1B12]">
                      {col.title}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${col.badgeBg}`}
                    >
                      {col.badge}
                    </span>
                  </div>

                  <div className="space-y-3 p-3">
                    {col.cards.length === 0 ? (
                      <div className="rounded-xl border-2 border-dashed border-[#D4C4A8] px-4 py-8 text-center text-[12px] text-[#9A8070]">
                        Drop cards here
                      </div>
                    ) : (
                      col.cards.map((card) => (
                        <button
                          key={card.id}
                          type="button"
                          onClick={() => setDrawerOpen(true)}
                          className="w-full rounded-xl border border-[#EDE5D8] bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${card.tagColor}`}
                            >
                              {card.tag}
                            </span>
                            <span
                              className={`text-[10px] font-medium ${card.dueColor}`}
                            >
                              {card.due}
                            </span>
                          </div>
                          <p className="mt-2 text-[11px] font-medium text-[#9A8070]">
                            {card.id}
                          </p>
                          <p className="text-[13px] font-semibold text-[#2B1B12]">
                            {card.customer}
                          </p>
                          <p className="mt-1 text-[11px] leading-relaxed text-[#6B5344]">
                            {card.description}
                          </p>
                          {"progress" in card && card.progress && (
                            <div className="mt-3">
                              <div className="h-1.5 overflow-hidden rounded-full bg-[#EDE5D8]">
                                <div
                                  className="h-full rounded-full bg-[#8B6F47]"
                                  style={{ width: `${card.progress}%` }}
                                />
                              </div>
                              <span className="mt-1.5 inline-block rounded-full bg-[#E6F4EA] px-2 py-0.5 text-[10px] font-medium text-[#1E7E34]">
                                Artisan: {card.artisan}
                              </span>
                            </div>
                          )}
                          {"showAssign" in card && card.showAssign && (
                            <p className="mt-3 text-[11px] font-bold tracking-wide text-[#5E35B1] uppercase">
                              Assign Artisan
                            </p>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {drawerOpen && (
            <div className="flex w-[380px] shrink-0 flex-col border-l border-[#EDE5D8] bg-white">
              <div className="flex items-start justify-between border-b border-[#EDE5D8] p-5">
                <div>
                  <h2 className="font-serif text-[18px] font-semibold text-[#2B1B12]">
                    Custom Order #COI-089
                  </h2>
                  <span className="mt-1 inline-block rounded-full bg-[#EDE7F6] px-2.5 py-0.5 text-[11px] font-semibold text-[#5E35B1]">
                    Protein Laddoos
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="text-[#9A8070] hover:text-[#2B1B12]"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex-1 space-y-5 overflow-y-auto p-5">
                <section>
                  <h3 className="mb-3 text-[11px] font-bold tracking-wide text-[#9A8070] uppercase">
                    Customer Details
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-[#F5D0B5] text-[13px] font-semibold text-[#8B4513]">
                      AS
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#2B1B12]">
                        Ananya Sharma
                      </p>
                      <p className="text-[12px] text-[#9A8070]">
                        ananya.sharma@gmail.com
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mt-3 flex items-center gap-2 rounded-lg border border-[#25D366] px-3 py-1.5 text-[12px] font-medium text-[#25D366]"
                  >
                    <svg viewBox="0 0 24 24" className="size-3.5" fill="#25D366">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </button>
                </section>

                <section>
                  <h3 className="mb-3 text-[11px] font-bold tracking-wide text-[#9A8070] uppercase">
                    Visual Specification
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Base Ingredient", value: "Mixed Millets" },
                      { label: "Binding Agent", value: "Wild Honey" },
                      { label: "Primary Flavour", value: "Dried Rose Petals" },
                      { label: "Add-ons", value: "Extra Almonds" },
                    ].map((spec) => (
                      <div
                        key={spec.label}
                        className="rounded-lg border border-[#EDE5D8] bg-[#FAF7F2] p-3"
                      >
                        <p className="text-[10px] font-medium text-[#9A8070]">
                          {spec.label}
                        </p>
                        <p className="mt-0.5 text-[13px] font-semibold text-[#2B1B12]">
                          {spec.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="rounded-lg border border-[#F5E6A3] bg-[#FFFBE6] p-4">
                  <p className="text-[11px] font-bold text-[#C5221F] uppercase">
                    Strict Requirements
                  </p>
                  <p className="mt-2 text-[12px] leading-relaxed text-[#6B5344]">
                    Absolutely no refined sugar. Customer has a mild peanut
                    allergy, ensure cross-contamination protocols.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-[#EDE5D8] p-5">
                <button
                  type="button"
                  className="px-4 py-2 text-[13px] font-medium text-[#6B5344]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-xl bg-[#2B1B12] px-5 py-2 text-[13px] font-medium text-white hover:bg-[#3D2B21]"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
