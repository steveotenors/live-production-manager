import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import Cookies from 'js-cookie';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const cookieStorage = {
  getItem: async (key: string) => Cookies.get(key) || null,
  setItem: async (key: string, value: string) => Cookies.set(key, value, { path: '/' }),
  removeItem: async (key: string) => Cookies.remove(key, { path: '/' }),
};

// Client-side Supabase client
export const supabaseClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);