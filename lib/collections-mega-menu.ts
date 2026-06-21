import { categoryCatalog } from "@/lib/category-catalog"
import { DEFAULT_CATEGORY_CARDS } from "@/lib/category-cards-shared"

export type CollectionsMegaMenuLink = {
  label: string
  href: string
  children?: CollectionsMegaMenuLink[]
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
    const baseLinks =
      config?.subcategories.map((subcategory) => ({
        label: subcategory.label,
        href: `${card.href}?subcategory=${subcategory.id}`,
      })) ?? []

    const links =
      card.id === "clothing"
        ? [
            {
              label: "The Loom Series",
              href: card.href,
            },
            {
              label: "Handloom Textiles",
              href: card.href,
              children: [
                { label: "Men", href: `${card.href}?subcategory=mens` },
                { label: "Women", href: `${card.href}?subcategory=womens` },
              ],
            },
            ...baseLinks.filter((entry) => entry.label !== "Men's Clothing" && entry.label !== "Women's Clothing"),
          ]
        : baseLinks

    return {
      title: card.title,
      href: card.href,
      links: [
        ...links,
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
