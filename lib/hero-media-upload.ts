import { promises as fs } from "fs"
import path from "path"
import { randomUUID } from "crypto"

import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { ensurePublicStorageBucket } from "@/lib/supabase-storage-setup"

const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "hero")
const STORAGE_BUCKET = "hero-media"

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"])
const VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"])

export type UploadedHeroMedia = {
  url: string
  mediaType: "image" | "video"
}

function extensionForMime(mime: string, originalName: string) {
  const fromName = originalName.split(".").pop()?.toLowerCase()
  if (fromName && fromName.length <= 5) return fromName

  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/quicktime": "mov",
  }
  return map[mime] ?? "bin"
}

export function validateHeroMediaFile(file: File) {
  const isImage = IMAGE_TYPES.has(file.type)
  const isVideo = VIDEO_TYPES.has(file.type)

  if (!isImage && !isVideo) {
    throw new Error("Only JPG, PNG, WebP, GIF, MP4, or WebM files are allowed")
  }

  const maxSize = isVideo ? 25 * 1024 * 1024 : 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error(isVideo ? "Videos must be under 25MB" : "Images must be under 5MB")
  }

  return {
    mediaType: isVideo ? ("video" as const) : ("image" as const),
  }
}

async function uploadToLocal(file: File, mediaType: "image" | "video"): Promise<UploadedHeroMedia> {
  const ext = extensionForMime(file.type, file.name)
  const filename = `${randomUUID()}.${ext}`
  const bytes = new Uint8Array(await file.arrayBuffer())

  await fs.mkdir(LOCAL_UPLOAD_DIR, { recursive: true })
  await fs.writeFile(path.join(LOCAL_UPLOAD_DIR, filename), bytes)

  return {
    url: `/uploads/hero/${filename}`,
    mediaType,
  }
}

async function uploadToSupabase(file: File, mediaType: "image" | "video"): Promise<UploadedHeroMedia | null> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return null

  const ready = await ensurePublicStorageBucket(STORAGE_BUCKET)
  if (!ready) return null

  const ext = extensionForMime(file.type, file.name)
  const filename = `${randomUUID()}.${ext}`
  const storagePath = `slides/${filename}`
  const bytes = new Uint8Array(await file.arrayBuffer())

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(storagePath, bytes, {
    contentType: file.type,
    upsert: false,
  })

  if (error) {
    console.error("[hero upload] Supabase storage error:", error.message)
    return null
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath)
  return {
    url: data.publicUrl,
    mediaType,
  }
}

export async function uploadHeroMedia(file: File): Promise<UploadedHeroMedia> {
  const { mediaType } = validateHeroMediaFile(file)

  const remote = await uploadToSupabase(file, mediaType)
  if (remote) return remote

  return uploadToLocal(file, mediaType)
}
