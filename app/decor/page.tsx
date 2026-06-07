import { CategoryListingPage } from "@/components/catalog/category-listing-page"
import { getCategoryConfig } from "@/lib/category-catalog"

export default function DecorPage() {
  const category = getCategoryConfig("decor")
  if (!category) return null
  return <CategoryListingPage category={category} />
}
