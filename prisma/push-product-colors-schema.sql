-- Per-product textile colour options (safe to re-run)

ALTER TABLE products ADD COLUMN IF NOT EXISTS available_colors TEXT[] NOT NULL DEFAULT '{}';
