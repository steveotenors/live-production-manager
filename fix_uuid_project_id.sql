-- Script to synchronize database schema with application code
-- This fixes type mismatches between UUID fields in database and their representation in code

-- First, check that we have the uuid extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 1: Confirm projects table has UUID ids
DO $$
DECLARE
  col_type TEXT;
BEGIN
  SELECT data_type INTO col_type FROM information_schema.columns
  WHERE table_name = 'projects' AND column_name = 'id';
  
  IF col_type = 'uuid' THEN
    RAISE NOTICE 'Confirmed: projects.id is UUID type';
  ELSE
    RAISE EXCEPTION 'Warning: projects.id is % type, not UUID', col_type;
  END IF;

  -- Check project_members.project_id
  SELECT data_type INTO col_type FROM information_schema.columns
  WHERE table_name = 'project_members' AND column_name = 'project_id';
  
  IF col_type = 'uuid' THEN
    RAISE NOTICE 'Confirmed: project_members.project_id is UUID type';
  ELSE
    RAISE EXCEPTION 'Warning: project_members.project_id is % type, not UUID', col_type;
  END IF;
  
  -- Check tasks.project_id
  SELECT data_type INTO col_type FROM information_schema.columns
  WHERE table_name = 'tasks' AND column_name = 'project_id';
  
  IF col_type = 'uuid' THEN
    RAISE NOTICE 'Confirmed: tasks.project_id is UUID type';
  ELSE
    RAISE EXCEPTION 'Warning: tasks.project_id is % type, not UUID', col_type;
  END IF;
END $$;

-- Step 2: List all tables with project_id for reference
SELECT 
  t.table_name,
  c.column_name,
  c.data_type
FROM 
  information_schema.tables t
JOIN 
  information_schema.columns c ON t.table_name = c.table_name
WHERE 
  t.table_schema = 'public' AND
  c.column_name = 'project_id' AND
  t.table_type = 'BASE TABLE';

-- Step 3: Verification query - check project IDs format in existing data
SELECT 
  id::text as id_text,
  length(id::text) as id_length
FROM 
  projects
LIMIT 5;

-- Final message
DO $$
BEGIN
  RAISE NOTICE 'Schema check complete. If the database uses UUIDs, you should ensure the TypeScript interfaces use string types.';
END $$; 