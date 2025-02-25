'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { serverLogout } from '@/app/actions';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await serverLogout();
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleLogout}
      className="flex items-center gap-2"
    >
      <LogOut className="h-4 w-4" />
      <span>Log Out</span>
    </Button>
  );
}