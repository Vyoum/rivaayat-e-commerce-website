import { promises as fs } from "fs"
import path from "path"
import { randomUUID } from "crypto"

import {
  DEFAULT_ARTISAN_PAGE_CONTENT,
  DEFAULT_ARTISAN_PROFILES,
  MAX_ARTISAN_PROFILES,
  type ArtisanPageContent,
} from "@/lib/artisan-page-content-shared"
import {
  readArtisanPageContentFromRemote,
  writeArtisanPageContentToRemote,
} from "@/lib/artisan-page-content-remote"
import { resolveArtisanSlugForName } from "@/lib/artisan-routes"
import type { CatalogProduct } from "@/lib/category-catalog"
import { slugify } from "@/lib/product-utils"

export type { ArtisanPageContent, ArtisanCredential } from "@/lib/artisan-page-content-shared"
export {
  DEFAULT_ARTISAN_PAGE_CONTENT,
  DEFAULT_ARTISAN_PROFILES,
  MAX_ARTISAN_PROFILES,
} from "@/lib/artisan-page-content-shared"

const DATA_FILE = path.join(process.cwd(), "data", "artisan-page-content.json")

type ArtisanProfilesFile = {
  profiles: ArtisanPageContent[]
}

type LegacyArtisanPageContentFile = {
  content?: Partial<ArtisanPageContent>
}

function mergeWithDefaults(content: Partial<ArtisanPageContent>): ArtisanPageContent {
  const defaults = DEFAULT_ARTISAN_PROFILES[0]
  return {
    ...defaults,
    ...content,
    biographyParagraphs: [
      content.biographyParagraphs?.[0] ?? defaults.biographyParagraphs[0],
      content.biographyParagraphs?.[1] ?? defaults.biographyParagraphs[1],
      content.biographyParagraphs?.[2] ?? defaults.biographyParagraphs[2],
    ],
    credentials: [
      { ...defaults.credentials[0], ...content.credentials?.[0] },
      { ...defaults.credentials[1], ...content.credentials?.[1] },
      { ...defaults.credentials[2], ...content.credentials?.[2] },
    ],
  }
}

function normalizeProfiles(profiles: Partial<ArtisanPageContent>[]): ArtisanPageContent[] {
  return profiles
    .slice(0, MAX_ARTISAN_PROFILES)
    .map((profile, index) =>
      mergeWithDefaults({
        ...profile,
        id: profile.id ?? randomUUID(),
        slug: profile.slug ?? slugify(profile.name ?? `artisan-${index + 1}`),
        isPublished: profile.isPublished ?? true,
        sortOrder: profile.sortOrder ?? index,
      }),
    )
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

function migrateLegacyFile(parsed: LegacyArtisanPageContentFile): ArtisanProfilesFile {
  if (parsed.content) {
    const profile = mergeWithDefaults({
      ...parsed.content,
      id: parsed.content.id ?? "default-devendra-khatri",
      slug: parsed.content.slug ?? "devendra-khatri",
      isPublished: parsed.content.isPublished ?? true,
      sortOrder: parsed.content.sortOrder ?? 0,
    })
    return { profiles: [profile] }
  }

  return { profiles: DEFAULT_ARTISAN_PROFILES }
}

async function readFile(): Promise<ArtisanProfilesFile> {
  try {
    const remote = await readArtisanPageContentFromRemote()
    if (remote) {
      const parsed = JSON.parse(remote) as ArtisanProfilesFile & LegacyArtisanPageContentFile
      if (Array.isArray(parsed.profiles)) {
        return { profiles: normalizeProfiles(parsed.profiles) }
      }
      return migrateLegacyFile(parsed)
    }
  } catch {
    // fall through
  }

  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8")
    const parsed = JSON.parse(raw) as ArtisanProfilesFile & LegacyArtisanPageContentFile
    if (Array.isArray(parsed.profiles)) {
      return { profiles: normalizeProfiles(parsed.profiles) }
    }
    return migrateLegacyFile(parsed)
  } catch {
    return { profiles: DEFAULT_ARTISAN_PROFILES }
  }
}

async function writeFile(data: ArtisanProfilesFile) {
  const normalized = { profiles: normalizeProfiles(data.profiles) }
  const serialized = JSON.stringify(normalized, null, 2)
  await writeArtisanPageContentToRemote(serialized)
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, serialized, "utf-8")
}

