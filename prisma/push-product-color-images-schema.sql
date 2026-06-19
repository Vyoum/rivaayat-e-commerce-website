-- Per-colour product gallery images for textiles (safe to re-run)

ALTER TABLE products ADD COLUMN IF NOT EXISTS color_images JSONB NOT NULL DEFAULT '{}'::jsonb;
