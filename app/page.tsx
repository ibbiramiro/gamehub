import Header from '@/components/Header';
import GreetingSection from '@/components/GreetingSection';
import GameList from '@/components/GameList';
import BottomNav from '@/components/BottomNav';
import type { Game } from '@/types/game';

/* ─── Mock fallback data (shown when Supabase is not configured) ── */
const FALLBACK_GAMES: Game[] = [
  {
    id:           '1',
    title:        'Truth or Dare',
    description:  'Bongkar rahasia atau lakukan tantangan gila!',
    icon_name:    'bottle',
    border_color: 'border-pink-300',
    slug:         'truth-or-dare',
  },
  {
    id:           '2',
    title:        'This or That',
    description:  'Pilih satu yang paling kamu banget.',
    icon_name:    'arrows',
    border_color: 'border-cyan-400',
    slug:         'this-or-that',
  },

  {
    id:           '4',
    title:        'Fakeit',
    description:  'Temukan imposter sebelum mereka menipumu!',
    icon_name:    'users',
    border_color: 'border-pink-500',
    slug:         'fakeit',
  },
  {
    id:           '5',
    title:        'Tebak Kata',
    description:  'Taruh HP di jidat, tebak sampai dapat! Waktunya bikin heboh tongkrongan.',
    icon_name:    'phone',
    border_color: 'border-lime-400',
    slug:         'tebak-kata',
  },
];

/* ─── Fetch (Server-side) ────────────────────────────────────────── */
async function fetchGames(): Promise<Game[]> {
  // Use static list since there is no 'games' table in Supabase
  return FALLBACK_GAMES;
}

/* ─── Page ──────────────────────────────────────────────────── */
export default async function HomePage() {
  const games = await fetchGames();

  return (
    /* Outer wrapper – centres the mobile column */
    <div className="relative min-h-screen bg-[#151515]">
      <div className="max-w-md mx-auto flex flex-col min-h-screen">

        {/* A. Sticky Header */}
        <Header />

        {/* Scrollable main content */}
        <main className="flex-1 overflow-y-auto pb-24">
          {/* B. Greeting */}
          <GreetingSection />

          {/* C. Game List */}
          <GameList games={games} />
        </main>
      </div>
    </div>
  );
}
