-- Fix Storage RLS Policies
-- This script fixes issues with storage permissions and assets table

-- First list all existing policies to check what's already there
DO $$
BEGIN
  RAISE NOTICE 'Existing storage policies:';
END $$;

SELECT policyname FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- 1. Now fix the storage permissions by dropping all existing policies
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname FROM pg_policies 
    WHERE tablename = 'objects' AND schemaname = 'storage'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
    RAISE NOTICE 'Dropped policy: %', pol.policyname;
  END LOOP;
END $$;

-- Create a simplified, more permissive policy for storage objects
CREATE POLICY "New project storage access" ON storage.objects
FOR ALL 
USING (
  -- Any authenticated user can access objects
  auth.uid() IS NOT NULL AND 
  bucket_id = 'production-files'
);

-- 2. Fix the assets table RLS policy
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies on assets table
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname FROM pg_policies 
    WHERE tablename = 'assets' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON assets', pol.policyname);
    RAISE NOTICE 'Dropped policy: %', pol.policyname;
  END LOOP;
END $$;

-- Create separate policies for the assets table
-- Allow users to view assets for their projects
CREATE POLICY "Users can view assets" ON assets
FOR SELECT
USING (
  -- User can view assets for projects they are a member of
  EXISTS (
    SELECT 1 FROM projects p
    LEFT JOIN project_members pm ON p.id = pm.project_id
    WHERE 
      p.id::text = assets.project_id::text AND
      (
        p.created_by = auth.uid() OR 
        pm.user_id = auth.uid()
      )
  )
);

-- Allow any authenticated user to insert assets
CREATE POLICY "Users can insert assets" ON assets
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
);

-- Notify about completion
DO $$
BEGIN
  RAISE NOTICE 'Storage RLS policies have been updated with a more permissive approach.';
  RAISE NOTICE 'Users should now be able to create folders and upload files to their projects.';
END $$; 