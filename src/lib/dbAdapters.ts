// src/lib/dbAdapters.ts
import { Database } from '@/types/database.types';

// Convert database practice session to component model
export function adaptPracticeSession(dbSession: Database['public']['Tables']['practice_sessions']['Row']) {
  // Extract tempo from notes if possible
  let tempo = 120;
  if (dbSession.notes) {
    const tempoMatch = dbSession.notes.match(/tempo:\s*(\d+)/i);
    if (tempoMatch && tempoMatch[1]) {
      tempo = parseInt(tempoMatch[1]);
    }
  }

  // Build a metadata object that components expect
  const metadata = {
    tempo,
    notes: dbSession.notes || '',
    difficulty: 'medium'
  };

  return {
    ...dbSession,
    metadata
  };
}

// Safely access JSON metadata from projects
export function getProjectMetadata(project: Database['public']['Tables']['projects']['Row']) {
  if (!project.metadata) return {};
  
  try {
    return typeof project.metadata === 'object' ? project.metadata : {};
  } catch (e) {
    console.error('Error parsing project metadata:', e);
    return {};
  }
}