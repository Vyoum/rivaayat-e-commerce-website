"use client"

import Image from "next/image"
import Link from "next/link"

import type { CatalogProduct } from "@/lib/category-catalog"

function formatCardPrice(price: number) {
  return price.toLocaleString("en-IN")
}

function getAssociationLines(product: CatalogProduct) {
  if (product.association) {
    return product.association
  }

  return [`associated with ${product.location}`, "and artisan textures"]
}

type CatalogProductCardProps = {
  product: CatalogProduct
  onAddToCart?: (product: CatalogProduct) => void
}

export function CatalogProductCard({ product, onAddToCart }: CatalogProductCardProps) {
  const associationLines = getAssociationLines(product)

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8E0D4]/70 bg-[#FDF9F3] shadow-[0_4px_20px_rgba(61,46,36,0.06)]">
      <Link
        href={`/products/${product.slug}`}
        className="group relative block aspect-square overflow-hidden rounded-t-2xl bg-[#EDE8DC]"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 100vw, 340px"
        />
      </Link>

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
          <h3 className="font-serif text-[13px] font-normal uppercase leading-[1.45] tracking-[0.14em] text-black sm:text-[14px]">
            {product.name}
          </h3>
        </Link>

        <button
          type="button"
          onClick={() => onAddToCart?.(product)}
          className="mt-4 w-full text-center font-serif text-[26px] font-bold uppercase leading-none tracking-[0.12em] text-black transition-opacity hover:opacity-70 sm:text-[28px]"
        >
          Add to Cart
        </button>

        <div aria-hidden className="mt-4 border-t border-dashed border-black/45" />

        <div className="mt-4 font-serif text-black">
          <p className="text-[11px] font-light leading-none">Artisan</p>
          <p className="mt-2 text-[16px] font-normal leading-none">{product.artisan}</p>
          {associationLines.map((line) => (
            <p key={line} className="mt-2 text-[12px] font-light leading-[1.35]">
              {line}
            </p>
          ))}
        </div>
      </div>
    </article>
  )
}
