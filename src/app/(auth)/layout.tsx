import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/supabase';
import React from 'react';
import { Navbar } from '@/components/Navbar';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  try {
    const { user, role } = await getServerUser();
    // User is authenticated and authorized (musical_director)
    return (
      <>
        <Navbar />
        {children}
      </>
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'User not authenticated') {
        redirect('/login');
      } else {
        // User not authorized
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
              <p className="mt-4 text-gray-600">You do not have permission to access this application.</p>
            </div>
          </div>
        );
      }
    } else {
      throw error; // Rethrow if not an Error instance
    }
  }
}