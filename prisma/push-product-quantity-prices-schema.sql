-- Per-product food box prices (250g, 500g, 1kg, 2kg)

ALTER TABLE products ADD COLUMN IF NOT EXISTS quantity_prices JSONB NOT NULL DEFAULT '{}'::jsonb;
