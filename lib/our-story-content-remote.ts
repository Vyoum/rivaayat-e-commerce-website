import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { ensurePublicStorageBucket } from "@/lib/supabase-storage-setup"

const STORAGE_BUCKET = "site-content"
const STORAGE_PATH = "our-story-content.json"

export async function readOurStoryContentFromRemote(): Promise<string | null> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return null

  await ensurePublicStorageBucket(STORAGE_BUCKET)

  const { data, error } = await supabase.storage.from(STORAGE_BUCKET).download(STORAGE_PATH)
  if (error || !data) return null

  return data.text()
}

export async function writeOurStoryContentToRemote(content: string) {
  const supabase = getSupabaseAdmin()
  if (!supabase) return false

  const ready = await ensurePublicStorageBucket(STORAGE_BUCKET)
  if (!ready) return false

  const payload = new TextEncoder().encode(content)
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(STORAGE_PATH, payload, {
    contentType: "application/json",
    upsert: true,
  })

  if (error) {
    console.error("[our story content] remote write error:", error.message)
    return false
  }

  return true
}
