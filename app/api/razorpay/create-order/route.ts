import { NextRequest, NextResponse } from "next/server"
import { getRazorpay } from "@/lib/razorpay"

export async function POST(req: NextRequest) {
  try {
    const razorpay = getRazorpay()
    if (!razorpay) {
      return NextResponse.json(
        { error: "Payment service is not configured." },
        { status: 503 },
      )
    }

    const { amount, currency = "INR", receipt } = await req.json()

    if (!amount || typeof amount !== "number" || amount < 1) {
      return NextResponse.json(
        { error: "Invalid amount. Must be a positive number in paise." },
        { status: 400 },
      )
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt ?? `rcpt_${Date.now()}`,
    })

    return NextResponse.json(order)
  } catch (err) {
    console.error("[razorpay/create-order]", err)
    return NextResponse.json(
      { error: "Failed to create Razorpay order." },
      { status: 500 },
    )
  }
}
