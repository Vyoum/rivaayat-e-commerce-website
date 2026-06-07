export type AdminOrderItem = {
  id: string
  productName: string
  variant: string | null
  quantity: number
  unitPrice: number
  image: string | null
  category: string
  artisan: string | null
}

export type AdminOrder = {
  id: string
  displayId: string
  status: string
  statusKey: string
  paymentStatus: string
  paymentLabel: string
  subtotal: number
  artisanTip: number
  total: number
  giftMessage: string | null
  shippingAddress: string | null
  createdAt: string
  customer: {
    name: string
    email: string
    phone: string | null
    avatarUrl: string | null
    initials: string
  }
  items: AdminOrderItem[]
  firstItem: AdminOrderItem | null
  totalQuantity: number
}

export type AdminOrderStatusCounts = {
  all: number
  pending: number
  processing: number
  shipped: number
  delivered: number
  cancelled: number
}
