export type ProductTicketTheme = {
  background: string
  foreground: string
  mutedForeground: string
  border: string
}

const DEFAULT_TICKET_THEME: ProductTicketTheme = {
  background: "#FDF9F3",
  foreground: "#000000",
  mutedForeground: "rgba(0, 0, 0, 0.65)",
  border: "rgba(0, 0, 0, 0.45)",
}

const CATEGORY_TICKET_THEMES: Record<string, ProductTicketTheme> = {
  clothing: {
    background: "#BBAE9A",
    foreground: "#2D1A12",
    mutedForeground: "rgba(45, 26, 18, 0.72)",
    border: "rgba(45, 26, 18, 0.4)",
  },
  jewellery: {
    background: "#D1B198",
    foreground: "#2D1A12",
    mutedForeground: "rgba(45, 26, 18, 0.72)",
    border: "rgba(45, 26, 18, 0.4)",
  },
  "custom-laddoos": {
    background: "#FAF6E8",
    foreground: "#2D1A12",
    mutedForeground: "rgba(45, 26, 18, 0.72)",
    border: "rgba(45, 26, 18, 0.35)",
  },
  decor: {
    background: "#B26F67",
    foreground: "#F1EEE8",
    mutedForeground: "rgba(241, 238, 232, 0.82)",
    border: "rgba(241, 238, 232, 0.5)",
  },
}

export function getProductTicketTheme(categoryRoute?: string): ProductTicketTheme {
  if (!categoryRoute) return DEFAULT_TICKET_THEME
  return CATEGORY_TICKET_THEMES[categoryRoute] ?? DEFAULT_TICKET_THEME
}
