"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronDown,
  ChevronRight,
  Minus,
  Plus,
  BookOpen,
  Leaf,
  Truck,
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const productImages = [
  {
    src: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900&h=1100&fit=crop&q=80",
    alt: "Mandala Crochet Earrings – front view",
  },
  {
    src: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900&h=1100&fit=crop&q=80",
    alt: "Mandala Crochet Earrings – detail view",
  },
  {
    src: "/close-up-of-hands-stringing-colorful-beads-for-tra.jpg",
    alt: "Mandala Crochet Earrings – craftsmanship detail",
  },
]

const colorSwatches = [
  { id: "terracotta", name: "Earthy Terracotta", color: "#8B5E3C" },
  { id: "cream", name: "Warm Cream", color: "#E8DFC8" },
  { id: "sage", name: "Sage Green", color: "#8FA68E" },
]

const accordionItems = [
  {
    id: "story",
    title: "The Story of This Piece",
    icon: BookOpen,
    content:
      "Each pair of Mandala Crochet Earrings begins as a single thread in Asha's workshop in Rajasthan. Inspired by desert mandalas and sun-bleached earth tones, she spends nearly four hours on every pair — looping, knotting, and shaping by hand. No two pieces are ever identical; each carries the quiet rhythm of her craft and the warmth of generations of thread work passed down through her family.",
  },
  {
    id: "materials",
    title: "Materials & Care",
    icon: Leaf,
    content:
      "Crafted from premium cotton thread, hypoallergenic gold-plated hooks, and natural plant-based dyes. Store in a dry place away from direct sunlight. Gently spot-clean with a damp cloth; avoid submerging in water. With proper care, these earrings will retain their shape and colour for years.",
  },
  {
    id: "shipping",
    title: "Shipping & Returns",
    icon: Truck,
    content:
      "Ships within 3–5 business days across India. Free shipping on orders above ₹999. Returns accepted within 7 days of delivery for unused items in original packaging. Each piece is handcrafted — minor variations in colour and pattern are a mark of authenticity, not a defect.",
  },
]

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Jewellery", href: "/jewellery" },
  { label: "Crochet Jewellery", href: "/jewellery" },
  { label: "Mandala Crochet Earrings", href: null },
]

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

