import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const toggleTheme = () => {
  document.body.classList.toggle('dark');
};

export const metadata: Metadata = {
  title: "Live Production Manager",
  description: "Manage your live production projects and practice sessions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="dark">{`${geistSans.variable} ${geistMono.variable} antialiased`}&gt;
          {children}
          <button onClick={toggleTheme}>Toggle Theme</button>
      </body>
    </html>
  );
}