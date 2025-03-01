import React from 'react';
import { Metadata } from 'next';
import { MusicDirectorDashboard } from '@/components/director';

export const metadata: Metadata = {
  title: 'Musical Director Tools | Live Production Manager',
  description: 'Premium tools for musical directors to manage cues, tempo, crew synchronization, and score annotations',
};

export default function DirectorPage() {
  return (
    <div className="container py-8 max-w-[1400px] mx-auto">
      <MusicDirectorDashboard />
    </div>
  );
} 