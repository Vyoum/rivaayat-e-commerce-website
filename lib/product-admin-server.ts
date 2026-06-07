import type { Category } from "@prisma/client"

import {
  ADMIN_CATEGORY_COLORS,
  CATEGORY_ENUM_TO_ROUTE,
  CATEGORY_LABELS,
} from "@/lib/product-catalog"
import { getPrisma } from "@/lib/prisma"
import { slugify } from "@/lib/product-utils"
import type {
  AdminProduct,
  AdminProductTab,
  CreateProductInput,
  UpdateProductInput,
} from "@/types/product"

const productSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  story: true,
  storyImageUrl: true,
  materialsCare: true,
  category: true,
  subcategory: true,
  price: true,
  artisanName: true,
  location: true,
  imageUrls: true,
  tags: true,
  badge: true,
  inStock: true,
  isPublished: true,
  handcrafted: true,
  createdAt: true,
  updatedAt: true,
} as const

function mapDbProductToAdmin(product: {
  id: string
  name: string
  slug: string
  description: string | null
  story: string | null
  storyImageUrl: string | null
  materialsCare: string | null
  category: Category
  subcategory: string | null
  price: unknown
  artisanName: string | null
  location: string | null
  imageUrls: string[]
  tags: string[]
  badge: string | null
  inStock: boolean
  isPublished: boolean
  handcrafted: boolean
  createdAt: Date
  updatedAt: Date
}): AdminProduct {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    story: product.story,
    storyImageUrl: product.storyImageUrl,
    materialsCare: product.materialsCare,
    category: product.category,
    categoryLabel: CATEGORY_LABELS[product.category],
    categoryRoute: CATEGORY_ENUM_TO_ROUTE[product.category],
    subcategory: product.subcategory,
    price: Number(product.price),
    artisanName: product.artisanName,
    location: product.location,
    imageUrls: product.imageUrls,
    tags: product.tags,
    badge: product.badge,
    inStock: product.inStock,
    isPublished: product.isPublished,
    handcrafted: product.handcrafted,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  }
}

async function ensureUniqueSlug(baseSlug: string, excludeId?: string) {
  const prisma = getPrisma()
  if (!prisma) throw new Error("Database unavailable")
  let slug = baseSlug
  let counter = 1

  while (true) {
    const existing = await prisma.product.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    })

    if (!existing) return slug
    counter += 1
    slug = `${baseSlug}-${counter}`
  }
}

export async function loadAdminProducts(options?: { tab?: AdminProductTab; query?: string }) {
  const tab = options?.tab ?? "All"
  const query = options?.query?.trim()

  const where =
    tab === "Draft"
      ? { isPublished: false }
      : tab !== "All"
        ? { category: tab as Category }
        : {}

  const prisma = getPrisma()
  if (!prisma) return []

  const products = await prisma.product.findMany({
    where: {
      ...where,
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" as const } },
              { slug: { contains: query, mode: "insensitive" as const } },
              { artisanName: { contains: query, mode: "insensitive" as const } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
    select: productSelect,
  })

  return products.map(mapDbProductToAdmin)
}

export async function getAdminProductCounts() {
  const prisma = getPrisma()
  if (!prisma) {
    return { All: 0, jewellery: 0, clothing: 0, decor: 0, custom_food: 0, Draft: 0 }
  }

  const [all, jewellery, clothing, decor, customFood, draft] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { category: "jewellery" } }),
    prisma.product.count({ where: { category: "clothing" } }),
    prisma.product.count({ where: { category: "decor" } }),
    prisma.product.count({ where: { category: "custom_food" } }),
    prisma.product.count({ where: { isPublished: false } }),
  ])

  return {
    All: all,
    jewellery,
    clothing,
    decor,
    custom_food: customFood,
    Draft: draft,
  }
}

