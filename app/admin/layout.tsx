import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Console — House of Indika",
  description: "House of Indika admin dashboard",
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
