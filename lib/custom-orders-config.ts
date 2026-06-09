import type { LucideIcon } from "lucide-react"
import { Cookie, Dumbbell, FlaskConical, Shirt } from "lucide-react"

export type CustomOrderCategoryId =
  | "healthy-laddoos"
  | "protein-bars"
  | "artisan-achaar"
  | "custom-clothing"

export type PricedOption = {
  label: string
  price: number | null
}

export type FormFieldGroup = {
  id: string
  label: string
  options: PricedOption[]
}

function pricedOptions(labels: string[]): PricedOption[] {
  return labels.map((label) => ({ label, price: null }))
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
  weightOptions: PricedOption[]
}

export function formatPricedOptionPrice(price: number | null | undefined) {
  if (price === null || price === undefined || price <= 0) return null
  return `+ ₹${price.toLocaleString("en-IN")}`
}

export function getPricedOptionLabels(options: PricedOption[]) {
  return options.map((option) => option.label)
}

export function getPricedOptionPrice(options: PricedOption[], label: string) {
  return options.find((option) => option.label === label)?.price ?? null
}

/** Serializable category data safe to pass from Server → Client Components */
export type PublicCustomOrderCategory = Omit<CustomOrderCategory, "icon">

export function toPublicCustomOrderCategory(category: CustomOrderCategory): PublicCustomOrderCategory {
  const { icon: _icon, ...rest } = category
  return rest
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
      {
        id: "base",
        label: "Choose Your Base",
        options: pricedOptions(["Millets", "Oats", "Mixed Nuts", "Dates"]),
      },
      {
        id: "sweetener",
        label: "Sweetening Agent (Binding)",
        options: pricedOptions(["Jaggery", "Honey", "Dates Paste"]),
      },
      {
        id: "flavour",
        label: "Flavour Profile",
        options: pricedOptions(["Cardamom", "Rose", "Saffron", "Plain"]),
      },
      {
        id: "coating",
        label: "Coating",
        options: pricedOptions(["Coconut", "Sesame", "Pistachios", "None"]),
      },
    ],
    weightOptions: pricedOptions(["250gm", "500gm", "1kg"]),
  },
  {
    id: "protein-bars",
    label: "Protein Bars",
    icon: Dumbbell,
    badge: "5-7 DAYS",
    formTitle: "Customise Your Protein Bars",
    fields: [
      {
        id: "base",
        label: "Choose Your Base",
        options: pricedOptions(["Whey", "Plant Protein", "Mixed Nuts", "Oats"]),
      },
      {
        id: "sweetener",
        label: "Sweetening Agent (Binding)",
        options: pricedOptions(["Jaggery", "Honey", "Dates Paste"]),
      },
      {
        id: "flavour",
        label: "Flavour Profile",
        options: pricedOptions(["Chocolate", "Peanut Butter", "Vanilla", "Plain"]),
      },
      {
        id: "coating",
        label: "Coating",
        options: pricedOptions(["Dark Chocolate", "Coconut", "Almonds", "None"]),
      },
    ],
    weightOptions: pricedOptions(["250gm", "500gm", "1kg"]),
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

export function buildCustomOrderCategories(
  settings: Array<{
    id: CustomOrderCategoryId
    label: string
    startingPrice: number | null
    formTitle?: string
    fields?: FormFieldGroup[]
    weightOptions?: PricedOption[]
  }>,
): CustomOrderCategory[] {
  const settingsMap = new Map(settings.map((entry) => [entry.id, entry]))

  return CUSTOM_ORDER_CATEGORIES.map((category) => {
    const setting = settingsMap.get(category.id)
    const label = setting?.label?.trim() || category.label
    const startingPrice = setting?.startingPrice ?? null
    const priceHint =
      startingPrice !== null && startingPrice > 0
        ? `Starting at ₹${startingPrice.toLocaleString("en-IN")}`
        : undefined

    return {
      ...category,
      label,
      priceHint,
      formTitle: setting?.formTitle?.trim() || category.formTitle,
      fields:
        setting?.fields && setting.fields.length > 0 ? setting.fields : category.fields,
      weightOptions:
        setting?.weightOptions && setting.weightOptions.length > 0
          ? setting.weightOptions
          : category.weightOptions,
    }
  })
}

export function buildPublicCustomOrderCategories(
  settings: Array<{
    id: CustomOrderCategoryId
    label: string
    startingPrice: number | null
    formTitle?: string
    fields?: FormFieldGroup[]
    weightOptions?: PricedOption[]
  }>,
): PublicCustomOrderCategory[] {
  return buildCustomOrderCategories(settings).map(toPublicCustomOrderCategory)
}

export function getCategoryDefaults(
  category: Pick<CustomOrderCategory, "fields" | "weightOptions">,
) {
  const selections: Record<string, string> = {}
  for (const field of category.fields) {
    selections[field.id] = field.options[0]?.label ?? ""
  }
  return {
    selections,
    weight: category.weightOptions[0]?.label ?? "250gm",
    quantity: "1",
    notes: "",
    fullName: "",
    whatsapp: "",
    email: "",
  }
}
