-- Fixed Project Members Policy
-- This script focuses specifically on fixing the project_members policies
-- Run this AFTER the test_incremental_setup.sql if that worked

-- First drop any existing policies on project_members
DROP POLICY IF EXISTS "Simple members access" ON project_members;
DROP POLICY IF EXISTS "Users can view memberships" ON project_members;
DROP POLICY IF EXISTS "Users can manage members" ON project_members;

-- 1. Policy for users to see their own memberships (non-recursive)
CREATE POLICY "View own memberships" ON project_members
  FOR SELECT USING (user_id = auth.uid());

-- 2. Policy for project owners (requires separate policies to avoid recursion)
-- First, let project owners view all members in their projects
CREATE POLICY "Owners view project members" ON project_members
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM project_members AS pm
    WHERE pm.user_id = auth.uid()
      AND pm.role = 'owner'
      AND pm.project_id = project_members.project_id
  ));

-- Then, let project owners manage memberships
CREATE POLICY "Owners manage project members" ON project_members
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM project_members AS pm
    WHERE pm.user_id = auth.uid()
      AND pm.role = 'owner'
      AND pm.project_id = project_members.project_id
  ));

CREATE POLICY "Owners update project members" ON project_members
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM project_members AS pm
    WHERE pm.user_id = auth.uid()
      AND pm.role = 'owner'
      AND pm.project_id = project_members.project_id
  ));

CREATE POLICY "Owners delete project members" ON project_members
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM project_members AS pm
    WHERE pm.user_id = auth.uid()
      AND pm.role = 'owner'
      AND pm.project_id = project_members.project_id
  ));

-- 3. Now add the simple storage policy using position()
DROP POLICY IF EXISTS "Simple storage access" ON storage.objects;

CREATE POLICY "Project storage access" ON storage.objects
FOR ALL
USING (
  -- Authenticated users only
  auth.uid() IS NOT NULL
  AND
  -- User is a member of a project
  EXISTS (
    SELECT 1 FROM project_members
    WHERE 
      project_members.user_id = auth.uid()
      AND 
      -- Project ID is in the filename
      position('project-' || project_members.project_id::text in objects.name) > 0
  )
);

-- Verification
DO $$
BEGIN
  RAISE NOTICE 'Fixed project_members policies applied.';
  RAISE NOTICE 'These policies avoid recursive references in the same table.';
  RAISE NOTICE 'Test if this resolves the infinite recursion issue.';
END $$; 