import type { User } from "@supabase/supabase-js"

import { getPrisma } from "@/lib/prisma"
import { ensureDbUserForAuthUser } from "@/lib/user-sync-server"
import { formatOrderStatus, shortId } from "@/lib/profile-utils"
import type { ProfileData } from "@/types/profile"

export function buildFallbackProfile(authUser: User): ProfileData {
  const authName =
    (authUser.user_metadata?.full_name as string | undefined) ??
    (authUser.user_metadata?.name as string | undefined) ??
    authUser.email?.split("@")[0] ??
    "Guest"

  return {
    user: {
      id: authUser.id,
      name: authName,
      email: authUser.email ?? "",
      phone: authUser.phone ?? null,
      avatarUrl: (authUser.user_metadata?.avatar_url as string | undefined) ?? null,
      patronSince: authUser.created_at,
      totalTips: 0,
    },
    stats: { orders: 0, wishlist: 0, customOrders: 0 },
    orders: [],
    wishlist: [],
    customOrders: [],
  }
}

export async function loadProfileForUser(authUser: User): Promise<ProfileData> {
  const prisma = getPrisma()
  if (!prisma || !authUser.email) {
    return buildFallbackProfile(authUser)
  }

  const synced = await ensureDbUserForAuthUser(authUser)
  if (!synced) {
    return buildFallbackProfile(authUser)
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: synced.id },
  })

  if (!dbUser) {
    return buildFallbackProfile(authUser)
  }

  const [orders, wishlistRows, customOrders] = await Promise.all([
    prisma.order.findMany({
      where: { userId: dbUser.id },
      include: {
        items: {
          include: {
            product: {
              include: { artisan: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.wishlist.findMany({
      where: { userId: dbUser.id },
      include: { product: true },
      orderBy: { addedAt: "desc" },
    }),
    prisma.customOrder.findMany({
      where: { userId: dbUser.id },
      include: { artisan: true },
      orderBy: { createdAt: "desc" },
    }),
  ])

  return {
    user: {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      phone: dbUser.phone,
      avatarUrl: dbUser.avatarUrl,
      patronSince: dbUser.patronSince.toISOString(),
      totalTips: Number(dbUser.totalTips),
    },
    stats: {
      orders: orders.length,
      wishlist: wishlistRows.length,
      customOrders: customOrders.length,
    },
    orders: orders.map((order) => {
      const firstItem = order.items[0]
      const artisan = firstItem?.product?.artisan

      return {
        id: order.id,
        displayId: order.razorpayOrderId ?? shortId(order.id),
        status: formatOrderStatus(order.status),
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
            : artisan
              ? `${artisan.name}, ${artisan.location}`
              : null,
        })),
      }
    }),
    wishlist: wishlistRows.map((row) => ({
      id: row.id,
      productId: row.productId,
      name: row.product.name,
      price: Number(row.product.price),
      slug: row.product.slug,
      image: row.product.imageUrls?.[0] ?? null,
      addedAt: row.addedAt.toISOString(),
    })),
    customOrders: customOrders.map((order) => ({
      id: order.id,
      displayId: shortId(order.id),
      description: order.description,
      status: formatOrderStatus(order.status),
      estimatedDelivery: order.estimatedDelivery,
      artisan: order.artisan ? `${order.artisan.name}, ${order.artisan.location}` : null,
      createdAt: order.createdAt.toISOString(),
    })),
  }
}
