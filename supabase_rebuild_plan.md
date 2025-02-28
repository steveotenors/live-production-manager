# Supabase Rebuild Plan for Live Production Manager App

## Database Schema

### Tables

1. **projects**
   ```sql
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
   ```

2. **project_members**
   ```sql
   CREATE TABLE project_members (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     role TEXT NOT NULL DEFAULT 'member',
     joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     UNIQUE(project_id, user_id)
   );
   
   -- Index for performance
   CREATE INDEX project_members_role_idx ON project_members(role);
   CREATE INDEX project_members_user_id_idx ON project_members(user_id);
   CREATE INDEX project_members_project_id_idx ON project_members(project_id);
   ```

3. **tasks**
   ```sql
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
   ```

4. **practice_sessions**
   ```sql
   CREATE TABLE practice_sessions (
     id SERIAL PRIMARY KEY,
     project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
     date TEXT NOT NULL,
     department TEXT NOT NULL DEFAULT 'general',
     notes TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

5. **assets**
   ```sql
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
   ```

6. **folders** (if needed)
   ```sql
   CREATE TABLE folders (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name TEXT NOT NULL,
     project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
     path TEXT[] DEFAULT '{}'::TEXT[],
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

## Storage Buckets

1. **Create the production-files bucket**
   ```sql
   -- Create the storage bucket
   INSERT INTO storage.buckets (id, name, public, avif_autodetection)
   VALUES ('production-files', 'Production Files', false, false);
   ```

## Row Level Security (RLS) Policies

### Projects Table

```sql
-- Enable RLS on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view projects they are members of
CREATE POLICY "Users can view their projects" ON projects
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM project_members WHERE project_id = projects.id
    )
  );

-- Policy: Users can create projects
CREATE POLICY "Users can create projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Only project owners can update projects
CREATE POLICY "Owners can update projects" ON projects
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM project_members 
      WHERE project_id = projects.id AND role = 'owner'
    )
  );

-- Policy: Only project owners can delete projects
CREATE POLICY "Owners can delete projects" ON projects
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM project_members 
      WHERE project_id = projects.id AND role = 'owner'
    )
  );
```

### Project Members Table

```sql
-- Enable RLS on project_members table
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view members of projects they belong to
CREATE POLICY "Users can view project members" ON project_members
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM project_members 
      WHERE project_id = project_members.project_id
    )
  );

-- Policy: Project owners can manage members
CREATE POLICY "Owners can manage project members" ON project_members
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM project_members 
      WHERE project_id = project_members.project_id AND role = 'owner'
    )
  );

-- Policy: Users can view their own memberships
CREATE POLICY "Users can see their own memberships" ON project_members
  FOR SELECT USING (auth.uid() = user_id);
```

### Tasks Table

```sql
-- Enable RLS on tasks table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policy: Project members can view tasks
CREATE POLICY "Project members can view tasks" ON tasks
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM project_members WHERE project_id = tasks.project_id
    )
  );

-- Policy: Project members can create tasks
CREATE POLICY "Project members can create tasks" ON tasks
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM project_members WHERE project_id = tasks.project_id
    )
  );

-- Policy: Project members can update tasks
CREATE POLICY "Project members can update tasks" ON tasks
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM project_members WHERE project_id = tasks.project_id
    )
  );

-- Policy: Project owners can delete tasks
CREATE POLICY "Owners can delete tasks" ON tasks
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM project_members 
      WHERE project_id = tasks.project_id AND role = 'owner'
    )
  );
```

### Practice Sessions Table

```sql
-- Enable RLS on practice_sessions table
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Project members can view practice sessions
CREATE POLICY "Project members can view practice sessions" ON practice_sessions
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM project_members WHERE project_id = practice_sessions.project_id
    )
  );

-- Policy: Project members can create practice sessions
CREATE POLICY "Project members can create practice sessions" ON practice_sessions
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM project_members WHERE project_id = practice_sessions.project_id
    )
  );

-- Policy: Project members can update practice sessions
CREATE POLICY "Project members can update practice sessions" ON practice_sessions
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM project_members WHERE project_id = practice_sessions.project_id
    )
  );

-- Policy: Project owners can delete practice sessions
CREATE POLICY "Owners can delete practice sessions" ON practice_sessions
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM project_members 
      WHERE project_id = practice_sessions.project_id AND role = 'owner'
    )
  );
```

### Assets Table

```sql
-- Enable RLS on assets table
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- Policy: Project members can view assets
CREATE POLICY "Project members can view assets" ON assets
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM project_members WHERE project_id = assets.project_id
    )
  );

-- Policy: Project members can create assets
CREATE POLICY "Project members can create assets" ON assets
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM project_members WHERE project_id = assets.project_id
    )
  );

-- Policy: Project members can update assets
CREATE POLICY "Project members can update assets" ON assets
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM project_members WHERE project_id = assets.project_id
    )
  );

-- Policy: Project owners can delete assets
CREATE POLICY "Owners can delete assets" ON assets
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM project_members 
      WHERE project_id = assets.project_id AND role = 'owner'
    )
  );
```

## Storage Policy (Most Important)

```sql
-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Project members can access project storage" ON storage.objects;

-- Create a simple, non-recursive policy for project storage access
CREATE POLICY "Users can access their project files" ON storage.objects
FOR ALL USING (
  -- Authenticated users only
  auth.uid() IS NOT NULL
  AND
  -- Check if the path contains a project ID the user is a member of
  EXISTS (
    SELECT 1 
    FROM project_members 
    WHERE 
      project_members.user_id = auth.uid()
      AND 
      -- Check if the file path (e.g., 'project-123/file.mp3') contains the project id
      -- Use simple position() function to avoid recursion
      position('project-' || project_members.project_id::text in objects.name) > 0
  )
);
```

## Post Setup Tasks

1. After creating all tables, create a trigger to automatically add project creators as project owners:

```sql
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
```

2. Update the database types by running:
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts
```

## Implementation Steps

1. Create the Project in Supabase Dashboard
2. Run the SQL scripts for table creation
3. Set up storage buckets
4. Set up RLS policies for tables
5. Set up storage policies
6. Update the database type definitions
7. Test all access patterns
8. Check for any missing references in the codebase

## Special Notes on Storage Access

The key issue in your application was the storage policy for the `project_members` relation causing infinite recursion. The new policy uses a simple string pattern match with the `position()` function rather than calling recursive functions like `storage.path_segments()`.

The storage folder structure should follow the pattern:
- `project-{id}/file.extension`

For example:
- `project-123/audio.mp3`
- `project-456/score.pdf` 