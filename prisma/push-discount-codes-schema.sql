-- Discount codes + order promo fields (safe to re-run)

DO $$ BEGIN
  CREATE TYPE "DiscountType" AS ENUM ('percentage', 'fixed');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  type "DiscountType" NOT NULL,
  value DECIMAL(10, 2) NOT NULL,
  min_order_amount DECIMAL(10, 2),
  max_uses INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS promo_code TEXT,
  ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0;

UPDATE orders SET discount_amount = 0 WHERE discount_amount IS NULL;

CREATE INDEX IF NOT EXISTS discount_codes_code_idx ON discount_codes (code);
CREATE INDEX IF NOT EXISTS orders_promo_code_idx ON orders (promo_code);
