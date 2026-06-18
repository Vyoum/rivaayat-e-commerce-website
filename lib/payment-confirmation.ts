export type PaymentConfirmationDetails = {
  orderId: string
  trackingId: string | null
}

export function delhiveryTrackingUrl(waybill: string) {
  return `https://www.delhivery.com/track/package/${encodeURIComponent(waybill)}`
}

export function buildPaymentConfirmationDetails(input: {
  order?: { id?: string; displayId?: string } | null
  orderId?: string | null
  orderDisplayId?: string | null
  trackingId?: string | null
  shipping?: { waybill?: string | null } | null
}): PaymentConfirmationDetails {
  const orderId =
    input.orderDisplayId?.trim() ||
    input.order?.displayId?.trim() ||
    input.order?.id?.trim() ||
    input.orderId?.trim() ||
    ""

  const trackingId =
    input.trackingId?.trim() ||
    input.shipping?.waybill?.trim() ||
    null

  return { orderId, trackingId }
}
