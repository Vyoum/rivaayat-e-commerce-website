import { promises as fs } from "fs"
import path from "path"
import { randomUUID } from "crypto"

import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { ensurePublicStorageBucket } from "@/lib/supabase-storage-setup"

const STORAGE_BUCKET = "site-content"
const LOCAL_UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads", "site-pages")

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"])

function extensionForMime(mime: string, originalName: string) {
  const fromName = originalName.split(".").pop()?.toLowerCase()
  if (fromName && fromName.length <= 5) return fromName

  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  }
  return map[mime] ?? "bin"
}

export function validateSitePageImageFile(file: File) {
  if (!IMAGE_TYPES.has(file.type)) {
    throw new Error("Only JPG, PNG, WebP, or GIF images are allowed")
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Images must be under 5MB")
  }
}

async function uploadToLocal(folder: string, file: File): Promise<string> {
  const ext = extensionForMime(file.type, file.name)
  const filename = `${randomUUID()}.${ext}`
  const bytes = new Uint8Array(await file.arrayBuffer())
  const dir = path.join(LOCAL_UPLOAD_ROOT, folder)

  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(path.join(dir, filename), bytes)

  return `/uploads/site-pages/${folder}/${filename}`
}

async function uploadToSupabase(folder: string, file: File): Promise<string | null> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return null

  const ready = await ensurePublicStorageBucket(STORAGE_BUCKET)
  if (!ready) return null

  const ext = extensionForMime(file.type, file.name)
  const filename = `${randomUUID()}.${ext}`
  const storagePath = `site-pages/${folder}/${filename}`
  const bytes = new Uint8Array(await file.arrayBuffer())

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(storagePath, bytes, {
    contentType: file.type,
    upsert: false,
  })

  if (error) {
    console.error("[site page upload] Supabase storage error:", error.message)
    return null
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath)
  return data.publicUrl
}

export async function uploadSitePageImage(folder: string, file: File): Promise<string> {
  validateSitePageImageFile(file)

  const remote = await uploadToSupabase(folder, file)
  if (remote) return remote

  return uploadToLocal(folder, file)
}
