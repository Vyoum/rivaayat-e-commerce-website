import { notFound } from "next/navigation"
import { CategoryListingPage } from "@/components/catalog/category-listing-page"
import { getCategoryConfig } from "@/lib/category-catalog"

type CategoryPageProps = {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = getCategoryConfig(slug)

  if (!category) {
    notFound()
  }

  return <CategoryListingPage category={category} />
}
