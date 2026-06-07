import type { OrderStatus, PaymentStatus } from "@prisma/client"

import { getPrisma } from "@/lib/prisma"
import {
  formatAdminOrderStatus,
  formatAdminPaymentStatus,
  type AdminOrderTab,
} from "@/lib/order-admin-constants"
import { formatCurrency, getInitials, shortId } from "@/lib/profile-utils"
import type { AdminOrder, AdminOrderStatusCounts } from "@/types/admin-order"

export type { AdminOrderTab } from "@/lib/order-admin-constants"
export { ADMIN_ORDER_TABS } from "@/lib/order-admin-constants"

const orderInclude = {
  user: true,
  items: {
    include: {
      product: {
        include: { artisan: true },
      },
    },
  },
} as const

const categoryLabels: Record<string, string> = {
  jewellery: "Jewellery",
  clothing: "Textiles",
  decor: "Décor",
  custom_food: "Gourmet Food",
}

const tabStatusFilters: Record<AdminOrderTab, OrderStatus[] | null> = {
  All: null,
  Pending: ["pending"],
  Processing: ["confirmed", "processing"],
  Shipped: ["shipped"],
  Delivered: ["delivered"],
  Cancelled: ["cancelled"],
}

function formatCategory(category?: string | null) {
  if (!category) return "General"
  return categoryLabels[category] ?? category
}

function mapDbOrderToAdmin(order: {
  id: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  razorpayOrderId: string | null
  subtotal: unknown
  artisanTip: unknown
  total: unknown
  giftMessage: string | null
  shippingAddress: string | null
  createdAt: Date
  user: {
    name: string
    email: string
    phone: string | null
    avatarUrl: string | null
  } | null
  items: Array<{
    id: string
    productName: string
    variant: string | null
    quantity: number
    unitPrice: unknown
    product: {
      category: string
      imageUrls: string[]
      artisan: { name: string } | null
    } | null
  }>
}): AdminOrder {
  const items = order.items.map((item) => ({
    id: item.id,
    productName: item.productName,
    variant: item.variant,
    quantity: item.quantity,
    unitPrice: Number(item.unitPrice),
    image: item.product?.imageUrls?.[0] ?? null,
    category: formatCategory(item.product?.category),
    artisan: item.product?.artisan?.name ?? null,
  }))

  const customerName = order.user?.name ?? "Guest Customer"
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    id: order.id,
    displayId: order.razorpayOrderId ? `#${order.razorpayOrderId}` : `#HOI-${shortId(order.id)}`,
    status: formatAdminOrderStatus(order.status),
    statusKey: order.status,
    paymentStatus: order.paymentStatus,
    paymentLabel: formatAdminPaymentStatus(order.paymentStatus),
    subtotal: Number(order.subtotal),
    artisanTip: Number(order.artisanTip),
    total: Number(order.total),
    giftMessage: order.giftMessage,
    shippingAddress: order.shippingAddress,
    createdAt: order.createdAt.toISOString(),
    customer: {
      name: customerName,
      email: order.user?.email ?? "—",
      phone: order.user?.phone ?? null,
      avatarUrl: order.user?.avatarUrl ?? null,
      initials: getInitials(customerName),
    },
    items,
    firstItem: items[0] ?? null,
    totalQuantity,
  }
}

export async function loadAdminOrders(options?: {
  tab?: AdminOrderTab
  query?: string
}): Promise<AdminOrder[]> {
  const prisma = getPrisma()
  if (!prisma) return []

  const tab = options?.tab ?? "All"
  const query = options?.query?.trim()
  const statusFilter = tabStatusFilters[tab]

  const orders = await prisma.order.findMany({
    where: {
      ...(statusFilter ? { status: { in: statusFilter } } : {}),
      ...(query
        ? {
            OR: [
              { razorpayOrderId: { contains: query, mode: "insensitive" } },
              { razorpayPaymentId: { contains: query, mode: "insensitive" } },
              { user: { name: { contains: query, mode: "insensitive" } } },
              { user: { email: { contains: query, mode: "insensitive" } } },
              { items: { some: { productName: { contains: query, mode: "insensitive" } } } },
            ],
          }
        : {}),
    },
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  })

  return orders.map(mapDbOrderToAdmin)
}

export async function loadAdminOrderById(orderId: string): Promise<AdminOrder | null> {
  const prisma = getPrisma()
  if (!prisma) return null

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: orderInclude,
  })

  if (!order) return null
  return mapDbOrderToAdmin(order)
}

export async function getAdminOrderStatusCounts(): Promise<AdminOrderStatusCounts> {
  const prisma = getPrisma()
  if (!prisma) {
    return { all: 0, pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 }
  }

  const grouped = await prisma.order.groupBy({
    by: ["status"],
    _count: { _all: true },
  })

  const counts: AdminOrderStatusCounts = {
    all: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  }

  for (const row of grouped) {
    counts.all += row._count._all
    if (row.status === "pending") counts.pending += row._count._all
    if (row.status === "confirmed" || row.status === "processing") {
      counts.processing += row._count._all
    }
    if (row.status === "shipped") counts.shipped += row._count._all
    if (row.status === "delivered") counts.delivered += row._count._all
    if (row.status === "cancelled") counts.cancelled += row._count._all
  }

  return counts
}

export async function updateAdminOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<AdminOrder | null> {
  const prisma = getPrisma()
  if (!prisma) return null

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: orderInclude,
  })

  return mapDbOrderToAdmin(order)
}

export { formatCurrency }
