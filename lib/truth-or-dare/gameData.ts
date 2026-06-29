// ─── Types ────────────────────────────────────────────────────────────────
export type TruthDareScreen = 'setup' | 'roulette' | 'choice' | 'gameplay';
export type CardChoice = 'truth' | 'dare';

export interface GameConfig {
  playerCount: number;
  playerNames: string[];
  truths: string[];
  dares: string[];
  punishments: string[];
}

// ─── Default TRUTH questions (Indonesian) ────────────────────────────────
export const DEFAULT_TRUTHS: string[] = [
  'Siapa orang terakhir yang kamu stalk di media sosial?',
  'Kapan terakhir kali kamu menangis dan apa alasannya?',
  'Jujur, siapa orang di ruangan ini yang menurutmu punya penampilan paling menarik?',
  'Apa kebohongan terbesar yang pernah kamu katakan pada orang tuamu dan belum ketahuan sampai sekarang?',
  'Pernahkah kamu menyukai pacar atau mantan pacar temanmu sendiri?',
  'Apa hal paling memalukan yang pernah terjadi padamu di depan umum?',
  'Siapa satu orang yang paling sering kamu chat akhir-akhir ini di WhatsApp?',
  'Apa satu rahasia konyol yang belum pernah kamu ceritakan ke siapa pun di tongkrongan ini?',
  'Pernahkah kamu pura-pura sakit untuk menghindari acara atau menghindari seseorang?',
  'Apa ketakutan atau fobia paling aneh yang kamu miliki?',
  'Kalau kamu harus bertukar hidup dengan satu orang di ruangan ini selama sehari, kamu pilih siapa dan kenapa?',
  'Apa barang paling bodoh atau sia-sia yang pernah kamu beli dengan harga mahal?',
  'Pernahkah kamu diam-diam membaca chat di HP orang lain tanpa izin?',
  'Siapa orang dari masa lalumu yang paling tidak ingin kamu temui saat ini?',
  'Apa kebiasaan paling jorok atau aneh yang sering kamu lakukan saat sedang sendirian di kamar?',
  'Pernahkah kamu membolos sekolah/kuliah/kerja dengan alasan yang sangat mengada-ada?',
  'Apa pesan teks (chat) paling memalukan yang pernah kamu salah kirim ke orang lain?',
  'Menurutmu, siapa di antara kita semua yang paling mungkin cepat kaya, dan siapa yang paling boros?',
  'Apa satu kejadian di masa lalu yang sangat ingin kamu ubah kalau kamu punya mesin waktu?',
  'Pernahkah kamu memakai barang (seperti sikat gigi atau handuk) milik orang lain diam-diam?',
  'Sebutkan inisial nama orang yang diam-diam sedang kamu taksir sekarang.',
  'Apa aplikasi di HP-mu yang paling sering kamu gunakan tapi malu kalau orang lain tahu?',
  'Pernahkah kamu mengarang cerita dramatis yang bohong hanya untuk mendapat perhatian?',
  'Berapa rekor terlama kamu tidak mandi?',
  'Apa penilaian (First Impression) pertamamu terhadap orang yang duduk di sebelah kananmu?',
];

// ─── Default DARE challenges (Indonesian) ────────────────────────────────
export const DEFAULT_DARES: string[] = [
  'Berikan HP-mu, dan biarkan pemain lain mengirim satu chat random ke kontak acak di HP-mu.',
  'Masukkan satu buah es batu ke dalam bajumu dan biarkan di sana sampai mencair.',
  'Telepon mantanmu atau gebetanmu sekarang, lalu langsung tutup saat diangkat.',
  'Bicaralah dengan aksen atau gaya bahasa aneh (misal: gaya sinetron lebay atau pantun) selama 3 putaran ke depan.',
  'Berdiri dan lakukan joget TikTok atau tarian konyol selama 1 menit penuh tanpa henti.',
  'Berikan HP-mu ke pemain lain dan biarkan mereka membacakan riwayat pencarian (search history) teratas di browsermu.',
  'Makan satu sendok saus sambal, kecap manis, atau perasan jeruk nipis murni.',
  'Nyanyikan lagu favoritmu dengan suara paling sumbang dan keras yang kamu bisa.',
  'Biarkan seseorang di ruangan ini merias wajahmu (atau mencoretnya dengan bedak/lipstik) dengan mata tertutup.',
  'Buat Instagram Story/WhatsApp Status dengan pose paling absurd sekarang juga dan jangan dihapus selama 1 jam.',
  'Lakukan plank sambil menceritakan sebuah lelucon sampai ada pemain yang tertawa.',
  'Bertingkahlah seperti hewan peliharaan (kucing atau anjing) dan menggonggong/mengeong setiap kali mau bicara selama 2 putaran.',
  'Gigit irisan lemon atau jeruk nipis dan tahan ekspresi wajahmu agar tidak terlihat asam.',
  'Lakukan lip-sync lagu romantis yang diputar di HP dengan penuh penghayatan sambil menatap mata pemain di sebelah kirimu.',
  'Biarkan pemain lain mengganti wallpaper HP-mu dengan foto apa saja dari galeri, dan biarkan selama 24 jam.',
  'Tunjukkan foto masa kecil atau foto paling memalukan yang ada di galeri HP-mu.',
  'Bicaralah tanpa membuka gigi (mingkem) sampai giliranmu berikutnya tiba.',
  'Lakukan 15 kali squat jump sambil meneriakkan namamu sendiri.',
  'Baca pesan terakhir yang kamu kirim kepada ibumu/keluargamu dengan suara keras dan nada teater.',
  'Berikan pujian kepada setiap orang di ruangan ini dengan kata-kata yang sangat lebay dan puitis.',
  'Masukkan tanganmu ke dalam kaos kaki layaknya boneka, dan gunakan tangan itu saat bicara selama 3 putaran.',
  'Cobalah untuk menjilat sikutmu sendiri selama 30 detik (biarkan orang menertawakan upayamu).',
  'Biarkan pemain lain memberikan komentar secara acak di postingan Instagram orang pertama yang muncul di feed-mu.',
  'Pakai jaket atau kemejamu secara terbalik (depan ke belakang) sampai giliranmu tiba lagi.',
  'Berdiri di depan cermin, tatap dirimu sendiri, dan berikan pidato motivasi yang sangat dramatis selama 1 menit.',
];

