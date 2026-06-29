// ─── Types ────────────────────────────────────────────────────────
export interface QuestionPair {
  id: string;
  option1: string;   // THIS – Cyan
  option2: string;   // THAT – Orange
  desc1: string;
  desc2: string;
}

export interface Player {
  id: string;
  name: string;
  voted: boolean;
  vote: 1 | 2 | null;   // 1 = THIS, 2 = THAT
}

export type HostScreen = 'setup' | 'lobby' | 'gameplay';

// ─── Default question pairs ────────────────────────────────────────
export const DEFAULT_PAIRS: QuestionPair[] = [
  { id: '1',  option1: 'PANTAI CHILL',   option2: 'CLUBBING SERU',   desc1: 'Senja, ketenangan, dan angin sepoi-sepoi.', desc2: 'Goyang semalaman, energi tak terbatas, musik EDM.' },
  { id: '2',  option1: 'KOPI',           option2: 'TEH',             desc1: 'Energi pagi yang kuat, bitter n bold.', desc2: 'Tenang, hangat, dan menenangkan jiwa.' },
  { id: '3',  option1: 'GUNUNG',         option2: 'PANTAI',          desc1: 'Udara segar, pendakian, dan alam hijau.', desc2: 'Ombak, pasir putih, dan snorkeling seru.' },
  { id: '4',  option1: 'INTROVERT',      option2: 'EXTROVERT',       desc1: 'Senang sendiri, baca buku, me-time.', desc2: 'Suka keramaian, teman banyak, selalu happy.' },
  { id: '5',  option1: 'NETFLIX',        option2: 'BIOSKOP',         desc1: 'Rebahan, piyama, snack unlimited.', desc2: 'Layar besar, popcorn, vibes sinema.' },
  { id: '6',  option1: 'MASAK SENDIRI',  option2: 'DELIVERY MANIA',  desc1: 'Hemat, sehat, puas masak sendiri.', desc2: 'Praktis, banyak pilihan, tinggal klik.' },
  { id: '7',  option1: 'PAGI BANGET',    option2: 'BEGADANG TERUS',  desc1: 'Sunrise, produktif, early bird vibes.', desc2: 'Malam sunyi, kreatif, night owl forever.' },
  { id: '8',  option1: 'KUCING',         option2: 'ANJING',          desc1: 'Manja, independen, aesthetic banget.', desc2: 'Setia, playful, always happy to see you.' },
  { id: '9',  option1: 'PIZZA',          option2: 'MIE AYAM',        desc1: 'Keju meleleh, topping melimpah, Italia vibes.', desc2: 'Kaldu gurih, bakso, comfort food sejati.' },
  { id: '10', option1: 'TRAVELING',      option2: 'STAYCATION',      desc1: 'Explore dunia, culture baru, petualangan.', desc2: 'Hotel mewah, kolam renang, relax total.' },
];

// ─── Random pair bank for dice-roll ───────────────────────────────
export const PAIR_BANK: Array<[string, string]> = [
  ['STARTUP FOUNDER', 'KERJA KANTORAN'],
  ['SOLO TRIP', 'BARENG BESTIE'],
  ['GYM RAT', 'REBAHAN KING'],
  ['ANDROID', 'iPhone'],
  ['NASI PUTIH', 'NASI GORENG'],
  ['BELI BAJU BARU', 'NABUNG DULU'],
  ['HORROR MOVIE', 'ROM-COM'],
  ['MANDI PAGI', 'MANDI MALAM'],
  ['MAIN HP', 'MAIN DI LUAR'],
  ['PAKAI JALUR CEPAT', 'ANTRI SABAR'],
  ['SKINCARE RAJIN', 'CUCI MUKA DOANG'],
  ['JALUR KERETA', 'MACET NAIK MOBIL'],
  ['BOBA PREMIUM', 'ES TEH PINGGIR JALAN'],
  ['NYANYI SENDIRI', 'KARAOKE BARENG'],
  ['MINIMALIS', 'MAXIMALIS'],
];

// ─── Demo player names for lobby simulation ────────────────────────
export const DEMO_PLAYER_NAMES = ['Andi', 'Budi', 'Cici', 'Dodo', 'Eva', 'Fani', 'Gita', 'Hendra'];
