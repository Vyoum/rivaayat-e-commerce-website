-- Prevent duplicate wishlist rows per user/product (safe to re-run)

CREATE UNIQUE INDEX IF NOT EXISTS wishlist_user_id_product_id_key
  ON wishlist (user_id, product_id);
