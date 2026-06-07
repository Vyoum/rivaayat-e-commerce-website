import { notFound } from "next/navigation"

import { ProductFormPage } from "@/components/admin/product-form-page"
import { getAdminProductById } from "@/lib/product-admin-server"

type EditProductPageProps = {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  const product = await getAdminProductById(id)

  if (!product) {
    notFound()
  }

  return <ProductFormPage product={product} />
}
