import { CategoryListingPage } from "@/components/catalog/category-listing-page"
import { buildCategoryConfigFromMeta } from "@/lib/product-catalog"
import { getPublishedProductsByCategoryRoute } from "@/lib/product-server"

export const dynamic = "force-dynamic"

export default async function DecorPage() {
  const data = await getPublishedProductsByCategoryRoute("decor")
  if (!data) return null

  const category = buildCategoryConfigFromMeta(data.meta, data.products)

  return <CategoryListingPage category={category} />
}
