export type ProfileOrderItem = {
  id: string
  productName: string
  variant: string | null
  quantity: number
  unitPrice: number
  image: string | null
  artisan: string | null
}

export type ProfileOrder = {
  id: string
  displayId: string
  status: string
  paymentStatus: string
  total: number
  artisanTip: number
  discountAmount?: number
  promoCode?: string | null
  giftMessage?: string | null
  createdAt: string
  items: ProfileOrderItem[]
}

export type ProfileWishlistItem = {
  id: string
  productId: string
  name: string
  price: number
  slug: string | null
  image: string | null
  addedAt: string
}

export type ProfileCustomOrder = {
  id: string
  displayId: string
  description: string
  status: string
  estimatedDelivery: string | null
  artisan: string | null
  createdAt: string
}

export type ProfileUser = {
  id: string
  name: string
  email: string
  phone: string | null
  avatarUrl: string | null
  patronSince: string
  totalTips: number
}

export type ProfileStats = {
  orders: number
  wishlist: number
  customOrders: number
}

export type ProfileData = {
  user: ProfileUser
  stats: ProfileStats
  orders: ProfileOrder[]
  wishlist: ProfileWishlistItem[]
  customOrders: ProfileCustomOrder[]
}
