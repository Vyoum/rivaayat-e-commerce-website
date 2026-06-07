import { promises as fs } from "fs"
import path from "path"
import { randomUUID } from "crypto"

import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { ensurePublicStorageBucket } from "@/lib/supabase-storage-setup"

const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "category-cards")
const STORAGE_BUCKET = "site-content"

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

export function validateCategoryCardImageFile(file: File) {
  if (!IMAGE_TYPES.has(file.type)) {
    throw new Error("Only JPG, PNG, WebP, or GIF images are allowed")
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Images must be under 5MB")
  }
}

async function uploadToLocal(file: File): Promise<string> {
  const ext = extensionForMime(file.type, file.name)
  const filename = `${randomUUID()}.${ext}`
  const bytes = new Uint8Array(await file.arrayBuffer())

  await fs.mkdir(LOCAL_UPLOAD_DIR, { recursive: true })
  await fs.writeFile(path.join(LOCAL_UPLOAD_DIR, filename), bytes)

  return `/uploads/category-cards/${filename}`
}

async function uploadToSupabase(file: File): Promise<string | null> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return null

  const ready = await ensurePublicStorageBucket(STORAGE_BUCKET)
  if (!ready) return null

  const ext = extensionForMime(file.type, file.name)
  const filename = `${randomUUID()}.${ext}`
  const storagePath = `category-cards/${filename}`
  const bytes = new Uint8Array(await file.arrayBuffer())

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(storagePath, bytes, {
    contentType: file.type,
    upsert: false,
  })

  if (error) {
    console.error("[category card upload] Supabase storage error:", error.message)
    return null
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath)
  return data.publicUrl
}

export async function uploadCategoryCardImage(file: File): Promise<string> {
  validateCategoryCardImageFile(file)

  const remote = await uploadToSupabase(file)
  if (remote) return remote

  return uploadToLocal(file)
}
