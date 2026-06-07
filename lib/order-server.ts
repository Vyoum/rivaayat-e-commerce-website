import type { User } from "@supabase/supabase-js"

import { getPrisma } from "@/lib/prisma"
import { formatOrderStatus, shortId } from "@/lib/profile-utils"
import type { ProfileOrder } from "@/types/profile"
import type { StoredCheckoutItem } from "@/lib/orders-storage"
import { checkoutItemsToOrderItems } from "@/lib/orders-storage"

type CreateOrderInput = {
  razorpayOrderId: string
  razorpayPaymentId: string
  items: StoredCheckoutItem[]
  subtotal: number
  artisanTip: number
  total: number
}

async function getOrCreateDbUser(authUser: User) {
  const prisma = getPrisma()
  if (!prisma || !authUser.email) return null

  const authName =
    (authUser.user_metadata?.full_name as string | undefined) ??
    (authUser.user_metadata?.name as string | undefined) ??
    authUser.email.split("@")[0]

  let dbUser = await prisma.user.findUnique({
    where: { email: authUser.email },
  })

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        email: authUser.email,
        name: authName,
        avatarUrl: (authUser.user_metadata?.avatar_url as string | undefined) ?? null,
        phone: authUser.phone ?? null,
      },
    })
  }

  return dbUser
}

function mapDbOrder(order: {
  id: string
  razorpayOrderId: string | null
  status: string
  paymentStatus: string
  total: unknown
  artisanTip: unknown
  createdAt: Date
  items: Array<{
    id: string
    productName: string
    variant: string | null
    quantity: number
    unitPrice: unknown
    product: { imageUrls: string[]; artisan: { name: string; location: string } | null } | null
  }>
}): ProfileOrder {
  const firstItem = order.items[0]

  return {
    id: order.id,
    displayId: order.razorpayOrderId ?? shortId(order.id),
    status: formatOrderStatus(order.status as "pending"),
    paymentStatus: order.paymentStatus,
    total: Number(order.total),
    artisanTip: Number(order.artisanTip),
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      productName: item.productName,
      variant: item.variant,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      image: item.product?.imageUrls?.[0] ?? null,
      artisan: item.product?.artisan
        ? `${item.product.artisan.name}, ${item.product.artisan.location}`
        : firstItem?.product?.artisan
          ? `${firstItem.product.artisan.name}, ${firstItem.product.artisan.location}`
          : null,
    })),
  }
}

export async function createOrderFromCheckout(
  authUser: User,
  input: CreateOrderInput,
): Promise<ProfileOrder | null> {
  const prisma = getPrisma()
  if (!prisma) return null

  const dbUser = await getOrCreateDbUser(authUser)
  if (!dbUser) return null

  const existing = await prisma.order.findFirst({
    where: { razorpayOrderId: input.razorpayOrderId },
    include: {
      items: {
        include: {
          product: {
            include: { artisan: true },
          },
        },
      },
    },
  })

  if (existing) {
    return mapDbOrder(existing)
  }

  const orderItems = checkoutItemsToOrderItems(input.items)

  const order = await prisma.order.create({
    data: {
      userId: dbUser.id,
      status: "confirmed",
      paymentStatus: "paid",
      razorpayOrderId: input.razorpayOrderId,
      razorpayPaymentId: input.razorpayPaymentId,
      subtotal: input.subtotal,
      artisanTip: input.artisanTip,
      total: input.total,
      items: {
        create: orderItems.map((item) => ({
          productName: item.productName,
          variant: item.variant,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      },
    },
    include: {
      items: {
        include: {
          product: {
            include: { artisan: true },
          },
        },
      },
    },
  })

  return {
    id: order.id,
    displayId: order.razorpayOrderId ?? shortId(order.id),
    status: formatOrderStatus(order.status),
    paymentStatus: order.paymentStatus,
    total: Number(order.total),
    artisanTip: Number(order.artisanTip),
    createdAt: order.createdAt.toISOString(),
    items: orderItems.map((item, index) => ({
      ...item,
      id: order.items[index]?.id ?? item.id,
    })),
  }
}
