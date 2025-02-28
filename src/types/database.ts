// Define all the database types here for TypeScript

// For JSON type fields
export type Json = Record<string, any>;

// Project table types
export interface Project {
  id: string;
  name: string;
  description?: string | null;
  status?: string | null;
  visibility?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  metadata?: Json | null;
}

// Project member types
export interface ProjectMember {
  id?: string;
  project_id: string;
  user_id: string;
  role: string;
  created_at?: string | null;
  updated_at?: string | null;
}

// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

// Task types
export interface Task {
  id: string;
  title: string;
  description: string;
  status: string | null;
  due_date: string | null;
  assigned_to: string | null;
  created_by: string;
  created_at: string;
  updated_at: string | null;
  project_id: string;
  assignee_name?: string;
}

// Team member (combined user and project_member)
export interface TeamMember {
  user_id: string;
  role: string;
  name?: string;
  email?: string;
  avatar_url?: string;
  created_at?: string;
  project_id: string;
}

// Asset/File types
export interface Asset {
  id: string;
  name: string;
  type: string;
  size: number | null;
  storage_path: string | null;
  project_id: string | null;
  created_at: string | null;
  department: string;
  metadata?: Json;
}

// Practice session types
export interface PracticeSession {
  id: string;
  project_id: string;
  user_id: string;
  duration: number;
  notes: string | null;
  created_at: string | null;
  session_date: string;
}

// Folder types
export interface Folder {
  id: string;
  name: string;
  project_id: string | null;
  parent_id: string | null;
  created_at: string | null;
  path: string;
}

// Export a database type that includes all tables
export interface Database {
  projects: Project;
  project_members: ProjectMember;
  users: User;
  tasks: Task;
  assets: Asset;
  practice_sessions: PracticeSession;
  folders: Folder;
} 