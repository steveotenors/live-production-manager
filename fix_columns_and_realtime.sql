-- Fix Columns and Setup Realtime
-- This script adds necessary columns and views without rebuilding the entire database

-- Add file_type column to assets table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'assets' AND column_name = 'file_type'
  ) THEN
    ALTER TABLE assets ADD COLUMN file_type TEXT;
    RAISE NOTICE 'Added file_type column to assets table';
  ELSE
    RAISE NOTICE 'file_type column already exists in assets table';
  END IF;
  
  -- Add version column to assets if it doesn't exist
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'assets' AND column_name = 'version'
  ) THEN
    ALTER TABLE assets ADD COLUMN version TEXT DEFAULT '1.0';
    RAISE NOTICE 'Added version column to assets table';
  ELSE
    RAISE NOTICE 'version column already exists in assets table';
  END IF;
END$$;

-- Create relationship view for tasks if it doesn't exist
DO $$
BEGIN
  DROP VIEW IF EXISTS task_assignments;
  
  CREATE VIEW task_assignments AS
  SELECT 
    t.id AS task_id,
    t.title AS task_title,
    t.project_id,
    t.assigned_to,
    u.email AS assigned_to_email
  FROM tasks t
  LEFT JOIN auth.users u ON t.assigned_to = u.id;
  
  RAISE NOTICE 'Created task_assignments view';
END$$;

-- Set up Realtime for relevant tables
BEGIN;
  -- Check if supabase_realtime publication exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
  ) THEN
    -- Create the publication if it doesn't exist
    CREATE PUBLICATION supabase_realtime FOR TABLE tasks, assets, folders, project_members;
    RAISE NOTICE 'Created supabase_realtime publication';
  ELSE
    -- Add tables to the existing publication if they're not already included
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' AND tablename = 'tasks'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
      RAISE NOTICE 'Added tasks to supabase_realtime publication';
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' AND tablename = 'assets'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE assets;
      RAISE NOTICE 'Added assets to supabase_realtime publication';
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' AND tablename = 'folders'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE folders;
      RAISE NOTICE 'Added folders to supabase_realtime publication';
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' AND tablename = 'project_members'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE project_members;
      RAISE NOTICE 'Added project_members to supabase_realtime publication';
    END IF;
  END IF;
COMMIT;

-- Create schema_version table if it doesn't exist
CREATE TABLE IF NOT EXISTS schema_version (
  id SERIAL PRIMARY KEY,
  version TEXT NOT NULL,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Record this schema update
INSERT INTO schema_version (version) VALUES ('1.1.0 - File type and task assignments');

-- Final verification
DO $$
BEGIN
  RAISE NOTICE 'Schema update complete.';
  RAISE NOTICE 'Added columns: file_type, version to assets table';
  RAISE NOTICE 'Created view: task_assignments';
  RAISE NOTICE 'Enabled Realtime for: tasks, assets, folders, project_members';
END $$; 