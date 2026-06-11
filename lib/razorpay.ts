import Razorpay from "razorpay"

type RazorpayGlobal = typeof globalThis & {
  _razorpay?: Razorpay
  _razorpayKeyId?: string
}

const globalForRazorpay = globalThis as RazorpayGlobal

export function getRazorpay() {
  const keyId =
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    return null
  }

  // Recreate the client when keys change (e.g. after updating .env.local).
  if (
    !globalForRazorpay._razorpay ||
    globalForRazorpay._razorpayKeyId !== keyId
  ) {
    globalForRazorpay._razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })
    globalForRazorpay._razorpayKeyId = keyId
  }

  return globalForRazorpay._razorpay
}

export function getRazorpayPublicKeyId() {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? process.env.RAZORPAY_KEY_ID ?? null
}

export function getRazorpayKeySecret() {
  return process.env.RAZORPAY_KEY_SECRET ?? null
}
