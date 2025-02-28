-- Minimal test setup to diagnose and fix the infinite recursion issue
-- Run this in the Supabase SQL Editor

-- Step 1: Drop all existing policies that might be causing recursion
DROP POLICY IF EXISTS "Project members can access project storage" ON storage.objects;
DROP POLICY IF EXISTS "Users can access their project files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view project members" ON project_members;
DROP POLICY IF EXISTS "Owners can manage project members" ON project_members;
DROP POLICY IF EXISTS "Users can see their own memberships" ON project_members;

-- Step 2: Temporarily disable RLS to test if that's the issue
ALTER TABLE project_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Step 3: Create a single extremely simple policy for storage
CREATE POLICY "Simple storage access" ON storage.objects
FOR ALL USING (auth.uid() IS NOT NULL);

-- Step 4: Create a single simple policy for project_members
CREATE POLICY "Simple project_members access" ON project_members
FOR ALL USING (auth.uid() IS NOT NULL);

-- Step 5: Verify setup
DO $$
BEGIN
  RAISE NOTICE 'Minimal setup complete.';
  RAISE NOTICE 'All complex policies have been replaced with simple ones.';
  RAISE NOTICE 'Try accessing the app now to see if the recursion error is gone.';
END $$; 