"use client"

import { useMemo, useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { Lock, Minus, Plus, Trash2, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { CartWishlistTab } from "@/components/cart/cart-wishlist-tab"
import { useCart } from "@/components/providers/cart-provider"
import { useAuth } from "@/hooks/use-auth"
import { HOUSE_OF_INDIKA } from "@/lib/brand"
import type { CartItem } from "@/lib/cart"
import { buildOrderFromCheckout, saveStoredOrder } from "@/lib/orders-storage"
import { cn } from "@/lib/utils"
import type { AppliedPromo } from "@/types/discount-code"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`
}

const tipOptions = [10, 20, 50]

function LotusIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-[#C4A882]"
      aria-hidden
    >
      <path
        d="M12 3C10.5 6 8 7.5 5 8c3 1.5 5 4 5 7 0-3 2-5.5 5-7-3-.5-5.5-2-7-5z"
        fill="currentColor"
        opacity="0.6"
      />
      <path
        d="M12 15c-2 2-4.5 3-7 3 2.5 1 4.5 3 7 3 2.5 0 4.5-2 7-3-2.5 0-5-1-7-3z"
        fill="currentColor"
        opacity="0.4"
      />
      <circle cx="12" cy="10" r="2" fill="currentColor" opacity="0.8" />
    </svg>
  )
}

function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}) {
  return (
    <article className="rounded-xl border border-[#EDE5D8] bg-[#F5F2EB] p-5 sm:p-6">
      <div className="flex gap-5 sm:gap-6">
        <div className="shrink-0">
          <div className="h-[120px] w-[90px] overflow-hidden rounded-t-[45px] rounded-b-md bg-[#EDE5D8] sm:h-[130px] sm:w-[100px]">
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="font-serif text-[20px] font-normal leading-tight text-[#2B1B12] sm:text-[22px]">
                  {item.name}
                </h3>
                {item.tag && (
                  <span className="rounded-full bg-[#5C6B58] px-2.5 py-0.5 font-sans text-[9px] font-medium uppercase tracking-[0.1em] text-white">
                    {item.tag}
                  </span>
                )}
              </div>
              <p className="font-sans text-[12px] text-[#9A8070]">
                <span className="text-[#6B5344]">Variant:</span> {item.variant}
              </p>
              <p className="font-sans text-[12px] text-[#9A8070]">
                <span className="text-[#6B5344]">Artisan:</span> {item.artisan}
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-3">
              <p className="font-serif text-[18px] text-[#2B1B12] sm:text-[20px]">
                {formatCurrency(item.price)}
              </p>

              <div className="flex items-center rounded-md border border-[#EDE5D8] bg-white">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="flex h-8 w-8 items-center justify-center text-[#6B5344] transition-colors hover:text-[#2B1B12] disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3 w-3" strokeWidth={1.5} />
                </button>
                <span className="flex h-8 w-8 items-center justify-center border-x border-[#EDE5D8] font-sans text-[13px] text-[#2B1B12]">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="flex h-8 w-8 items-center justify-center text-[#6B5344] transition-colors hover:text-[#2B1B12]"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3 w-3" strokeWidth={1.5} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="flex items-center gap-1.5 font-sans text-[11px] text-[#9A8070] underline underline-offset-2 transition-colors hover:text-[#2B1B12]"
              >
                <Trash2 className="h-3 w-3" strokeWidth={1.5} />
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

type PaymentState = "idle" | "loading" | "success" | "error"

export function CartContent() {
  const { items, updateQuantity, removeItem, clearCart } = useCart()
  const { userId } = useAuth()
  const [selectedTip, setSelectedTip] = useState<number>(20)
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [promoLoading, setPromoLoading] = useState(false)
  const [isGift, setIsGift] = useState(false)
  const [giftMessageText, setGiftMessageText] = useState("")
  const [paymentState, setPaymentState] = useState<PaymentState>("idle")
  const [paymentMessage, setPaymentMessage] = useState("")

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  )

  const discountAmount = appliedPromo?.discountAmount ?? 0
  const total = Math.max(1, subtotal + selectedTip - discountAmount)

  useEffect(() => {
    setAppliedPromo(null)
    setPromoError(null)
  }, [subtotal])

  const handleApplyPromo = useCallback(async () => {
    if (!promoCode.trim()) {
      setPromoError("Enter a promo code.")
      return
    }

    setPromoLoading(true)
    setPromoError(null)

    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode, subtotal }),
      })
      const data = await res.json()

      if (!res.ok || !data.valid) {
        setAppliedPromo(null)
        setPromoError(data.error ?? "Invalid promo code.")
        return
      }

      setAppliedPromo(data.promo)
      setPromoCode(data.promo.code)
    } catch {
      setPromoError("Could not validate promo code. Try again.")
    } finally {
      setPromoLoading(false)
    }
  }, [promoCode, subtotal])

  const handleRazorpayCheckout = useCallback(async () => {
    setPaymentState("loading")
    setPaymentMessage("")

    const loaded = await loadRazorpayScript()
    if (!loaded) {
      setPaymentState("error")
      setPaymentMessage("Could not load payment gateway. Please try again.")
      return
    }

    try {
      const giftMessage =
        isGift && giftMessageText.trim() ? giftMessageText.trim().slice(0, 500) : null

      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, currency: "INR" }),
      })
      const order = await res.json()
      if (!res.ok) throw new Error(order.error ?? "Order creation failed.")

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: HOUSE_OF_INDIKA,
        description: "Handcrafted treasures",
        order_id: order.id,
        handler: async (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) => {
          const verify = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              ...response,
              items,
              subtotal,
              artisanTip: selectedTip,
              total,
              giftMessage,
              promoCode: appliedPromo?.code ?? null,
            }),
          })
          const result = await verify.json()
          if (result.verified) {
            const order =
              result.order ??
              buildOrderFromCheckout(
                response.razorpay_order_id,
                items,
                total,
                selectedTip,
                giftMessage,
                appliedPromo?.code ?? null,
                discountAmount,
              )

            if (userId) {
              saveStoredOrder(userId, order)
            }

            setPaymentState("success")
            setPaymentMessage(`Payment confirmed! ID: ${result.paymentId}`)
            setAppliedPromo(null)
            clearCart()
          } else {
            setPaymentState("error")
            setPaymentMessage("Payment verification failed. Please contact support.")
          }
        },
        prefill: { name: "Rahul Sharma", email: "rahul.sharma@email.com" },
        theme: { color: "#5C4332" },
        modal: {
          ondismiss: () => {
            setPaymentState("idle")
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on("payment.failed", (resp: { error: { description: string } }) => {
        setPaymentState("error")
        setPaymentMessage(resp.error.description ?? "Payment failed.")
      })
      rzp.open()
    } catch (err) {
      setPaymentState("error")
      setPaymentMessage(err instanceof Error ? err.message : "Something went wrong.")
    }
  }, [
    total,
    subtotal,
    selectedTip,
    discountAmount,
    items,
    userId,
    clearCart,
    isGift,
    giftMessageText,
    appliedPromo,
  ])

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <div className="mb-12 text-center sm:mb-14">
        <h1 className="font-serif text-[40px] font-light italic text-[#2B1B12] sm:text-[48px]">
          Your Cart
        </h1>
        <p className="mx-auto mt-3 max-w-md font-serif text-[14px] italic text-[#9A8070] sm:text-[15px]">
          These are the pieces you have chosen to be part of your story.
        </p>
        <div className="mt-4 flex justify-center">
          <LotusIcon />
        </div>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px] lg:gap-10 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          {items.length === 0 ? (
            <div className="rounded-xl border border-[#EDE5D8] bg-[#F5F2EB] p-10 text-center">
              <p className="font-serif text-[22px] text-[#2B1B12]">
                Your cart is empty
              </p>
              <p className="mt-2 font-sans text-[14px] text-[#9A8070]">
                Discover handcrafted treasures waiting to become part of your
                story.
              </p>
              <Link
                href="/"
                className="mt-6 inline-block font-sans text-[12px] uppercase tracking-[0.12em] text-[#6B5344] underline underline-offset-4"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))
          )}

          <CartWishlistTab />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-8">
          {items.length > 0 ? (
            <div className="rounded-xl border border-[#EDE5D8] bg-[#F5F2EB] p-5 sm:p-6">
              <p className="font-sans text-[12px] text-[#6B5344]">Have a promo code?</p>
              <div className="mt-2.5 flex items-center gap-3">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value.toUpperCase())
                    setPromoError(null)
                  }}
                  placeholder="ENTER CODE HERE"
                  disabled={Boolean(appliedPromo)}
                  className="h-11 min-w-0 flex-1 rounded-lg border border-[#EDE5D8] bg-white px-4 font-sans text-[12px] uppercase tracking-[0.08em] text-[#2B1B12] placeholder:text-[#C4A882]/70 outline-none focus:border-[#C4A882] focus:ring-1 focus:ring-[#C4A882]/30 disabled:opacity-70"
                />
                {appliedPromo ? (
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedPromo(null)
                      setPromoCode("")
                      setPromoError(null)
                    }}
                    className="shrink-0 font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-[#C5221F] transition-colors hover:text-[#9A1B1B]"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => void handleApplyPromo()}
                    disabled={promoLoading}
                    className="shrink-0 font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-[#6B5344] transition-colors hover:text-[#2B1B12] disabled:opacity-60"
                  >
                    {promoLoading ? "Checking…" : "Apply"}
                  </button>
                )}
              </div>
              {promoError ? (
                <p className="mt-2 font-sans text-[12px] text-[#C5221F]">{promoError}</p>
              ) : null}
              {appliedPromo ? (
                <p className="mt-2 font-sans text-[12px] text-[#1E7E34]">
                  {appliedPromo.code} applied — {appliedPromo.label} (
                  {formatCurrency(appliedPromo.discountAmount)} off)
                </p>
              ) : null}
            </div>
          ) : null}

          {items.length > 0 ? (
            <div className="rounded-xl border border-[#EDE5D8] bg-[#F5F2EB] p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <LotusIcon />
                <div className="min-w-0 flex-1">
                  <h2 className="font-serif text-[18px] font-normal text-[#2B1B12]">
                    Add a Little Extra Love
                  </h2>
                  <p className="mt-1.5 font-sans text-[12px] leading-relaxed text-[#9A8070]">
                    Your tip goes directly to the artisan community supporting their craft.
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {tipOptions.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setSelectedTip(amount)}
                    className={cn(
                      "rounded-lg border px-2 py-2.5 font-sans text-[12px] transition-all",
                      selectedTip === amount
                        ? "border-[#2B1B12] bg-white text-[#2B1B12]"
                        : "border-[#EDE5D8] bg-white/60 text-[#6B5344] hover:border-[#C4A882]",
                    )}
                  >
                    + {formatCurrency(amount)}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="rounded-xl border border-[#D4C4B0] bg-[#E8DFD0] p-6 sm:p-7">
            <h2 className="font-serif text-[24px] font-normal text-[#2B1B12]">
              Order Summary
            </h2>

            <div className="mt-6 space-y-3.5">
              <div className="flex items-center justify-between font-sans text-[13px]">
                <span className="text-[#6B5344]">Subtotal</span>
                <span className="text-[#2B1B12]">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between font-sans text-[13px]">
                <span className="text-[#6B5344]">Artisan Tip</span>
                <span className="text-[#2B1B12]">
                  {formatCurrency(selectedTip)}
                </span>
              </div>
              <div className="flex items-center justify-between font-sans text-[13px]">
                <span className="text-[#6B5344]">Shipping</span>
                <span className="text-[#2B1B12]">Complimentary</span>
              </div>
              {appliedPromo ? (
                <div className="flex items-center justify-between font-sans text-[13px]">
                  <span className="text-[#1E7E34]">Promo ({appliedPromo.code})</span>
                  <span className="text-[#1E7E34]">−{formatCurrency(discountAmount)}</span>
                </div>
              ) : null}
            </div>

            <div className="my-5 border-t border-[#D4C4B0]" />

            <div className="flex items-end justify-between">
              <span className="font-sans text-[14px] text-[#6B5344]">Total</span>
              <div className="text-right">
                <p className="font-serif text-[28px] leading-none text-[#2B1B12]">
                  {formatCurrency(total)}
                </p>
                <p className="mt-1 font-sans text-[11px] text-[#9A8070]">
                  Includes GST
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <label className="flex cursor-pointer items-center gap-2.5">
                <Checkbox
                  checked={isGift}
                  onCheckedChange={(checked) => {
                    const enabled = checked === true
                    setIsGift(enabled)
                    if (!enabled) setGiftMessageText("")
                  }}
                  className="border-[#C4A882] data-[state=checked]:border-[#2B1B12] data-[state=checked]:bg-[#2B1B12]"
                />
                <span className="font-sans text-[13px] text-[#6B5344]">
                  Add a gift message
                </span>
              </label>

              {isGift ? (
                <textarea
                  value={giftMessageText}
                  onChange={(event) => setGiftMessageText(event.target.value.slice(0, 500))}
                  rows={4}
                  placeholder="Write a personal note for the recipient — we'll include it with the package."
                  className="w-full resize-y rounded-lg border border-[#EDE5D8] bg-white px-4 py-3 font-serif text-[13px] leading-relaxed text-[#2B1B12] placeholder:text-[#C4A882]/70 outline-none focus:border-[#C4A882] focus:ring-1 focus:ring-[#C4A882]/30"
                />
              ) : null}
              {isGift ? (
                <p className="font-sans text-[11px] text-[#9A8070]">
                  {giftMessageText.length}/500 characters
                </p>
              ) : null}
            </div>

            {/* Payment status feedback */}
            {paymentState === "success" && (
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#A8D5B5] bg-[#EAF4EC] p-4">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#3D7A4F]" />
                <p className="font-sans text-[13px] text-[#3D7A4F]">{paymentMessage}</p>
              </div>
            )}
            {paymentState === "error" && (
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#F5C6C6] bg-[#FEF2F2] p-4">
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#B91C1C]" />
                <p className="font-sans text-[13px] text-[#B91C1C]">{paymentMessage}</p>
              </div>
            )}

            <button
              type="button"
              onClick={handleRazorpayCheckout}
              disabled={paymentState === "loading" || items.length === 0}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-[#2B1B12] font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#3D2B21] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {paymentState === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing…
                </>
              ) : (
                "Pay with Razorpay"
              )}
            </button>

            <Link
              href="/"
              className="mt-4 block text-center font-sans text-[12px] uppercase tracking-[0.12em] text-[#6B5344] underline underline-offset-4 transition-colors hover:text-[#2B1B12]"
            >
              Continue Shopping
            </Link>

            <div className="mt-6 flex items-center justify-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-[#9A8070]" strokeWidth={1.5} />
              <span className="font-sans text-[11px] text-[#9A8070]">
                Secured by Razorpay
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
