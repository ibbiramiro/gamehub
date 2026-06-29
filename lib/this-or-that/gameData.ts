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

export type HostScreen = 'setup' | 'lobby' | 'gameplay' | 'finish';

// ─── Default question pairs ────────────────────────────────────────
export const DEFAULT_PAIRS: QuestionPair[] = [
  { id: '1',  option1: 'PANTAI', option2: 'GUNUNG', desc1: 'Liburan Santai di Pantai', desc2: 'Liburan Petualangan di Gunung' },
  { id: '2',  option1: 'KOPI PAHIT', option2: 'TEH BOBA', desc1: 'Kopi Hitam Pahit', desc2: 'Teh Susu Manis (Boba)' },
  { id: '3',  option1: 'BACA PIKIRAN', option2: 'TEMBUS PANDANG', desc1: 'Kekuatan Membaca Pikiran', desc2: 'Kekuatan Tembus Pandang' },
  { id: '4',  option1: 'KAYA KESEPIAN', option2: 'PAS-PASAN BANYAK SAHABAT', desc1: 'Jadi Orang Terkaya tapi Kesepian', desc2: 'Gaji Pas-pasan tapi Dikelilingi Sahabat' },
  { id: '5',  option1: 'UBAH MASA LALU', option2: 'LIHAT MASA DEPAN', desc1: 'Bisa mengubah sejarah', desc2: 'Bisa melihat apa yang terjadi di masa depan' },
  { id: '6',  option1: 'BIOSKOP', option2: 'NETFLIX', desc1: 'Nonton Film di Bioskop', desc2: 'Maraton Series di Kasur (Netflix)' },
  { id: '7',  option1: 'SUPER PEDAS', option2: 'SUPER MANIS', desc1: 'Makanan Super Pedas', desc2: 'Makanan Super Manis' },
  { id: '8',  option1: 'TEMAN KECIL', option2: 'ORANG BARU', desc1: 'Pacaran dengan Teman Masa Kecil', desc2: 'Pacaran dengan Orang Baru Dikenal' },
  { id: '9',  option1: 'KANTORAN', option2: 'FREELANCE', desc1: 'Gaji Tetap, Jam Pasti', desc2: 'Gaji Tidak Tetap, Waktu Bebas' },
  { id: '10', option1: 'TAHU KAPAN MATI', option2: 'TAHU CARA MATI', desc1: 'Tahu Kapan Kamu Akan Mati', desc2: 'Tahu Bagaimana Kamu Akan Mati' },
  { id: '11', option1: 'TANPA HP SETAHUN', option2: 'TANPA MAKAN ENAK', desc1: 'Tidak Bisa Menggunakan Smartphone Selama Setahun', desc2: 'Tidak Bisa Makan Makanan Enak Selama Setahun' },
  { id: '12', option1: 'TELAT 10 MENIT', option2: 'KECEPATAN 1 JAM', desc1: 'Selalu Terlambat 10 Menit', desc2: 'Selalu Datang 1 Jam Lebih Cepat' },
  { id: '13', option1: 'TANPA MUSIK', option2: 'TANPA FILM', desc1: 'Hidup Tanpa Musik', desc2: 'Hidup Tanpa Film/Video' },
  { id: '14', option1: 'JAGO OLAHRAGA', option2: 'JAGO BAHASA', desc1: 'Jago Semua Jenis Olahraga', desc2: 'Menguasai Semua Bahasa di Dunia' },
  { id: '15', option1: 'PANAS TERIK', option2: 'HUJAN DERAS', desc1: 'Cuaca Selalu Panas Terik', desc2: 'Cuaca Selalu Hujan Deras' },
  { id: '16', option1: 'TIDUR 8 JAM', option2: 'MAKAN ENAK BANYAK', desc1: 'Tidur Nyenyak 8 Jam Tiap Malam', desc2: 'Makan Enak Sepuasnya Tanpa Bisa Gemuk' },
  { id: '17', option1: 'DINNER ROMANTIS', option2: 'DUFAN SERU', desc1: 'Kencan Makan Malam Mewah', desc2: 'Kencan Main di Taman Bermain' },
  { id: '18', option1: 'HORROR', option2: 'ROMCOM', desc1: 'Jadi Karakter Utama di Film Horor', desc2: 'Jadi Karakter Utama di Film Komedi Romantis' },
  { id: '19', option1: 'BICARA HEWAN', option2: 'BICARA MESIN', desc1: 'Bisa Bicara dengan Hewan', desc2: 'Bisa Bicara dengan Mesin/Teknologi' },
  { id: '20', option1: 'JUJUR 100%', option2: 'BOHONG AMAN', desc1: 'Selalu Harus Mengatakan Kebenaran', desc2: 'Selalu Berbohong tapi Tidak Pernah Ketahuan' },
  { id: '21', option1: 'HILANG FOTO', option2: 'HILANG UANG', desc1: 'Kehilangan Semua Foto Kenanganmu', desc2: 'Kehilangan Semua Uang Tabunganmu Saat Ini' },
  { id: '22', option1: 'MANDI DINGIN', option2: 'MANDI PANAS', desc1: 'Mandi Air Dingin Seumur Hidup', desc2: 'Mandi Air Panas Seumur Hidup' },
  { id: '23', option1: 'MUSISI', option2: 'AKTOR', desc1: 'Jadi Musisi Terkenal', desc2: 'Jadi Aktor/Aktris Terkenal' },
  { id: '24', option1: 'DALAM RUANGAN', option2: 'LUAR RUANGAN', desc1: 'Bekerja di Dalam Ruangan Terus-Menerus', desc2: 'Bekerja di Luar Ruangan Terus-Menerus' },
  { id: '25', option1: 'PULAU TERPENCIL', option2: 'KOTA TANPA UANG', desc1: 'Bertahan Hidup di Pulau Terpencil Sendirian', desc2: 'Bertahan Hidup di Kota Besar Tanpa Uang Sepeserpun' },
];

// ─── Random pair bank for dice-roll ───────────────────────────────
export const PAIR_BANK: Array<[string, string]> = DEFAULT_PAIRS.map(p => [p.option1, p.option2]);

// ─── Demo player names for lobby simulation ────────────────────────
export const DEMO_PLAYER_NAMES = ['Andi', 'Budi', 'Cici', 'Dodo', 'Eva', 'Fani', 'Gita', 'Hendra'];
