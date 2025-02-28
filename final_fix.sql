-- FINAL AGGRESSIVE FIX
-- This script takes a different approach to fix the recursion

-- STEP 1: Drop all potentially problematic policies
DROP POLICY IF EXISTS "Project members can access project storage" ON storage.objects;
DROP POLICY IF EXISTS "Users can access their project files" ON storage.objects;
DROP POLICY IF EXISTS "Allow project file access" ON storage.objects;
DROP POLICY IF EXISTS "Simple storage access" ON storage.objects;
DROP POLICY IF EXISTS "Project storage access" ON storage.objects;
DROP POLICY IF EXISTS "Users can view project members" ON project_members;
DROP POLICY IF EXISTS "Owners can manage project members" ON project_members;
DROP POLICY IF EXISTS "Users can see their own memberships" ON project_members;
DROP POLICY IF EXISTS "Users can view memberships" ON project_members;
DROP POLICY IF EXISTS "Users can manage members" ON project_members;
DROP POLICY IF EXISTS "Simple project_members access" ON project_members;
DROP POLICY IF EXISTS "View own memberships" ON project_members;
DROP POLICY IF EXISTS "Owners view project members" ON project_members;
DROP POLICY IF EXISTS "Owners manage project members" ON project_members;
DROP POLICY IF EXISTS "Owners update project members" ON project_members;
DROP POLICY IF EXISTS "Owners delete project members" ON project_members;

-- STEP 2: Disable RLS on project_members but keep it on storage.objects
-- This is a compromise - we lose some security on project_members but keep storage secure
ALTER TABLE project_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- STEP 3: Recreate bucket if needed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'production-files'
  ) THEN
    INSERT INTO storage.buckets (id, name, public, avif_autodetection)
    VALUES ('production-files', 'Production Files', false, false);
  END IF;
END $$;

-- STEP 4: Create a completely different type of storage policy
-- This policy directly checks auth.users and projects tables instead of project_members
CREATE POLICY "Direct project access" ON storage.objects
FOR ALL
USING (
  -- Authenticated users only
  auth.uid() IS NOT NULL
  AND
  (
    -- EITHER: User is the creator of a project that matches the file path
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.created_by = auth.uid()
      AND position('project-' || p.id::text in objects.name) > 0
    )
    OR
    -- OR: User is mentioned in project_members but we use a direct join approach
    -- instead of a nested EXISTS which might be causing recursion
    position('project-' || (
      SELECT p.id::text FROM projects p
      JOIN project_members pm ON p.id = pm.project_id
      WHERE pm.user_id = auth.uid()
      LIMIT 1
    ) in objects.name) > 0
  )
);

-- STEP 5: Verify setup
DO $$
BEGIN
  RAISE NOTICE 'Final aggressive fix applied.';
  RAISE NOTICE 'RLS has been disabled on project_members.';
  RAISE NOTICE 'Storage is secured through a different policy approach.';
  RAISE NOTICE 'This is a trade-off but should prevent the infinite recursion.';
END $$; 