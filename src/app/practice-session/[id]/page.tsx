'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PracticeSessionPlayer } from '@/components/PracticeSessionPlayer';
import { supabase } from '@/utils/supabase';

interface PracticeSession {
  id: string;
  name: string;
  project_id: string | null;  // Updated to allow null
  created_at: string;
  updated_at: string;
}

export default function PracticeSessionPage() {
  const params = useParams();
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      if (!params.id || typeof params.id !== 'string') return;  // Type guard for params.id
      
      try {
        const { data, error } = await supabase
          .from('practice_sessions')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setSession(data as PracticeSession);  // Type assertion
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