// ─── Default PUNISHMENTS (Indonesian) ────────────────────────────────────
export const DEFAULT_PUNISHMENTS: string[] = [
  'Minum segelas penuh air putih dalam sekali teguk tanpa henti.',
  'Muka dicoret menggunakan lipstik, spidol whiteboard, atau bedak bayi oleh pemain lain.',
  'Lakukan 20 kali push-up atau sit-up sekarang juga.',
  'Kamu harus menraktir cemilan atau minuman untuk seluruh pemain di pertemuan berikutnya.',
  'Pakai pakaianmu (baju luar atau jaket) secara terbalik (luar ke dalam) hingga akhir permainan.',
  'Berdiri menghadap dinding di sudut ruangan selama 1 putaran penuh, jangan menoleh!',
  'Posting foto selfie dengan wajah paling jelek di WhatsApp Status dengan caption "Aku cakep banget".',
  'Biarkan dahimu ditempel kertas/stiker berisi tulisan memalukan (misal: "Saya Beban") sampai akhir game.',
  'Tambahkan kata "Meow" atau "Guk" di setiap akhir kalimatmu selama sisa permainan.',
  'Minum "Ramuan Penyihir" (campuran air putih, sedikit kecap, dan sedikit garam) satu teguk saja.',
  'Lakukan gerakan skipping (lompat tali) tanpa tali sebanyak 50 kali.',
  'Jadilah tukang pijat: Beri pijatan pundak ke pemain yang ada di sebelah kirimu selama 2 menit.',
  'Berjalanlah jongkok (seperti bebek) mengelilingi pemain lain sebanyak 2 kali putaran.',
  'Jangan sentuh HP-mu sama sekali (taruh HP di tengah meja) sampai game benar-benar selesai.',
  'Nyanyikan lagu anak-anak (misal: Balonku) tapi semua huruf vokalnya diganti huruf "O" atau "I".',
  'Pegang telingamu menyilang dengan tangan, lalu lakukan squat sebanyak 15 kali.',
  'Tahan napas dan jangan berkedip selama pemain lain menghitung mundur dari angka 20.',
  'Peluk tiang atau benda mati di ruangan ini dan ucapkan kata-kata rayuan manis selama 1 menit.',
  'Unggah foto selfie ke Instagram Story menggunakan filter wajah yang paling aneh/distorsi.',
  'Buatkan atau ambilkan minuman untuk semua pemain yang meminta.',
  'Ucapkan abjad dari Z sampai A secepat mungkin. Kalau salah, ulang dari awal!',
  'Jadilah "pelayan" bagi pemain yang mengumpulkan poin Truth/Dare terbanyak selama 15 menit ke depan.',
  'Pakai kacamata hitam di dalam ruangan (walau malam hari) sampai permainan selesai.',
  'Tepuk jidatmu sendiri secara perlahan setiap kali ada pemain lain yang sedang tertawa.',
  'Ikat rambutmu dengan gaya konyol (seperti antena) atau pakai topi/helm di dalam ruangan sampai game usai.',
];


// ─── Shuffler ──────────────────────────────────────────────────────────────
export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function pickRandomExcluding<T>(arr: T[], exclude: T): T {
  const filtered = arr.filter(x => x !== exclude);
  return filtered.length > 0 ? pickRandom(filtered) : arr[0];
}
