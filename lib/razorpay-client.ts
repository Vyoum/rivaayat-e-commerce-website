import { HOUSE_OF_INDIKA } from "@/lib/brand"
import type { CartItem } from "@/lib/cart"
import { buildOrderFromCheckout, saveStoredOrder } from "@/lib/orders-storage"
import type { ProfileOrder } from "@/types/profile"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any
  }
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false)
    if (window.Razorpay) return resolve(true)
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export type RazorpayPaymentResponse = {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

export type RazorpayPaymentInput = {
  amount: number
  description?: string
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  onSuccess: (response: RazorpayPaymentResponse) => void | Promise<void>
  onError: (message: string) => void
  onDismiss?: () => void
}

export async function openRazorpayPayment(input: RazorpayPaymentInput) {
  const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  if (!razorpayKeyId) {
    input.onError(
      "Payment is not configured on this site. Please contact support.",
    )
    return
  }

  const loaded = await loadRazorpayScript()
  if (!loaded) {
    input.onError("Could not load payment gateway. Please try again.")
    return
  }

  try {
    const res = await fetch("/api/razorpay/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: input.amount, currency: "INR" }),
    })

    let order: { id?: string; amount?: number; currency?: string; error?: string }
    try {
      order = await res.json()
    } catch {
      throw new Error("Payment server returned an invalid response.")
    }

    if (!res.ok) {
      throw new Error(order.error ?? "Order creation failed.")
    }

    if (!order.id) {
      throw new Error("Payment server did not return an order id.")
    }

    const options = {
      key: razorpayKeyId,
      amount: order.amount,
      currency: order.currency,
      name: HOUSE_OF_INDIKA,
      description: input.description ?? "Handcrafted treasures",
      order_id: order.id,
      handler: async (response: RazorpayPaymentResponse) => {
        await input.onSuccess(response)
      },
      prefill: {
        name: input.prefill?.name ?? "",
        email: input.prefill?.email ?? "",
        contact: input.prefill?.contact ?? "",
      },
      theme: { color: "#5C4332" },
      modal: {
        ondismiss: () => {
          input.onDismiss?.()
        },
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.on("payment.failed", (resp: { error: { description: string } }) => {
      input.onError(resp.error.description ?? "Payment failed.")
    })
    rzp.open()
  } catch (err) {
    input.onError(err instanceof Error ? err.message : "Something went wrong.")
  }
}

export type RazorpayCheckoutInput = {
  items: CartItem[]
  subtotal: number
  artisanTip: number
  total: number
  discountAmount: number
  giftMessage: string | null
  promoCode: string | null
  userId: string | null
  deliveryAddress?: {
    fullName: string
    email: string
    whatsapp: string
    addressLine1: string
    addressLine2: string
    city: string
    pinCode: string
    state: string
  }
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  onSuccess: (message: string) => void
  onError: (message: string) => void
  onDismiss?: () => void
  clearCart: () => void
}

export async function openRazorpayCheckout(input: RazorpayCheckoutInput) {
  await openRazorpayPayment({
    amount: input.total,
    description: "Handcrafted treasures",
    prefill: input.prefill,
    onDismiss: input.onDismiss,
    onError: input.onError,
    onSuccess: async (response) => {
      const verify = await fetch("/api/razorpay/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...response,
          items: input.items,
          subtotal: input.subtotal,
          artisanTip: input.artisanTip,
          total: input.total,
          giftMessage: input.giftMessage,
          promoCode: input.promoCode,
          deliveryAddress: input.deliveryAddress,
        }),
      })
      const result = await verify.json()
      if (result.verified) {
        const savedOrder: ProfileOrder =
          result.order ??
          buildOrderFromCheckout(
            response.razorpay_order_id,
            input.items,
            input.total,
            input.artisanTip,
            input.giftMessage,
            input.promoCode,
            input.discountAmount,
          )

        if (input.userId) {
          saveStoredOrder(input.userId, savedOrder)
        }

        input.clearCart()
        input.onSuccess(`Payment confirmed! ID: ${result.paymentId}`)
      } else {
        input.onError("Payment verification failed. Please contact support.")
      }
    },
  })
}
