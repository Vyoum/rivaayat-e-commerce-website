import { categoryCatalog } from "@/lib/category-catalog"
import { DEFAULT_CATEGORY_CARDS } from "@/lib/category-cards-shared"

export type CollectionsMegaMenuLink = {
  label: string
  href: string
}

export type CollectionsMegaMenuColumn = {
  title: string
  href?: string
  links: CollectionsMegaMenuLink[]
}

export const COLLECTIONS_NAV_HREF = "/collections"

export const COLLECTIONS_MEGA_MENU_COLUMNS: CollectionsMegaMenuColumn[] = [
  ...DEFAULT_CATEGORY_CARDS.map((card) => {
    const config = categoryCatalog[card.id]

    return {
      title: card.title,
      href: card.href,
      links: [
        ...(config?.subcategories.map((subcategory) => ({
          label: subcategory.label,
          href: `${card.href}?subcategory=${subcategory.id}`,
        })) ?? []),
        { label: `Shop All ${card.title}`, href: card.href },
      ],
    }
  }),
  {
    title: "Discover",
    links: [
      { label: "All Collections", href: "/collections" },
      { label: "New Arrivals", href: "/collections" },
      { label: "Custom Orders", href: "/custom-orders" },
    ],
  },
]
