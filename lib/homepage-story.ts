import { promises as fs } from "fs"
import path from "path"

import {
  DEFAULT_HOMEPAGE_STORY,
  HOMEPAGE_STORY_IMAGE_KEYS,
  type HomepageStoryContent,
  type HomepageStoryImageKey,
} from "@/lib/homepage-story-shared"
import {
  readHomepageStoryFromRemote,
  writeHomepageStoryToRemote,
} from "@/lib/homepage-story-remote"

export type { HomepageStoryContent, HomepageStoryImage, HomepageStoryImageKey } from "@/lib/homepage-story-shared"
export { DEFAULT_HOMEPAGE_STORY, HOMEPAGE_STORY_IMAGE_KEYS } from "@/lib/homepage-story-shared"

const DATA_FILE = path.join(process.cwd(), "data", "homepage-story.json")

type HomepageStoryFile = {
  content: HomepageStoryContent
}

function mergeWithDefaults(content: Partial<HomepageStoryContent>): HomepageStoryContent {
  const defaults = DEFAULT_HOMEPAGE_STORY
  const imageMap = new Map(content.images?.map((img) => [img.id, img]))

  return {
    ...defaults,
    ...content,
    bodyParagraphs: [
      content.bodyParagraphs?.[0] ?? defaults.bodyParagraphs[0],
      content.bodyParagraphs?.[1] ?? defaults.bodyParagraphs[1],
    ],
    images: HOMEPAGE_STORY_IMAGE_KEYS.map((id) => {
      const defaults = DEFAULT_HOMEPAGE_STORY.images.find((img) => img.id === id)!
      const patch = imageMap.get(id)
      return {
        ...defaults,
        ...patch,
        id,
      }
    }) as HomepageStoryContent["images"],
  }
}

async function readFile(): Promise<HomepageStoryFile> {
  try {
    const remote = await readHomepageStoryFromRemote()
    if (remote) {
      const parsed = JSON.parse(remote) as HomepageStoryFile
      if (parsed.content) {
        return { content: mergeWithDefaults(parsed.content) }
      }
    }
  } catch {
    // fall through
  }

  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8")
    const parsed = JSON.parse(raw) as HomepageStoryFile
    if (!parsed.content) return { content: DEFAULT_HOMEPAGE_STORY }
    return { content: mergeWithDefaults(parsed.content) }
  } catch {
    return { content: DEFAULT_HOMEPAGE_STORY }
  }
}

async function writeFile(data: HomepageStoryFile) {
  const normalized = { content: mergeWithDefaults(data.content) }
  const serialized = JSON.stringify(normalized, null, 2)
  await writeHomepageStoryToRemote(serialized)
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, serialized, "utf-8")
}

export async function getHomepageStory(): Promise<HomepageStoryContent> {
  const { content } = await readFile()
  return content
}

export async function updateHomepageStory(
  patch: Partial<HomepageStoryContent>,
): Promise<HomepageStoryContent> {
  const data = await readFile()
  data.content = mergeWithDefaults({ ...data.content, ...patch })
  await writeFile(data)
  return data.content
}

export async function updateHomepageStoryImage(
  id: HomepageStoryImageKey,
  src: string,
  alt?: string,
): Promise<HomepageStoryContent> {
  if (!HOMEPAGE_STORY_IMAGE_KEYS.includes(id)) {
    throw new Error("Invalid image slot")
  }
  if (!src.trim()) throw new Error("Image URL is required")

  const data = await readFile()
  data.content.images = data.content.images.map((img) =>
    img.id === id
      ? { ...img, src: src.trim(), ...(alt !== undefined ? { alt: alt.trim() } : {}) }
      : img,
  ) as HomepageStoryContent["images"]

  await writeFile(data)
  return data.content
}
