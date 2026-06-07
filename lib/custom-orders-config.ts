import type { LucideIcon } from "lucide-react"
import { Cookie, Dumbbell, FlaskConical, Shirt } from "lucide-react"

export type CustomOrderCategoryId =
  | "healthy-laddoos"
  | "protein-bars"
  | "artisan-achaar"
  | "custom-clothing"

export type FormFieldGroup = {
  id: string
  label: string
  options: string[]
}

export type CustomOrderCategory = {
  id: CustomOrderCategoryId
  label: string
  icon: LucideIcon
  priceHint?: string
  badge?: string
  comingSoon?: boolean
  formTitle: string
  fields: FormFieldGroup[]
  weightOptions: string[]
}

export const CUSTOM_ORDER_CATEGORIES: CustomOrderCategory[] = [
  {
    id: "healthy-laddoos",
    label: "Healthy Laddoos",
    icon: Cookie,
    priceHint: "Starting at ₹850",
    badge: "5-7 DAYS",
    formTitle: "Customise Your Healthy Laddoos",
    fields: [
      { id: "base", label: "Choose Your Base", options: ["Millets", "Oats", "Mixed Nuts", "Dates"] },
      {
        id: "sweetener",
        label: "Sweetening Agent (Binding)",
        options: ["Jaggery", "Honey", "Dates Paste"],
      },
      {
        id: "flavour",
        label: "Flavour Profile",
        options: ["Cardamom", "Rose", "Saffron", "Plain"],
      },
      { id: "coating", label: "Coating", options: ["Coconut", "Sesame", "Pistachios", "None"] },
    ],
    weightOptions: ["250gm", "500gm", "1kg"],
  },
  {
    id: "protein-bars",
    label: "Protein Bars",
    icon: Dumbbell,
    badge: "5-7 DAYS",
    formTitle: "Customise Your Protein Bars",
    fields: [
      { id: "base", label: "Choose Your Base", options: ["Whey", "Plant Protein", "Mixed Nuts", "Oats"] },
      {
        id: "sweetener",
        label: "Sweetening Agent (Binding)",
        options: ["Jaggery", "Honey", "Dates Paste"],
      },
      {
        id: "flavour",
        label: "Flavour Profile",
        options: ["Chocolate", "Peanut Butter", "Vanilla", "Plain"],
      },
      { id: "coating", label: "Coating", options: ["Dark Chocolate", "Coconut", "Almonds", "None"] },
    ],
    weightOptions: ["250gm", "500gm", "1kg"],
  },
  {
    id: "artisan-achaar",
    label: "Artisan Achaar",
    icon: FlaskConical,
    comingSoon: true,
    badge: "COMING SOON",
    formTitle: "Customise Your Artisan Achaar",
    fields: [],
    weightOptions: [],
  },
  {
    id: "custom-clothing",
    label: "Custom Clothing",
    icon: Shirt,
    priceHint: "Starting at ₹5000",
    comingSoon: true,
    badge: "COMING SOON",
    formTitle: "Customise Your Clothing",
    fields: [],
    weightOptions: [],
  },
]

export const DEFAULT_CATEGORY_ID: CustomOrderCategoryId = "healthy-laddoos"

export function getCategoryDefaults(category: CustomOrderCategory) {
  const selections: Record<string, string> = {}
  for (const field of category.fields) {
    selections[field.id] = field.options[0] ?? ""
  }
  return {
    selections,
    weight: category.weightOptions[0] ?? "250gm",
    quantity: "1",
    notes: "",
    fullName: "",
    whatsapp: "",
    email: "",
  }
}
