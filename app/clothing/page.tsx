import { CategoryListingPage } from "@/components/catalog/category-listing-page"
import { buildCategoryConfig } from "@/lib/product-catalog"
import { getPublishedProductsByCategoryRoute } from "@/lib/product-server"

export const dynamic = "force-dynamic"

export default async function ClothingPage() {
  const data = await getPublishedProductsByCategoryRoute("clothing")
  if (!data) return null

  const category = buildCategoryConfig("clothing", data.products)
  if (!category) return null

  return <CategoryListingPage category={category} />
}
