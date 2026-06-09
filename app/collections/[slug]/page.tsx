import { notFound } from "next/navigation"

import { CategoryListingPage } from "@/components/catalog/category-listing-page"
import { buildCategoryConfigFromMeta } from "@/lib/product-catalog"
import { getPublishedProductsByCategoryRoute } from "@/lib/product-server"

export const dynamic = "force-dynamic"

type CategoryPageProps = {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const data = await getPublishedProductsByCategoryRoute(slug)

  if (!data) {
    notFound()
  }

  const category = buildCategoryConfigFromMeta(data.meta, data.products)

  return <CategoryListingPage category={category} />
}
