ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS delhivery_waybill TEXT,
  ADD COLUMN IF NOT EXISTS delhivery_status TEXT;

ALTER TABLE custom_orders
  ADD COLUMN IF NOT EXISTS delhivery_waybill TEXT,
  ADD COLUMN IF NOT EXISTS delhivery_status TEXT;
