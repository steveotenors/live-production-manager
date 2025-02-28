-- Debug Project Creation Issues
-- This script helps investigate and fix project creation problems

-- 1. Check if trigger function exists
SELECT pg_get_functiondef('add_project_creator_as_owner'::regproc);

-- 2. List all triggers on the projects table
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'projects';

-- 3. Create a test project manually to verify trigger works
DO $$ 
DECLARE
  test_user_id UUID;
  test_project_id UUID;
  owner_count INTEGER; -- New variable for storing count
BEGIN
  -- Get a real user ID from the system
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;
  
  IF test_user_id IS NULL THEN
    RAISE NOTICE 'No users found in the system. Skipping test.';
    RETURN;
  END IF;
  
  -- Create a test project
  INSERT INTO projects 
    (name, description, created_by, status, visibility)
  VALUES 
    ('Test Project', 'Created to verify trigger works', test_user_id, 'active', 'private')
  RETURNING id INTO test_project_id;
  
  -- Verify the project_members entry was created by the trigger
  RAISE NOTICE 'Project created with ID: %', test_project_id;
  
  -- Use owner_count instead of reusing test_user_id
  SELECT COUNT(*) INTO owner_count FROM project_members 
  WHERE project_id = test_project_id AND user_id = test_user_id AND role = 'owner';
  
  IF owner_count > 0 THEN
    RAISE NOTICE 'SUCCESS: Trigger correctly created project_members entry for project owner';
  ELSE
    RAISE NOTICE 'FAILURE: Trigger did not create project_members entry';
  END IF;
  
  -- Clean up the test
  DELETE FROM projects WHERE id = test_project_id;
END $$;

-- 4. Check for any NaN issues in project IDs
SELECT id, name, created_by
FROM projects
WHERE id::text = 'NaN' OR id IS NULL;

-- 5. Check if any project has an owner who doesn't exist in auth.users
SELECT p.id, p.name, pm.user_id
FROM projects p
JOIN project_members pm ON p.id = pm.project_id AND pm.role = 'owner'
LEFT JOIN auth.users u ON pm.user_id = u.id
WHERE u.id IS NULL;

-- 6. Check for projects without any members (orphaned projects)
SELECT p.id, p.name, p.created_by
FROM projects p
LEFT JOIN project_members pm ON p.id = pm.project_id
WHERE pm.id IS NULL; 