export async function getAdminProductById(id: string) {
  const prisma = getPrisma()
  if (!prisma) return null

  const product = await prisma.product.findUnique({
    where: { id },
    select: productSelect,
  })

  return product ? mapDbProductToAdmin(product) : null
}

export async function createAdminProduct(input: CreateProductInput) {
  const prisma = getPrisma()
  if (!prisma) throw new Error("Database unavailable")
  const baseSlug = slugify(input.slug?.trim() || input.name)
  if (!baseSlug) throw new Error("Product name must contain valid characters for a URL slug")

  const slug = await ensureUniqueSlug(baseSlug)

  if (input.imageUrls.length === 0) {
    throw new Error("At least one product image is required")
  }

  const product = await prisma.product.create({
    data: {
      name: input.name.trim(),
      slug,
      description: input.description?.trim() || null,
      story: input.story?.trim() || null,
      storyImageUrl: input.storyImageUrl?.trim() || null,
      materialsCare: input.materialsCare?.trim() || null,
      category: input.category,
      subcategory: input.subcategory?.trim() || null,
      price: input.price,
      artisanName: input.artisanName?.trim() || null,
      location: input.location?.trim() || null,
      imageUrls: input.imageUrls,
      tags: input.tags ?? [],
      badge: input.badge?.trim() || null,
      inStock: input.inStock ?? true,
      isPublished: input.isPublished ?? false,
      handcrafted: input.handcrafted ?? true,
    },
    select: productSelect,
  })

  return mapDbProductToAdmin(product)
}

export async function updateAdminProduct(id: string, input: UpdateProductInput) {
  const prisma = getPrisma()
  if (!prisma) throw new Error("Database unavailable")
  const existing = await prisma.product.findUnique({ where: { id }, select: { id: true, slug: true } })
  if (!existing) throw new Error("Product not found")

  let slug = existing.slug
  if (input.slug !== undefined || input.name !== undefined) {
    const baseSlug = slugify(input.slug?.trim() || input.name?.trim() || existing.slug)
    if (!baseSlug) throw new Error("Product name must contain valid characters for a URL slug")
    slug = await ensureUniqueSlug(baseSlug, id)
  }

  if (input.imageUrls !== undefined && input.imageUrls.length === 0) {
    throw new Error("At least one product image is required")
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: input.name.trim() } : {}),
      slug,
      ...(input.description !== undefined ? { description: input.description.trim() || null } : {}),
      ...(input.story !== undefined ? { story: input.story.trim() || null } : {}),
      ...(input.storyImageUrl !== undefined
        ? { storyImageUrl: input.storyImageUrl?.trim() || null }
        : {}),
      ...(input.materialsCare !== undefined
        ? { materialsCare: input.materialsCare.trim() || null }
        : {}),
      ...(input.category !== undefined ? { category: input.category } : {}),
      ...(input.subcategory !== undefined ? { subcategory: input.subcategory.trim() || null } : {}),
      ...(input.price !== undefined ? { price: input.price } : {}),
      ...(input.artisanName !== undefined ? { artisanName: input.artisanName.trim() || null } : {}),
      ...(input.location !== undefined ? { location: input.location.trim() || null } : {}),
      ...(input.imageUrls !== undefined ? { imageUrls: input.imageUrls } : {}),
      ...(input.tags !== undefined ? { tags: input.tags } : {}),
      ...(input.badge !== undefined ? { badge: input.badge.trim() || null } : {}),
      ...(input.inStock !== undefined ? { inStock: input.inStock } : {}),
      ...(input.isPublished !== undefined ? { isPublished: input.isPublished } : {}),
      ...(input.handcrafted !== undefined ? { handcrafted: input.handcrafted } : {}),
    },
    select: productSelect,
  })

  return mapDbProductToAdmin(product)
}

export async function deleteAdminProduct(id: string) {
  const prisma = getPrisma()
  if (!prisma) throw new Error("Database unavailable")

  await prisma.product.delete({ where: { id } })
}

export { ADMIN_CATEGORY_COLORS }
