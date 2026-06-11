"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  CheckCircle,
  Loader2,
  Lock,
  XCircle,
} from "lucide-react"

import { CheckoutStepper } from "@/components/checkout/checkout-stepper"
import { SiteHeader } from "@/components/site-header"
import { useCart } from "@/components/providers/cart-provider"
import { useAuth } from "@/hooks/use-auth"
import {
  clearCheckoutSession,
  DEFAULT_CHECKOUT_SESSION,
  loadCheckoutSession,
  type CheckoutSession,
} from "@/lib/checkout-session"
import { INDIAN_STATES } from "@/lib/indian-states"
import { openRazorpayCheckout } from "@/lib/razorpay-client"
import { cn } from "@/lib/utils"

function formatCurrency(amount: number) {
  return `₹ ${amount.toLocaleString("en-IN")}`
}

type DeliveryForm = {
  fullName: string
  email: string
  whatsapp: string
  addressLine1: string
  addressLine2: string
  city: string
  pinCode: string
  state: string
}

const initialDeliveryForm: DeliveryForm = {
  fullName: "",
  email: "",
  whatsapp: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  pinCode: "",
  state: "",
}

type PaymentState = "idle" | "loading" | "success" | "error"

function UnderlineField({
  label,
  id,
  type = "text",
  value,
  onChange,
  required,
  placeholder,
  className,
}: {
  label: string
  id: string
  type?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  placeholder?: string
  className?: string
}) {
  return (
    <label className={cn("block", className)}>
      <span className="font-sans text-[11px] uppercase tracking-[0.12em] text-[#9A8070]">
        {label}
        {!required ? (
          <span className="normal-case tracking-normal text-[#B5A090]"> (Optional)</span>
        ) : null}
      </span>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full border-0 border-b border-[#D8CFC4] bg-transparent py-2.5 font-serif text-[15px] text-[#2B1B12] outline-none transition-colors placeholder:text-[#C4B5A5] focus:border-[#6B5344]"
      />
    </label>
  )
}

export function CheckoutContent() {
  const router = useRouter()
  const { items, clearCart } = useCart()
  const { userId, user } = useAuth()
  const [session, setSession] = useState<CheckoutSession>(DEFAULT_CHECKOUT_SESSION)
  const [hydrated, setHydrated] = useState(false)
  const [form, setForm] = useState<DeliveryForm>(initialDeliveryForm)
  const [paymentState, setPaymentState] = useState<PaymentState>("idle")
  const [paymentMessage, setPaymentMessage] = useState("")

  useEffect(() => {
    const saved = loadCheckoutSession()
    setSession(saved ?? DEFAULT_CHECKOUT_SESSION)
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    if (items.length === 0 && paymentState !== "success") {
      router.replace("/cart")
    }
  }, [hydrated, items.length, paymentState, router])

  useEffect(() => {
    if (!user) return
    const metadata = user.user_metadata as { full_name?: string; name?: string; phone?: string } | undefined
    setForm((prev) => ({
      ...prev,
      fullName: prev.fullName || metadata?.full_name || metadata?.name || "",
      email: prev.email || user.email || "",
      whatsapp: prev.whatsapp || user.phone || metadata?.phone || "",
    }))
  }, [user])

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  )

  const discountAmount = session.appliedPromo?.discountAmount ?? 0
  const total = Math.max(1, subtotal + session.selectedTip - discountAmount)

  function updateForm<K extends keyof DeliveryForm>(key: K, value: DeliveryForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handlePlaceOrder(event: React.FormEvent) {
    event.preventDefault()
    if (items.length === 0) return

    setPaymentState("loading")
    setPaymentMessage("")

    await openRazorpayCheckout({
      items,
      subtotal,
      artisanTip: session.selectedTip,
      total,
      discountAmount,
      giftMessage: session.giftMessage,
      promoCode: session.appliedPromo?.code ?? null,
      userId,
      prefill: {
        name: form.fullName.trim(),
        email: form.email.trim(),
        contact: form.whatsapp.replace(/\D/g, ""),
      },
      clearCart: () => {
        clearCart()
        clearCheckoutSession()
      },
      onSuccess: (message) => {
        setPaymentState("success")
        setPaymentMessage(message)
      },
      onError: (message) => {
        setPaymentState("error")
        setPaymentMessage(message)
      },
      onDismiss: () => {
        setPaymentState("idle")
      },
    })
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-[#9A8070]" />
      </div>
    )
  }

  if (items.length === 0 && paymentState === "success") {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <CheckCircle className="mx-auto size-12 text-[#5C6B58]" />
        <h1 className="mt-6 font-serif text-[28px] text-[#2B1B12]">Thank you</h1>
        <p className="mt-3 font-serif text-[15px] text-[#6B5344]">{paymentMessage}</p>
        <p className="mt-2 font-sans text-[13px] text-[#9A8070]">
          A personalised artisan note will accompany your order.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block font-sans text-[12px] uppercase tracking-[0.14em] text-[#6B5344] underline underline-offset-4"
        >
          Continue shopping
        </Link>
      </div>
    )
  }

  if (items.length === 0) return null

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
      <CheckoutStepper current="details" />

      <form onSubmit={(event) => void handlePlaceOrder(event)}>
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <h1 className="font-serif text-[26px] font-normal text-[#2B1B12] sm:text-[28px]">
              Delivery Details
            </h1>

            <div className="mt-8 space-y-6">
              <UnderlineField
                label="Full Name"
                id="fullName"
                required
                value={form.fullName}
                onChange={(value) => updateForm("fullName", value)}
              />

              <div className="grid gap-6 sm:grid-cols-2">
                <UnderlineField
                  label="Email Address"
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(value) => updateForm("email", value)}
                />
                <UnderlineField
                  label="WhatsApp Number"
                  id="whatsapp"
                  type="tel"
                  required
                  value={form.whatsapp}
                  onChange={(value) => updateForm("whatsapp", value)}
                />
              </div>

              <UnderlineField
                label="Address Line 1"
                id="addressLine1"
                required
                value={form.addressLine1}
                onChange={(value) => updateForm("addressLine1", value)}
              />

              <UnderlineField
                label="Address Line 2"
                id="addressLine2"
                value={form.addressLine2}
                onChange={(value) => updateForm("addressLine2", value)}
              />

              <div className="grid gap-6 sm:grid-cols-2">
                <UnderlineField
                  label="City"
                  id="city"
                  required
                  value={form.city}
                  onChange={(value) => updateForm("city", value)}
                />
                <UnderlineField
                  label="PIN Code"
                  id="pinCode"
                  required
                  value={form.pinCode}
                  onChange={(value) => updateForm("pinCode", value.replace(/\D/g, "").slice(0, 6))}
                />
              </div>

              <label className="block">
                <span className="font-sans text-[11px] uppercase tracking-[0.12em] text-[#9A8070]">
                  State
                </span>
                <select
                  id="state"
                  required
                  value={form.state}
                  onChange={(event) => updateForm("state", event.target.value)}
                  className="mt-2 w-full appearance-none border-0 border-b border-[#D8CFC4] bg-transparent py-2.5 font-serif text-[15px] text-[#2B1B12] outline-none transition-colors focus:border-[#6B5344]"
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <aside className="lg:sticky lg:top-8">
            <div className="rounded-xl border border-[#D4C4B0] bg-[#E8DFD0] p-6 sm:p-7">
              <h2 className="font-serif text-[22px] font-normal text-[#2B1B12]">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-[#EDE8DC]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-[14px] leading-snug text-[#2B1B12]">
                        {item.name}
                      </p>
                      <p className="mt-0.5 font-sans text-[11px] text-[#9A8070]">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="shrink-0 font-serif text-[14px] text-[#2B1B12]">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="my-5 border-t border-[#D4C4B0]" />

              <div className="space-y-3 font-sans text-[13px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#6B5344]">Subtotal</span>
                  <span className="text-[#2B1B12]">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6B5344]">Shipping</span>
                  <span className="text-[#2B1B12]">Complimentary</span>
                </div>
                {session.selectedTip > 0 ? (
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B5344]">Artisan Tip (Optional)</span>
                    <span className="text-[#2B1B12]">{formatCurrency(session.selectedTip)}</span>
                  </div>
                ) : null}
                {session.appliedPromo ? (
                  <div className="flex items-center justify-between">
                    <span className="text-[#1E7E34]">Promo ({session.appliedPromo.code})</span>
                    <span className="text-[#1E7E34]">−{formatCurrency(discountAmount)}</span>
                  </div>
                ) : null}
              </div>

              <div className="my-5 border-t border-[#D4C4B0]" />

              <div className="flex items-end justify-between">
                <span className="font-sans text-[14px] text-[#6B5344]">Total</span>
                <p className="font-serif text-[26px] leading-none text-[#2B1B12]">
                  {formatCurrency(total)}
                </p>
              </div>

              <div className="mt-5 rounded-lg border border-[#EDE5D8] bg-white/80 px-4 py-3.5">
                <div className="flex items-start gap-3">
                  <Lock className="mt-0.5 size-4 shrink-0 text-[#9A8070]" strokeWidth={1.5} />
                  <div>
                    <p className="font-sans text-[12px] font-medium text-[#2B1B12]">
                      Secure Checkout
                    </p>
                    <p className="mt-1 font-sans text-[11px] leading-relaxed text-[#9A8070]">
                      You will be redirected to Razorpay to complete payment safely. Your details
                      are protected.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {paymentState === "error" ? (
          <div className="mt-8 flex items-start gap-3 rounded-xl border border-[#F5C6C6] bg-[#FEF2F2] px-4 py-3">
            <XCircle className="mt-0.5 size-5 shrink-0 text-[#B91C1C]" />
            <p className="font-sans text-[13px] text-[#B91C1C]">{paymentMessage}</p>
          </div>
        ) : null}

        <div className="mt-10">
          <button
            type="submit"
            disabled={paymentState === "loading" || paymentState === "success"}
            className="flex h-14 w-full items-center justify-center gap-2.5 bg-[#6B5344] font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#5C4332] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {paymentState === "loading" ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Opening Razorpay…
              </>
            ) : (
              <>
                Place Order
                <ArrowRight className="size-4" strokeWidth={1.5} />
              </>
            )}
          </button>

          <div className="mt-0 bg-[#5C4332] px-4 py-3 text-center">
            <p className="font-serif text-[13px] italic text-[#F5EDE3]">
              A personalised artisan note will accompany your order.
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
