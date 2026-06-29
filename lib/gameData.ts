import type { Category } from './gameTypes';

export const CATEGORIES: Category[] = [
  {
    id: 'buah',
    name: 'BUAH',
    iconName: 'Apple', // Use closest lucide icon if available or just generic
    color: '#ef4444', // border-red-500
    glowColor: 'rgba(239, 68, 68, 0.45)',
    words: [
      'Apel', 'Pisang', 'Semangka', 'Jeruk', 'Mangga', 'Anggur', 'Durian', 'Nanas', 'Pepaya', 'Stroberi'
    ],
  },
  {
    id: 'warna',
    name: 'WARNA',
    iconName: 'Palette',
    color: '#facc15', // border-yellow-400
    glowColor: 'rgba(250, 204, 21, 0.45)',
    words: [
      'Merah', 'Biru', 'Hijau', 'Kuning', 'Hitam', 'Putih', 'Ungu', 'Merah Muda', 'Cokelat', 'Abu-abu'
    ],
  },
  {
    id: 'sayur',
    name: 'SAYUR',
    iconName: 'Carrot',
    color: '#22c55e', // border-green-500
    glowColor: 'rgba(34, 197, 94, 0.45)',
    words: [
      'Bayam', 'Kangkung', 'Wortel', 'Brokoli', 'Tomat', 'Terong', 'Kubis', 'Kacang Panjang', 'Sawi', 'Kentang'
    ],
  },
  {
    id: 'alat-sekolah',
    name: 'ALAT SEKOLAH',
    iconName: 'Pencil',
    color: '#60a5fa', // border-blue-400
    glowColor: 'rgba(96, 165, 250, 0.45)',
    words: [
      'Pensil', 'Penghapus', 'Penggaris', 'Buku Tulis', 'Ransel', 'Papan Tulis', 'Spidol', 'Rautan', 'Tempat Pensil', 'Pulpen'
    ],
  },
  {
    id: 'hewan',
    name: 'HEWAN',
    iconName: 'PawPrint',
    color: '#f97316', // border-orange-500
    glowColor: 'rgba(249, 115, 22, 0.45)',
    words: [
      'Kucing', 'Anjing', 'Gajah', 'Harimau', 'Kelinci', 'Burung', 'Ikan', 'Kuda', 'Jerapah', 'Monyet'
    ],
  },
  {
    id: 'elektronik',
    name: 'ELEKTRONIK',
    iconName: 'Tv',
    color: '#22d3ee', // border-cyan-400
    glowColor: 'rgba(34, 211, 238, 0.45)',
    words: [
      'Televisi', 'Kulkas', 'Kipas Angin', 'Mesin Cuci', 'Setrika', 'Laptop', 'Handphone', 'Rice Cooker', 'Blender', 'AC'
    ],
  },
  {
    id: 'rumah',
    name: 'RUMAH',
    iconName: 'Home',
    color: '#ec4899', // border-pink-500
    glowColor: 'rgba(236, 72, 153, 0.45)',
    words: [
      'Meja', 'Kursi', 'Kasur', 'Lemari', 'Pintu', 'Jendela', 'Bantal', 'Sapu', 'Piring', 'Gelas'
    ],
  },
];

/** Shuffle an array using Fisher-Yates */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
