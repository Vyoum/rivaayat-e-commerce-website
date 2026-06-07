import { promises as fs } from "fs"
import path from "path"

import {
  DEFAULT_OUR_STORY_CONTENT,
  mergeOurStoryContent,
  type OurStoryContent,
} from "@/lib/our-story-content-shared"
import {
  readOurStoryContentFromRemote,
  writeOurStoryContentToRemote,
} from "@/lib/our-story-content-remote"

export type { OurStoryContent } from "@/lib/our-story-content-shared"
export { DEFAULT_OUR_STORY_CONTENT } from "@/lib/our-story-content-shared"

const DATA_FILE = path.join(process.cwd(), "data", "our-story-content.json")

type OurStoryContentFile = {
  content: OurStoryContent
}

function mergeWithDefaults(content: Partial<OurStoryContent>): OurStoryContent {
  return mergeOurStoryContent(content)
}

async function readFile(): Promise<OurStoryContentFile> {
  try {
    const remote = await readOurStoryContentFromRemote()
    if (remote) {
      const parsed = JSON.parse(remote) as OurStoryContentFile
      if (parsed.content) {
        return { content: mergeWithDefaults(parsed.content) }
      }
    }
  } catch {
    // fall through
  }

  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8")
    const parsed = JSON.parse(raw) as OurStoryContentFile
    if (!parsed.content) return { content: DEFAULT_OUR_STORY_CONTENT }
    return { content: mergeWithDefaults(parsed.content) }
  } catch {
    return { content: DEFAULT_OUR_STORY_CONTENT }
  }
}

async function writeFile(data: OurStoryContentFile) {
  const normalized = { content: mergeWithDefaults(data.content) }
  const serialized = JSON.stringify(normalized, null, 2)
  await writeOurStoryContentToRemote(serialized)
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, serialized, "utf-8")
}

export async function getOurStoryContent(): Promise<OurStoryContent> {
  const { content } = await readFile()
  return content
}

export async function updateOurStoryContent(
  patch: Partial<OurStoryContent>,
): Promise<OurStoryContent> {
  const data = await readFile()
  data.content = mergeWithDefaults({ ...data.content, ...patch })
  await writeFile(data)
  return data.content
}
