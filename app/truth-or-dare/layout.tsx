import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Truth or Dare – Game Hub',
  description: 'Game Truth or Dare seru bersama teman! Pilih TRUTH untuk menjawab jujur, atau DARE untuk tantangan gila.',
};

export default function TruthOrDareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
