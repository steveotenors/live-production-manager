import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Only allow POST requests for logout
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize Supabase client with server-side auth
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Sign out from Supabase
    await supabase.auth.signOut();

    // Clear cookies
    res.setHeader('Set-Cookie', [
      'sb-access-token=; Max-Age=0; Path=/; HttpOnly',
      'sb-refresh-token=; Max-Age=0; Path=/; HttpOnly',
    ]);

    // Return success
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout API error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
} 