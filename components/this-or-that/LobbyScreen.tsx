'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';
import { ElectricHeader } from './SetupScreen';
import { DEMO_PLAYER_NAMES } from '@/lib/this-or-that/gameData';
import type { Player } from '@/lib/this-or-that/gameData';

interface LobbyScreenProps {
  onStartVoting: (players: Player[]) => void;
}

/* ─── Simple inline QR Code SVG ────────────────────────────────── */
function QRCodePlaceholder() {
  // A convincing QR-code-like SVG pattern
  const modules = [
    '1111111011010110101011111110',
    '1000001010100010110010000010',
    '1011101011010011001010111010',
    '1011101001100110110010111010',
    '1011101011011001010110111010',
    '1000001000110001100010000010',
    '1111111010101010101011111110',
    '0000000011001011010100000000',
    '1101101110100011011111101100',
    '0100010000111001001001001100',
    '1011111110100001100111111110',
    '0010100011001101001110001000',
    '1001111001010010011001110110',
    '0000000010110100100100000100',
    '1111111010001011010110100010',
    '1000001010101101001010100000',
    '1011101010010010011110111100',
    '1011101001001101100010111010',
    '1011101011100001010010111010',
    '1000001000011010100010000010',
    '1111111010100101010111111110',
  ];

  const CELL = 10; // px per module
  const N = modules[0].length;
  const H = modules.length;

  return (
    <svg
      viewBox={`0 0 ${N * CELL} ${H * CELL}`}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="QR Code"
    >
      <rect width={N * CELL} height={H * CELL} fill="white" />
      {modules.map((row, ri) =>
        row.split('').map((cell, ci) =>
          cell === '1' ? (
            <rect
              key={`${ri}-${ci}`}
              x={ci * CELL}
              y={ri * CELL}
              width={CELL}
              height={CELL}
              fill="#000000"
            />
          ) : null,
        ),
      )}
    </svg>
  );
}

/* ─── Component ─────────────────────────────────────────────────── */
export default function LobbyScreen({ onStartVoting }: LobbyScreenProps) {
  const [players, setPlayers] = useState<Player[]>([]);

  /* Simulate players joining one by one */
  useEffect(() => {
    const names = DEMO_PLAYER_NAMES.slice(0, 5);
    names.forEach((name, i) => {
      setTimeout(() => {
        setPlayers(prev => [
          ...prev,
          { id: String(i + 1), name, voted: false, vote: null },
        ]);
      }, (i + 1) * 1200);
    });
  }, []);

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
          <p className="text-gray-500 text-sm mt-1">Tunjukkan QR code ini ke semua pemain</p>
        </div>

        {/* QR Code Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="relative rounded-2xl overflow-hidden border-2 border-[#C0F300]
                     shadow-[0_0_30px_rgba(192,243,0,0.45)] bg-white"
          style={{ width: 220, height: 220 }}
        >
          <QRCodePlaceholder />
        </motion.div>

        {/* Join link */}
        <div className="text-center">
          <p className="text-gray-500 text-xs">atau buka:</p>
          <p className="text-[#C0F300] font-bold text-sm mt-0.5"
            style={{ textShadow: '0 0 10px rgba(192,243,0,0.5)' }}>
            electric.social/join
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
