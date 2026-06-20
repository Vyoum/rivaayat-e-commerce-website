"use client"

import { useEffect, useMemo, useState } from "react"
import { Cookie, Dumbbell, FlaskConical, Loader2, Lock, Shirt, type LucideIcon } from "lucide-react"
import { DeliveryAddressFields } from "@/components/shared/delivery-address-fields"
import { BestSellingProductsRail } from "@/components/catalog/best-selling-products-rail"
import { OrderConfirmationDetails } from "@/components/shared/order-confirmation-details"
import { useAuth } from "@/hooks/use-auth"
import {
  INITIAL_DELIVERY_ADDRESS,
  isDeliveryAddressComplete,
  type DeliveryAddress,
} from "@/lib/delivery-address"
import { openRazorpayPayment } from "@/lib/razorpay-client"
import { buildPaymentConfirmationDetails, type PaymentConfirmationDetails } from "@/lib/payment-confirmation"
import { cn } from "@/lib/utils"
import {
  calculateCustomOrderTotal,
  CUSTOM_ORDER_CATEGORIES,
  DEFAULT_CATEGORY_ID,
  formatCustomOrderAmount,
  formatPricedOptionPrice,
  getCategoryDefaults,
  getPricedOptionLabels,
  getPricedOptionPrice,
  type CustomOrderCategory,
  type CustomOrderCategoryId,
  type CustomOrderTotalBreakdown,
  type PricedOption,
  type PublicCustomOrderCategory,
} from "@/lib/custom-orders-config"

const CATEGORY_ICONS: Record<CustomOrderCategoryId, LucideIcon> = {
  "healthy-laddoos": Cookie,
  "protein-bars": Dumbbell,
  "artisan-achaar": FlaskConical,
  "custom-clothing": Shirt,
}

function withCategoryIcons(categories: PublicCustomOrderCategory[]): CustomOrderCategory[] {
  return categories.map((category) => ({
    ...category,
    icon: CATEGORY_ICONS[category.id],
  }))
}

function BotanicalIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="mx-auto size-8 text-[#C4A882]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden
    >
      <circle cx="24" cy="24" r="22" strokeOpacity="0.45" />
      <path d="M24 34V18M24 18C24 18 16 16 14 10C18 12 24 18 24 18ZM24 18C24 18 32 16 34 10C30 12 24 18 24 18Z" />
    </svg>
  )
}

