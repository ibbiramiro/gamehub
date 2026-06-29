// ─── Types ────────────────────────────────────────────────────────────────
export type FakeitScreen = 
  | 'home' 
  | 'addPlayers' 
  | 'settings' 
  | 'reveal' 
  | 'timer' 
  | 'voting' 
  | 'result';

export interface Player {
  id: string;
  name: string;
  role: 'normal' | 'imposter';
  avatarColor: string; // Used for the pre-reveal background
}

export interface FakeitItem {
  word: string;
  hint: string;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  iconUrl: string; // We'll use emojis for now as a stand-in for 3D icons, or string placeholders
  themeColor: string; // Tailwind color class for UI (from prompt)
  isLocked: boolean;
  items: FakeitItem[];
}

export interface GameConfig {
  category: Category;
  players: Player[];
  imposterCount: number;
  timeLimitMinutes: number;
  secretItem: FakeitItem;
}

export interface GameResult {
  imposterCaught: boolean;
  imposterNames: string[];
}

// ─── Constants & Data ───────────────────────────────────────────────────

export const AVATAR_COLORS = [
  '#F28C00', // Orange
  '#00D084', // Green
  '#FF4081', // Pink
  '#00BFFF', // Light Blue
  '#9C27B0', // Purple
  '#FFEB3B', // Yellow
  '#009688', // Teal
  '#FF5722', // Deep Orange
];

