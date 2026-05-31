-- ══════════════════════════════════════════════
-- BountyFetch — Supabase Auth Setup SQL
-- Run this in: Supabase → SQL Editor → New query
-- ══════════════════════════════════════════════

-- 1. Update users table to support Supabase Auth
--    (adds avatar column if it doesn't exist)
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT;

-- 2. Update users table password to be nullable
--    (OAuth users don't have passwords)
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;
ALTER TABLE users ALTER COLUMN password SET DEFAULT '';

-- 3. Make sure id column accepts Supabase UUID format
--    (already TEXT so this should work fine)

-- 4. Verify the table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
