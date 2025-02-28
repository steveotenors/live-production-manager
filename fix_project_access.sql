-- Fix for Project Access Issues
-- Addresses problems with project creation and access after RLS changes

-- 1. First verify that projects table has RLS enabled
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing project policies if any
DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
DROP POLICY IF EXISTS "Users can create projects" ON projects;
DROP POLICY IF EXISTS "Only project owners can update projects" ON projects;
DROP POLICY IF EXISTS "Only project owners can delete projects" ON projects;
DROP POLICY IF EXISTS "Users can update their projects" ON projects;
DROP POLICY IF EXISTS "Users can delete their projects" ON projects;

-- 3. Create simpler policies for projects that don't rely on recursive lookups
-- Allow users to view their own projects (ones they created or are members of)
CREATE POLICY "Users can view their own projects" ON projects
FOR SELECT
USING (
  auth.uid() = created_by OR
  EXISTS (
    SELECT 1 FROM project_members pm
    WHERE pm.project_id = id AND pm.user_id = auth.uid()
  )
);

-- Allow authenticated users to create projects
CREATE POLICY "Users can create projects" ON projects
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

-- Allow updating only if owner or admin
CREATE POLICY "Users can update their projects" ON projects
FOR UPDATE
USING (
  auth.uid() = created_by OR
  EXISTS (
    SELECT 1 FROM project_members pm
    WHERE pm.project_id = id AND pm.user_id = auth.uid() AND pm.role IN ('owner', 'admin')
  )
);

-- Allow deletion only if owner
CREATE POLICY "Users can delete their projects" ON projects
FOR DELETE
USING (
  auth.uid() = created_by OR
  EXISTS (
    SELECT 1 FROM project_members pm
    WHERE pm.project_id = id AND pm.user_id = auth.uid() AND pm.role = 'owner'
  )
);

-- 4. Drop the existing storage policy and create a more reliable one
DROP POLICY IF EXISTS "Direct project access" ON storage.objects;
DROP POLICY IF EXISTS "Users access project files" ON storage.objects;

CREATE POLICY "Users access project files" ON storage.objects
FOR ALL 
USING (
  -- Simple path-based check without regex
  auth.uid() IS NOT NULL AND
  bucket_id = 'production-files' AND
  EXISTS (
    SELECT 1
    FROM projects p
    WHERE 
      -- Match project ID in the path
      name LIKE 'project-' || p.id::text || '/%' AND
      -- Check if user created project or is a member
      (p.created_by = auth.uid() OR 
       EXISTS (
         SELECT 1 FROM project_members pm 
         WHERE pm.project_id = p.id AND pm.user_id = auth.uid()
       )
      )
  )
);

-- 5. Drop existing triggers first, then the function
DROP TRIGGER IF EXISTS add_project_owner_trigger ON projects;
DROP TRIGGER IF EXISTS project_creator_trigger ON projects;

-- Now safe to drop and recreate the function
DROP FUNCTION IF EXISTS add_project_creator_as_owner();

-- Create or replace the function
CREATE OR REPLACE FUNCTION add_project_creator_as_owner()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO project_members (project_id, user_id, role, joined_at)
  VALUES (NEW.id, NEW.created_by, 'owner', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger with our standardized name
CREATE TRIGGER add_project_owner_trigger
AFTER INSERT ON projects
FOR EACH ROW
EXECUTE FUNCTION add_project_creator_as_owner();

-- 6. Final verification message
DO $$
BEGIN
  RAISE NOTICE 'Project access fixes applied.';
  RAISE NOTICE 'Projects table policies have been simplified.';
  RAISE NOTICE 'Storage policy now uses direct path matching for reliable access control.';
  RAISE NOTICE 'Project creator trigger has been verified and fixed.';
END $$; 