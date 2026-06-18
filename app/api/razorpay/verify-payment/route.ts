import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

import { validatePromoCode, incrementPromoUsage } from "@/lib/discount-code-server"
import type { DeliveryAddress } from "@/lib/delivery-address"
import { isDeliveryAddressComplete } from "@/lib/delivery-address"
import { fulfillOrderWithDelhivery } from "@/lib/delhivery-fulfillment"
import { createGuestOrderFromCheckout, createOrderFromCheckout } from "@/lib/order-server"
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
    const {
      data: { user },
    } = supabase ? await supabase.auth.getUser() : { data: { user: null } }

    const orderPayload = {
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
    }

    if (checkoutItems.length > 0 && orderPayload.deliveryAddress) {
      const dbOrder = user
        ? await createOrderFromCheckout(user, orderPayload)
        : await createGuestOrderFromCheckout(orderPayload)

      if (dbOrder) {
        savedOrder = dbOrder
        dbOrderId = dbOrder.id
      }
    }

    let delhiveryResult: { ok: boolean; waybill?: string; error?: string } | null = null

    if (
      dbOrderId &&
      orderPayload.deliveryAddress &&
      !existingOrder?.delhiveryWaybill
    ) {
      const productsDesc =
        checkoutItems.length > 0
          ? checkoutItems
              .map((item) => `${item.name}${item.quantity > 1 ? ` x${item.quantity}` : ""}`)
              .join(", ")
          : "House of Indika order"

      delhiveryResult = await fulfillOrderWithDelhivery({
        orderId: dbOrderId,
        orderReference: razorpay_order_id,
        delivery: orderPayload.deliveryAddress,
        productsDesc,
        totalAmount: orderTotal,
        kind: "store",
      })

      if (!delhiveryResult.ok) {
        console.error("[razorpay/verify-payment] Delhivery failed", {
          razorpayOrderId: razorpay_order_id,
          dbOrderId,
          error: delhiveryResult.error,
        })
      } else {
        console.info("[razorpay/verify-payment] Delhivery waybill created", {
          razorpayOrderId: razorpay_order_id,
          dbOrderId,
          waybill: delhiveryResult.waybill,
        })
      }
    }

    if (!existingOrder && appliedPromoCode) {
      await incrementPromoUsage(appliedPromoCode)
    }

    const trackingId =
      delhiveryResult?.waybill?.trim() ||
      existingOrder?.delhiveryWaybill?.trim() ||
      null

    const jsonResponse = NextResponse.json({
      verified: true,
      orderId: savedOrder?.id ?? dbOrderId,
      orderDisplayId: savedOrder?.displayId ?? dbOrderId,
      paymentId: razorpay_payment_id,
      trackingId,
      order: savedOrder,
      shipping: delhiveryResult
        ? {
            created: delhiveryResult.ok,
            waybill: delhiveryResult.waybill ?? null,
            error: delhiveryResult.error ?? null,
          }
        : trackingId
          ? {
              created: true,
              waybill: trackingId,
              error: null,
            }
          : null,
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