export const CATEGORIES: Category[] = [
  {
    id: 'makanan',
    title: 'Makanan',
    description: 'Makanan khas, camilan, dan hidangan populer.',
    iconUrl: '🍔',
    themeColor: 'bg-orange-500',
    isLocked: false,
    items: [
      { word: 'Nasi Goreng', hint: 'Makanan khas Indonesia' },
      { word: 'Pizza', hint: 'Makanan berbentuk bundar asal Eropa' },
      { word: 'Sushi', hint: 'Makanan Jepang' },
      { word: 'Bakso', hint: 'Berbentuk bulat dan berkuah' },
      { word: 'Burger', hint: 'Roti lapis daging' },
      { word: 'Rendang', hint: 'Olahan daging bersantan' },
      { word: 'Sate', hint: 'Daging yang ditusuk' },
      { word: 'Martabak', hint: 'Camilan malam hari' },
      { word: 'Donat', hint: 'Makanan manis berlubang' },
      { word: 'Mie Ayam', hint: 'Makanan berkuah dengan karbohidrat panjang' },
      { word: 'Gado-gado', hint: 'Makanan sehat berbumbu kacang' },
      { word: 'Fried Chicken', hint: 'Ayam berlapis tepung' },
      { word: 'Pempek', hint: 'Olahan ikan dari Sumatera' },
      { word: 'Kerupuk', hint: 'Pendamping makan yang renyah' },
      { word: 'Dimsum', hint: 'Makanan kukus porsi kecil' },
    ]
  },
  {
    id: 'minuman',
    title: 'Minuman',
    description: 'Dari kopi hingga jus buah yang menyegarkan.',
    iconUrl: '🧋',
    themeColor: 'bg-blue-500',
    isLocked: false,
    items: [
      { word: 'Kopi', hint: 'Minuman berkafein / pahit' },
      { word: 'Teh Manis', hint: 'Minuman santai di segala suasana' },
      { word: 'Susu', hint: 'Minuman kaya kalsium / putih' },
      { word: 'Jus Jeruk', hint: 'Minuman sari buah' },
      { word: 'Boba', hint: 'Minuman dengan isian kenyal' },
      { word: 'Sirup', hint: 'Minuman manis berwarna' },
      { word: 'Air Kelapa', hint: 'Minuman menyegarkan dari pohon' },
      { word: 'Soda', hint: 'Minuman berkarbonasi / bergas' },
      { word: 'Yogurt', hint: 'Minuman hasil fermentasi' },
      { word: 'Cendol', hint: 'Minuman tradisional bersantan' },
      { word: 'Bandrek', hint: 'Minuman hangat berbahan rempah' },
      { word: 'Es Teh Lemon', hint: 'Minuman dingin asam manis' },
      { word: 'Cokelat Panas', hint: 'Minuman hangat dan manis' },
      { word: 'Matcha', hint: 'Minuman teh hijau Jepang' },
      { word: 'Es Krim Shake', hint: 'Minuman kental dingin' },
    ]
  },
  {
    id: 'negara',
    title: 'Negara',
    description: 'Destinasi wisata, benua, dan negara populer dunia.',
    iconUrl: '🌎',
    themeColor: 'bg-green-600',
    isLocked: false,
    items: [
      { word: 'Indonesia', hint: 'Negara kepulauan di Asia' },
      { word: 'Jepang', hint: 'Negara dengan musim sakura' },
      { word: 'Amerika Serikat', hint: 'Negara adidaya / Barat' },
      { word: 'Inggris', hint: 'Negara bersistem kerajaan di Eropa' },
      { word: 'Korea Selatan', hint: 'Terkenal dengan industri hiburannya' },
      { word: 'Arab Saudi', hint: 'Negara gurun di Timur Tengah' },
      { word: 'Australia', hint: 'Negara sekaligus benua' },
      { word: 'Brasil', hint: 'Negara yang jago sepak bola' },
      { word: 'China', hint: 'Negara dengan populasi sangat besar' },
      { word: 'Prancis', hint: 'Negara romantis di Eropa' },
      { word: 'India', hint: 'Negara di Asia Selatan dengan budaya kental' },
      { word: 'Mesir', hint: 'Negara dengan bangunan kuno raksasa' },
      { word: 'Italia', hint: 'Negara asal banyak kuliner terkenal' },
      { word: 'Thailand', hint: 'Negara Asia Tenggara / Gajah' },
      { word: 'Rusia', hint: 'Negara dengan wilayah terluas' },
    ]
  },
  {
    id: 'hewan',
    title: 'Hewan',
    description: 'Darat, laut, dan udara.',
    iconUrl: '🐾',
    themeColor: 'bg-yellow-500',
    isLocked: false,
    items: [
      { word: 'Kucing', hint: 'Hewan peliharaan berbulu' },
      { word: 'Anjing', hint: 'Hewan penjaga yang setia' },
      { word: 'Gajah', hint: 'Hewan darat berukuran sangat besar' },
      { word: 'Harimau', hint: 'Kucing besar buas' },
      { word: 'Ular', hint: 'Reptil berbahaya' },
      { word: 'Monyet', hint: 'Hewan primata' },
      { word: 'Jerapah', hint: 'Hewan dengan leher sangat panjang' },
      { word: 'Buaya', hint: 'Reptil buas di perairan' },
      { word: 'Paus', hint: 'Hewan laut raksasa' },
      { word: 'Burung Hantu', hint: 'Hewan yang aktif di malam hari' },
      { word: 'Kelinci', hint: 'Hewan peliharaan pelompat' },
      { word: 'Sapi', hint: 'Hewan ternak penghasil susu' },
      { word: 'Kuda', hint: 'Hewan yang sering ditunggangi' },
      { word: 'Singa', hint: 'Predator buas raja hutan' },
      { word: 'Lumba-lumba', hint: 'Mamalia air yang cerdas' },
    ]
  },
  {
    id: 'kendaraan',
    title: 'Kendaraan',
    description: 'Alat transportasi darat, laut, dan udara.',
    iconUrl: '🚗',
    themeColor: 'bg-slate-500',
    isLocked: false,
    items: [
      { word: 'Mobil', hint: 'Kendaraan pribadi roda empat' },
      { word: 'Sepeda Motor', hint: 'Kendaraan bermesin roda dua' },
      { word: 'Pesawat Terbang', hint: 'Transportasi udara komersial' },
      { word: 'Kapal Laut', hint: 'Transportasi air ukuran besar' },
      { word: 'Kereta Api', hint: 'Kendaraan umum jalur khusus/rel' },
      { word: 'Sepeda', hint: 'Kendaraan yang harus dikayuh' },
      { word: 'Helikopter', hint: 'Kendaraan udara berbaling-baling' },
      { word: 'Bus', hint: 'Kendaraan angkutan darat besar' },
      { word: 'Truk', hint: 'Kendaraan angkut barang' },
      { word: 'Delman', hint: 'Kendaraan tradisional dengan hewan' },
      { word: 'Angkot', hint: 'Transportasi umum perkotaan kecil' },
      { word: 'Kapal Selam', hint: 'Bergerak di bawah permukaan air' },
      { word: 'Becak', hint: 'Kendaraan tradisional roda tiga' },
      { word: 'Traktor', hint: 'Kendaraan alat berat / pertanian' },
      { word: 'Skuter', hint: 'Kendaraan kecil santai roda dua' },
    ]
  },
  {
    id: 'alat-musik',
    title: 'Alat Musik',
    description: 'Petik, tiup, pukul, dan gesek.',
    iconUrl: '🎸',
    themeColor: 'bg-purple-500',
    isLocked: false,
    items: [
      { word: 'Gitar', hint: 'Alat musik berdawai yang dipetik' },
      { word: 'Piano', hint: 'Alat musik dengan tuts hitam putih' },
      { word: 'Drum', hint: 'Alat musik perkusi yang dipukul' },
      { word: 'Biola', hint: 'Alat musik gesek' },
      { word: 'Suling', hint: 'Alat musik tiup tradisional' },
      { word: 'Terompet', hint: 'Alat musik tiup dari logam' },
      { word: 'Bass', hint: 'Alat musik petik bernada rendah' },
      { word: 'Angklung', hint: 'Alat musik dari bambu yang digoyang' },
      { word: 'Harmonika', hint: 'Alat musik tiup berukuran kecil' },
      { word: 'Keyboard', hint: 'Alat musik tuts elektronik' },
      { word: 'Gendang', hint: 'Alat musik pukul tradisional' },
      { word: 'Harpa', hint: 'Alat musik petik berukuran besar' },
      { word: 'Saxophone', hint: 'Alat musik tiup khas musik Jazz' },
      { word: 'Ukulele', hint: 'Alat musik petik mirip gitar tapi kecil' },
      { word: 'Tamborin', hint: 'Alat musik genggam yang digoyang/pukul' },
    ]
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────

export function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate the randomized roles for the game
export function generateRoles(players: Player[], imposterCount: number): Player[] {
  const roles: ('imposter' | 'normal')[] = Array(players.length).fill('normal');
  for (let i = 0; i < imposterCount; i++) {
    roles[i] = 'imposter';
  }
  
  const shuffledRoles = shuffleArray(roles);
  
  return players.map((p, index) => ({
    ...p,
    role: shuffledRoles[index]
  }));
}
