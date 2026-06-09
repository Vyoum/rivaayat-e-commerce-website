import {
  CUSTOM_ORDER_CATEGORIES,
  type CustomOrderCategoryId,
  type FormFieldGroup,
  type PricedOption,
} from "@/lib/custom-orders-config"

export type CustomOrderCategorySetting = {
  id: CustomOrderCategoryId
  label: string
  startingPrice: number | null
  formTitle: string
  fields: FormFieldGroup[]
  weightOptions: PricedOption[]
}

export const CUSTOM_ORDER_CATEGORY_IDS = CUSTOM_ORDER_CATEGORIES.map((category) => category.id)

function defaultStartingPrice(id: CustomOrderCategoryId): number | null {
  if (id === "healthy-laddoos") return 850
  if (id === "custom-clothing") return 5000
  return null
}

function getBaseCategory(id: CustomOrderCategoryId) {
  return CUSTOM_ORDER_CATEGORIES.find((category) => category.id === id)
}

export function normalizePricedOption(option: string | PricedOption): PricedOption {
  if (typeof option === "string") {
    return { label: option.trim(), price: null }
  }

  const price =
    option.price === null || option.price === undefined ? null : Number(option.price)

  return {
    label: option.label.trim(),
    price: Number.isFinite(price) && price >= 0 ? price : null,
  }
}

export function normalizePricedOptions(
  options: Array<string | PricedOption> | undefined,
  fallback: PricedOption[],
): PricedOption[] {
  const cleaned = (options ?? [])
    .map(normalizePricedOption)
    .filter((option) => option.label)

  if (cleaned.length > 0) return cleaned
  return fallback
}

export function mergeCategoryFields(
  id: CustomOrderCategoryId,
  savedFields?: FormFieldGroup[],
): FormFieldGroup[] {
  const base = getBaseCategory(id)
  if (!base) return []

  const savedMap = new Map((savedFields ?? []).map((field) => [field.id, field]))

  return base.fields.map((defaultField) => {
    const saved = savedMap.get(defaultField.id)

    return {
      id: defaultField.id,
      label: saved?.label?.trim() || defaultField.label,
      options: normalizePricedOptions(saved?.options, defaultField.options),
    }
  })
}

export function mergeCategoryWeightOptions(
  id: CustomOrderCategoryId,
  saved?: Array<string | PricedOption>,
): PricedOption[] {
  const base = getBaseCategory(id)
  return normalizePricedOptions(saved, base?.weightOptions ?? [])
}

export function buildDefaultCategorySetting(id: CustomOrderCategoryId): CustomOrderCategorySetting {
  const base = getBaseCategory(id)
  if (!base) {
    throw new Error(`Unknown custom order category: ${id}`)
  }

  return {
    id,
    label: base.label,
    startingPrice: defaultStartingPrice(id),
    formTitle: base.formTitle,
    fields: base.fields.map((field) => ({
      id: field.id,
      label: field.label,
      options: field.options.map((option) => ({ ...option })),
    })),
    weightOptions: base.weightOptions.map((option) => ({ ...option })),
  }
}

export const DEFAULT_CUSTOM_ORDER_CATEGORY_SETTINGS: CustomOrderCategorySetting[] =
  CUSTOM_ORDER_CATEGORY_IDS.map((id) => buildDefaultCategorySetting(id))

export function mergeCategorySetting(saved: Partial<CustomOrderCategorySetting>): CustomOrderCategorySetting {
  const defaults = buildDefaultCategorySetting(saved.id as CustomOrderCategoryId)

  return {
    id: defaults.id,
    label: saved.label?.trim() || defaults.label,
    startingPrice:
      saved.startingPrice !== undefined
        ? saved.startingPrice === null
          ? null
          : Number(saved.startingPrice)
        : defaults.startingPrice,
    formTitle: saved.formTitle?.trim() || defaults.formTitle,
    fields: mergeCategoryFields(defaults.id, saved.fields),
    weightOptions: mergeCategoryWeightOptions(defaults.id, saved.weightOptions),
  }
}

export function formatCustomOrderStartingPrice(price: number | null) {
  if (price === null || price <= 0) return null
  return `Starting at ₹${price.toLocaleString("en-IN")}`
}

export function pricedOptionsEqual(a: PricedOption[], b: PricedOption[]) {
  if (a.length !== b.length) return false
  return a.every((option, index) => {
    const other = b[index]
    return option.label === other.label && option.price === other.price
  })
}