export function ProductDetailContent() {
  const [activeImage, setActiveImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(colorSwatches[0].id)
  const [quantity, setQuantity] = useState(1)
  const [isGift, setIsGift] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  const selectedColorName = colorSwatches.find((c) => c.id === selectedColor)?.name ?? ""

  const toggleAccordion = (id: string) => {
    setOpenAccordion((prev) => (prev === id ? null : id))
  }

  return (
    <>
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-6 pt-8 pb-6 lg:px-10">
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

      {/* Main Product Section */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-[4/5] overflow-hidden bg-[#EDE8DC]">
              <Image
                src={productImages[activeImage].src}
                alt={productImages[activeImage].alt}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <span className="absolute top-4 left-4 rounded-sm bg-[#8FA68E]/85 px-3 py-1.5 font-sans text-[10px] font-semibold tracking-[0.14em] text-white uppercase backdrop-blur-sm">
                Handcrafted
              </span>
            </div>

            <div className="mt-4 flex gap-3">
              {productImages.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={cn(
                    "relative aspect-square w-[72px] overflow-hidden bg-[#EDE8DC] transition-all sm:w-[80px]",
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
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col pt-2 lg:pt-4">
            <p className="font-sans text-[11px] font-medium tracking-[0.2em] text-[#9A8070] uppercase">
              Crochet Jewellery
            </p>

            <h1 className="mt-3 font-serif text-[36px] leading-tight font-normal text-[#3D2E24] md:text-[42px]">
              Mandala Crochet Earrings
            </h1>

            <div className="mt-4 flex items-center gap-2.5">
              <StarRating rating={4.8} />
              <span className="font-sans text-[13px] text-[#9A8070]">4.8 (24 Reviews)</span>
            </div>

            <p className="mt-5 font-serif text-[28px] text-[#3D2E24]">₹650</p>

            {/* Artisan Card */}
            <div className="mt-7 flex items-center gap-4 rounded-lg bg-[#EDE8DC]/70 px-5 py-4">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-full">
                <Image
                  src="/elderly-indian-woman-in-traditional-orange-sari-sm.jpg"
                  alt="Asha, artisan from Rajasthan"
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-sans text-[14px] font-semibold text-[#3D2E24]">
                  By Asha from Rajasthan
                </p>
                <p className="font-sans text-[13px] text-[#9A8070] italic">
                  Master of Crochet &amp; Thread Craft
                </p>
              </div>
            </div>
            <Link
              href="#"
              className="mt-2 inline-block font-sans text-[10px] font-semibold tracking-[0.16em] text-[#846246] uppercase underline underline-offset-4 transition-colors hover:text-[#5C4332]"
            >
              View Artisan Profile
            </Link>

            {/* Color Selection */}
            <div className="mt-8">
              <p className="font-sans text-[13px] text-[#6B5344]">
                Colour: <span className="font-medium text-[#3D2E24]">{selectedColorName}</span>
              </p>
              <div className="mt-3 flex gap-3">
                {colorSwatches.map((swatch) => (
                  <button
                    key={swatch.id}
                    type="button"
                    onClick={() => setSelectedColor(swatch.id)}
                    aria-label={swatch.name}
                    aria-pressed={selectedColor === swatch.id}
                    className={cn(
                      "size-8 rounded-full transition-all",
                      selectedColor === swatch.id
                        ? "ring-2 ring-[#3D2E24] ring-offset-2 ring-offset-[#F5F3E9]"
                        : "hover:scale-105",
                    )}
                    style={{ backgroundColor: swatch.color }}
                  />
                ))}
              </div>
            </div>

            {/* Quantity & Gift */}
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <div className="flex items-center border border-[#D9CFC0]">
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
                <Label
                  htmlFor="gift"
                  className="cursor-pointer font-sans text-[13px] text-[#6B5344]"
                >
                  Gift this piece?
                </Label>
              </div>
            </div>

            {/* CTA Buttons */}
            <button
              type="button"
              className="mt-8 w-full bg-[#846246] py-4 font-sans text-[12px] font-semibold tracking-[0.18em] text-white uppercase transition-colors hover:bg-[#6B5344]"
            >
              Add to Cart
            </button>
            <button
              type="button"
              className="mt-4 w-full py-2 font-sans text-[11px] font-semibold tracking-[0.18em] text-[#846246] uppercase transition-colors hover:text-[#5C4332]"
            >
              Add to Wishlist
            </button>

            {/* Accordions */}
            <div className="mt-10 border-t border-[#E8E0D4]">
              {accordionItems.map((item) => {
                const Icon = item.icon
                const isOpen = openAccordion === item.id

                return (
                  <div key={item.id} className="border-b border-[#E8E0D4]">
                    <button
                      type="button"
                      onClick={() => toggleAccordion(item.id)}
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

      {/* Storytelling Section */}
      <section className="bg-[#EDE8DC]/50">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10 lg:py-24">
          <blockquote className="font-serif text-[22px] leading-[1.65] font-normal text-[#3D2E24] italic md:text-[26px] lg:text-[28px]">
            &ldquo;In every loop of thread, there is a quiet rhythm, a prayer whispered into
            existence. These earrings are not merely accessories; they are small, woven tapestries
            of heritage, carrying the warmth of the desert sun and the steady grace of artisan
            hands.&rdquo;
          </blockquote>

          <div className="relative aspect-[4/3] overflow-hidden bg-[#EDE8DC]">
            <Image
              src="/close-up-of-hands-stringing-colorful-beads-for-tra.jpg"
              alt="Colorful thread spools on a wooden surface"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>
    </>
  )
}
