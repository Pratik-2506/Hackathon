-- ==========================================
-- ULTIMATE REPAIR SCRIPT (Fixes Permissions & Triggers)
-- Run this in Supabase SQL Editor -> New Query
-- ==========================================

BEGIN;

-- 1. CLEANUP (Remove ANY existing blockers)
-- Remove triggers that might be hanging
DROP TRIGGER IF EXISTS on_journal_entry_created ON journal_entries;
DROP FUNCTION IF EXISTS handle_new_journal_entry();

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own entries" ON journal_entries;
DROP POLICY IF EXISTS "Users can insert their own entries" ON journal_entries;
DROP POLICY IF EXISTS "Users can update their own entries" ON journal_entries;
DROP POLICY IF EXISTS "Users can delete their own entries" ON journal_entries;

-- 2. RESET SECURITY (Allow User Access)
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own entries"
  ON journal_entries FOR SELECT
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert their own entries"
  ON journal_entries FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update their own entries"
  ON journal_entries FOR UPDATE
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can delete their own entries"
  ON journal_entries FOR DELETE
  USING ( auth.uid() = user_id );

-- 3. GRANT PERMISSIONS (Fix "403 Forbidden")
GRANT ALL ON journal_entries TO authenticated;
GRANT ALL ON journal_entries TO service_role;
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON profiles TO service_role;

-- 4. ENSURE SCHEMA (Fix missing columns)
-- This block is safe to run even if columns exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'journal_entries' AND column_name = 'user_id') THEN
        ALTER TABLE journal_entries ADD COLUMN user_id uuid REFERENCES auth.users NOT NULL;
    END IF;
END $$;

COMMIT;
