import type { Category } from "@prisma/client"

export type AdminProduct = {
  id: string
  name: string
  slug: string
  description: string | null
  story: string | null
  storyImageUrl: string | null
  materialsCare: string | null
  category: Category
  categoryLabel: string
  categoryRoute: string
  subcategory: string | null
  price: number
  artisanName: string | null
  location: string | null
  imageUrls: string[]
  tags: string[]
  badge: string | null
  inStock: boolean
  isPublished: boolean
  handcrafted: boolean
  createdAt: string
  updatedAt: string
}

export type StoreProductDetail = {
  id: string
  name: string
  slug: string
  price: number
  description: string | null
  story: string | null
  storyImageUrl: string | null
  materialsCare: string | null
  category: Category
  categoryRoute: string
  categoryLabel: string
  subcategory: string | null
  subcategoryLabel: string | null
  artisanName: string
  artisanSlug?: string
  location: string
  imageUrls: string[]
  badge: string | null
  handcrafted: boolean
  inStock: boolean
}

export type CreateProductInput = {
  name: string
  slug?: string
  description?: string
  story?: string
  storyImageUrl?: string | null
  materialsCare?: string
  category: Category
  subcategory?: string
  price: number
  artisanName?: string
  location?: string
  imageUrls: string[]
  tags?: string[]
  badge?: string
  inStock?: boolean
  isPublished?: boolean
  handcrafted?: boolean
}

export type UpdateProductInput = Partial<CreateProductInput>

export type AdminProductTab = "All" | Category | "Draft"
