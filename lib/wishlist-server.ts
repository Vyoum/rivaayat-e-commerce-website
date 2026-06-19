import type { User as AuthUser } from "@supabase/supabase-js"
import type { Category } from "@prisma/client"

import { CATEGORY_ENUM_TO_ROUTE, mapDbProductToCatalog } from "@/lib/product-catalog"
import { getPrisma } from "@/lib/prisma"
import { ensureDbUserForAuthUser } from "@/lib/user-sync-server"
import type { WishlistItem } from "@/lib/wishlist"

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const wishlistProductSelect = {
  id: true,
  name: true,
  slug: true,
  price: true,
  artisanName: true,
  location: true,
  imageUrls: true,
  badge: true,
  handcrafted: true,
  inStock: true,
  subcategory: true,
  tags: true,
  category: true,
  artisan: { select: { name: true } },
} as const

type WishlistProductRow = {
  id: string
  name: string
  slug: string
  price: unknown
  artisanName: string | null
  location: string | null
  imageUrls: string[]
  badge: string | null
  handcrafted: boolean
  inStock: boolean
  subcategory: string | null
  tags: string[]
  category: Category
  artisan: { name: string } | null
}

type WishlistRow = {
  productId: string
  addedAt: Date
  product: WishlistProductRow
}

export function isWishlistProductId(value: string) {
  return UUID_PATTERN.test(value.trim())
}

function mapWishlistRow(row: WishlistRow): WishlistItem {
  const categoryRoute = CATEGORY_ENUM_TO_ROUTE[row.product.category]
  const catalog = mapDbProductToCatalog(row.product, categoryRoute)

  return {
    id: row.productId,
    name: catalog.name,
    slug: catalog.slug,
    price: catalog.price,
    image: catalog.image,
    artisan: catalog.artisan,
    location: catalog.location,
    addedAt: row.addedAt.toISOString(),
    categoryRoute: catalog.categoryRoute,
    categoryLabel: catalog.categoryLabel,
    subcategory: catalog.subcategory,
    subcategoryLabel: catalog.subcategoryLabel,
    inStock: catalog.inStock,
  }
}

async function resolvePublishedProduct(productId: string, slug?: string | null) {
  const prisma = getPrisma()
  if (!prisma) return null

  const trimmedId = productId.trim()
  if (isWishlistProductId(trimmedId)) {
    const byId = await prisma.product.findFirst({
      where: { id: trimmedId, isPublished: true },
      select: wishlistProductSelect,
    })
    if (byId) return byId
  }

  const trimmedSlug = slug?.trim()
  if (trimmedSlug) {
    return prisma.product.findFirst({
      where: { slug: trimmedSlug, isPublished: true },
      select: wishlistProductSelect,
    })
  }

  return null
}

async function getDbUserId(authUser: AuthUser) {
  const dbUser = await ensureDbUserForAuthUser(authUser)
  return dbUser?.id ?? null
}

export async function loadWishlistForAuthUser(authUser: AuthUser): Promise<WishlistItem[]> {
  const prisma = getPrisma()
  if (!prisma) return []

  const userId = await getDbUserId(authUser)
  if (!userId) return []

  const rows = await prisma.wishlist.findMany({
    where: { userId },
    include: { product: { select: wishlistProductSelect } },
    orderBy: { addedAt: "desc" },
  })

  return rows.map((row) => mapWishlistRow(row))
}

export async function addWishlistItemForAuthUser(
  authUser: AuthUser,
  productId: string,
  slug?: string | null,
): Promise<{ item: WishlistItem; items: WishlistItem[] } | null> {
  const prisma = getPrisma()
  if (!prisma) return null

  const userId = await getDbUserId(authUser)
  if (!userId) return null

  const product = await resolvePublishedProduct(productId, slug)
  if (!product) return null

  await prisma.wishlist.upsert({
    where: {
      userId_productId: {
        userId,
        productId: product.id,
      },
    },
    create: {
      userId,
      productId: product.id,
    },
    update: {},
  })

  const items = await loadWishlistForAuthUser(authUser)
  const item = items.find((entry) => entry.id === product.id)
  if (!item) return null

  return { item, items }
}

export async function removeWishlistItemForAuthUser(
  authUser: AuthUser,
  productId: string,
): Promise<WishlistItem[]> {
  const prisma = getPrisma()
  if (!prisma) return []

  const userId = await getDbUserId(authUser)
  if (!userId) return []

  const resolved = await resolvePublishedProduct(productId)
  const resolvedId = resolved?.id ?? (isWishlistProductId(productId) ? productId.trim() : null)
  if (!resolvedId) return loadWishlistForAuthUser(authUser)

  await prisma.wishlist.deleteMany({
    where: { userId, productId: resolvedId },
  })

  return loadWishlistForAuthUser(authUser)
}

export async function toggleWishlistItemForAuthUser(
  authUser: AuthUser,
  productId: string,
  slug?: string | null,
): Promise<{ added: boolean; items: WishlistItem[] } | null> {
  const prisma = getPrisma()
  if (!prisma) return null

  const userId = await getDbUserId(authUser)
  if (!userId) return null

  const product = await resolvePublishedProduct(productId, slug)
  if (!product) return null

  const existing = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId,
        productId: product.id,
      },
    },
    select: { id: true },
  })

  if (existing) {
    await prisma.wishlist.delete({ where: { id: existing.id } })
    return { added: false, items: await loadWishlistForAuthUser(authUser) }
  }

  await prisma.wishlist.create({
    data: {
      userId,
      productId: product.id,
    },
  })

  return { added: true, items: await loadWishlistForAuthUser(authUser) }
}

export async function migrateWishlistItemsForAuthUser(
  authUser: AuthUser,
  entries: Array<{ productId: string; slug?: string | null }>,
): Promise<WishlistItem[]> {
  for (const entry of entries) {
    await addWishlistItemForAuthUser(authUser, entry.productId, entry.slug)
  }

  return loadWishlistForAuthUser(authUser)
}
