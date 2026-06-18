import { notFound } from "next/navigation"

import { CategoryListingRoute } from "@/components/catalog/category-listing-route"
import { buildCategoryConfigFromMeta } from "@/lib/product-catalog"
import { getPublishedProductsByCategoryRoute } from "@/lib/product-server"

export const dynamic = "force-dynamic"

type CategoryPageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ subcategory?: string; q?: string }>
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const queryParams = await searchParams
  const data = await getPublishedProductsByCategoryRoute(slug)

  if (!data) {
    notFound()
  }

  const category = buildCategoryConfigFromMeta(data.meta, data.products)

  return (
    <CategoryListingRoute
      category={category}
      initialSubcategory={queryParams.subcategory ?? ""}
      initialQuery={queryParams.q ?? ""}
    />
  )
}
