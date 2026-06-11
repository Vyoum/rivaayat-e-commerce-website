export type CustomOrderDescriptionInput = {
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
  total?: number
  razorpayOrderId?: string
  razorpayPaymentId?: string
}

export function buildCustomOrderDescription(payload: CustomOrderDescriptionInput) {
  const lines = [
    `Category: ${payload.categoryLabel}`,
    `Weight: ${payload.weight}`,
    `Quantity: ${payload.quantity} box(es)`,
    "",
    "Selections:",
    ...Object.entries(payload.selections).map(([key, value]) => `- ${key}: ${value}`),
  ]

  if (payload.notes?.trim()) {
    lines.push("", `Notes: ${payload.notes.trim()}`)
  }

  lines.push(
    "",
    "Delivery:",
    `- Name: ${payload.fullName}`,
    `- Email: ${payload.email}`,
    `- WhatsApp: ${payload.whatsapp}`,
    `- Address: ${payload.addressLine1}${payload.addressLine2?.trim() ? `, ${payload.addressLine2.trim()}` : ""}`,
    `- City: ${payload.city}`,
    `- PIN: ${payload.pinCode}`,
    `- State: ${payload.state}`,
  )

  if (payload.total !== undefined) {
    lines.push("", `Amount: ₹${payload.total.toLocaleString("en-IN")}`)
  }

  if (payload.razorpayOrderId || payload.razorpayPaymentId) {
    lines.push("", "Payment:")
    if (payload.razorpayOrderId) {
      lines.push(`- Razorpay Order: ${payload.razorpayOrderId}`)
    }
    if (payload.razorpayPaymentId) {
      lines.push(`- Payment ID: ${payload.razorpayPaymentId}`)
    }
  }

  return lines.join("\n")
}
