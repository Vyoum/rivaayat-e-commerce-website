-- Per-product food quantity / pack options (safe to re-run)

ALTER TABLE products ADD COLUMN IF NOT EXISTS available_quantities TEXT[] NOT NULL DEFAULT '{}';
