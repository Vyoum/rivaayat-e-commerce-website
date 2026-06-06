import { promises as fs } from "fs"
import path from "path"
import { randomUUID } from "crypto"
import {
  DEFAULT_HERO_SLIDES,
  MAX_HERO_SLIDES,
  type HeroSlide,
} from "@/lib/hero-slides-shared"

export type { HeroSlide } from "@/lib/hero-slides-shared"
export { DEFAULT_HERO_SLIDES, MAX_HERO_SLIDES } from "@/lib/hero-slides-shared"

const DATA_FILE = path.join(process.cwd(), "data", "hero-slides.json")

type HeroSlidesFile = {
  slides: HeroSlide[]
}

async function readFile(): Promise<HeroSlidesFile> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8")
    const parsed = JSON.parse(raw) as HeroSlidesFile
    if (!Array.isArray(parsed.slides)) return { slides: DEFAULT_HERO_SLIDES }
    return parsed
  } catch {
    return { slides: DEFAULT_HERO_SLIDES }
  }
}

async function writeFile(data: HeroSlidesFile) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8")
}

function sortSlides(slides: HeroSlide[]) {
  return [...slides].sort((a, b) => a.sortOrder - b.sortOrder)
}

export async function getActiveHeroSlides(): Promise<HeroSlide[]> {
  const { slides } = await readFile()
  const active = sortSlides(slides).filter((s) => s.isActive && s.imageUrl)
  return active.length > 0 ? active.slice(0, MAX_HERO_SLIDES) : DEFAULT_HERO_SLIDES
}

export async function getAllHeroSlides(): Promise<HeroSlide[]> {
  const { slides } = await readFile()
  return sortSlides(slides)
}

export async function createHeroSlide(input: {
  imageUrl: string
  alt: string
}): Promise<HeroSlide> {
  const data = await readFile()
  if (data.slides.length >= MAX_HERO_SLIDES) {
    throw new Error(`Maximum ${MAX_HERO_SLIDES} hero slides allowed`)
  }

  const slide: HeroSlide = {
    id: randomUUID(),
    imageUrl: input.imageUrl,
    alt: input.alt || "House of Indika hero image",
    sortOrder: data.slides.length,
    isActive: true,
  }

  data.slides.push(slide)
  await writeFile(data)
  return slide
}

export async function updateHeroSlide(
  id: string,
  patch: Partial<Pick<HeroSlide, "imageUrl" | "alt" | "sortOrder" | "isActive">>,
): Promise<HeroSlide> {
  const data = await readFile()
  const index = data.slides.findIndex((s) => s.id === id)
  if (index === -1) throw new Error("Slide not found")

  data.slides[index] = { ...data.slides[index], ...patch }
  await writeFile(data)
  return data.slides[index]
}

export async function deleteHeroSlide(id: string) {
  const data = await readFile()
  data.slides = data.slides
    .filter((s) => s.id !== id)
    .map((slide, index) => ({ ...slide, sortOrder: index }))
  await writeFile(data)
}

export async function reorderHeroSlides(orderedIds: string[]) {
  const data = await readFile()
  const map = new Map(data.slides.map((s) => [s.id, s]))

  data.slides = orderedIds
    .map((id, index) => {
      const slide = map.get(id)
      return slide ? { ...slide, sortOrder: index } : null
    })
    .filter((s): s is HeroSlide => s !== null)

  await writeFile(data)
  return data.slides
}
