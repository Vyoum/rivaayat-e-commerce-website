import type { Metadata } from "next"
import { HOUSE_OF_INDIKA } from "@/lib/brand"

export const metadata: Metadata = {
  title: `Admin Console — ${HOUSE_OF_INDIKA}`,
  description: `${HOUSE_OF_INDIKA} admin dashboard`,
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#FDF8F1] [font-family:var(--font-sans)]">
      {children}
    </div>
  )
}
