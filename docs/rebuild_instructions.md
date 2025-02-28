# Supabase Backend Rebuild Instructions

This guide will walk you through the process of rebuilding your Supabase backend for the Live Production Manager app, addressing the storage policy infinite recursion issue and setting up a clean database structure.

## Prerequisites

1. Access to your Supabase project dashboard
2. Admin privileges on your Supabase project
3. Backup of any important data (if applicable)

## Step 1: Backup Your Data (Optional but Recommended)

If you have existing data you want to preserve:

1. Go to the Supabase Dashboard > Project Settings > Database
2. Click on "Backups" and create a point-in-time backup

## Step 2: Execute the Setup Script

1. Go to the Supabase Dashboard > SQL Editor
2. Create a new query
3. Copy and paste the entire contents of the `supabase_setup.sql` file
4. Click "Run" to execute the script

This script will:
- Drop existing tables (providing a clean slate)
- Create all necessary tables with proper relationships
- Set up RLS (Row Level Security) policies for all tables
- Create a storage bucket named "production-files"
- Configure storage policies to prevent infinite recursion

## Step 3: Generate TypeScript Types (Optional)

To update your TypeScript types to match the new database schema:

```bash
npx supabase gen types typescript --project-id your-project-id --schema public > src/types/supabase.ts
```

Replace `your-project-id` with your actual Supabase project ID.

## Step 4: Update Storage Integration in Your App

Ensure your app follows these conventions when interacting with storage:

1. **File Structure**: Files should follow the pattern `project-{projectId}/filename.extension`
2. **Permissions**: Files will be accessible only to members of the associated project
3. **Delay**: Add a short delay between API requests to prevent too many concurrent requests

## Step 5: Test Your Application

1. Create a new project
2. Upload files to the project storage
3. Add a project member
4. Verify the project member can access the project's files
5. Verify non-members cannot access the project's files

## Important Notes

### Storage Structure

The storage policy is designed to work with files organized as:

```
production-files/
├── project-123/
│   ├── audio1.mp3
│   ├── audio2.wav
│   └── notes.pdf
├── project-456/
│   ├── track1.mp3
│   └── track2.mp3
```

### Storage Policy Explanation

The new storage policy avoids the infinite recursion issue by:

1. Using a direct `EXISTS` query instead of a recursive one
2. Using the `position()` function to check for project ID in the file path
3. Simplifying the permission check to just verify project membership

### Troubleshooting

If you encounter issues:

1. **Permission Errors**: Check the user's project membership role
2. **Storage Access Issues**: Verify file paths follow the `project-{id}/filename` pattern
3. **Database Errors**: Check the Supabase logs in the Dashboard > Logs

## Need Help?

If you encounter any issues with this rebuild process:

1. Check the Supabase documentation: https://supabase.io/docs
2. Review the SQL script for any errors
3. Consult the error logs in your Supabase dashboard 