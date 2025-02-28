-- Incremental test setup - add back only essential components
-- Run this in the Supabase SQL Editor

-- STEP 1: Start with the same setup that worked
-- =============================================

-- First drop all existing policies that might be causing recursion
DROP POLICY IF EXISTS "Project members can access project storage" ON storage.objects;
DROP POLICY IF EXISTS "Users can access their project files" ON storage.objects;
DROP POLICY IF EXISTS "Allow project file access" ON storage.objects;
DROP POLICY IF EXISTS "Simple storage access" ON storage.objects;
DROP POLICY IF EXISTS "Users can view project members" ON project_members;
DROP POLICY IF EXISTS "Owners can manage project members" ON project_members;
DROP POLICY IF EXISTS "Users can see their own memberships" ON project_members;
DROP POLICY IF EXISTS "Users can view memberships" ON project_members;
DROP POLICY IF EXISTS "Users can manage members" ON project_members;
DROP POLICY IF EXISTS "Simple project_members access" ON project_members;

-- Keep RLS disabled on the problematic tables
ALTER TABLE project_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- STEP 2: Make sure our bucket exists
-- ===================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'production-files'
  ) THEN
    INSERT INTO storage.buckets (id, name, public, avif_autodetection)
    VALUES ('production-files', 'Production Files', false, false);
  END IF;
END $$;

-- STEP 3: Re-enable RLS but with the SIMPLEST possible policies
-- =============================================================
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create extremely simple policies for project_members
CREATE POLICY "Simple members access" ON project_members
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Create extremely simple policy for storage
CREATE POLICY "Simple storage access" ON storage.objects
  FOR ALL USING (auth.uid() IS NOT NULL);

-- STEP 4: Verify setup
-- ===================
DO $$
BEGIN
  RAISE NOTICE 'Incremental setup complete.';
  RAISE NOTICE 'RLS has been re-enabled with the simplest possible policies.';
  RAISE NOTICE 'Test if the app works with these minimal policies before adding more.';
END $$; 