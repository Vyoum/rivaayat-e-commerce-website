import { CategoryListingPage } from "@/components/catalog/category-listing-page"
import { getCategoryConfig } from "@/lib/category-catalog"

export default function ClothingPage() {
  const category = getCategoryConfig("clothing")
  if (!category) return null
  return <CategoryListingPage category={category} />
}
