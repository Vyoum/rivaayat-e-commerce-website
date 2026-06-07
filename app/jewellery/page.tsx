import { CategoryListingPage } from "@/components/catalog/category-listing-page"
import { buildCategoryConfig } from "@/lib/product-catalog"
import { getPublishedProductsByCategoryRoute } from "@/lib/product-server"

export default async function JewelleryPage() {
  const data = await getPublishedProductsByCategoryRoute("jewellery")
  if (!data) return null

  const category = buildCategoryConfig("jewellery", data.products)
  if (!category) return null

  return <CategoryListingPage category={category} />
}
