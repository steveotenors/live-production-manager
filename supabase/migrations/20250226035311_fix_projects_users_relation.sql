-- This is a Supabase migration file that fixes the foreign key relationship
-- Create a new migration using: npm run db:migration:new

-- First verify the musical_director_id column exists in projects table
DO $$ 
BEGIN
    -- Check if musical_director_id column exists
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'projects' 
        AND column_name = 'musical_director_id'
    ) THEN
        -- Add the column if it doesn't exist
        ALTER TABLE projects 
        ADD COLUMN musical_director_id UUID REFERENCES auth.users(id);
    ELSE
        -- Remove any existing foreign key constraint that might be incorrectly set up
        -- This is a safe operation that will do nothing if the constraint doesn't exist
        ALTER TABLE projects 
        DROP CONSTRAINT IF EXISTS projects_musical_director_id_fkey;
        
        -- Add the correct foreign key constraint
        ALTER TABLE projects 
        ADD CONSTRAINT projects_musical_director_id_fkey 
        FOREIGN KEY (musical_director_id) 
        REFERENCES auth.users(id);
    END IF;
END $$;