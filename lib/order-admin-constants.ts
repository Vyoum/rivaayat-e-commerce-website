export const ADMIN_ORDER_TABS = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const

export type AdminOrderTab = (typeof ADMIN_ORDER_TABS)[number]

export function formatAdminOrderStatus(status: string): string {
  const labels: Record<string, string> = {
    pending: "Pending",
    confirmed: "Processing",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  }
  return labels[status] ?? status
}

export function formatAdminPaymentStatus(status: string): string {
  const labels: Record<string, string> = {
    pending: "Unpaid",
    paid: "Paid",
    failed: "Failed",
    refunded: "Refunded",
  }
  return labels[status] ?? status
}
