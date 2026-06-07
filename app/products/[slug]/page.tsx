import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ProductDetailHeader } from "@/components/product/product-detail-header"
import { ProductDetailContent } from "@/components/product/product-detail-content"
import { HOUSE_OF_INDIKA } from "@/lib/brand"
import { getPublishedProductBySlug } from "@/lib/product-server"

type ProductPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getPublishedProductBySlug(slug)

  if (!product) {
    return { title: `Product — ${HOUSE_OF_INDIKA}` }
  }

  return {
    title: `${product.name} — ${HOUSE_OF_INDIKA}`,
    description: product.description ?? `${product.name} handcrafted by ${product.artisanName}.`,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getPublishedProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#F5F3E9]">
      <ProductDetailHeader />
      <ProductDetailContent product={product} />
    </main>
  )
}
