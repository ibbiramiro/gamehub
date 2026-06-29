import GameCard from './GameCard';
import type { Game } from '@/types/game';

interface GameListProps {
  games: Game[];
}

export default function GameList({ games }: GameListProps) {
  if (games.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-gray-500">
        <p className="text-lg">Belum ada game tersedia 😔</p>
        <p className="text-sm mt-1">Cek lagi nanti ya!</p>
      </div>
    );
  }

  return (
    <section
      className="flex flex-col gap-4 px-4 pb-4"
      aria-label="Daftar Game"
    >
      {games.map((game, index) => (
        <GameCard key={game.id} game={game} index={index} />
      ))}
    </section>
  );
}
