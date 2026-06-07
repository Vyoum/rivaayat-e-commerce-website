import { promises as fs } from "fs"
import path from "path"

import {
  DEFAULT_ARTISAN_PAGE_CONTENT,
  type ArtisanPageContent,
} from "@/lib/artisan-page-content-shared"
import {
  readArtisanPageContentFromRemote,
  writeArtisanPageContentToRemote,
} from "@/lib/artisan-page-content-remote"

export type { ArtisanPageContent, ArtisanCredential } from "@/lib/artisan-page-content-shared"
export { DEFAULT_ARTISAN_PAGE_CONTENT } from "@/lib/artisan-page-content-shared"

const DATA_FILE = path.join(process.cwd(), "data", "artisan-page-content.json")

type ArtisanPageContentFile = {
  content: ArtisanPageContent
}

function mergeWithDefaults(content: Partial<ArtisanPageContent>): ArtisanPageContent {
  const defaults = DEFAULT_ARTISAN_PAGE_CONTENT
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

async function readFile(): Promise<ArtisanPageContentFile> {
  try {
    const remote = await readArtisanPageContentFromRemote()
    if (remote) {
      const parsed = JSON.parse(remote) as ArtisanPageContentFile
      if (parsed.content) {
        return { content: mergeWithDefaults(parsed.content) }
      }
    }
  } catch {
    // fall through
  }

  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8")
    const parsed = JSON.parse(raw) as ArtisanPageContentFile
    if (!parsed.content) return { content: DEFAULT_ARTISAN_PAGE_CONTENT }
    return { content: mergeWithDefaults(parsed.content) }
  } catch {
    return { content: DEFAULT_ARTISAN_PAGE_CONTENT }
  }
}

async function writeFile(data: ArtisanPageContentFile) {
  const normalized = { content: mergeWithDefaults(data.content) }
  const serialized = JSON.stringify(normalized, null, 2)
  await writeArtisanPageContentToRemote(serialized)
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, serialized, "utf-8")
}

export async function getArtisanPageContent(): Promise<ArtisanPageContent> {
  const { content } = await readFile()
  return content
}

export async function updateArtisanPageContent(
  patch: Partial<ArtisanPageContent>,
): Promise<ArtisanPageContent> {
  const data = await readFile()
  data.content = mergeWithDefaults({ ...data.content, ...patch })
  await writeFile(data)
  return data.content
}
