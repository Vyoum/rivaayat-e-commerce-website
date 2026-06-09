import type { CatalogProduct } from "@/lib/category-catalog"

export type WishlistItem = {
  id: string
  name: string
  slug: string
  price: number
  image: string
  artisan: string
  location: string
  addedAt: string
  categoryRoute?: string
  categoryLabel?: string
  subcategory?: string
  subcategoryLabel?: string
  inStock?: boolean
}

export function catalogProductToWishlistItem(product: CatalogProduct): WishlistItem {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    image: product.image,
    artisan: product.artisan,
    location: product.location,
    addedAt: new Date().toISOString(),
    categoryRoute: product.categoryRoute,
    categoryLabel: product.categoryLabel,
    subcategory: product.subcategory,
    subcategoryLabel: product.subcategoryLabel,
    inStock: product.inStock ?? true,
  }
}

export function wishlistItemToCatalogProduct(item: WishlistItem): CatalogProduct {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    price: item.price,
    artisan: item.artisan,
    location: item.location,
    image: item.image,
  }
}