function uniqueSlug(base: string, profiles: ArtisanPageContent[], excludeId?: string) {
  const taken = new Set(
    profiles.filter((profile) => profile.id !== excludeId).map((profile) => profile.slug),
  )
  if (!taken.has(base)) return base

  let counter = 2
  while (taken.has(`${base}-${counter}`)) counter += 1
  return `${base}-${counter}`
}

export async function getAllArtisanProfiles(): Promise<ArtisanPageContent[]> {
  const { profiles } = await readFile()
  return profiles
}

export async function getPublishedArtisanProfiles(): Promise<ArtisanPageContent[]> {
  const { profiles } = await readFile()
  return profiles.filter((profile) => profile.isPublished)
}

export async function getArtisanProfileBySlug(
  slug: string,
): Promise<ArtisanPageContent | null> {
  const { profiles } = await readFile()
  return profiles.find((profile) => profile.slug === slug) ?? null
}

export async function getRandomPublishedArtisanProfile(
  excludeSlug?: string,
): Promise<ArtisanPageContent | null> {
  const published = await getPublishedArtisanProfiles()
  const pool = excludeSlug
    ? published.filter((profile) => profile.slug !== excludeSlug)
    : published

  if (pool.length === 0) {
    return published[0] ?? null
  }

  return pool[Math.floor(Math.random() * pool.length)]
}

export async function attachArtisanSlugsToCatalogProducts(
  products: CatalogProduct[],
): Promise<CatalogProduct[]> {
  const published = await getPublishedArtisanProfiles()

  return products.map((product) => ({
    ...product,
    artisanSlug: resolveArtisanSlugForName(product.artisan, published) ?? undefined,
  }))
}

/** @deprecated Use getArtisanProfileBySlug or getAllArtisanProfiles */
export async function getArtisanPageContent(): Promise<ArtisanPageContent> {
  const { profiles } = await readFile()
  return profiles[0] ?? DEFAULT_ARTISAN_PROFILES[0]
}

export async function createArtisanProfile(
  input: Partial<ArtisanPageContent> = {},
): Promise<ArtisanPageContent> {
  const data = await readFile()
  if (data.profiles.length >= MAX_ARTISAN_PROFILES) {
    throw new Error(`Maximum ${MAX_ARTISAN_PROFILES} artisan profiles allowed`)
  }

  const name = input.name?.trim() || "New Artisan"
  const baseSlug = slugify(input.slug?.trim() || name) || `artisan-${data.profiles.length + 1}`
  const profile = mergeWithDefaults({
    ...DEFAULT_ARTISAN_PAGE_CONTENT,
    ...input,
    id: randomUUID(),
    name,
    slug: uniqueSlug(baseSlug, data.profiles),
    isPublished: input.isPublished ?? false,
    sortOrder: data.profiles.length,
  })

  data.profiles.push(profile)
  await writeFile(data)
  return profile
}

export async function updateArtisanProfile(
  id: string,
  patch: Partial<ArtisanPageContent>,
): Promise<ArtisanPageContent> {
  const data = await readFile()
  const index = data.profiles.findIndex((profile) => profile.id === id)
  if (index === -1) throw new Error("Artisan profile not found")

  const current = data.profiles[index]
  const nextName = patch.name?.trim() || current.name
  const requestedSlug = patch.slug?.trim()
  const nextSlug = requestedSlug
    ? uniqueSlug(slugify(requestedSlug) || current.slug, data.profiles, id)
    : patch.name
      ? uniqueSlug(slugify(nextName) || current.slug, data.profiles, id)
      : current.slug

  data.profiles[index] = mergeWithDefaults({
    ...current,
    ...patch,
    id: current.id,
    slug: nextSlug,
    name: nextName,
    sortOrder: patch.sortOrder ?? current.sortOrder,
  })

  await writeFile(data)
  return data.profiles[index]
}

export async function deleteArtisanProfile(id: string) {
  const data = await readFile()
  data.profiles = data.profiles
    .filter((profile) => profile.id !== id)
    .map((profile, index) => ({ ...profile, sortOrder: index }))
  await writeFile(data)
}

/** @deprecated Use updateArtisanProfile */
export async function updateArtisanPageContent(
  patch: Partial<ArtisanPageContent>,
): Promise<ArtisanPageContent> {
  const data = await readFile()
  const first = data.profiles[0]
  if (!first) {
    const created = await createArtisanProfile(patch)
    return created
  }
  return updateArtisanProfile(first.id, patch)
}
