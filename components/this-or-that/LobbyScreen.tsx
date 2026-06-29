'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';
import QRCode from 'react-qr-code';
import { ElectricHeader } from './SetupScreen';
import type { Player } from '@/lib/this-or-that/gameData';
import { supabase } from '@/lib/supabase';

interface LobbyScreenProps {
  onStartVoting: (players: Player[]) => void;
  sessionId: string;
}

/* ─── Component ─────────────────────────────────────────────────── */
export default function LobbyScreen({ onStartVoting, sessionId }: LobbyScreenProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [joinUrl, setJoinUrl] = useState<string>('');

  // 1. Setup join URL (use window.location.host for local IP)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.protocol}//${window.location.host}/this-or-that/play/${sessionId}`;
      setJoinUrl(url);
    }
  }, [sessionId]);

  // 2. Subscribe to real-time player joins
  useEffect(() => {
    // Fetch existing players just in case
    const fetchPlayers = async () => {
      const { data } = await supabase
        .from('tot_players')
        .select('*')
        .eq('session_id', sessionId);
        
      if (data) {
        const existing: Player[] = data.map(p => ({
          id: p.id,
          name: p.name,
          voted: false,
          vote: null
        }));
        setPlayers(existing);
      }
    };
    fetchPlayers();

    // Subscribe to new players
    const channel = supabase.channel(`tot_players_${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'tot_players', filter: `session_id=eq.${sessionId}` },
        (payload) => {
          setPlayers((prev) => [
            ...prev,
            { id: payload.new.id, name: payload.new.name, voted: false, vote: null }
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const connected = players.length;
  const canStart  = connected > 0;

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white">
      <ElectricHeader />

      <main className="flex-1 overflow-y-auto pb-28 px-4 pt-6 flex flex-col items-center space-y-6">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight leading-tight">
            Scan Untuk<br />Bergabung
          </h2>
          <p className="text-gray-400 text-sm mt-2 font-medium">
            Tunjukkan QR code ini ke semua pemain
          </p>
        </div>

        {/* Real QR Code */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="relative rounded-2xl overflow-hidden border-2 border-[#C0F300]
                     shadow-[0_0_30px_rgba(192,243,0,0.45)] bg-white p-4"
          style={{ width: 220, height: 220 }}
        >
          {joinUrl ? (
            <QRCode value={joinUrl} size={184} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-black">Memuat...</div>
          )}
        </motion.div>

        {/* Join link text */}
        <div className="text-center">
          <p className="text-gray-500 text-xs">atau buka:</p>
          <p className="text-[#C0F300] font-bold text-sm mt-0.5"
             style={{ textShadow: '0 0 10px rgba(192,243,0,0.5)', wordBreak: 'break-all' }}>
            {joinUrl.replace(/^https?:\/\//, '')}
          </p>
        </div>

        {/* Player counter */}
        <motion.div
          className="flex items-center gap-2"
          animate={connected > 0 ? { scale: [1, 1.12, 1] } : {}}
          transition={{ duration: 0.3 }}
          key={connected}
        >
          <Users className="w-5 h-5" style={{ color: '#C0F300' }} />
          <span className="font-black text-lg" style={{ color: '#C0F300' }}>
            {connected} Pemain Terhubung
          </span>
        </motion.div>

        {/* Player pills */}
        {players.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center w-full">
            <AnimatePresence>
              {players.map(player => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="px-4 py-2 rounded-full bg-[#1E1E1E] border border-gray-700
                             text-white text-sm font-semibold"
                >
                  {player.name}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!canStart && (
          <p className="text-gray-600 text-sm text-center animate-pulse">
            Menunggu pemain bergabung...
          </p>
        )}
      </main>

      {/* ── Fixed Footer ─────────────────────────────────────── */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md
                      px-4 pb-5 pt-2 bg-gradient-to-t from-[#121212] via-[#121212]/95 to-transparent">
        <motion.button
          id="btn-start-voting"
          onClick={() => canStart && onStartVoting(players)}
          disabled={!canStart}
          whileHover={canStart ? { scale: 1.02 } : {}}
          whileTap={canStart ? { scale: 0.97 } : {}}
          className={`w-full py-4 rounded-2xl font-black text-base uppercase tracking-widest
                      flex items-center justify-center gap-2 transition-all duration-300
                      ${canStart
                        ? 'text-black shadow-[0_0_24px_rgba(192,243,0,0.6)]'
                        : 'bg-[#2A2A2A] text-gray-600 cursor-not-allowed'}`}
          style={canStart ? { backgroundColor: '#C0F300' } : {}}
        >
          {canStart ? '🗳 Mulai Voting Sekarang!' : '⏳ Menunggu Pemain...'}
        </motion.button>
      </div>
    </div>
  );
}
