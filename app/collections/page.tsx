import type { Metadata } from "next"

import { CategoryListingPage } from "@/components/catalog/category-listing-page"
import { buildCategoryConfigFromMeta } from "@/lib/product-catalog"
import { getAllPublishedProducts } from "@/lib/product-server"
import { HOUSE_OF_INDIKA } from "@/lib/brand"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: `Collections | ${HOUSE_OF_INDIKA}`,
  description:
    "Browse every handcrafted piece across clothing, jewellery, décor, and custom food from artisans across India.",
}

const collectionsMeta = {
  slug: "collections",
  breadcrumb: "Collections",
  title: "All Collections",
  subtitle:
    "Every handcrafted piece in one place — clothing, jewellery, décor, and custom food from artisans across India.",
  subcategories: [],
}

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; subcategory?: string }>
}) {
  const params = await searchParams
  const products = await getAllPublishedProducts()
  const category = buildCategoryConfigFromMeta(collectionsMeta, products)

  return (
    <CategoryListingPage
      category={category}
      productFilter="category-and-subcategory"
      initialCategory={params.category ?? ""}
      initialSubcategory={params.subcategory ?? ""}
    />
  )
}
