import { NextRequest, NextResponse } from "next/server"
import { getRazorpay } from "@/lib/razorpay"

export const runtime = "nodejs"

function getRazorpayErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "error" in err) {
    const error = (
      err as {
        error?: { description?: string; reason?: string; code?: string }
      }
    ).error

    return (
      error?.description ??
      error?.reason ??
      error?.code ??
      "Razorpay rejected the order request."
    )
  }

  if (err instanceof Error && err.message.trim()) {
    return err.message
  }

  return "Failed to create Razorpay order."
}

export async function POST(req: NextRequest) {
  try {
    const razorpay = getRazorpay()
    if (!razorpay) {
      return NextResponse.json(
        {
          error:
            "Payment service is not configured. Add NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your environment.",
        },
        { status: 503 },
      )
    }

    const body = await req.json()
    const { currency = "INR", receipt } = body
    const amountRupees = Number(body.amount)

    if (!Number.isFinite(amountRupees) || amountRupees < 1) {
      return NextResponse.json(
        { error: "Invalid amount. Must be at least ₹1." },
        { status: 400 },
      )
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amountRupees * 100),
      currency,
      receipt: receipt ?? `rcpt_${Date.now()}`,
    })

    return NextResponse.json(order)
  } catch (err) {
    console.error("[razorpay/create-order]", err)
    return NextResponse.json(
      { error: getRazorpayErrorMessage(err) },
      { status: 500 },
    )
  }
}
