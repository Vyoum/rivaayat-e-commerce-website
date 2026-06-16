import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

import { validatePromoCode, incrementPromoUsage } from "@/lib/discount-code-server"
import type { DeliveryAddress } from "@/lib/delivery-address"
import { isDeliveryAddressComplete } from "@/lib/delivery-address"
import { fulfillOrderWithDelhivery } from "@/lib/delhivery-fulfillment"
import { createOrderFromCheckout } from "@/lib/order-server"
import { buildOrderFromCheckout, type StoredCheckoutItem } from "@/lib/orders-storage"
import { getPrisma } from "@/lib/prisma"
import { getRazorpayKeySecret } from "@/lib/razorpay"
import { createSupabaseApiClient } from "@/lib/supabase/server"

function normalizeGiftMessage(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  if (!trimmed) return null
  return trimmed.slice(0, 500)
}

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
      giftMessage,
      promoCode,
      deliveryAddress,
    } = body as {
      razorpay_order_id: string
      razorpay_payment_id: string
      razorpay_signature: string
      items?: StoredCheckoutItem[]
      subtotal?: number
      artisanTip?: number
      total?: number
      giftMessage?: string | null
      promoCode?: string | null
      deliveryAddress?: DeliveryAddress
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
    const normalizedGiftMessage = normalizeGiftMessage(giftMessage)

    let discountAmount = 0
    let appliedPromoCode: string | null = null

    if (typeof promoCode === "string" && promoCode.trim()) {
      const promoResult = await validatePromoCode(promoCode, orderSubtotal)
      if (promoResult.valid) {
        discountAmount = promoResult.promo.discountAmount
        appliedPromoCode = promoResult.promo.code
      }
    }

    const orderTotal = Math.max(1, orderSubtotal + orderTip - discountAmount)

    let savedOrder =
      checkoutItems.length > 0
        ? buildOrderFromCheckout(
            razorpay_order_id,
            checkoutItems,
            orderTotal,
            orderTip,
            normalizedGiftMessage,
            appliedPromoCode,
            discountAmount,
          )
        : null

    const prisma = getPrisma()
    const existingOrder = prisma
      ? await prisma.order.findFirst({ where: { razorpayOrderId: razorpay_order_id } })
      : null

    let dbOrderId: string | null = existingOrder?.id ?? null

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
          giftMessage: normalizedGiftMessage,
          promoCode: appliedPromoCode,
          discountAmount,
          deliveryAddress:
            deliveryAddress && isDeliveryAddressComplete(deliveryAddress)
              ? deliveryAddress
              : null,
        })
        if (dbOrder) {
          savedOrder = dbOrder
          dbOrderId = dbOrder.id
        }
      }
    }

    if (
      dbOrderId &&
      deliveryAddress &&
      isDeliveryAddressComplete(deliveryAddress) &&
      !existingOrder?.delhiveryWaybill
    ) {
      const productsDesc =
        checkoutItems.length > 0
          ? checkoutItems
              .map((item) => `${item.name}${item.quantity > 1 ? ` x${item.quantity}` : ""}`)
              .join(", ")
          : "House of Indika order"

      await fulfillOrderWithDelhivery({
        orderId: dbOrderId,
        orderReference: razorpay_order_id,
        delivery: deliveryAddress,
        productsDesc,
        totalAmount: orderTotal,
        kind: "store",
      })
    }

    if (!existingOrder && appliedPromoCode) {
      await incrementPromoUsage(appliedPromoCode)
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
