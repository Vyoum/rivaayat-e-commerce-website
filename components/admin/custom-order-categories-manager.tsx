"use client"

import { useCallback, useEffect, useState } from "react"
import { Loader2, Plus, Trash2 } from "lucide-react"

import type { CustomOrderCategorySetting } from "@/lib/custom-order-categories-shared"
import {
  formatCustomOrderStartingPrice,
  pricedOptionsEqual,
} from "@/lib/custom-order-categories-shared"
import type { CustomOrderCategoryId } from "@/lib/custom-orders-config"
import { CUSTOM_ORDER_BOX_SIZES, CUSTOM_ORDER_CATEGORIES } from "@/lib/custom-orders-config"

type OptionDraft = {
  label: string
  price: string
}

type FieldDraft = {
  label: string
  options: OptionDraft[]
}

type CategoryDraft = {
  label: string
  startingPrice: string
  formTitle: string
  fields: Record<string, FieldDraft>
  weightOptions: OptionDraft[]
}

function toOptionDrafts(
  options: Array<{ label: string; price: number | null }>,
): OptionDraft[] {
  return options.map((option) => ({
    label: option.label,
    price: option.price === null ? "" : String(option.price),
  }))
}

function buildDraft(category: CustomOrderCategorySetting): CategoryDraft {
  const weightOptions = CUSTOM_ORDER_BOX_SIZES.map((label) => {
    const existing = category.weightOptions.find((option) => option.label === label)
    return existing ?? { label, price: null }
  })

  return {
    label: category.label,
    startingPrice: category.startingPrice === null ? "" : String(category.startingPrice),
    formTitle: category.formTitle,
    fields: Object.fromEntries(
      category.fields.map((field) => [
        field.id,
        {
          label: field.label,
          options: toOptionDrafts(field.options),
        },
      ]),
    ),
    weightOptions: toOptionDrafts(weightOptions),
  }
}

function parseOptionDrafts(options: OptionDraft[]) {
  return options
    .map((option) => ({
      label: option.label.trim(),
      price: option.price.trim() === "" ? null : Number(option.price),
    }))
    .filter((option) => option.label)
}

function draftToPayload(draft: CategoryDraft) {
  return {
    label: draft.label.trim(),
    startingPrice: draft.startingPrice.trim() === "" ? null : Number(draft.startingPrice),
    formTitle: draft.formTitle.trim(),
    fields: Object.entries(draft.fields).map(([id, field]) => ({
      id,
      label: field.label.trim(),
      options: parseOptionDrafts(field.options),
    })),
    weightOptions: parseOptionDrafts(draft.weightOptions),
  }
}

function draftsEqual(category: CustomOrderCategorySetting, draft: CategoryDraft) {
  const payload = draftToPayload(draft)
  if (payload.label !== category.label) return false
  if (payload.startingPrice !== category.startingPrice) return false
  if (payload.formTitle !== category.formTitle) return false
  if (!pricedOptionsEqual(payload.weightOptions, category.weightOptions)) return false

  return category.fields.every((field) => {
    const draftField = draft.fields[field.id]
    if (!draftField) return false
    if (draftField.label.trim() !== field.label) return false
    return pricedOptionsEqual(parseOptionDrafts(draftField.options), field.options)
  })
}

const FIELD_ADMIN_LABELS: Record<string, string> = {
  base: "Base",
  sweetener: "Sweetening Agent",
  flavour: "Flavour Profile",
  coating: "Coating",
}

function ensureOptionDrafts(options: OptionDraft[]) {
  return options.length > 0 ? options : [{ label: "", price: "" }]
}

