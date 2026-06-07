import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { getRazorpayKeySecret } from "@/lib/razorpay"

export async function POST(req: NextRequest) {
  try {
    const keySecret = getRazorpayKeySecret()
    if (!keySecret) {
      return NextResponse.json(
        { error: "Payment service is not configured." },
        { status: 503 },
      )
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment verification fields." },
        { status: 400 },
      )
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { verified: false, error: "Signature mismatch — payment not verified." },
        { status: 400 },
      )
    }

    // Payment verified — persist order to DB here in production
    return NextResponse.json({
      verified: true,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    })
  } catch (err) {
    console.error("[razorpay/verify-payment]", err)
    return NextResponse.json(
      { error: "Payment verification failed." },
      { status: 500 },
    )
  }
}
