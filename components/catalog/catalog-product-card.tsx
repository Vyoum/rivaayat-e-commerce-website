"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"
import { toast } from "sonner"

import { ProductBarcodeButton } from "@/components/catalog/product-barcode-button"
import { useCart } from "@/components/providers/cart-provider"
import { useWishlist } from "@/components/providers/wishlist-provider"
import { getArtisanProfileHref } from "@/lib/artisan-routes"
import type { CatalogProduct } from "@/lib/category-catalog"
import { cn } from "@/lib/utils"

function formatCardPrice(price: number) {
  return price.toLocaleString("en-IN")
}

function getAssociationLines(product: CatalogProduct) {
  if (product.association) {
    return product.association
  }

  return [`associated with ${product.location}`, "and artisan textures"]
}

function getProductBadgeLabel(badge: CatalogProduct["badge"]) {
  if (badge === "HANDCRAFTED") return "Handcrafted"
  if (badge === "CUSTOMISABLE") return "Customisable"
  return null
}

type CatalogProductCardProps = {
  product: CatalogProduct
}

export function CatalogProductCard({ product }: CatalogProductCardProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const { isLoggedIn, isWishlisted, toggleItem } = useWishlist()
  const associationLines = getAssociationLines(product)
  const badgeLabel = getProductBadgeLabel(product.badge)
  const wishlisted = isWishlisted(product.id)

  function handleAddToCart() {
    addItem(product)
  }

  function handleToggleWishlist() {
    if (!isLoggedIn) {
      const next = encodeURIComponent(window.location.pathname + window.location.search)
      router.push(`/login?next=${next}`)
      toast.info("Sign in to save items to your wishlist")
      return
    }

    const added = toggleItem(product)
    toast.success(
      added ? `${product.name} added to wishlist` : `${product.name} removed from wishlist`,
    )
  }

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-xl border border-[#E8E0D4]/70 bg-[#FDF9F3] shadow-[0_4px_20px_rgba(61,46,36,0.06)] sm:rounded-2xl">
      <div className="relative aspect-square overflow-hidden rounded-t-xl bg-[#EDE8DC] sm:rounded-t-2xl">
        <Link href={`/products/${product.slug}`} className="group block h-full w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 50vw, 340px"
          />
        </Link>

        {badgeLabel && (
          <span
            className={cn(
              "pointer-events-none absolute top-2 left-2 rounded-full px-2 py-0.5 font-sans text-[8px] font-semibold tracking-[0.1em] text-white uppercase sm:top-3 sm:left-3 sm:px-3 sm:py-1 sm:text-[10px] sm:tracking-[0.12em]",
              product.badge === "HANDCRAFTED" ? "bg-[#8FA68E]/90" : "bg-[#846246]/90",
            )}
          >
            {badgeLabel}
          </span>
        )}

        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          className={cn(
            "absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-white/90 text-[#846246] shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-[#5C4332] sm:top-3 sm:right-3 sm:size-10",
            wishlisted && "text-[#B85A32]",
          )}
        >
          <Heart className={cn("size-4 stroke-[1.75] sm:size-5", wishlisted && "fill-current")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col px-2.5 pb-3 pt-2.5 sm:px-5 sm:pb-5 sm:pt-4">
        <div className="mb-3 flex w-full items-end sm:mb-6">
          <span
            aria-hidden
            className="mb-[5px] h-0 min-w-0 flex-1 border-t border-solid border-black"
          />
          <span className="shrink-0 pl-1.5 font-serif text-[12px] font-light leading-none tracking-[0.03em] text-black sm:pl-2 sm:text-[15px]">
            {formatCardPrice(product.price)}
          </span>
        </div>

        <Link href={`/products/${product.slug}`} className="block px-1 text-center sm:px-2">
          <h3 className="font-serif text-[14px] font-normal uppercase leading-[1.35] tracking-[0.11em] text-black sm:text-[19px] sm:leading-[1.45] sm:tracking-[0.14em]">
            {product.name}
          </h3>
        </Link>

        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-2.5 w-full text-center font-serif text-[12px] font-bold uppercase leading-none tracking-[0.08em] text-black transition-opacity hover:opacity-70 sm:mt-4 sm:text-[21px] sm:tracking-[0.12em]"
        >
          Add to Cart
        </button>

        <div aria-hidden className="mt-2.5 border-t border-dashed border-black/45 sm:mt-4" />

        <div className="mt-2.5 pr-8 font-serif text-black sm:mt-4 sm:pr-12">
          <p className="text-[9px] font-light leading-none sm:text-[11px]">Artisan</p>
          <p className="mt-1 text-[12px] font-normal leading-none sm:mt-2 sm:text-[16px]">
            {product.artisan}
          </p>
          {associationLines.map((line) => (
            <p
              key={line}
              className="mt-1 hidden text-[12px] font-light leading-[1.35] sm:mt-2 sm:block"
            >
              {line}
            </p>
          ))}
        </div>
      </div>

      <ProductBarcodeButton
        productId={product.id}
        href={getArtisanProfileHref(product.artisan)}
        artisanName={product.artisan}
        className="absolute right-2.5 bottom-2.5 sm:right-5 sm:bottom-4"
      />
    </article>
  )
}
