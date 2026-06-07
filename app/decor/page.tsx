import { CategoryListingPage } from "@/components/catalog/category-listing-page"
import { buildCategoryConfig } from "@/lib/product-catalog"
import { getPublishedProductsByCategoryRoute } from "@/lib/product-server"

export default async function DecorPage() {
  const data = await getPublishedProductsByCategoryRoute("decor")
  if (!data) return null

  const category = buildCategoryConfig("decor", data.products)
  if (!category) return null

  return <CategoryListingPage category={category} />
}
