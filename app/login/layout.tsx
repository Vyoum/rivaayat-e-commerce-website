import type { Metadata } from "next"

import { HOUSE_OF_INDIKA } from "@/lib/brand"

export const metadata: Metadata = {
  title: `Sign In — ${HOUSE_OF_INDIKA}`,
  description: `Sign in to ${HOUSE_OF_INDIKA} to access your wishlist, orders, and artisan collections.`,
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
