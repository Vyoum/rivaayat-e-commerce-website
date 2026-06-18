import { CategoryListingRoute } from "@/components/catalog/category-listing-route"
import { buildCategoryConfigFromMeta } from "@/lib/product-catalog"
import { getPublishedProductsByCategoryRoute } from "@/lib/product-server"

export const dynamic = "force-dynamic"

export default async function JewelleryPage({
  searchParams,
}: {
  searchParams: Promise<{ subcategory?: string; q?: string }>
}) {
  const params = await searchParams
  const data = await getPublishedProductsByCategoryRoute("jewellery")
  if (!data) return null

  const category = buildCategoryConfigFromMeta(data.meta, data.products)

  return (
    <CategoryListingRoute
      category={category}
      initialSubcategory={params.subcategory ?? ""}
      initialQuery={params.q ?? ""}
    />
  )
}
