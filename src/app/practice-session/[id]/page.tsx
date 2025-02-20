'use client';

import { useEffect, useState } from 'react';
import { PracticeSessionPlayer } from '@/components/PracticeSessionPlayer';
import { supabase } from '@/utils/supabase';

interface PracticeSession {
  id: string;
  name: string;
  project_id: string;
}

export default function PracticeSessionPage({ params }: { params: { id: string } }) {
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      try {
        const { data, error } = await supabase
          .from('practice_sessions')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setSession(data);
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSession();
  }, [params.id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Session not found</div>;
  }

  return <PracticeSessionPlayer sessionId={session.id} sessionName={session.name} />;
}