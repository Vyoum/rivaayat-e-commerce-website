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

export const CUSTOM_ORDER_BOX_SIZES = ["250g", "500g", "1kg"] as const

export type CustomOrderBoxSize = (typeof CUSTOM_ORDER_BOX_SIZES)[number]

const BOX_SIZE_LABEL_ALIASES: Record<string, CustomOrderBoxSize> = {
  "250g": "250g",
  "250gm": "250g",
  "250 g": "250g",
  "500g": "500g",
  "500gm": "500g",
  "500 g": "500g",
  "1kg": "1kg",
  "1 kg": "1kg",
}

export function normalizeBoxSizeLabel(label: string): CustomOrderBoxSize | null {
  const normalized = label.trim().toLowerCase().replace(/\s+/g, " ")
  return BOX_SIZE_LABEL_ALIASES[normalized] ?? null
}

export function resolveBoxSizeSelection(weight: string, options: PricedOption[]): string {
  if (options.some((option) => option.label === weight)) return weight

  const normalized = normalizeBoxSizeLabel(weight)
  if (normalized && options.some((option) => option.label === normalized)) {
    return normalized
  }

  return options[0]?.label ?? CUSTOM_ORDER_BOX_SIZES[0]
}

export function mergeBoxSizeOptions(saved?: Array<string | PricedOption>): PricedOption[] {
  const priceBySize = new Map<CustomOrderBoxSize, number | null>()

  for (const entry of saved ?? []) {
    const option = typeof entry === "string" ? { label: entry, price: null } : entry
    const size = normalizeBoxSizeLabel(option.label)
    if (!size) continue

    const price =
      option.price === null || option.price === undefined ? null : Number(option.price)
    priceBySize.set(
      size,
      Number.isFinite(price) && price >= 0 ? price : null,
    )
  }

  return CUSTOM_ORDER_BOX_SIZES.map((label) => ({
    label,
    price: priceBySize.get(label) ?? null,
  }))
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
  startingPrice: number | null
  priceHint?: string
  badge?: string
  comingSoon?: boolean
  formTitle: string
  fields: FormFieldGroup[]
  weightOptions: PricedOption[]
}

export type CustomOrderTotalLine = {
  label: string
  amount: number
}

export type CustomOrderTotalBreakdown = {
  startingPrice: number
  optionLines: CustomOrderTotalLine[]
  weightLine: CustomOrderTotalLine | null
  perUnit: number
  quantity: number
  total: number
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

export function formatCustomOrderAmount(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`
}

function pricedAmount(price: number | null | undefined) {
  return price !== null && price !== undefined && price > 0 ? price : 0
}

export function calculateCustomOrderTotal(
  category: Pick<CustomOrderCategory, "startingPrice" | "fields" | "weightOptions">,
  selections: Record<string, string>,
  weight: string,
  quantityInput: string,
): CustomOrderTotalBreakdown {
  const startingPrice = pricedAmount(category.startingPrice)
  const optionLines: CustomOrderTotalLine[] = []
  const resolvedWeight = resolveBoxSizeSelection(weight, category.weightOptions)

  for (const field of category.fields) {
    const selected = selections[field.id] ?? field.options[0]?.label ?? ""
    const amount = pricedAmount(getPricedOptionPrice(field.options, selected))
    if (amount > 0) {
      optionLines.push({ label: `${field.label}: ${selected}`, amount })
    }
  }

  const weightAmount = pricedAmount(getPricedOptionPrice(category.weightOptions, resolvedWeight))
  const weightLine =
    weightAmount > 0 ? { label: `Box size (${resolvedWeight})`, amount: weightAmount } : null

  const perUnit =
    startingPrice +
    optionLines.reduce((sum, line) => sum + line.amount, 0) +
    (weightLine?.amount ?? 0)
  const quantity = Math.max(1, Math.floor(Number(quantityInput)) || 1)

  return {
    startingPrice,
    optionLines,
    weightLine,
    perUnit,
    quantity,
    total: perUnit * quantity,
  }
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
    startingPrice: 850,
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
    weightOptions: mergeBoxSizeOptions(["250g", "500g", "1kg"]),
  },
  {
    id: "protein-bars",
    label: "Protein Bars",
    icon: Dumbbell,
    startingPrice: null,
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
    weightOptions: mergeBoxSizeOptions(["250g", "500g", "1kg"]),
  },
  {
    id: "artisan-achaar",
    label: "Artisan Achaar",
    icon: FlaskConical,
    startingPrice: null,
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
    startingPrice: 5000,
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
      startingPrice: setting?.startingPrice ?? category.startingPrice,
      priceHint,
      formTitle: setting?.formTitle?.trim() || category.formTitle,
      fields:
        setting?.fields && setting.fields.length > 0 ? setting.fields : category.fields,
      weightOptions:
        setting?.weightOptions && setting.weightOptions.length > 0
          ? mergeBoxSizeOptions(setting.weightOptions)
          : mergeBoxSizeOptions(category.weightOptions),
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
    weight: category.weightOptions[0]?.label ?? CUSTOM_ORDER_BOX_SIZES[0],
    quantity: "1",
    notes: "",
  }
}
