import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

import { createOrderFromCheckout } from "@/lib/order-server"
import { buildOrderFromCheckout, type StoredCheckoutItem } from "@/lib/orders-storage"
import { getRazorpayKeySecret } from "@/lib/razorpay"
import { createSupabaseApiClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const response = NextResponse.next()

  try {
    const keySecret = getRazorpayKeySecret()
    if (!keySecret) {
      return NextResponse.json(
        { error: "Payment service is not configured." },
        { status: 503 },
      )
    }

    const body = await req.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      subtotal,
      artisanTip = 0,
      total,
    } = body as {
      razorpay_order_id: string
      razorpay_payment_id: string
      razorpay_signature: string
      items?: StoredCheckoutItem[]
      subtotal?: number
      artisanTip?: number
      total?: number
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment verification fields." },
        { status: 400 },
      )
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(payload)
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { verified: false, error: "Signature mismatch — payment not verified." },
        { status: 400 },
      )
    }

    const checkoutItems = Array.isArray(items) ? items : []
    const orderSubtotal =
      typeof subtotal === "number"
        ? subtotal
        : checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const orderTip = typeof artisanTip === "number" ? artisanTip : 0
    const orderTotal =
      typeof total === "number" ? total : orderSubtotal + orderTip

    let savedOrder =
      checkoutItems.length > 0
        ? buildOrderFromCheckout(razorpay_order_id, checkoutItems, orderTotal, orderTip)
        : null

    const supabase = createSupabaseApiClient(req, response)
    if (supabase && checkoutItems.length > 0) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const dbOrder = await createOrderFromCheckout(user, {
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          items: checkoutItems,
          subtotal: orderSubtotal,
          artisanTip: orderTip,
          total: orderTotal,
        })
        if (dbOrder) {
          savedOrder = dbOrder
        }
      }
    }

    const jsonResponse = NextResponse.json({
      verified: true,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      order: savedOrder,
    })
    response.cookies.getAll().forEach((cookie) => {
      jsonResponse.cookies.set(cookie)
    })
    return jsonResponse
  } catch (err) {
    console.error("[razorpay/verify-payment]", err)
    return NextResponse.json(
      { error: "Payment verification failed." },
      { status: 500 },
    )
  }
}
