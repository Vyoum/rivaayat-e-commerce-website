"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  ChevronDown,
  ChevronRight,
  Minus,
  Plus,
  Sparkles,
  Star,
  Truck,
} from "lucide-react"
import { toast } from "sonner"

import { useCart } from "@/components/providers/cart-provider"
import { useWishlist } from "@/components/providers/wishlist-provider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { storeProductDetailToCatalog } from "@/lib/product-catalog"
import { cn } from "@/lib/utils"
import type { StoreProductDetail } from "@/types/product"

const defaultShipping =
  "Ships within 3–5 business days across India. Free shipping on orders above ₹999. Returns accepted within 7 days of delivery for unused items in original packaging. Each piece is handcrafted — minor variations in colour and pattern are a mark of authenticity, not a defect."

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.min(Math.max(rating - i, 0), 1)
        return (
          <div key={i} className="relative size-[14px]">
            <Star className="absolute inset-0 size-[14px] fill-[#E8E0D4] text-[#E8E0D4]" />
            {fill > 0 && (
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className="size-[14px] fill-[#C4A035] text-[#C4A035]" />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

type ProductDetailContentProps = {
  product: StoreProductDetail
}

export function ProductDetailContent({ product }: ProductDetailContentProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const { isLoggedIn, isWishlisted, toggleItem } = useWishlist()
  const catalogProduct = storeProductDetailToCatalog(product)

  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isGift, setIsGift] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  const productImages =
    product.imageUrls.length > 0
      ? product.imageUrls.map((src, index) => ({
          src,
          alt: `${product.name} image ${index + 1}`,
        }))
      : [{ src: "/placeholder.svg", alt: product.name }]

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: product.categoryLabel, href: `/${product.categoryRoute}` },
    ...(product.subcategoryLabel
      ? [{ label: product.subcategoryLabel, href: `/${product.categoryRoute}` }]
      : []),
    { label: product.name, href: null },
  ]

  const accordionItems = [
    ...(product.materialsCare
      ? [
          {
            id: "materials",
            title: "Materials & Care",
            icon: Sparkles,
            content: product.materialsCare,
          },
        ]
      : []),
    {
      id: "shipping",
      title: "Shipping & Returns",
      icon: Truck,
      content: defaultShipping,
    },
  ]

  const storyImageSrc = productImages[1]?.src ?? productImages[0].src
  const storyParagraphs = product.story
    ? product.story.split(/\n+/).map((line) => line.trim()).filter(Boolean)
    : []

  const wishlisted = isWishlisted(product.id)

  function handleAddToCart() {
    if (!product.inStock) {
      toast.error("This product is currently out of stock")
      return
    }

    for (let i = 0; i < quantity; i += 1) {
      addItem(catalogProduct)
    }
    toast.success(`${product.name} added to cart`)
  }

  function handleToggleWishlist() {
    if (!isLoggedIn) {
      router.push(`/login?next=/products/${product.slug}`)
      toast.info("Sign in to save items to your wishlist")
      return
    }

    const added = toggleItem(catalogProduct)
    toast.success(
      added ? `${product.name} added to wishlist` : `${product.name} removed from wishlist`,
    )
  }

  return (
    <>
      <nav aria-label="Breadcrumb" className="mx-auto max-w-6xl px-6 pt-8 pb-6 lg:px-10">
        <ol className="flex flex-wrap items-center gap-1.5 font-sans text-[12px] text-[#9A8070]">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.label} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="size-3 text-[#C4B5A5]" />}
              {crumb.href ? (
                <Link href={crumb.href} className="transition-colors hover:text-[#6B5344]">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[#6B5344]">{crumb.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <section className="mx-auto max-w-6xl px-6 pb-20 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-14 xl:gap-20">
          <div className="mx-auto w-full max-w-[340px] lg:mx-0">
            <div className="relative aspect-square overflow-hidden rounded-[28px] bg-[#EDE8DC] shadow-[0_10px_40px_rgba(61,46,36,0.1)] [&_img]:rounded-[28px]">
              <Image
                src={productImages[activeImage].src}
                alt={productImages[activeImage].alt}
                fill
                className="rounded-[28px] object-cover"
                priority
                sizes="340px"
              />
              {product.handcrafted && (
                <span className="absolute top-4 left-4 rounded-full bg-[#8FA68E]/90 px-3 py-1 font-sans text-[10px] font-semibold tracking-[0.12em] text-white uppercase">
                  Handcrafted
                </span>
              )}
            </div>

            {productImages.length > 1 && (
              <div className="mt-4 flex justify-center gap-2.5 lg:justify-start">
                {productImages.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={cn(
                      "relative aspect-square w-[64px] overflow-hidden rounded-[18px] bg-[#EDE8DC] transition-all [&_img]:rounded-[18px]",
                      activeImage === index
                        ? "ring-2 ring-[#3D2E24] ring-offset-2 ring-offset-[#F5F3E9]"
                        : "opacity-70 hover:opacity-100",
                    )}
                    aria-label={`View image ${index + 1}`}
                    aria-pressed={activeImage === index}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="rounded-[18px] object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col lg:pt-2">
            {product.subcategoryLabel && (
              <p className="font-sans text-[11px] font-medium tracking-[0.22em] text-[#9A8070] uppercase">
                {product.subcategoryLabel}
              </p>
            )}

            <h1 className="mt-3 font-serif text-[34px] leading-[1.15] font-normal text-[#3D2E24] md:text-[40px]">
              {product.name}
            </h1>

            <div className="mt-4 flex items-center gap-2.5">
              <StarRating rating={4.8} />
              <span className="font-sans text-[13px] text-[#9A8070]">4.8 (24 Reviews)</span>
            </div>

            <p className="mt-5 font-serif text-[30px] font-normal text-[#3D2E24]">
              ₹{product.price.toLocaleString("en-IN")}
            </p>

            {(product.artisanName || product.location) && (
              <div className="mt-7 rounded-2xl bg-[#EDE8DC]/60 px-5 py-4">
                <div className="flex items-center gap-4">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-[#EDE8DC] ring-2 ring-white/80">
                    {productImages[0] && (
                      <Image
                        src={productImages[0].src}
                        alt={product.artisanName}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-[14px] font-semibold text-[#3D2E24]">
                      By {product.artisanName}
                      {product.location ? ` from ${product.location}` : ""}
                    </p>
                    {product.description && (
                      <p className="font-sans text-[13px] text-[#9A8070] italic">
                        {product.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <div className="flex items-center rounded-sm border border-[#D9CFC0] bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex size-10 items-center justify-center text-[#6B5344] transition-colors hover:bg-[#EDE8DC]"
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-4" />
                </button>
                <span className="flex w-10 items-center justify-center font-sans text-[14px] text-[#3D2E24]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex size-10 items-center justify-center text-[#6B5344] transition-colors hover:bg-[#EDE8DC]"
                  aria-label="Increase quantity"
                >
                  <Plus className="size-4" />
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                <Checkbox
                  id="gift"
                  checked={isGift}
                  onCheckedChange={(checked) => setIsGift(checked === true)}
                  className="border-[#D9CFC0] data-[state=checked]:border-[#846246] data-[state=checked]:bg-[#846246]"
                />
                <Label htmlFor="gift" className="cursor-pointer font-sans text-[13px] text-[#6B5344]">
                  Gift this piece?
                </Label>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="mt-8 w-full rounded-xl bg-[#5C4332] py-4 font-sans text-[12px] font-semibold tracking-[0.2em] text-white uppercase transition-colors hover:bg-[#4A3528] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </button>
            <button
              type="button"
              onClick={handleToggleWishlist}
              className={cn(
                "mt-4 w-full py-2 font-sans text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors",
                wishlisted ? "text-[#5C4332]" : "text-[#846246] hover:text-[#5C4332]",
              )}
            >
              {wishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
            </button>

            <div className="mt-10 border-t border-[#E8E0D4]">
              {accordionItems.map((item) => {
                const Icon = item.icon
                const isOpen = openAccordion === item.id

                return (
                  <div key={item.id} className="border-b border-[#E8E0D4]">
                    <button
                      type="button"
                      onClick={() => setOpenAccordion(isOpen ? null : item.id)}
                      className="flex w-full items-center justify-between py-5 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="size-[15px] text-[#9A8070]" strokeWidth={1.5} />
                        <span className="font-sans text-[13px] font-medium text-[#3D2E24]">
                          {item.title}
                        </span>
                      </span>
                      <ChevronDown
                        className={cn(
                          "size-4 text-[#9A8070] transition-transform duration-200",
                          isOpen && "rotate-180",
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        "grid transition-all duration-200",
                        isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]",
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="pr-8 pl-[27px] font-sans text-[13px] leading-relaxed text-[#9A8070]">
                          {item.content}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {product.story && storyParagraphs.length > 0 && (
        <section className="bg-[#EDE8DC]/45">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10 lg:py-24">
            <div>
              <p className="font-sans text-[11px] font-medium tracking-[0.22em] text-[#9A8070] uppercase">
                The Story of This Piece
              </p>
              <div className="mt-6 space-y-5 font-serif text-[17px] leading-[1.75] text-[#3D2E24] md:text-[18px]">
                {storyParagraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="relative mx-auto aspect-[4/3] w-full max-w-[420px] overflow-hidden rounded-[28px] bg-[#EDE8DC] shadow-[0_10px_40px_rgba(61,46,36,0.1)] lg:mx-0 lg:max-w-none [&_img]:rounded-[28px]">
              <Image
                src={storyImageSrc}
                alt={`${product.name} — craftsmanship detail`}
                fill
                className="rounded-[28px] object-cover"
                sizes="(max-width: 1024px) 420px, 50vw"
              />
            </div>
          </div>
        </section>
      )}
    </>
  )
}
