import { CategoryListingPage } from "@/components/catalog/category-listing-page"
import { getCategoryConfig } from "@/lib/category-catalog"

export default function CustomLaddoosPage() {
  const category = getCategoryConfig("custom-laddoos")
  if (!category) return null
  return <CategoryListingPage category={category} />
}
