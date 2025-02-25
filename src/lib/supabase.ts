import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database.types';

export const getServerSupabaseClient = async () => {
  const cookieStore = await cookies(); // Resolve the promise
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.set({ name, value: '', ...options, maxAge: 0 });
        },
      },
    }
  );
};

export const getServerUser = async () => {
  const supabase = await getServerSupabaseClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  const role = user.user_metadata?.role || user.app_metadata?.role || user.role;
  const allowedRoles = ['musical_director'];
  if (!role || !allowedRoles.includes(role)) {
    throw new Error('User not authorized');
  }

  return { user, role };
};