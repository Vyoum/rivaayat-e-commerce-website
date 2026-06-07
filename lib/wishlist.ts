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
  }
}
