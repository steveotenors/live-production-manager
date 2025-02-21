import { Database } from '@/types/database.types';

export type DBFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  storage_path: string;
  created_at: string;
  url?: string;
};

export type Project = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type PracticeSession = {
  id: string;
  name: string;
  project_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Tables = Database['public']['Tables'];
export type Enums = Database['public']['Enums']; 