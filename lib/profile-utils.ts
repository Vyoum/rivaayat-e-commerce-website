export function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export function formatOrderStatus(status: string) {
  const labels: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    processing: "Processing",
    shipped: "In Transit",
    delivered: "Delivered",
    cancelled: "Cancelled",
  }
  return labels[status] ?? status
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPatronSince(date: string) {
  const year = new Date(date).getFullYear()
  return `Patron since ${year}`
}

export function formatOrderDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}

export function shortId(id: string) {
  return id.slice(0, 8).toUpperCase()
}
