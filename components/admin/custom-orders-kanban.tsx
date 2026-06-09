"use client"

import { useCallback, useState } from "react"
import Link from "next/link"
import { Loader2, Search, Sparkles, X } from "lucide-react"

import { AdminSidebar } from "./admin-sidebar"
import { CommerceSubnav } from "./commerce-subnav"
import { HOUSE_OF_INDIKA } from "@/lib/brand"
import type {
  CustomOrderKanbanBoard,
  CustomOrderKanbanCard,
} from "@/lib/custom-order-admin-server"
import { getInitials } from "@/lib/profile-utils"

type CustomOrdersKanbanProps = {
  initialBoard: CustomOrderKanbanBoard
}

function formatBadgeCount(count: number, label: string) {
  if (count === 0) return `0 ${label}`
  return `${count} ${label}`
}

function WhatsAppButton({ phone }: { phone: string }) {
  const digits = phone.replace(/\D/g, "")
  if (!digits) return null

  return (
    <a
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 flex items-center gap-2 rounded-lg border border-[#25D366] px-3 py-1.5 text-[12px] font-medium text-[#25D366]"
    >
      <svg viewBox="0 0 24 24" className="size-3.5" fill="#25D366" aria-hidden>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      WhatsApp
    </a>
  )
}

export function CustomOrdersKanban({ initialBoard }: CustomOrdersKanbanProps) {
  const [board, setBoard] = useState(initialBoard)
  const [selectedId, setSelectedId] = useState<string | null>(
    initialBoard.columns.flatMap((col) => col.cards)[0]?.id ?? null,
  )
  const [drawerOpen, setDrawerOpen] = useState(Boolean(selectedId))
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const allCards = board.columns.flatMap((col) => col.cards)
  const selected = allCards.find((card) => card.id === selectedId) ?? null

  const refreshBoard = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/custom-orders")
      if (!res.ok) throw new Error("Failed to refresh custom orders")
      const data = (await res.json()) as CustomOrderKanbanBoard
      setBoard(data)
      const stillExists = data.columns
        .flatMap((col) => col.cards)
        .some((card) => card.id === selectedId)
      if (!stillExists) {
        const first = data.columns.flatMap((col) => col.cards)[0]
        setSelectedId(first?.id ?? null)
        setDrawerOpen(Boolean(first))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh")
    } finally {
      setLoading(false)
    }
  }, [selectedId])

  async function assignArtisan(artisanId: string) {
    if (!selected) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/custom-orders/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artisanId }),
      })
      if (!res.ok) throw new Error("Failed to assign artisan")
      await refreshBoard()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign artisan")
    } finally {
      setSaving(false)
    }
  }

  async function updateStatus(status: CustomOrderKanbanCard["status"]) {
    if (!selected) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/custom-orders/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error("Failed to update status")
      await refreshBoard()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status")
    } finally {
      setSaving(false)
    }
  }

  function openCard(card: CustomOrderKanbanCard) {
    setSelectedId(card.id)
    setDrawerOpen(true)
  }

  const columnBadgeLabels: Record<string, string> = {
    new: "NEW",
    assigned: "IN PROGRESS",
    ready: "READY",
    delivered: "DONE",
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="ml-[220px] flex min-h-screen flex-1 flex-col bg-[#F9F7F2]">
        <header className="flex h-[52px] items-center justify-between border-b border-[#EDE5D8] bg-white px-6">
          <div className="flex items-center gap-6">
            <span className="text-[13px] font-medium text-[#6B5344]">{HOUSE_OF_INDIKA}</span>
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

            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
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
              <button
                type="button"
                onClick={() => void refreshBoard()}
                disabled={loading}
                className="rounded-lg border border-[#EDE5D8] bg-white px-3 py-1.5 text-[12px] font-medium text-[#6B5344] hover:bg-[#FAF7F2] disabled:opacity-60"
              >
                {loading ? "Refreshing…" : "Refresh"}
              </button>
            </div>

            {error ? (
              <p className="mb-4 rounded-lg border border-[#F5C6C2] bg-[#FCE8E6] px-4 py-3 text-[12px] text-[#C5221F]">
                {error}
              </p>
            ) : null}

            <div className="flex gap-4">
              {board.columns.map((col) => (
                <div key={col.key} className="w-[260px] shrink-0 rounded-xl bg-white/50">
                  <div
                    className={`flex items-center justify-between rounded-t-xl px-4 py-3 ${col.headerBg}`}
                  >
                    <span className="text-[11px] font-bold tracking-wide text-[#2B1B12]">
                      {col.title}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${col.badgeBg}`}>
                      {formatBadgeCount(col.cards.length, columnBadgeLabels[col.key])}
                    </span>
                  </div>

                  <div className="space-y-3 p-3">
                    {col.cards.length === 0 ? (
                      <div className="rounded-xl border-2 border-dashed border-[#D4C4A8] px-4 py-8 text-center text-[12px] text-[#9A8070]">
                        No orders here
                      </div>
                    ) : (
                      col.cards.map((card) => (
                        <button
                          key={card.id}
                          type="button"
                          onClick={() => openCard(card)}
                          className={`w-full rounded-xl border bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md ${
                            selectedId === card.id
                              ? "border-[#8B6F47] ring-1 ring-[#8B6F47]/30"
                              : "border-[#EDE5D8]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${card.tagColor}`}
                            >
                              {card.category}
                            </span>
                            <span className={`text-[10px] font-medium ${card.dueColor}`}>
                              {card.dueLabel}
                            </span>
                          </div>
                          <p className="mt-2 text-[11px] font-medium text-[#9A8070]">
                            {card.displayId}
                          </p>
                          <p className="text-[13px] font-semibold text-[#2B1B12]">
                            {card.customerName}
                          </p>
                          <p className="mt-1 text-[11px] leading-relaxed text-[#6B5344]">
                            {card.summary}
                          </p>
                          {card.artisanName ? (
                            <span className="mt-3 inline-block rounded-full bg-[#E6F4EA] px-2 py-0.5 text-[10px] font-medium text-[#1E7E34]">
                              Artisan: {card.artisanName}
                            </span>
                          ) : null}
                          {card.showAssign ? (
                            <p className="mt-3 text-[11px] font-bold tracking-wide text-[#5E35B1] uppercase">
                              Assign Artisan
                            </p>
                          ) : null}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {drawerOpen && selected ? (
            <div className="flex w-[380px] shrink-0 flex-col border-l border-[#EDE5D8] bg-white">
              <div className="flex items-start justify-between border-b border-[#EDE5D8] p-5">
                <div>
                  <h2 className="font-serif text-[18px] font-semibold text-[#2B1B12]">
                    Custom Order #{selected.displayId}
                  </h2>
                  <span
                    className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${selected.tagColor}`}
                  >
                    {selected.category}
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
                      {getInitials(selected.customerName)}
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#2B1B12]">
                        {selected.customerName}
                      </p>
                      {selected.customerEmail ? (
                        <p className="text-[12px] text-[#9A8070]">{selected.customerEmail}</p>
                      ) : null}
                    </div>
                  </div>
                  <WhatsAppButton phone={selected.whatsapp} />
                </section>

                <section>
                  <h3 className="mb-3 text-[11px] font-bold tracking-wide text-[#9A8070] uppercase">
                    Order Specification
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Weight", value: selected.weight },
                      { label: "Quantity", value: selected.quantity },
                      ...Object.entries(selected.selections).map(([label, value]) => ({
                        label,
                        value,
                      })),
                    ]
                      .filter((spec) => spec.value)
                      .map((spec) => (
                        <div
                          key={spec.label}
                          className="rounded-lg border border-[#EDE5D8] bg-[#FAF7F2] p-3"
                        >
                          <p className="text-[10px] font-medium text-[#9A8070]">{spec.label}</p>
                          <p className="mt-0.5 text-[13px] font-semibold text-[#2B1B12]">
                            {spec.value}
                          </p>
                        </div>
                      ))}
                  </div>
                </section>

                {selected.notes ? (
                  <div className="rounded-lg border border-[#F5E6A3] bg-[#FFFBE6] p-4">
                    <p className="text-[11px] font-bold text-[#C5221F] uppercase">
                      Customer Notes
                    </p>
                    <p className="mt-2 text-[12px] leading-relaxed text-[#6B5344]">
                      {selected.notes}
                    </p>
                  </div>
                ) : null}

                <section>
                  <h3 className="mb-3 text-[11px] font-bold tracking-wide text-[#9A8070] uppercase">
                    Assign Artisan
                  </h3>
                  <select
                    value={selected.artisanId ?? ""}
                    disabled={saving || board.artisans.length === 0}
                    onChange={(event) => {
                      const value = event.target.value
                      if (value) void assignArtisan(value)
                    }}
                    className="w-full rounded-lg border border-[#EDE5D8] bg-white px-3 py-2 text-[13px] text-[#2B1B12]"
                  >
                    <option value="">
                      {board.artisans.length === 0 ? "No artisans available" : "Select artisan"}
                    </option>
                    {board.artisans.map((artisan) => (
                      <option key={artisan.id} value={artisan.id}>
                        {artisan.name}
                      </option>
                    ))}
                  </select>
                </section>

                <section>
                  <h3 className="mb-3 text-[11px] font-bold tracking-wide text-[#9A8070] uppercase">
                    Update Status
                  </h3>
                  <select
                    value={selected.status}
                    disabled={saving}
                    onChange={(event) => {
                      void updateStatus(event.target.value as CustomOrderKanbanCard["status"])
                    }}
                    className="w-full rounded-lg border border-[#EDE5D8] bg-white px-3 py-2 text-[13px] text-[#2B1B12]"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </section>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-[#EDE5D8] p-5">
                {saving ? (
                  <span className="flex items-center gap-2 text-[12px] text-[#6B5344]">
                    <Loader2 className="size-4 animate-spin" />
                    Saving…
                  </span>
                ) : null}
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  )
}
