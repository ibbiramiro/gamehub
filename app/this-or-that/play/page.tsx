import PlayerVoteScreen from '@/components/this-or-that/PlayerVoteScreen';

/**
 * Player voting interface — the page reached by scanning the QR code.
 * In a real multiplayer setup, question data would come from a
 * real-time subscription (e.g. Supabase Realtime / Pusher).
 * For this demo, a default question pair is shown.
 */
export default function PlayerPage() {
  return (
    <PlayerVoteScreen
      option1="PANTAI CHILL"
      option2="CLUBBING SERU"
    />
  );
}
