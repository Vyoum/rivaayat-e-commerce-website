import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "INR", receipt } = await req.json()

    if (!amount || typeof amount !== "number" || amount < 1) {
      return NextResponse.json(
        { error: "Invalid amount. Must be a positive number in paise." },
        { status: 400 },
      )
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // convert ₹ to paise
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
