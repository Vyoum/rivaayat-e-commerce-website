import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { getPrisma } from "@/lib/prisma"
import type { ProfileData } from "@/types/profile"
import { formatOrderStatus, shortId } from "@/lib/profile-utils"

function getBearerToken(req: NextRequest) {
  const header = req.headers.get("authorization")
  if (!header?.startsWith("Bearer ")) return null
  return header.slice(7)
}

export async function GET(req: NextRequest) {
  try {
    const token = getBearerToken(req)
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return NextResponse.json({ error: "Auth service is not configured." }, { status: 503 })
    }

    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser(token)

    if (authError || !authUser?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const authName =
      (authUser.user_metadata?.full_name as string | undefined) ??
      (authUser.user_metadata?.name as string | undefined) ??
      authUser.email.split("@")[0]

    const prisma = getPrisma()

    if (!prisma) {
      const fallbackProfile: ProfileData = {
        user: {
          id: authUser.id,
          name: authName,
          email: authUser.email,
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
      return NextResponse.json(fallbackProfile)
    }

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
    } else if (dbUser.name !== authName || authUser.user_metadata?.avatar_url) {
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          name: authName,
          avatarUrl:
            (authUser.user_metadata?.avatar_url as string | undefined) ?? dbUser.avatarUrl,
          phone: authUser.phone ?? dbUser.phone,
        },
      })
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

    const profile: ProfileData = {
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

    return NextResponse.json(profile)
  } catch (err) {
    console.error("[api/profile]", err)
    return NextResponse.json({ error: "Failed to load profile." }, { status: 500 })
  }
}
