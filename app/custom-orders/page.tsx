import type { Metadata } from "next"

import { CustomOrdersHeader } from "@/components/custom-orders/custom-orders-header"
import { CustomOrdersPage } from "@/components/custom-orders/custom-orders-page"
import { HOUSE_OF_INDIKA } from "@/lib/brand"

export const metadata: Metadata = {
  title: `Custom Orders — ${HOUSE_OF_INDIKA}`,
  description:
    "Create something uniquely yours. Work directly with our artisans to customise products according to your preferences.",
}

export default function CustomOrdersRoute() {
  return (
    <main className="min-h-screen bg-[#FCFAF5]">
      <CustomOrdersHeader />
      <CustomOrdersPage />
    </main>
  )
}
