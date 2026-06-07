import { promises as fs } from "fs"
import path from "path"

import {
  CATEGORY_CARD_KEYS,
  DEFAULT_CATEGORY_CARDS,
  type CategoryCard,
  type CategoryCardKey,
} from "@/lib/category-cards-shared"
import { readCategoryCardsFromRemote, writeCategoryCardsToRemote } from "@/lib/category-cards-remote"

export type { CategoryCard, CategoryCardKey } from "@/lib/category-cards-shared"
export {
  CATEGORY_CARD_KEYS,
  CATEGORY_CARD_LABELS,
  DEFAULT_CATEGORY_CARDS,
} from "@/lib/category-cards-shared"

const DATA_FILE = path.join(process.cwd(), "data", "category-cards.json")

type CategoryCardsFile = {
  cards: CategoryCard[]
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

async function readFile(): Promise<CategoryCardsFile> {
  try {
    const remote = await readCategoryCardsFromRemote()
    if (remote) {
      const parsed = JSON.parse(remote) as CategoryCardsFile
      if (Array.isArray(parsed.cards)) {
        return { cards: mergeWithDefaults(parsed.cards) }
      }
    }
  } catch {
    // fall through to local file
  }

  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8")
    const parsed = JSON.parse(raw) as CategoryCardsFile
    if (!Array.isArray(parsed.cards)) return { cards: DEFAULT_CATEGORY_CARDS }
    return { cards: mergeWithDefaults(parsed.cards) }
  } catch {
    return { cards: DEFAULT_CATEGORY_CARDS }
  }
}

async function writeFile(data: CategoryCardsFile) {
  const normalized = { cards: mergeWithDefaults(data.cards) }
  const serialized = JSON.stringify(normalized, null, 2)
  await writeCategoryCardsToRemote(serialized)
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, serialized, "utf-8")
}

export async function getCategoryCards(): Promise<CategoryCard[]> {
  const { cards } = await readFile()
  return cards
}

export async function getAllCategoryCardsAdmin(): Promise<CategoryCard[]> {
  return getCategoryCards()
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

  data.cards[index] = {
    ...data.cards[index],
    ...(patch.title !== undefined ? { title: patch.title.trim() } : {}),
    ...(patch.description !== undefined ? { description: patch.description.trim() } : {}),
    ...(patch.imageUrl !== undefined ? { imageUrl: patch.imageUrl.trim() } : {}),
  }

  await writeFile(data)
  return data.cards[index]
}
