import { getSupabaseAdmin } from "@/lib/supabase/admin"

const ensuredBuckets = new Set<string>()

export async function ensurePublicStorageBucket(bucket: string) {
  if (ensuredBuckets.has(bucket)) return true

  const supabase = getSupabaseAdmin()
  if (!supabase) return false

  const { data: buckets, error: listError } = await supabase.storage.listBuckets()
  if (listError) {
    console.error(`[storage] list buckets failed:`, listError.message)
    return false
  }

  if (buckets?.some((item) => item.name === bucket)) {
    ensuredBuckets.add(bucket)
    return true
  }

  const { error: createError } = await supabase.storage.createBucket(bucket, {
    public: true,
    fileSizeLimit: 25 * 1024 * 1024,
  })

  if (createError) {
    console.error(`[storage] create bucket "${bucket}" failed:`, createError.message)
    return false
  }

  ensuredBuckets.add(bucket)
  return true
}
