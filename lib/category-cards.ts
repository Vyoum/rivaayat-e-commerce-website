import { promises as fs } from "fs"
import path from "path"

import {
  CATEGORY_CARD_KEYS,
  DEFAULT_CATEGORY_CARDS,
  DEFAULT_CATEGORY_SECTION_HEADING,
  type CategoryCard,
  type CategoryCardKey,
} from "@/lib/category-cards-shared"
import { readCategoryCardsFromRemote, writeCategoryCardsToRemote } from "@/lib/category-cards-remote"

export type { CategoryCard, CategoryCardKey } from "@/lib/category-cards-shared"
export {
  CATEGORY_CARD_KEYS,
  CATEGORY_CARD_LABELS,
  DEFAULT_CATEGORY_CARDS,
  DEFAULT_CATEGORY_SECTION_HEADING,
} from "@/lib/category-cards-shared"

const DATA_FILE = path.join(process.cwd(), "data", "category-cards.json")

type CategoryCardsFile = {
  cards: CategoryCard[]
  sectionHeading?: string
}

function mergeWithDefaults(cards: CategoryCard[]): CategoryCard[] {
  const map = new Map(cards.map((card) => [card.id, card]))
  return DEFAULT_CATEGORY_CARDS.map((defaults) => ({
    ...defaults,
    ...map.get(defaults.id),
    id: defaults.id,
    href: defaults.href,
  }))
}

function normalizeFile(data: Partial<CategoryCardsFile>): CategoryCardsFile {
  return {
    cards: mergeWithDefaults(Array.isArray(data.cards) ? data.cards : []),
    sectionHeading: data.sectionHeading?.trim() || DEFAULT_CATEGORY_SECTION_HEADING,
  }
}

async function readFile(): Promise<CategoryCardsFile> {
  try {
    const remote = await readCategoryCardsFromRemote()
    if (remote) {
      const parsed = JSON.parse(remote) as Partial<CategoryCardsFile>
      if (Array.isArray(parsed.cards)) {
        return normalizeFile(parsed)
      }
    }
  } catch {
    // fall through to local file
  }

  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8")
    const parsed = JSON.parse(raw) as Partial<CategoryCardsFile>
    if (!Array.isArray(parsed.cards)) {
      return normalizeFile({ cards: DEFAULT_CATEGORY_CARDS })
    }
    return normalizeFile(parsed)
  } catch {
    return normalizeFile({ cards: DEFAULT_CATEGORY_CARDS })
  }
}

async function writeFile(data: CategoryCardsFile) {
  const normalized = normalizeFile(data)
  const serialized = JSON.stringify(normalized, null, 2)
  await writeCategoryCardsToRemote(serialized)
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, serialized, "utf-8")
}

export async function getCategoryCardsContent(): Promise<{
  cards: CategoryCard[]
  sectionHeading: string
}> {
  const data = await readFile()
  return {
    cards: data.cards,
    sectionHeading: data.sectionHeading ?? DEFAULT_CATEGORY_SECTION_HEADING,
  }
}

export async function getCategoryCards(): Promise<CategoryCard[]> {
  const { cards } = await getCategoryCardsContent()
  return cards
}

export async function getCategorySectionHeading(): Promise<string> {
  const { sectionHeading } = await getCategoryCardsContent()
  return sectionHeading
}

export async function getAllCategoryCardsAdmin(): Promise<{
  cards: CategoryCard[]
  sectionHeading: string
}> {
  return getCategoryCardsContent()
}

export async function getCategoryCardByRoute(route: string): Promise<CategoryCard | null> {
  const cards = await getCategoryCards()
  if (!CATEGORY_CARD_KEYS.includes(route as CategoryCardKey)) return null
  return cards.find((card) => card.id === route) ?? null
}

export function applyCategoryCardToMeta<T extends { breadcrumb: string; subtitle: string }>(
  meta: T,
  card: CategoryCard | null,
): T {
  if (!card) return meta
  return {
    ...meta,
    breadcrumb: card.title,
    subtitle: card.description,
  }
}

export async function updateCategoryCard(
  id: CategoryCardKey,
  patch: Partial<Pick<CategoryCard, "imageUrl" | "title" | "description">>,
): Promise<CategoryCard> {
  if (!CATEGORY_CARD_KEYS.includes(id)) {
    throw new Error("Invalid category")
  }

  const data = await readFile()
  const index = data.cards.findIndex((card) => card.id === id)
  if (index === -1) throw new Error("Category not found")

  if (patch.imageUrl !== undefined && !patch.imageUrl.trim()) {
    throw new Error("Image URL is required")
  }

  if (patch.title !== undefined && !patch.title.trim()) {
    throw new Error("Category name is required")
  }

  if (patch.description !== undefined && !patch.description.trim()) {
    throw new Error("Tagline is required")
  }

  data.cards[index] = {
    ...data.cards[index],
    ...(patch.title !== undefined ? { title: patch.title.trim() } : {}),
    ...(patch.description !== undefined ? { description: patch.description.trim() } : {}),
    ...(patch.imageUrl !== undefined ? { imageUrl: patch.imageUrl.trim() } : {}),
  }

  await writeFile(data)
  return data.cards[index]
}

export async function updateCategorySectionHeading(sectionHeading: string): Promise<string> {
  const trimmed = sectionHeading.trim()
  if (!trimmed) {
    throw new Error("Section heading is required")
  }

  const data = await readFile()
  data.sectionHeading = trimmed
  await writeFile(data)
  return trimmed
}
