-- Add user roles for admin access (safe to re-run)

DO $$ BEGIN
  CREATE TYPE "UserRole" AS ENUM ('customer', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS role "UserRole" NOT NULL DEFAULT 'customer';

UPDATE users SET role = 'customer' WHERE role IS NULL;

CREATE INDEX IF NOT EXISTS users_role_idx ON users (role);
