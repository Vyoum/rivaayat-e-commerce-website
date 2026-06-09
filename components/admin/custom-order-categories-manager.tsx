"use client"

import { useCallback, useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

import type { CustomOrderCategorySetting } from "@/lib/custom-order-categories-shared"
import {
  formatCustomOrderStartingPrice,
  formatOptionsList,
  parseOptionsList,
} from "@/lib/custom-order-categories-shared"
import type { CustomOrderCategoryId } from "@/lib/custom-orders-config"
import { CUSTOM_ORDER_CATEGORIES } from "@/lib/custom-orders-config"

type FieldDraft = {
  label: string
  optionsText: string
}

type CategoryDraft = {
  label: string
  startingPrice: string
  formTitle: string
  fields: Record<string, FieldDraft>
  weightOptionsText: string
}

function buildDraft(category: CustomOrderCategorySetting): CategoryDraft {
  return {
    label: category.label,
    startingPrice: category.startingPrice === null ? "" : String(category.startingPrice),
    formTitle: category.formTitle,
    fields: Object.fromEntries(
      category.fields.map((field) => [
        field.id,
        {
          label: field.label,
          optionsText: formatOptionsList(field.options),
        },
      ]),
    ),
    weightOptionsText: formatOptionsList(category.weightOptions),
  }
}

function draftToPayload(draft: CategoryDraft) {
  return {
    label: draft.label.trim(),
    startingPrice: draft.startingPrice.trim() === "" ? null : Number(draft.startingPrice),
    formTitle: draft.formTitle.trim(),
    fields: Object.entries(draft.fields).map(([id, field]) => ({
      id,
      label: field.label.trim(),
      options: parseOptionsList(field.optionsText),
    })),
    weightOptions: parseOptionsList(draft.weightOptionsText),
  }
}

function draftsEqual(category: CustomOrderCategorySetting, draft: CategoryDraft) {
  const payload = draftToPayload(draft)
  if (payload.label !== category.label) return false
  if (payload.startingPrice !== category.startingPrice) return false
  if (payload.formTitle !== category.formTitle) return false
  if (payload.weightOptions.join("|") !== category.weightOptions.join("|")) return false

  return category.fields.every((field) => {
    const draftField = draft.fields[field.id]
    if (!draftField) return false
    if (draftField.label.trim() !== field.label) return false
    return parseOptionsList(draftField.optionsText).join("|") === field.options.join("|")
  })
}

const FIELD_ADMIN_LABELS: Record<string, string> = {
  base: "Base",
  sweetener: "Sweetening Agent",
  flavour: "Flavour Profile",
  coating: "Coating",
}

export function CustomOrderCategoriesManager() {
  const [categories, setCategories] = useState<CustomOrderCategorySetting[]>([])
  const [drafts, setDrafts] = useState<Partial<Record<CustomOrderCategoryId, CategoryDraft>>>({})
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<CustomOrderCategoryId | null>(null)
  const [error, setError] = useState<string | null>(null)

  const syncDrafts = useCallback((nextCategories: CustomOrderCategorySetting[]) => {
    setDrafts(
      Object.fromEntries(
        nextCategories.map((category) => [category.id, buildDraft(category)]),
      ) as Partial<Record<CustomOrderCategoryId, CategoryDraft>>,
    )
  }, [])

  const loadCategories = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/custom-order-categories")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load custom order categories")
      const nextCategories = data.categories ?? []
      setCategories(nextCategories)
      syncDrafts(nextCategories)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load custom order categories")
    } finally {
      setLoading(false)
    }
  }, [syncDrafts])

  useEffect(() => {
    void loadCategories()
  }, [loadCategories])

  async function handleSave(id: CustomOrderCategoryId) {
    const draft = drafts[id]
    if (!draft) return

    const payload = draftToPayload(draft)
    if (payload.startingPrice !== null && !Number.isFinite(payload.startingPrice)) {
      setError("Starting price must be a valid number.")
      return
    }

    setSavingId(id)
    setError(null)

    try {
      const res = await fetch("/api/admin/custom-order-categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...payload }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save category")

      setCategories((prev) => prev.map((category) => (category.id === id ? data.category : category)))
      syncDrafts([data.category])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save category")
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-serif text-[18px] font-semibold text-[#2B1B12]">Category Settings</h2>
        <p className="mt-1 text-[12px] text-[#9A8070]">
          Edit category names, starting prices, form options, and order details for the public custom
          orders page.
        </p>
      </div>

      {error ? (
        <p className="rounded-lg border border-[#F5C6C2] bg-[#FCE8E6] px-4 py-3 text-[12px] text-[#C5221F]">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center py-10 text-[#9A8070]">
          <Loader2 className="size-5 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => {
            const base = CUSTOM_ORDER_CATEGORIES.find((entry) => entry.id === category.id)
            const draft = drafts[category.id] ?? buildDraft(category)
            const parsedPrice =
              draft.startingPrice.trim() === ""
                ? null
                : Number(draft.startingPrice.replace(/,/g, ""))
            const dirty = !draftsEqual(category, draft)
            const isSaving = savingId === category.id
            const hasForm = (base?.fields.length ?? 0) > 0

            return (
              <article
                key={category.id}
                className="rounded-xl border border-[#EDE5D8] bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wide text-[#C4B5A5]">
                      {category.id}
                    </p>
                    {base?.comingSoon ? (
                      <span className="mt-1 inline-block rounded-full bg-[#EDE8DC] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#846246]">
                        Coming soon
                      </span>
                    ) : null}
                  </div>
                  <p className="font-serif text-[13px] text-[#6B5344]">
                    {formatCustomOrderStartingPrice(parsedPrice) ?? "No starting price"}
                  </p>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <label className="block">
                    <span className="text-[11px] font-medium uppercase tracking-wide text-[#9A8070]">
                      Category name
                    </span>
                    <input
                      value={draft.label}
                      onChange={(event) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [category.id]: { ...draft, label: event.target.value },
                        }))
                      }
                      maxLength={60}
                      className="mt-1 h-10 w-full rounded-lg border border-[#EDE5D8] px-3 font-serif text-[14px] text-[#2D1E17] outline-none focus:border-[#C4A882]"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[11px] font-medium uppercase tracking-wide text-[#9A8070]">
                      Starting price (₹)
                    </span>
                    <input
                      value={draft.startingPrice}
                      onChange={(event) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [category.id]: {
                            ...draft,
                            startingPrice: event.target.value.replace(/[^\d]/g, ""),
                          },
                        }))
                      }
                      inputMode="numeric"
                      placeholder="Leave blank to hide"
                      className="mt-1 h-10 w-full rounded-lg border border-[#EDE5D8] px-3 font-sans text-[14px] text-[#2D1E17] outline-none focus:border-[#C4A882]"
                    />
                  </label>
                </div>

                {hasForm ? (
                  <div className="mt-5 space-y-4 border-t border-[#F0EAE2] pt-5">
                    <label className="block">
                      <span className="text-[11px] font-medium uppercase tracking-wide text-[#9A8070]">
                        Form title
                      </span>
                      <input
                        value={draft.formTitle}
                        onChange={(event) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [category.id]: { ...draft, formTitle: event.target.value },
                          }))
                        }
                        maxLength={80}
                        className="mt-1 h-10 w-full rounded-lg border border-[#EDE5D8] px-3 font-serif text-[14px] text-[#2D1E17] outline-none focus:border-[#C4A882]"
                      />
                    </label>

                    <div className="grid gap-4 lg:grid-cols-2">
                      {category.fields.map((field) => {
                        const fieldDraft = draft.fields[field.id] ?? {
                          label: field.label,
                          optionsText: formatOptionsList(field.options),
                        }

                        return (
                          <div
                            key={field.id}
                            className="rounded-lg border border-[#F0EAE2] bg-[#FAF7F2] p-3"
                          >
                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#846246]">
                              {FIELD_ADMIN_LABELS[field.id] ?? field.id}
                            </p>
                            <label className="mt-3 block">
                              <span className="text-[10px] font-medium uppercase tracking-wide text-[#9A8070]">
                                Section label
                              </span>
                              <input
                                value={fieldDraft.label}
                                onChange={(event) =>
                                  setDrafts((prev) => ({
                                    ...prev,
                                    [category.id]: {
                                      ...draft,
                                      fields: {
                                        ...draft.fields,
                                        [field.id]: {
                                          ...fieldDraft,
                                          label: event.target.value,
                                        },
                                      },
                                    },
                                  }))
                                }
                                className="mt-1 h-9 w-full rounded-lg border border-[#EDE5D8] bg-white px-3 font-serif text-[13px] text-[#2D1E17] outline-none focus:border-[#C4A882]"
                              />
                            </label>
                            <label className="mt-3 block">
                              <span className="text-[10px] font-medium uppercase tracking-wide text-[#9A8070]">
                                Options (one per line)
                              </span>
                              <textarea
                                value={fieldDraft.optionsText}
                                onChange={(event) =>
                                  setDrafts((prev) => ({
                                    ...prev,
                                    [category.id]: {
                                      ...draft,
                                      fields: {
                                        ...draft.fields,
                                        [field.id]: {
                                          ...fieldDraft,
                                          optionsText: event.target.value,
                                        },
                                      },
                                    },
                                  }))
                                }
                                rows={4}
                                className="mt-1 w-full resize-y rounded-lg border border-[#EDE5D8] bg-white px-3 py-2 font-sans text-[12px] leading-relaxed text-[#2D1E17] outline-none focus:border-[#C4A882]"
                              />
                            </label>
                          </div>
                        )
                      })}
                    </div>

                    <label className="block">
                      <span className="text-[11px] font-medium uppercase tracking-wide text-[#9A8070]">
                        Order details — weight options (one per line)
                      </span>
                      <textarea
                        value={draft.weightOptionsText}
                        onChange={(event) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [category.id]: {
                              ...draft,
                              weightOptionsText: event.target.value,
                            },
                          }))
                        }
                        rows={3}
                        placeholder={"250gm\n500gm\n1kg"}
                        className="mt-1 w-full resize-y rounded-lg border border-[#EDE5D8] px-3 py-2 font-sans text-[12px] leading-relaxed text-[#2D1E17] outline-none focus:border-[#C4A882]"
                      />
                    </label>
                  </div>
                ) : (
                  <p className="mt-4 text-[12px] text-[#9A8070]">
                    Form options will be available once this category is live.
                  </p>
                )}

                <button
                  type="button"
                  disabled={isSaving || !dirty}
                  onClick={() => void handleSave(category.id)}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#2B1B12] px-3 py-2.5 text-[12px] font-medium text-white hover:bg-[#3D2B21] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
                  {isSaving ? "Saving…" : dirty ? "Save Category" : "Saved"}
                </button>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
