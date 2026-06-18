-- Per-product clothing sizes (safe to re-run)

ALTER TABLE products ADD COLUMN IF NOT EXISTS available_sizes TEXT[] NOT NULL DEFAULT '{}';
