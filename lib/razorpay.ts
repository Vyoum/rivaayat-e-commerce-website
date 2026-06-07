import Razorpay from "razorpay"

let razorpayInstance: Razorpay | null = null

export function getRazorpay() {
  const keyId =
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    return null
  }

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })
  }

  return razorpayInstance
}

export function getRazorpayKeySecret() {
  return process.env.RAZORPAY_KEY_SECRET ?? null
}
