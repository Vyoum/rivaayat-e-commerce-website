import { CategoryListingPage } from "@/components/catalog/category-listing-page"
import { getCategoryConfig } from "@/lib/category-catalog"

export default function JewelleryPage() {
  const category = getCategoryConfig("jewellery")
  if (!category) return null
  return <CategoryListingPage category={category} />
}
