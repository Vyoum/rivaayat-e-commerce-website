import { readFileSync } from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { createClient } from "@supabase/supabase-js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const content = readFileSync(path.join(__dirname, "../data/hero-slides.json"), "utf8")

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(url, key)
const payload = new TextEncoder().encode(content)

const { error } = await supabase.storage.from("site-content").upload("hero-slides.json", payload, {
  contentType: "application/json",
  upsert: true,
})

if (error) {
  console.error("Remote push failed:", error.message)
  process.exit(1)
}

console.log("Pushed hero-slides.json to Supabase site-content bucket")
