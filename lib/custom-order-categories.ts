import { promises as fs } from "fs"
import path from "path"

import {
  buildPublicCustomOrderCategories,
  type PublicCustomOrderCategory,
} from "@/lib/custom-orders-config"
import {
  CUSTOM_ORDER_CATEGORY_IDS,
  DEFAULT_CUSTOM_ORDER_CATEGORY_SETTINGS,
  formatCustomOrderStartingPrice,
  mergeCategorySetting,
  type CustomOrderCategorySetting,
} from "@/lib/custom-order-categories-shared"
import {
  readCustomOrderCategoriesFromRemote,
  writeCustomOrderCategoriesToRemote,
} from "@/lib/custom-order-categories-remote"
import type { CustomOrderCategoryId, FormFieldGroup } from "@/lib/custom-orders-config"

export type { CustomOrderCategorySetting } from "@/lib/custom-order-categories-shared"
export {
  CUSTOM_ORDER_CATEGORY_IDS,
  DEFAULT_CUSTOM_ORDER_CATEGORY_SETTINGS,
  formatCustomOrderStartingPrice,
  normalizePricedOption,
  normalizePricedOptions,
  pricedOptionsEqual,
} from "@/lib/custom-order-categories-shared"

const DATA_FILE = path.join(process.cwd(), "data", "custom-order-categories.json")

type CustomOrderCategoriesFile = {
  categories: Partial<CustomOrderCategorySetting>[]
}

function mergeWithDefaults(categories: Partial<CustomOrderCategorySetting>[]): CustomOrderCategorySetting[] {
  const map = new Map(
    categories
      .filter((entry): entry is Partial<CustomOrderCategorySetting> & { id: CustomOrderCategoryId } =>
        Boolean(entry.id && CUSTOM_ORDER_CATEGORY_IDS.includes(entry.id as CustomOrderCategoryId)),
      )
      .map((entry) => [entry.id, entry]),
  )

  return DEFAULT_CUSTOM_ORDER_CATEGORY_SETTINGS.map((defaults) =>
    mergeCategorySetting({ ...defaults, ...map.get(defaults.id) }),
  )
}

function normalizeFile(data: Partial<CustomOrderCategoriesFile>): { categories: CustomOrderCategorySetting[] } {
  return {
    categories: mergeWithDefaults(Array.isArray(data.categories) ? data.categories : []),
  }
}

async function readFile(): Promise<{ categories: CustomOrderCategorySetting[] }> {
  try {
    const remote = await readCustomOrderCategoriesFromRemote()
    if (remote) {
      const parsed = JSON.parse(remote) as Partial<CustomOrderCategoriesFile>
      if (Array.isArray(parsed.categories)) {
        return normalizeFile(parsed)
      }
    }
  } catch {
    // fall through to local file
  }

  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8")
    const parsed = JSON.parse(raw) as Partial<CustomOrderCategoriesFile>
    if (!Array.isArray(parsed.categories)) {
      return normalizeFile({ categories: DEFAULT_CUSTOM_ORDER_CATEGORY_SETTINGS })
    }
    return normalizeFile(parsed)
  } catch {
    return normalizeFile({ categories: DEFAULT_CUSTOM_ORDER_CATEGORY_SETTINGS })
  }
}

async function writeFile(data: { categories: CustomOrderCategorySetting[] }) {
  const normalized = normalizeFile({ categories: data.categories })
  const serialized = JSON.stringify(normalized, null, 2)
  await writeCustomOrderCategoriesToRemote(serialized)
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, serialized, "utf-8")
}

export async function getCustomOrderCategorySettings(): Promise<CustomOrderCategorySetting[]> {
  const { categories } = await readFile()
  return categories
}

export async function getCustomOrderCategoriesForPublic(): Promise<PublicCustomOrderCategory[]> {
  const settings = await getCustomOrderCategorySettings()
  return buildPublicCustomOrderCategories(settings)
}

function validateFields(fields: FormFieldGroup[]) {
  for (const field of fields) {
    if (!field.label.trim()) {
      throw new Error("Each form section needs a label")
    }
    if (!field.options.length) {
      throw new Error(`Add at least one option for ${field.label}`)
    }
    for (const option of field.options) {
      if (!option.label.trim()) {
        throw new Error(`Each option in ${field.label} needs a name`)
      }
      if (option.price !== null && (!Number.isFinite(option.price) || option.price < 0)) {
        throw new Error(`Invalid price for ${option.label}`)
      }
    }
  }
}

function validateWeightOptions(weightOptions: FormFieldGroup["options"]) {
  const cleaned = mergeBoxSizeOptions(weightOptions)

  for (const option of cleaned) {
    if (option.price !== null && (!Number.isFinite(option.price) || option.price < 0)) {
      throw new Error(`Invalid price for ${option.label}`)
    }
  }

  return cleaned
}

export async function updateCustomOrderCategorySetting(
  id: CustomOrderCategoryId,
  patch: Partial<
    Pick<CustomOrderCategorySetting, "label" | "startingPrice" | "formTitle" | "fields" | "weightOptions">
  >,
): Promise<CustomOrderCategorySetting> {
  if (!CUSTOM_ORDER_CATEGORY_IDS.includes(id)) {
    throw new Error("Invalid custom order category")
  }

  const data = await readFile()
  const index = data.categories.findIndex((entry) => entry.id === id)
  if (index === -1) throw new Error("Category not found")

  if (patch.label !== undefined && !patch.label.trim()) {
    throw new Error("Category name is required")
  }

  if (patch.formTitle !== undefined && !patch.formTitle.trim()) {
    throw new Error("Form title is required")
  }

  if (patch.startingPrice !== undefined && patch.startingPrice !== null) {
    const price = Number(patch.startingPrice)
    if (!Number.isFinite(price) || price < 0) {
      throw new Error("Starting price must be zero or greater")
    }
  }

  if (patch.fields !== undefined) {
    validateFields(patch.fields)
  }

  if (patch.weightOptions !== undefined) {
    patch.weightOptions = validateWeightOptions(patch.weightOptions)
  }

  const next = mergeCategorySetting({
    ...data.categories[index],
    ...(patch.label !== undefined ? { label: patch.label.trim() } : {}),
    ...(patch.startingPrice !== undefined ? { startingPrice: patch.startingPrice } : {}),
    ...(patch.formTitle !== undefined ? { formTitle: patch.formTitle.trim() } : {}),
    ...(patch.fields !== undefined ? { fields: patch.fields } : {}),
    ...(patch.weightOptions !== undefined ? { weightOptions: patch.weightOptions } : {}),
  })

  data.categories[index] = next
  await writeFile(data)
  return next
}
