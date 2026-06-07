import { CategoryListingPage } from "@/components/catalog/category-listing-page"
import { buildCategoryConfig } from "@/lib/product-catalog"
import { getPublishedProductsByCategoryRoute } from "@/lib/product-server"

export default async function CustomLaddoosPage() {
  const data = await getPublishedProductsByCategoryRoute("custom-laddoos")
  if (!data) return null

  const category = buildCategoryConfig("custom-laddoos", data.products)
  if (!category) return null

  return <CategoryListingPage category={category} />
}
