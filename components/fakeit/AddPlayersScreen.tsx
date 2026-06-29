'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Plus, X, ChevronLeft } from 'lucide-react';
import type { Player } from '@/lib/fakeit/gameData';
import { AVATAR_COLORS } from '@/lib/fakeit/gameData';

interface AddPlayersScreenProps {
  players: Player[];
  onPlayersChange: (players: Player[]) => void;
  onContinue: () => void;
  onSettingsClick: () => void;
  onBack: () => void;
}

export default function AddPlayersScreen({ players, onPlayersChange, onContinue, onSettingsClick, onBack }: AddPlayersScreenProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when adding state opens
  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  function handleAdd() {
    if (newName.trim()) {
      const newPlayer: Player = {
        id: Math.random().toString(36).substring(7),
        name: newName.trim(),
        role: 'normal', // temporary, assigned later
        avatarColor: AVATAR_COLORS[players.length % AVATAR_COLORS.length]
      };
      onPlayersChange([...players, newPlayer]);
      setNewName('');
    }
    // Keep adding mode open until they blur or hit enter empty
    if (!newName.trim() && players.length > 0) {
      setIsAdding(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleAdd();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewName('');
    }
  }

  function removePlayer(id: string) {
    onPlayersChange(players.filter(p => p.id !== id));
  }

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden text-white">
      {/* ── Background with Grid Overlay ───────────────────────── */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#FF1A5A] to-[#FF4D4D]">
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-5 pt-10 pb-6">
        <button onClick={onBack} aria-label="Back" className="p-2 -ml-2 rounded-full hover:bg-white/10 transition">
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
        
        <h1 className="text-2xl font-black tracking-wide">Add Players</h1>
        
        <button onClick={onSettingsClick} aria-label="Settings" className="p-2 -mr-2 rounded-full hover:bg-white/10 transition">
          <Settings className="w-7 h-7 text-white" />
        </button>
      </header>

      {/* ── Player List ────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 overflow-y-auto px-5 pb-32 space-y-3">
        <AnimatePresence initial={false}>
          {players.map((player, idx) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, height: 0, scale: 0.8 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.8, marginTop: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="w-full flex items-center bg-[#1C1C24] rounded-full p-2 pr-4 shadow-lg"
            >
              <div className="w-10 h-10 rounded-full bg-[#FFD500] flex items-center justify-center shrink-0">
                <span className="text-black font-black text-lg">{idx + 1}</span>
              </div>
              <span className="ml-4 font-black text-lg text-white flex-1 truncate">
                {player.name}
              </span>
              <button 
                onClick={() => removePlayer(player.id)}
                className="p-2 rounded-full hover:bg-white/10 text-gray-500 hover:text-red-400 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* ── Add Player Button / Input ──────────────────────── */}
        <div className="pt-2">
          {isAdding ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex items-center bg-[#1C1C24]/80 rounded-full p-2 pr-4 border border-white/30 backdrop-blur-sm"
            >
              <div className="w-10 h-10 rounded-full bg-[#FFD500]/50 flex items-center justify-center shrink-0">
                <Plus className="w-5 h-5 text-black" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                  if (newName.trim()) handleAdd();
                  else setIsAdding(false);
                }}
                placeholder="Enter name..."
                className="ml-4 flex-1 bg-transparent border-none outline-none text-white font-bold text-lg placeholder-white/50"
              />
            </motion.div>
          ) : (
            <motion.button
              onClick={() => setIsAdding(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-full border-2 border-dashed border-white/50 bg-white/5 hover:bg-white/10 flex items-center justify-center gap-3 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <Plus className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">Add Player</span>
            </motion.button>
          )}
        </div>
      </main>

      {/* ── Sticky Footer ──────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-20 bg-gradient-to-t from-[#FF4D4D] via-[#FF4D4D]/90 to-transparent pt-10">
        <motion.button
          onClick={onContinue}
          disabled={players.length < 3}
          whileHover={players.length >= 3 ? { scale: 1.02 } : {}}
          whileTap={players.length >= 3 ? { scale: 0.97 } : {}}
          className={`w-full py-4 rounded-full flex items-center justify-center transition-all duration-200 ${
            players.length >= 3 
              ? 'bg-white text-black shadow-lg shadow-black/20' 
              : 'bg-white/50 text-black/50 cursor-not-allowed'
          }`}
        >
          <span className="text-xl font-black tracking-wide">Continue</span>
        </motion.button>
        {players.length < 3 && (
          <p className="text-center text-white/70 text-xs mt-3 font-medium">Need at least 3 players</p>
        )}
      </div>
    </div>
  );
}
