"use client"

import { useCallback, useEffect, useState } from "react"
import { Loader2, Plus, Sparkles, Tag, Trash2 } from "lucide-react"

import { AdminSidebar } from "./admin-sidebar"
import { CommerceSubnav } from "./commerce-subnav"
import type { AdminDiscountCode, DiscountType } from "@/types/discount-code"

const emptyForm = {
  code: "",
  type: "percentage" as DiscountType,
  value: "",
  minOrderAmount: "",
  maxUses: "",
  expiresAt: "",
}

function formatValue(type: DiscountType, value: number) {
  return type === "percentage" ? `${value}%` : `₹${value.toLocaleString("en-IN")}`
}

export function DiscountCodesPage() {
  const [codes, setCodes] = useState<AdminDiscountCode[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)

  const loadCodes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/discount-codes")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed to load discount codes")
      setCodes(data.codes ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load discount codes")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadCodes()
  }, [loadCodes])

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const res = await fetch("/api/admin/discount-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code,
          type: form.type,
          value: Number(form.value),
          minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : null,
          maxUses: form.maxUses ? Number(form.maxUses) : null,
          expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed to create code")

      setForm(emptyForm)
      setShowForm(false)
      await loadCodes()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create code")
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(code: AdminDiscountCode) {
    try {
      const res = await fetch(`/api/admin/discount-codes/${code.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !code.isActive }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed to update code")
      setCodes((prev) => prev.map((entry) => (entry.id === code.id ? data.code : entry)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update code")
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this discount code?")) return

    try {
      const res = await fetch(`/api/admin/discount-codes/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed to delete code")
      setCodes((prev) => prev.filter((entry) => entry.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete code")
    }
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="ml-[220px] flex min-h-screen flex-1 flex-col bg-[#F9F7F2]">
        <main className="flex-1 p-6">
          <CommerceSubnav />

          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-[#C4A882]" />
              <div>
                <h1 className="font-serif text-[22px] font-semibold text-[#2B1B12]">
                  Discount Codes
                </h1>
                <p className="text-[12px] text-[#9A8070]">
                  Create promo codes customers can apply at checkout.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowForm((open) => !open)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2B1B12] px-4 py-2.5 text-[12px] font-medium text-white hover:bg-[#3D2B21]"
            >
              <Plus className="size-4" />
              New Code
            </button>
          </div>

          {error ? (
            <p className="mb-4 rounded-lg border border-[#F5C6C2] bg-[#FCE8E6] px-4 py-3 text-[12px] text-[#C5221F]">
              {error}
            </p>
          ) : null}

          {showForm ? (
            <form
              onSubmit={handleCreate}
              className="mb-6 rounded-xl border border-[#EDE5D8] bg-white p-5"
            >
              <h2 className="font-serif text-[18px] text-[#2B1B12]">Create discount code</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <label className="block">
                  <span className="text-[11px] font-medium tracking-wide text-[#9A8070] uppercase">
                    Code
                  </span>
                  <input
                    required
                    value={form.code}
                    onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="WELCOME10"
                    className="mt-1 h-10 w-full rounded-lg border border-[#EDE5D8] px-3 text-[13px] uppercase outline-none focus:border-[#C4A882]"
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] font-medium tracking-wide text-[#9A8070] uppercase">
                    Type
                  </span>
                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, type: e.target.value as DiscountType }))
                    }
                    className="mt-1 h-10 w-full rounded-lg border border-[#EDE5D8] px-3 text-[13px] outline-none focus:border-[#C4A882]"
                  >
                    <option value="percentage">Percentage off</option>
                    <option value="fixed">Fixed amount off</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-[11px] font-medium tracking-wide text-[#9A8070] uppercase">
                    Value
                  </span>
                  <input
                    required
                    type="number"
                    min="1"
                    max={form.type === "percentage" ? "100" : undefined}
                    value={form.value}
                    onChange={(e) => setForm((prev) => ({ ...prev, value: e.target.value }))}
                    placeholder={form.type === "percentage" ? "10" : "500"}
                    className="mt-1 h-10 w-full rounded-lg border border-[#EDE5D8] px-3 text-[13px] outline-none focus:border-[#C4A882]"
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] font-medium tracking-wide text-[#9A8070] uppercase">
                    Min order (optional)
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={form.minOrderAmount}
                    onChange={(e) => setForm((prev) => ({ ...prev, minOrderAmount: e.target.value }))}
                    placeholder="999"
                    className="mt-1 h-10 w-full rounded-lg border border-[#EDE5D8] px-3 text-[13px] outline-none focus:border-[#C4A882]"
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] font-medium tracking-wide text-[#9A8070] uppercase">
                    Max uses (optional)
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={form.maxUses}
                    onChange={(e) => setForm((prev) => ({ ...prev, maxUses: e.target.value }))}
                    placeholder="100"
                    className="mt-1 h-10 w-full rounded-lg border border-[#EDE5D8] px-3 text-[13px] outline-none focus:border-[#C4A882]"
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] font-medium tracking-wide text-[#9A8070] uppercase">
                    Expires (optional)
                  </span>
                  <input
                    type="date"
                    value={form.expiresAt}
                    onChange={(e) => setForm((prev) => ({ ...prev, expiresAt: e.target.value }))}
                    className="mt-1 h-10 w-full rounded-lg border border-[#EDE5D8] px-3 text-[13px] outline-none focus:border-[#C4A882]"
                  />
                </label>
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#2B1B12] px-4 py-2 text-[12px] font-medium text-white disabled:opacity-60"
                >
                  {saving ? <Loader2 className="size-4 animate-spin" /> : null}
                  Create Code
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setForm(emptyForm)
                  }}
                  className="rounded-lg border border-[#EDE5D8] px-4 py-2 text-[12px] text-[#6B5344]"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : null}

          <div className="overflow-hidden rounded-xl border border-[#EDE5D8] bg-white">
            <table className="w-full">
              <thead className="border-b border-[#EDE5D8] bg-[#FAF7F2]">
                <tr>
                  {["Code", "Discount", "Usage", "Min order", "Expires", "Status", ""].map(
                    (heading) => (
                      <th
                        key={heading || "actions"}
                        className="px-4 py-3 text-left text-[11px] font-bold tracking-wide text-[#9A8070] uppercase"
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-[13px] text-[#9A8070]">
                      <Loader2 className="mx-auto size-5 animate-spin" />
                    </td>
                  </tr>
                ) : codes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-[13px] text-[#9A8070]">
                      No discount codes yet. Create one for your customers.
                    </td>
                  </tr>
                ) : (
                  codes.map((code) => (
                    <tr key={code.id} className="border-b border-[#F5EDE3] last:border-0">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Tag className="size-4 text-[#C4A882]" />
                          <span className="font-mono text-[13px] font-semibold text-[#2B1B12]">
                            {code.code}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[13px] text-[#2B1B12]">
                        {formatValue(code.type, code.value)}
                      </td>
                      <td className="px-4 py-4 text-[13px] text-[#6B5344]">
                        {code.usedCount}
                        {code.maxUses != null ? ` / ${code.maxUses}` : ""}
                      </td>
                      <td className="px-4 py-4 text-[13px] text-[#6B5344]">
                        {code.minOrderAmount != null
                          ? `₹${code.minOrderAmount.toLocaleString("en-IN")}`
                          : "—"}
                      </td>
                      <td className="px-4 py-4 text-[13px] text-[#6B5344]">
                        {code.expiresAt
                          ? new Date(code.expiresAt).toLocaleDateString("en-IN")
                          : "—"}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => void toggleActive(code)}
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            code.isActive
                              ? "bg-[#E6F4EA] text-[#1E7E34]"
                              : "bg-[#F0EDE8] text-[#6B5344]"
                          }`}
                        >
                          {code.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => void handleDelete(code.id)}
                          className="text-[#9A8070] hover:text-[#C5221F]"
                          aria-label={`Delete ${code.code}`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  )
}