function PricedOptionPills({
  options,
  value,
  onChange,
  columns = 3,
}: {
  options: PricedOption[]
  value: string
  onChange: (value: string) => void
  columns?: 2 | 3 | 4
}) {
  const gridClass =
    columns === 2
      ? "grid-cols-2"
      : columns === 3
        ? "grid-cols-2 sm:grid-cols-3"
        : "grid-cols-2 sm:grid-cols-4"

  return (
    <div className={cn("grid gap-2.5", gridClass)}>
      {options.map((option) => {
        const selected = value === option.label
        const priceLabel = formatPricedOptionPrice(option.price)

        return (
          <button
            key={option.label}
            type="button"
            onClick={() => onChange(option.label)}
            className={cn(
              "rounded-md border px-3 py-2.5 text-center font-sans transition-colors",
              selected
                ? "border-[#3D2E24] bg-[#3D2E24] text-white"
                : "border-[#D8CFC4] bg-white text-[#3D2E24] hover:border-[#B8A898]",
            )}
          >
            <span className="block text-[12px] tracking-wide">{option.label}</span>
            {priceLabel ? (
              <span
                className={cn(
                  "mt-1 block text-[10px]",
                  selected ? "text-white/80" : "text-[#8B7355]",
                )}
              >
                {priceLabel}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

function OptionPills({
  options,
  value,
  onChange,
  columns = 4,
}: {
  options: string[]
  value: string
  onChange: (value: string) => void
  columns?: 2 | 3 | 4
}) {
  const gridClass =
    columns === 2
      ? "grid-cols-2"
      : columns === 3
        ? "grid-cols-2 sm:grid-cols-3"
        : "grid-cols-2 sm:grid-cols-4"

  return (
    <div className={cn("grid gap-2.5", gridClass)}>
      {options.map((option) => {
        const selected = value === option
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "rounded-md border px-3 py-2.5 font-sans text-[12px] tracking-wide transition-colors",
              selected
                ? "border-[#3D2E24] bg-[#3D2E24] text-white"
                : "border-[#D8CFC4] bg-white text-[#3D2E24] hover:border-[#B8A898]",
            )}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}

type FormState = ReturnType<typeof getCategoryDefaults>

function CustomOrderTotalSummary({ breakdown }: { breakdown: CustomOrderTotalBreakdown }) {
  const hasLineItems =
    breakdown.startingPrice > 0 ||
    breakdown.optionLines.length > 0 ||
    breakdown.weightLine !== null

  return (
    <div className="rounded-xl border border-[#E8E0D4] bg-white p-5 shadow-sm">
      <h3 className="font-serif text-[18px] text-[#3D2E24]">Estimated Total</h3>
      <p className="mt-1 font-sans text-[12px] text-[#8B7355]">
        Based on your selections. Final price may be confirmed by the artisan.
      </p>

      {hasLineItems ? (
        <dl className="mt-4 space-y-2 border-b border-[#F0EAE2] pb-4">
          {breakdown.startingPrice > 0 ? (
            <div className="flex items-center justify-between gap-4 font-sans text-[13px] text-[#6B5A4E]">
              <dt>Starting price</dt>
              <dd>{formatCustomOrderAmount(breakdown.startingPrice)}</dd>
            </div>
          ) : null}
          {breakdown.optionLines.map((line) => (
            <div
              key={line.label}
              className="flex items-center justify-between gap-4 font-sans text-[13px] text-[#6B5A4E]"
            >
              <dt>{line.label}</dt>
              <dd>+ {formatCustomOrderAmount(line.amount)}</dd>
            </div>
          ))}
          {breakdown.weightLine ? (
            <div className="flex items-center justify-between gap-4 font-sans text-[13px] text-[#6B5A4E]">
              <dt>{breakdown.weightLine.label}</dt>
              <dd>+ {formatCustomOrderAmount(breakdown.weightLine.amount)}</dd>
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-4 pt-1 font-sans text-[13px] font-medium text-[#3D2E24]">
            <dt>Per box</dt>
            <dd>{formatCustomOrderAmount(breakdown.perUnit)}</dd>
          </div>
        </dl>
      ) : null}

      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-[#8B7355]">
            Quantity
          </p>
          <p className="mt-1 font-serif text-[15px] text-[#3D2E24]">
            {breakdown.quantity} box{breakdown.quantity === 1 ? "" : "es"}
          </p>
        </div>
        <div className="text-right">
          <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-[#8B7355]">
            Estimated total
          </p>
          <p className="mt-1 font-serif text-[28px] leading-none text-[#3D2E24]">
            {formatCustomOrderAmount(breakdown.total)}
          </p>
        </div>
      </div>
    </div>
  )
}

type CustomOrdersPageProps = {
  categories?: PublicCustomOrderCategory[]
}

export function CustomOrdersPage({ categories: categoriesProp }: CustomOrdersPageProps) {
  const categories = useMemo(
    () =>
      categoriesProp ? withCategoryIcons(categoriesProp) : CUSTOM_ORDER_CATEGORIES,
    [categoriesProp],
  )
  const [categoryId, setCategoryId] = useState<CustomOrderCategoryId>(DEFAULT_CATEGORY_ID)
  const [formByCategory, setFormByCategory] = useState<Record<string, FormState>>(() => {
    const initial: Record<string, FormState> = {}
    for (const category of categories) {
      if (!category.comingSoon) {
        initial[category.id] = getCategoryDefaults(category)
      }
    }
    return initial
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [confirmation, setConfirmation] = useState<PaymentConfirmationDetails | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [delivery, setDelivery] = useState<DeliveryAddress>(INITIAL_DELIVERY_ADDRESS)
  const { user } = useAuth()

  const category = useMemo(
    () => categories.find((item) => item.id === categoryId)!,
    [categories, categoryId],
  )

  const form = formByCategory[categoryId] ?? getCategoryDefaults(category)

  const orderTotal = useMemo(
    () =>
      calculateCustomOrderTotal(
        category,
        form.selections,
        form.weight,
        form.quantity,
      ),
    [category, form.selections, form.weight, form.quantity],
  )

  function updateForm(patch: Partial<FormState>) {
    setFormByCategory((prev) => ({
      ...prev,
      [categoryId]: { ...form, ...patch },
    }))
  }

  function updateSelection(fieldId: string, value: string) {
    updateForm({
      selections: { ...form.selections, [fieldId]: value },
    })
  }

  function updateDelivery(patch: Partial<DeliveryAddress>) {
    setDelivery((prev) => ({ ...prev, ...patch }))
  }

  useEffect(() => {
    if (!user) return
    const metadata = user.user_metadata as { full_name?: string; name?: string; phone?: string } | undefined
    setDelivery((prev) => ({
      ...prev,
      fullName: prev.fullName || metadata?.full_name || metadata?.name || "",
      email: prev.email || user.email || "",
      whatsapp: prev.whatsapp || user.phone || metadata?.phone || "",
    }))
  }, [user])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (category.comingSoon) return
    if (!isDeliveryAddressComplete(delivery)) {
      setError("Please complete all delivery details before paying.")
      return
    }

    setSubmitting(true)
    setError(null)
    setConfirmation(null)

    const total = Math.max(1, orderTotal.total)
    const orderPayload = {
      categoryId,
      categoryLabel: category.label,
      selections: form.selections,
      weight: form.weight,
      quantity: form.quantity,
      notes: form.notes,
      fullName: delivery.fullName.trim(),
      whatsapp: delivery.whatsapp.trim(),
      email: delivery.email.trim(),
      addressLine1: delivery.addressLine1.trim(),
      addressLine2: delivery.addressLine2.trim(),
      city: delivery.city.trim(),
      pinCode: delivery.pinCode.trim(),
      state: delivery.state.trim(),
      total,
    }

    await openRazorpayPayment({
      amount: total,
      description: `${category.label} custom order`,
      prefill: {
        name: orderPayload.fullName,
        email: orderPayload.email,
        contact: orderPayload.whatsapp.replace(/\D/g, ""),
      },
      onDismiss: () => {
        setSubmitting(false)
      },
      onError: (message) => {
        setSubmitting(false)
        setError(message)
      },
      onSuccess: async (payment) => {
        try {
          const res = await fetch("/api/custom-orders/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              ...payment,
              ...orderPayload,
            }),
          })

          const data = await res.json()
          if (!res.ok) throw new Error(data.error || "Failed to confirm custom order")

          setSubmitted(true)
          setConfirmation(
            buildPaymentConfirmationDetails({
              orderId: data.id,
              orderDisplayId: data.orderDisplayId,
              trackingId: data.trackingId,
              shipping: data.shipping,
            }),
          )
        } catch (err) {
          setError(err instanceof Error ? err.message : "Something went wrong")
        } finally {
          setSubmitting(false)
        }
      },
    })
  }

  return (
    <>
      <div className="mx-auto max-w-[1060px] px-5 pb-20 pt-10 lg:px-8 lg:pt-14">
      <header className="text-center">
        <h1 className="font-serif text-[clamp(2rem,4vw,2.75rem)] font-normal text-[#3D2E24]">
          Custom Orders
        </h1>
        <p className="mx-auto mt-4 max-w-[620px] font-serif text-[15px] leading-relaxed text-[#6B5A4E]">
          Create something uniquely yours. Work directly with our artisans to customise products
          according to your preferences, taste, and style.
        </p>
        <div className="mt-5">
          <BotanicalIcon />
        </div>
      </header>

      <div className="mt-12 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
        {/* Category sidebar */}
        <aside className="h-fit rounded-xl bg-[#E8DCC8]/80 p-5 lg:sticky lg:top-24">
          <h2 className="font-serif text-[18px] text-[#3D2E24]">Choose Category</h2>
          <ul className="mt-4 space-y-2">
            {categories.map((item) => {
              const Icon = item.icon
              const selected = categoryId === item.id
              const disabled = item.comingSoon

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      if (!disabled) setCategoryId(item.id)
                    }}
                    className={cn(
                      "w-full rounded-lg px-3 py-3 text-left transition-all",
                      selected
                        ? "bg-white shadow-sm ring-1 ring-[#D8CFC4]/80"
                        : disabled
                          ? "cursor-not-allowed opacity-70"
                          : "hover:bg-white/50",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="mt-0.5 size-4 shrink-0 text-[#8B7355]" strokeWidth={1.5} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-serif text-[14px] text-[#3D2E24]">{item.label}</span>
                          {item.badge ? (
                            <span
                              className={cn(
                                "rounded px-1.5 py-0.5 font-sans text-[9px] font-medium uppercase tracking-wider",
                                item.comingSoon
                                  ? "bg-[#D8CFC4]/60 text-[#6B5A4E]"
                                  : "bg-[#D8CFC4]/50 text-[#6B5A4E]",
                              )}
                            >
                              {item.badge}
                            </span>
                          ) : null}
                        </div>
                        {item.priceHint ? (
                          <p className="mt-0.5 font-sans text-[11px] text-[#8B7355]">
                            {item.priceHint}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </aside>

        {/* Form */}
        <div className="rounded-xl border border-[#E8E0D4] bg-[#FAFAF8] p-6 shadow-sm sm:p-8">
          {category.comingSoon ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
              <p className="font-serif text-[22px] text-[#3D2E24]">{category.label}</p>
              <p className="mt-3 font-sans text-[13px] uppercase tracking-[0.18em] text-[#8B7355]">
                Coming Soon
              </p>
              <p className="mt-4 max-w-sm font-serif text-[14px] leading-relaxed text-[#6B5A4E]">
                We&apos;re preparing this category for custom orders. Check back soon or choose
                Healthy Laddoos to place an order today.
              </p>
            </div>
          ) : submitted ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
              <p className="font-serif text-[24px] text-[#3D2E24]">Order Confirmed</p>
              <p className="mt-4 max-w-md font-serif text-[15px] leading-relaxed text-[#6B5A4E]">
                Thank you! Your payment was received and our artisan will begin preparing your
                custom order.
              </p>
              {confirmation ? (
                <OrderConfirmationDetails
                  orderId={confirmation.orderId}
                  trackingId={confirmation.trackingId}
                  className="w-full max-w-md"
                />
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false)
                  setConfirmation(null)
                  setDelivery(INITIAL_DELIVERY_ADDRESS)
                }}
                className="mt-8 font-sans text-[11px] uppercase tracking-[0.16em] text-[#3D2E24] underline underline-offset-4"
              >
                Place another order
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <h2 className="font-serif text-[20px] text-[#3D2E24]">
                <span className="text-[#C4A882]">✦</span> {category.formTitle}
              </h2>

              {category.fields.map((field) => {
                const selected =
                  form.selections[field.id] ?? field.options[0]?.label ?? ""
                const selectedPrice = getPricedOptionPrice(field.options, selected)
                const priceLabel = formatPricedOptionPrice(selectedPrice)

                return (
                  <div key={field.id}>
                    <p className="mb-3 font-serif text-[15px] text-[#3D2E24]">{field.label}</p>
                    <OptionPills
                      options={getPricedOptionLabels(field.options)}
                      value={selected}
                      onChange={(value) => updateSelection(field.id, value)}
                      columns={field.options.length <= 3 ? 3 : 4}
                    />
                    {priceLabel ? (
                      <p className="mt-2.5 font-sans text-[12px] text-[#8B7355]">{priceLabel}</p>
                    ) : null}
                  </div>
                )
              })}

              <div>
                <p className="mb-3 font-serif text-[15px] text-[#3D2E24]">Order Details</p>
                <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
                  <div>
                    <p className="mb-2.5 font-sans text-[11px] uppercase tracking-[0.14em] text-[#8B7355]">
                      Box Size
                    </p>
                    <PricedOptionPills
                      options={category.weightOptions}
                      value={form.weight}
                      onChange={(weight) => updateForm({ weight })}
                      columns={3}
                    />
                  </div>
                  <div className="sm:w-[120px]">
                    <label
                      htmlFor="quantity"
                      className="mb-2 block font-sans text-[11px] uppercase tracking-[0.14em] text-[#8B7355]"
                    >
                      Quantity (Boxes)
                    </label>
                    <input
                      id="quantity"
                      type="number"
                      min={1}
                      value={form.quantity}
                      onChange={(e) => updateForm({ quantity: e.target.value })}
                      className="w-full rounded-md border border-[#D8CFC4] bg-white px-3 py-2.5 font-sans text-[14px] text-[#3D2E24] outline-none focus:border-[#3D2E24]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-3 font-serif text-[15px] text-[#3D2E24]">
                  Special Requests or Dietary Notes
                </p>
                <textarea
                  value={form.notes}
                  onChange={(e) => updateForm({ notes: e.target.value })}
                  rows={4}
                  placeholder="e.g. Nut allergies, vegan binding only, etc."
                  className="w-full resize-y rounded-lg border border-[#E8DCC8] bg-[#F5EDD8]/70 px-4 py-3 font-serif text-[14px] leading-relaxed text-[#3D2E24] placeholder:text-[#A89888] outline-none focus:border-[#C4A882]"
                />
              </div>

              <CustomOrderTotalSummary breakdown={orderTotal} />

              <div className="border-t border-[#E8E0D4] pt-8">
                <DeliveryAddressFields
                  value={delivery}
                  onChange={updateDelivery}
                />
              </div>

              {error ? (
                <p className="text-center font-sans text-[13px] text-[#B42318]">{error}</p>
              ) : null}

              <div className="rounded-lg border border-[#EDE5D8] bg-white/80 px-4 py-3.5">
                <div className="flex items-start gap-3">
                  <Lock className="mt-0.5 size-4 shrink-0 text-[#9A8070]" strokeWidth={1.5} />
                  <div>
                    <p className="font-sans text-[12px] font-medium text-[#2B1B12]">
                      Secure Checkout
                    </p>
                    <p className="mt-1 font-sans text-[11px] leading-relaxed text-[#9A8070]">
                      You will be redirected to Razorpay to complete payment safely.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#3D2E24] py-3.5 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Opening Razorpay…
                    </>
                  ) : (
                    <>
                      <span className="text-[#C4A882]">✦</span>
                      Pay {formatCustomOrderAmount(orderTotal.total)}
                    </>
                  )}
                </button>
                <p className="mt-4 text-center font-serif text-[13px] italic text-[#8B7355]">
                  A personalised artisan note will accompany your order.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
      </div>
      {submitted ? <BestSellingProductsRail title="Best Sellers" className="mt-2" /> : null}
    </>
  )
}
