import type { Metadata } from "next"

import { ContactPage } from "@/components/contact/contact-page"
import { HOUSE_OF_INDIKA } from "@/lib/brand"

export const metadata: Metadata = {
  title: `Contact — ${HOUSE_OF_INDIKA}`,
  description:
    "Reach our concierge team for orders, custom pieces, and artisan stories. We're here to help.",
}

export default function ContactRoute() {
  return <ContactPage />
}
