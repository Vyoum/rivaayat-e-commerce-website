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
    toast.success(`${product.name} added to cart`)
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
    <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8E0D4]/70 bg-[#FDF9F3] shadow-[0_4px_20px_rgba(61,46,36,0.06)]">
      <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-[#EDE8DC]">
        <Link href={`/products/${product.slug}`} className="group block h-full w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, 340px"
          />
        </Link>

        {badgeLabel && (
          <span
            className={cn(
              "pointer-events-none absolute top-3 left-3 rounded-full px-3 py-1 font-sans text-[10px] font-semibold tracking-[0.12em] text-white uppercase",
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
            "absolute top-3 right-3 flex size-10 items-center justify-center rounded-full bg-white/90 text-[#846246] shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-[#5C4332]",
            wishlisted && "text-[#B85A32]",
          )}
        >
          <Heart className={cn("size-5 stroke-[1.75]", wishlisted && "fill-current")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <div className="mb-6 flex w-full items-end">
          <span
            aria-hidden
            className="mb-[5px] h-0 min-w-0 flex-1 border-t border-solid border-black"
          />
          <span className="shrink-0 pl-2 font-serif text-[15px] font-light leading-none tracking-[0.03em] text-black">
            {formatCardPrice(product.price)}
          </span>
        </div>

        <Link href={`/products/${product.slug}`} className="block px-2 text-center">
          <h3 className="font-serif text-[16px] font-normal uppercase leading-[1.45] tracking-[0.14em] text-black sm:text-[18px]">
            {product.name}
          </h3>
        </Link>

        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-4 w-full text-center font-serif text-[19px] font-bold uppercase leading-none tracking-[0.12em] text-black transition-opacity hover:opacity-70 sm:text-[21px]"
        >
          Add to Cart
        </button>

        <div aria-hidden className="mt-4 border-t border-dashed border-black/45" />

        <div className="mt-4 pr-12 font-serif text-black">
          <p className="text-[11px] font-light leading-none">Artisan</p>
          <p className="mt-2 text-[16px] font-normal leading-none">{product.artisan}</p>
          {associationLines.map((line) => (
            <p key={line} className="mt-2 text-[12px] font-light leading-[1.35]">
              {line}
            </p>
          ))}
        </div>
      </div>

      <ProductBarcodeButton
        productId={product.id}
        href={getArtisanProfileHref(product.artisan)}
        artisanName={product.artisan}
        className="absolute bottom-4 right-5"
      />
    </article>
  )
}
