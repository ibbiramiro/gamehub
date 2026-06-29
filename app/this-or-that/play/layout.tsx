import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Player – Electric Social | This or That',
  description: 'Bergabung ke game This or That! Scan QR dari host dan voting sekarang.',
};

export default function PlayerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
