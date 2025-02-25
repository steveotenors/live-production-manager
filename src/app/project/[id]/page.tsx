'use client';

import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import type { Database } from '@/types/database.types';

type Project = Database['public']['Tables']['projects']['Row'];

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error } = await supabaseClient
          .from('projects')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setProject(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching project:', error.message);
        } else {
          console.error('Unknown error:', error);
        }
      }
    };

    fetchProject();
  }, [params.id]);

  if (!project) return <div>Loading...</div>;

  return (
    <div>
      <h1>{project.name}</h1>
    </div>
  );
}