-- Full products schema sync for Supabase (safe to re-run)

DO $$ BEGIN
  CREATE TYPE "Category" AS ENUM ('jewellery', 'clothing', 'decor', 'custom_food');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category "Category" NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  artisan_id UUID,
  image_urls TEXT[] NOT NULL DEFAULT '{}',
  in_stock BOOLEAN NOT NULL DEFAULT true,
  handcrafted BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS story TEXT,
  ADD COLUMN IF NOT EXISTS story_image_url TEXT,
  ADD COLUMN IF NOT EXISTS materials_care TEXT,
  ADD COLUMN IF NOT EXISTS subcategory TEXT,
  ADD COLUMN IF NOT EXISTS artisan_name TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS badge TEXT,
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;

UPDATE products SET is_published = false WHERE is_published IS NULL;
UPDATE products SET tags = '{}' WHERE tags IS NULL;
UPDATE products SET in_stock = true WHERE in_stock IS NULL;
UPDATE products SET handcrafted = true WHERE handcrafted IS NULL;

CREATE INDEX IF NOT EXISTS products_category_published_idx ON products (category, is_published);
CREATE INDEX IF NOT EXISTS products_slug_idx ON products (slug);
