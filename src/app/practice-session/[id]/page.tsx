'use client';

import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import type { Database } from '@/types/database.types';

type PracticeSession = Database['public']['Tables']['practice_sessions']['Row'];
type Asset = Database['public']['Tables']['assets']['Row'];

export default function PracticeSessionPage({ params }: { params: { id: string } }) {
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch practice session
        const { data: sessionData, error: sessionError } = await supabaseClient
          .from('practice_sessions')
          .select('*')
          .eq('id', params.id)
          .single();

        if (sessionError) throw sessionError;
        if (sessionData) setSession(sessionData);

        // Fetch related assets
        const { data: assetsData, error: assetsError } = await supabaseClient
          .from('assets')
          .select('*')
          .eq('project_id', sessionData?.project_id ?? '')
          .eq('department', sessionData?.department ?? '');

        if (assetsError) throw assetsError;
        if (assetsData) setAssets(assetsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (!session) return <div>Session not found</div>;

  return (
    <div>
      <h1>{session.name}</h1>
      <ul>
        {assets.map((asset) => (
          <li key={asset.id}>{asset.name}</li>
        ))}
      </ul>
    </div>
  );
}