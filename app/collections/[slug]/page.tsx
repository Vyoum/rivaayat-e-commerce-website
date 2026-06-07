import { notFound } from "next/navigation"

import { CategoryListingPage } from "@/components/catalog/category-listing-page"
import { buildCategoryConfig } from "@/lib/product-catalog"
import { getPublishedProductsByCategoryRoute } from "@/lib/product-server"

type CategoryPageProps = {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const data = await getPublishedProductsByCategoryRoute(slug)

  if (!data) {
    notFound()
  }

  const category = buildCategoryConfig(slug, data.products)
  if (!category) {
    notFound()
  }

  return <CategoryListingPage category={category} />
}
