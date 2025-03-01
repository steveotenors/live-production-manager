import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';
import ClientLayout from '@/components/ClientLayout';
import { DesignSystemProvider } from '@/lib/design-system';
import { DesignSelector } from '@/components/DesignSelector';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata = {
  title: 'Live Production Manager | Premium',
  description: 'Professional tool for managing live productions with Premium Obsidian theme',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`premium-obsidian-theme ${inter.variable} ${playfair.variable}`}>
      <body className={`${inter.className} bg-background text-foreground min-h-screen`}>
        <DesignSystemProvider defaultDesign="minimalist">
          <ClientLayout>{children}</ClientLayout>
          <DesignSelector />
        </DesignSystemProvider>
      </body>
    </html>
  );
} 