function BoxSizePricingEditor({
  options,
  onChange,
}: {
  options: OptionDraft[]
  onChange: (next: OptionDraft[]) => void
}) {
  const rows = CUSTOM_ORDER_BOX_SIZES.map((label) => {
    const existing = options.find((option) => option.label === label)
    return existing ?? { label, price: "" }
  })

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[120px_1fr] gap-2 px-0.5">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-[#9A8070]">
          Box size
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-[#9A8070]">
          Price (₹)
        </span>
      </div>

      {rows.map((option) => (
        <div key={option.label} className="grid grid-cols-[120px_1fr] gap-2">
          <div className="flex h-9 items-center rounded-lg border border-[#EDE5D8] bg-[#FAF7F2] px-3 font-sans text-[12px] font-medium text-[#2D1E17]">
            {option.label}
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-sans text-[12px] text-[#9A8070]">
              ₹
            </span>
            <input
              value={option.price}
              onChange={(event) =>
                onChange(
                  rows.map((entry) =>
                    entry.label === option.label
                      ? { ...entry, price: event.target.value.replace(/[^\d]/g, "") }
                      : entry,
                  ),
                )
              }
              inputMode="numeric"
              placeholder="0"
              aria-label={`Price for ${option.label} box`}
              className="h-9 w-full rounded-lg border border-[#EDE5D8] bg-white pr-3 pl-7 font-sans text-[12px] text-[#2D1E17] outline-none focus:border-[#C4A882]"
            />
          </div>
        </div>
      ))}

      <p className="text-[10px] leading-relaxed text-[#B5A090]">
        Set the price for each box size. Leave blank if there is no extra charge beyond the starting
        price. Customers see these prices on the custom orders page.
      </p>
    </div>
  )
}

function OptionRowsEditor({
  options,
  onChange,
  addLabel = "Add option",
}: {
  options: OptionDraft[]
  onChange: (next: OptionDraft[]) => void
  addLabel?: string
}) {
  const rows = ensureOptionDrafts(options)

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[1fr_120px_auto] gap-2 px-0.5">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-[#9A8070]">
          Option name
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-[#9A8070]">
          Extra price (₹)
        </span>
        <span className="sr-only">Remove</span>
      </div>

      {rows.map((option, index) => (
        <div key={index} className="grid grid-cols-[1fr_120px_auto] gap-2">
          <input
            value={option.label}
            onChange={(event) =>
              onChange(
                rows.map((entry, entryIndex) =>
                  entryIndex === index ? { ...entry, label: event.target.value } : entry,
                ),
              )
            }
            placeholder="e.g. Millets, Honey"
            className="h-9 rounded-lg border border-[#EDE5D8] bg-white px-3 font-sans text-[12px] text-[#2D1E17] outline-none focus:border-[#C4A882]"
          />
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-sans text-[12px] text-[#9A8070]">
              ₹
            </span>
            <input
              value={option.price}
              onChange={(event) =>
                onChange(
                  rows.map((entry, entryIndex) =>
                    entryIndex === index
                      ? { ...entry, price: event.target.value.replace(/[^\d]/g, "") }
                      : entry,
                  ),
                )
              }
              inputMode="numeric"
              placeholder="0"
              aria-label={`Extra price for ${option.label || "option"}`}
              className="h-9 w-full rounded-lg border border-[#EDE5D8] bg-white pr-3 pl-7 font-sans text-[12px] text-[#2D1E17] outline-none focus:border-[#C4A882]"
            />
          </div>
          <button
            type="button"
            onClick={() => onChange(rows.filter((_, entryIndex) => entryIndex !== index))}
            disabled={rows.length <= 1}
            className="flex size-9 items-center justify-center rounded-lg border border-[#EDE5D8] text-[#9A8070] hover:text-[#C5221F] disabled:opacity-40"
            aria-label="Remove option"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ))}

      <p className="text-[10px] leading-relaxed text-[#B5A090]">
        Leave price blank if there is no extra charge. Customers see this below the selected option.
      </p>

      <button
        type="button"
        onClick={() => onChange([...rows, { label: "", price: "" }])}
        className="inline-flex items-center gap-1.5 font-sans text-[11px] font-medium text-[#846246] hover:text-[#5C4332]"
      >
        <Plus className="size-3.5" />
        {addLabel}
      </button>
    </div>
  )
}

export function CustomOrderCategoriesManager({
  variant = "full",
}: {
  variant?: "full" | "box-sizes"
}) {
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

  function validateDraftPrices(draft: CategoryDraft) {
    if (draft.startingPrice.trim() !== "" && !Number.isFinite(Number(draft.startingPrice))) {
      return "Starting price must be a valid number."
    }

    for (const field of Object.values(draft.fields)) {
      for (const option of field.options) {
        if (option.price.trim() !== "" && !Number.isFinite(Number(option.price))) {
          return `Enter a valid price for "${option.label || "an option"}" in ${field.label || "a section"}.`
        }
      }
    }

    for (const option of draft.weightOptions) {
      if (option.price.trim() !== "" && !Number.isFinite(Number(option.price))) {
        return `Enter a valid price for weight option "${option.label || "an option"}".`
      }
    }

    return null
  }

  async function handleSave(id: CustomOrderCategoryId) {
    const draft = drafts[id]
    if (!draft) return

    const validationError = validateDraftPrices(draft)
    if (validationError) {
      setError(validationError)
      return
    }

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
    <div className="space-y-4" id="custom-order-box-sizes">
      <div>
        <h2 className="font-serif text-[18px] font-semibold text-[#2B1B12]">
          {variant === "box-sizes" ? "Box Size Pricing" : "Categories"}
        </h2>
        <p className="mt-1 text-[12px] text-[#9A8070]">
          {variant === "box-sizes"
            ? "Set the category starting price and extra prices for each form choice. Box size prices for food products are managed on each product in Admin → Products."
            : "Set the category starting price and extra prices for each form choice. Prices appear on the public custom orders page."}
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
          {categories
            .filter((category) => {
              if (variant !== "box-sizes") return true
              const base = CUSTOM_ORDER_CATEGORIES.find((entry) => entry.id === category.id)
              return !base?.comingSoon
            })
            .map((category) => {
            const base = CUSTOM_ORDER_CATEGORIES.find((entry) => entry.id === category.id)
            const draft = drafts[category.id] ?? buildDraft(category)
            const parsedPrice =
              draft.startingPrice.trim() === ""
                ? null
                : Number(draft.startingPrice.replace(/,/g, ""))
            const dirty = !draftsEqual(category, draft)
            const isSaving = savingId === category.id
            const formFields =
              category.fields.length > 0 ? category.fields : (base?.fields ?? [])
            const hasForm = formFields.length > 0
            const supportsBoxSizes = !base?.comingSoon

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

                {variant === "full" && hasForm ? (
                  <div className="mt-5 space-y-4 border-t border-[#F0EAE2] pt-5">
                    <div className="rounded-lg border border-[#E8DFD2] bg-[#FFF9F2] px-3 py-2.5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#846246]">
                        Form options & extra pricing
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-[#9A8070]">
                        Each row below is one customer choice. Add an extra ₹ amount for options like
                        Millets or Honey, or leave the price empty.
                      </p>
                    </div>

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
                      {formFields.map((field) => {
                        const fieldDraft = draft.fields[field.id] ?? {
                          label: field.label,
                          options: toOptionDrafts(field.options),
                        }
                        const optionDrafts = ensureOptionDrafts(fieldDraft.options)

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
                            <div className="mt-3">
                              <span className="text-[10px] font-medium uppercase tracking-wide text-[#9A8070]">
                                Choices & extra prices
                              </span>
                              <div className="mt-1.5">
                                <OptionRowsEditor
                                  options={optionDrafts}
                                  onChange={(next) =>
                                    setDrafts((prev) => ({
                                      ...prev,
                                      [category.id]: {
                                        ...draft,
                                        fields: {
                                          ...draft.fields,
                                          [field.id]: {
                                            ...fieldDraft,
                                            options: next,
                                          },
                                        },
                                      },
                                    }))
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                  </div>
                ) : variant === "full" && !supportsBoxSizes ? (
                  <p className="mt-4 text-[12px] text-[#9A8070]">
                    Form options will be available once this category is live.
                  </p>
                ) : null}

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
