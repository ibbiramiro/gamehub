import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Game Hub – Pilih Game Kamu',
  description:
    'Game Hub adalah platform seru untuk memilih game bersama teman-teman. Truth or Dare, This or That, Test Chemistry, dan masih banyak lagi!',
  keywords: ['game', 'truth or dare', 'this or that', 'game hub', 'seru'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#151515',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="bg-[#151515] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
