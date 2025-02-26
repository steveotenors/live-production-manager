'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Clean up the navbar by removing any unnecessary elements
export function Navbar() {
  // Just render a minimal navbar without Projects text or Logout button
  return (
    <header className="hidden">
      {/* Hide this entire component since we now use MainLayout */}
    </header>
  );
}