import { Suspense } from "react"

import { CategoryListingPage } from "@/components/catalog/category-listing-page"
import type { CategoryConfig } from "@/lib/category-catalog"

type CategoryListingRouteProps = {
  category: CategoryConfig
  productFilter?: "subcategory" | "category" | "category-and-subcategory"
  initialCategory?: string
  initialSubcategory?: string
  initialQuery?: string
}

export function CategoryListingRoute(props: CategoryListingRouteProps) {
  return (
    <Suspense fallback={null}>
      <CategoryListingPage {...props} />
    </Suspense>
  )
}
