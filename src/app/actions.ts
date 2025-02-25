// src/app/actions.ts
'use server';

import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('supabase-auth', token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    sameSite: 'lax',
  });
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('supabase-auth');
}

export async function serverLogin(email: string, password: string) {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  if (data.session) {
    await setAuthCookie(data.session.access_token);
    return { success: true };
  }

  return { success: false };
}

export async function serverLogout() {
  await removeAuthCookie();
  return { success: true };
}