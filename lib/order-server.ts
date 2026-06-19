import type { User } from "@supabase/supabase-js"

import { getPrisma } from "@/lib/prisma"
import { formatOrderStatus, shortId } from "@/lib/profile-utils"
import type { ProfileOrder } from "@/types/profile"
import type { DeliveryAddress } from "@/lib/delivery-address"
import { serializeDeliveryAddress } from "@/lib/delivery-address"
import { checkoutItemsToOrderItems, type StoredCheckoutItem } from "@/lib/orders-storage"
import { formatCartItemVariantDetails } from "@/lib/cart"

type CreateOrderInput = {
  razorpayOrderId: string
  razorpayPaymentId: string
  items: StoredCheckoutItem[]
  subtotal: number
  artisanTip: number
  total: number
  giftMessage?: string | null
  promoCode?: string | null
  discountAmount?: number
  deliveryAddress?: DeliveryAddress | null
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

  return createOrderRecord(dbUser.id, input)
}

export async function createGuestOrderFromCheckout(
  input: CreateOrderInput,
): Promise<ProfileOrder | null> {
  const prisma = getPrisma()
  if (!prisma) return null

  if (!input.deliveryAddress?.email.trim()) {
    return null
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: input.deliveryAddress.email.trim().toLowerCase() },
    select: { id: true },
  })

  return createOrderRecord(existingUser?.id ?? null, input)
}

async function createOrderRecord(
  userId: string | null,
  input: CreateOrderInput,
): Promise<ProfileOrder | null> {
  const prisma = getPrisma()
  if (!prisma) return null

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
      userId,
      status: "confirmed",
      paymentStatus: "paid",
      razorpayOrderId: input.razorpayOrderId,
      razorpayPaymentId: input.razorpayPaymentId,
      subtotal: input.subtotal,
      artisanTip: input.artisanTip,
      total: input.total,
      giftMessage: input.giftMessage?.trim() || null,
      promoCode: input.promoCode?.trim().toUpperCase() || null,
      discountAmount: input.discountAmount ?? 0,
      shippingAddress: input.deliveryAddress
        ? serializeDeliveryAddress(input.deliveryAddress)
        : null,
      items: {
        create: input.items.map((item) => ({
          productId: item.id,
          productName: item.name,
          variant: formatCartItemVariantDetails({
            variant: item.variant,
            size: item.size,
            color: item.color,
          }),
          quantity: item.quantity,
          unitPrice: item.price,
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
