import { NextResponse, type NextRequest } from "next/server"
import crypto from "crypto"

import { buildCustomOrderDescription } from "@/lib/custom-order-description"
import { fulfillOrderWithDelhivery } from "@/lib/delhivery-fulfillment"
import type { DeliveryAddress } from "@/lib/delivery-address"
import { getPrisma } from "@/lib/prisma"
import { shortId } from "@/lib/profile-utils"
import { getRazorpayKeySecret } from "@/lib/razorpay"
import { createSupabaseApiClient } from "@/lib/supabase/server"

type ConfirmCustomOrderPayload = {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  categoryId: string
  categoryLabel: string
  selections: Record<string, string>
  weight: string
  quantity: string
  notes?: string
  fullName: string
  whatsapp: string
  email: string
  addressLine1: string
  addressLine2?: string
  city: string
  pinCode: string
  state: string
  total: number
}

function validatePayload(body: ConfirmCustomOrderPayload) {
  if (
    !body.razorpay_order_id ||
    !body.razorpay_payment_id ||
    !body.razorpay_signature
  ) {
    return "Payment verification fields are missing."
  }

  if (
    !body.fullName?.trim() ||
    !body.whatsapp?.trim() ||
    !body.email?.trim() ||
    !body.addressLine1?.trim() ||
    !body.city?.trim() ||
    !body.pinCode?.trim() ||
    !body.state?.trim()
  ) {
    return "Delivery details are incomplete."
  }

  if (!body.categoryLabel || !body.weight || !body.quantity) {
    return "Order details are incomplete."
  }

  if (!Number.isFinite(body.total) || body.total < 1) {
    return "Invalid order total."
  }

  return null
}

export async function POST(request: NextRequest) {
  const response = NextResponse.next()

  try {
    const keySecret = getRazorpayKeySecret()
    if (!keySecret) {
      return NextResponse.json(
        { error: "Payment service is not configured." },
        { status: 503 },
      )
    }

    const body = (await request.json()) as ConfirmCustomOrderPayload
    const validationError = validatePayload(body)
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    const payload = `${body.razorpay_order_id}|${body.razorpay_payment_id}`
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(payload)
      .digest("hex")

    if (expectedSignature !== body.razorpay_signature) {
      return NextResponse.json(
        { error: "Payment verification failed." },
        { status: 400 },
      )
    }

    const prisma = getPrisma()
    if (!prisma) {
      return NextResponse.json({ error: "Database is unavailable." }, { status: 503 })
    }

    let userId: string | null = null

    try {
      const supabase = createSupabaseApiClient(request, response)
      if (supabase) {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email ?? "" },
            select: { id: true },
          })
          userId = dbUser?.id ?? null
        }
      }
    } catch {
      // guest checkout is allowed
    }

    const order = await prisma.customOrder.create({
      data: {
        userId,
        description: buildCustomOrderDescription({
          categoryLabel: body.categoryLabel,
          selections: body.selections,
          weight: body.weight,
          quantity: body.quantity,
          notes: body.notes,
          fullName: body.fullName.trim(),
          whatsapp: body.whatsapp.trim(),
          email: body.email.trim(),
          addressLine1: body.addressLine1.trim(),
          addressLine2: body.addressLine2?.trim(),
          city: body.city.trim(),
          pinCode: body.pinCode.trim(),
          state: body.state.trim(),
          total: body.total,
          razorpayOrderId: body.razorpay_order_id,
          razorpayPaymentId: body.razorpay_payment_id,
        }),
        status: "confirmed",
        estimatedDelivery: "5-7 days",
      },
    })

    const delivery: DeliveryAddress = {
      fullName: body.fullName.trim(),
      email: body.email.trim(),
      whatsapp: body.whatsapp.trim(),
      addressLine1: body.addressLine1.trim(),
      addressLine2: body.addressLine2?.trim() ?? "",
      city: body.city.trim(),
      pinCode: body.pinCode.trim(),
      state: body.state.trim(),
    }

    const delhiveryResult = await fulfillOrderWithDelhivery({
      orderId: order.id,
      orderReference: body.razorpay_order_id,
      delivery,
      productsDesc: `${body.categoryLabel} custom order (${body.weight}, ${body.quantity} box)`,
      totalAmount: body.total,
      kind: "custom",
    })

    if (!delhiveryResult.ok) {
      console.error("[api/custom-orders/confirm] Delhivery failed", {
        customOrderId: order.id,
        orderReference: body.razorpay_order_id,
        error: delhiveryResult.error,
      })
    } else {
      console.info("[api/custom-orders/confirm] Delhivery waybill created", {
        customOrderId: order.id,
        orderReference: body.razorpay_order_id,
        waybill: delhiveryResult.waybill,
      })
    }

    const trackingId = delhiveryResult.waybill?.trim() || null

    const jsonResponse = NextResponse.json({
      id: order.id,
      orderDisplayId: shortId(order.id),
      success: true,
      paymentId: body.razorpay_payment_id,
      trackingId,
      shipping: {
        created: delhiveryResult.ok,
        waybill: trackingId,
        error: delhiveryResult.error ?? null,
      },
    })
    response.cookies.getAll().forEach((cookie) => {
      jsonResponse.cookies.set(cookie)
    })
    return jsonResponse
  } catch (error) {
    console.error("[api/custom-orders/confirm]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to confirm custom order" },
      { status: 500 },
    )
  }
}
