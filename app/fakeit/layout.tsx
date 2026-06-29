import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fakeit – Game Hub',
  description: 'Temukan imposter di antara kalian atau menipulah sampai akhir!',
};

export default function FakeitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
