-- Run in Supabase SQL Editor if products table already exists without new columns.
-- Safe to run multiple times (uses IF NOT EXISTS).

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS story TEXT,
  ADD COLUMN IF NOT EXISTS materials_care TEXT,
  ADD COLUMN IF NOT EXISTS subcategory TEXT,
  ADD COLUMN IF NOT EXISTS artisan_name TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS badge TEXT,
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;

UPDATE products SET is_published = false WHERE is_published IS NULL;
UPDATE products SET tags = '{}' WHERE tags IS NULL;

CREATE INDEX IF NOT EXISTS products_category_published_idx
  ON products (category, is_published);

CREATE INDEX IF NOT EXISTS products_slug_idx
  ON products (slug);
