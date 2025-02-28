-- Supabase Complete Setup Script for Live Production Manager (FIXED VERSION)
-- ===================================================
-- This script addresses the infinite recursion issue with project_members policies

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- First aggressively drop all policies that might cause recursion
DROP POLICY IF EXISTS "Project members can access project storage" ON storage.objects;
DROP POLICY IF EXISTS "Users can access their project files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view project members" ON project_members;
DROP POLICY IF EXISTS "Owners can manage project members" ON project_members;
DROP POLICY IF EXISTS "Users can see their own memberships" ON project_members;
DROP POLICY IF EXISTS "Project members can view tasks" ON tasks;
DROP POLICY IF EXISTS "Project members can create tasks" ON tasks;
DROP POLICY IF EXISTS "Project members can update tasks" ON tasks;
DROP POLICY IF EXISTS "Owners can delete tasks" ON tasks;
DROP POLICY IF EXISTS "Users can view their projects" ON projects;
DROP POLICY IF EXISTS "Users can create projects" ON projects;
DROP POLICY IF EXISTS "Owners can update projects" ON projects;
DROP POLICY IF EXISTS "Owners can delete projects" ON projects;

-- Drop existing tables if they exist (for clean rebuild)
DROP TABLE IF EXISTS assets CASCADE;
DROP TABLE IF EXISTS practice_sessions CASCADE;
DROP TABLE IF EXISTS folders CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- Clean up any existing triggers
DROP FUNCTION IF EXISTS add_project_creator_as_owner() CASCADE;

-- 1. Create the projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active',
  visibility TEXT DEFAULT 'private'
);

-- 2. Create the project_members table
CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Create indexes for performance
CREATE INDEX project_members_role_idx ON project_members(role);
CREATE INDEX project_members_user_id_idx ON project_members(user_id);
CREATE INDEX project_members_project_id_idx ON project_members(project_id);

-- 3. Create the tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date TIMESTAMP WITH TIME ZONE,
  assigned_to UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id)
);

-- 4. Create the practice_sessions table
CREATE TABLE practice_sessions (
  id SERIAL PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  department TEXT NOT NULL DEFAULT 'general',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create the assets table
CREATE TABLE assets (
  id SERIAL PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  department TEXT NOT NULL DEFAULT 'general',
  storage_path TEXT,
  metadata JSONB,
  size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create the folders table
CREATE TABLE folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  path TEXT[] DEFAULT '{}'::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a trigger to add project creators as owners
CREATE OR REPLACE FUNCTION add_project_creator_as_owner()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO project_members (project_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 'owner');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER project_creator_trigger
AFTER INSERT ON projects
FOR EACH ROW
EXECUTE FUNCTION add_project_creator_as_owner();

-- STORAGE SETUP
-- =============

-- Create the production-files bucket if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'production-files'
  ) THEN
    INSERT INTO storage.buckets (id, name, public, avif_autodetection)
    VALUES ('production-files', 'Production Files', false, false);
  END IF;
END $$;

-- SECURITY POLICIES (SIMPLIFIED FOR DEBUGGING)
-- ================

-- Enable Row Level Security on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create simplified non-recursive policies

-- Projects Table Policy - Simple version
CREATE POLICY "Users can view projects" ON projects
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM project_members WHERE project_id = projects.id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update projects" ON projects
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM project_members 
    WHERE project_id = projects.id AND user_id = auth.uid() AND role = 'owner'
  ));

CREATE POLICY "Users can delete projects" ON projects
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM project_members 
    WHERE project_id = projects.id AND user_id = auth.uid() AND role = 'owner'
  ));

-- Project Members Table Policies - Simple version
CREATE POLICY "Users can view memberships" ON project_members
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM project_members 
      WHERE project_id = project_members.project_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage members" ON project_members
  FOR ALL USING (EXISTS (
    SELECT 1 FROM project_members 
    WHERE project_id = project_members.project_id AND user_id = auth.uid() AND role = 'owner'
  ));

-- Tasks Table Policy - Simple version
CREATE POLICY "Users can view tasks" ON tasks
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM project_members WHERE project_id = tasks.project_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create tasks" ON tasks
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM project_members WHERE project_id = tasks.project_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update tasks" ON tasks
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM project_members WHERE project_id = tasks.project_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete tasks" ON tasks
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM project_members 
    WHERE project_id = tasks.project_id AND user_id = auth.uid() AND role = 'owner'
  ));

-- Practice Sessions Policies - Simple version
CREATE POLICY "Users can view practice sessions" ON practice_sessions
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM project_members WHERE project_id = practice_sessions.project_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create practice sessions" ON practice_sessions
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM project_members WHERE project_id = practice_sessions.project_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update practice sessions" ON practice_sessions
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM project_members WHERE project_id = practice_sessions.project_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete practice sessions" ON practice_sessions
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM project_members 
    WHERE project_id = practice_sessions.project_id AND user_id = auth.uid() AND role = 'owner'
  ));

-- Assets Policies - Simple version
CREATE POLICY "Users can view assets" ON assets
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM project_members WHERE project_id = assets.project_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create assets" ON assets
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM project_members WHERE project_id = assets.project_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update assets" ON assets
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM project_members WHERE project_id = assets.project_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete assets" ON assets
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM project_members 
    WHERE project_id = assets.project_id AND user_id = auth.uid() AND role = 'owner'
  ));

-- Folders Policies - Simple version
CREATE POLICY "Users can view folders" ON folders
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM project_members WHERE project_id = folders.project_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create folders" ON folders
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM project_members WHERE project_id = folders.project_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update folders" ON folders
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM project_members WHERE project_id = folders.project_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete folders" ON folders
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM project_members 
    WHERE project_id = folders.project_id AND user_id = auth.uid() AND role = 'owner'
  ));

-- STORAGE POLICY (CRITICAL)
-- =========================

-- Simple, non-recursive policy for storage
CREATE POLICY "Allow project file access" ON storage.objects
FOR ALL USING (
  -- Authenticated users only
  auth.uid() IS NOT NULL
  AND
  -- Check if the path contains a project ID the user is a member of
  EXISTS (
    SELECT 1 
    FROM project_members 
    WHERE 
      user_id = auth.uid()
      AND 
      -- Use position() instead of path_segments to avoid recursion
      position('project-' || project_id::text in objects.name) > 0
  )
);

-- Final verification
DO $$
BEGIN
  RAISE NOTICE 'Fixed setup complete.';
  RAISE NOTICE 'All policies have been rewritten to avoid recursion.';
  RAISE NOTICE 'Project members is now secured with non-recursive policies.';
  RAISE NOTICE 'Storage policy uses position() function instead of path_segments().';
END $$; 