'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Menu, UserCircle, Plus, X, Home, BarChart2, Settings,
  Clapperboard, PawPrint, Zap, Music, Utensils, Briefcase,
  ChevronRight, ArrowLeft
} from 'lucide-react';
import type { Category, LeaderboardEntry } from '@/lib/gameTypes';
import { CATEGORIES } from '@/lib/gameData';

/* ─── Icon map ─────────────────────────────────────────────────────── */
const ICON_MAP: Record<string, React.ElementType> = {
  Clapperboard, PawPrint, Zap, Music, Utensils, Briefcase,
};

/* ─── Props ─────────────────────────────────────────────────────────── */
interface HomeScreenProps {
  players: string[];
  currentPlayerIndex: number;
  duration: 30 | 60;
  leaderboard: LeaderboardEntry[];
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (index: number) => void;
  onSetDuration: (d: 30 | 60) => void;
  onSelectCategory: (cat: Category) => void;
  onCreateCustom: () => void;
  activeTab: 'home' | 'ranks' | 'settings';
  onTabChange: (t: 'home' | 'ranks' | 'settings') => void;
}

/* ─── Component ─────────────────────────────────────────────────────── */
export default function HomeScreen({
  players,
  currentPlayerIndex,
  duration,
  leaderboard,
  onAddPlayer,
  onRemovePlayer,
  onSetDuration,
  onSelectCategory,
  onCreateCustom,
  activeTab,
  onTabChange,
}: HomeScreenProps) {
  const [inputName, setInputName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function handleAdd() {
    const name = inputName.trim();
    if (!name) return;
    onAddPlayer(name);
    setInputName('');
    inputRef.current?.focus();
  }

  const currentPlayer = players[currentPlayerIndex] ?? null;

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white">
      {/* ── Header ────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#121212]/95 backdrop-blur-sm border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <Link href="/" id="btn-back-home" aria-label="Back to Home" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>

        <h1
          className="text-2xl font-black italic tracking-tight"
          style={{
            color: '#C0F300',
            textShadow: '0 0 20px rgba(192,243,0,0.7), 0 0 8px rgba(192,243,0,0.5)',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          TEBAK KATA
        </h1>

        <button id="btn-user" aria-label="User Profile" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
          <UserCircle className="w-6 h-6 text-white" />
        </button>
      </header>

      {/* ── Scrollable Content ────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto pb-24 px-4 space-y-5 pt-4">

        {/* ── Player Management ─────────────────────────────────── */}
        <section aria-label="Daftar Pemain">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Daftar Pemain
          </p>

          {/* Input row */}
          <div className="flex gap-2">
            <input
              ref={inputRef}
              id="input-player-name"
              type="text"
              value={inputName}
              onChange={e => setInputName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="Ketik nama pemain..."
              className="flex-1 bg-[#1E1E1E] border border-gray-700 rounded-xl px-4 py-2.5 text-sm
                         text-white placeholder-gray-500 outline-none
                         focus:border-[#C0F300] focus:shadow-[0_0_0_2px_rgba(192,243,0,0.25)]
                         transition-all duration-200"
            />
            <button
              id="btn-add-player"
              onClick={handleAdd}
              aria-label="Tambah pemain"
              className="flex items-center gap-1.5 bg-[#C0F300] text-black font-bold text-sm
                         px-4 rounded-xl hover:brightness-110 active:scale-95 transition-all duration-150
                         shadow-[0_0_12px_rgba(192,243,0,0.5)]"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah</span>
            </button>
          </div>

          {/* Player pills */}
          {players.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-3">
              <AnimatePresence>
                {players.map((name, i) => (
                  <motion.div
                    key={name + i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border transition-all
                      ${i === currentPlayerIndex
                        ? 'border-[#C0F300] bg-[#C0F300]/15 text-[#C0F300] shadow-[0_0_8px_rgba(192,243,0,0.4)]'
                        : 'border-gray-700 bg-[#1E1E1E] text-gray-300'}`}
                  >
                    {name}
                    <button
                      onClick={() => onRemovePlayer(i)}
                      aria-label={`Hapus ${name}`}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Turn indicator */}
          {currentPlayer && (
            <p className="mt-2 text-sm text-cyan-300 font-medium">
              🎮 Giliran: <span className="font-bold text-white">{currentPlayer}</span>
            </p>
          )}
        </section>

        {/* ── Custom Category Button ────────────────────────────── */}
        <button
          id="btn-custom-category"
          onClick={onCreateCustom}
          className="w-full flex items-center justify-between px-5 py-4 rounded-2xl
                     bg-[#1A1A1A] border-2 border-[#C0F300]
                     shadow-[0_0_18px_rgba(192,243,0,0.35)]
                     hover:shadow-[0_0_28px_rgba(192,243,0,0.55)]
                     hover:scale-[1.01] active:scale-[0.99]
                     transition-all duration-200 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#C0F300]/15 flex items-center justify-center">
              <Plus className="w-5 h-5 text-[#C0F300]" />
            </div>
            <span className="font-black text-base text-[#C0F300] tracking-wider uppercase">
              Buat Kategori Custom
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-[#C0F300] group-hover:translate-x-1 transition-transform" />
        </button>

        {/* ── Duration Toggle ───────────────────────────────────── */}
        <section aria-label="Durasi Permainan">
          <p className="text-xs font-bold text-white uppercase tracking-widest mb-2">
            Durasi Permainan
          </p>
          <div className="flex gap-3">
            {([60, 30] as const).map(d => (
              <button
                key={d}
                id={`btn-duration-${d}`}
                onClick={() => onSetDuration(d)}
                className={`flex-1 py-3 rounded-xl font-black text-sm tracking-wider uppercase transition-all duration-200
                  ${duration === d
                    ? 'bg-[#C0F300] text-black shadow-[0_0_16px_rgba(192,243,0,0.5)]'
                    : 'bg-[#2A2A2A] text-gray-400 hover:bg-[#333] border border-gray-700'}`}
              >
                {d} Detik
              </button>
            ))}
          </div>
        </section>

        {/* ── Category Grid ────────────────────────────────────── */}
        <section aria-label="Pilih Kategori">
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((cat, i) => {
              const Icon = ICON_MAP[cat.iconName] ?? Zap;
              return (
                <motion.button
                  key={cat.id}
                  id={`btn-cat-${cat.id}`}
                  onClick={() => onSelectCategory(cat)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="relative flex flex-col items-center justify-center gap-3
                             bg-[#1A1A1A] rounded-2xl py-7 px-4 border-2 overflow-hidden"
                  style={{
                    borderColor: cat.color,
                    boxShadow: `0 0 14px 2px ${cat.glowColor}`,
                  }}
                >
                  {/* Badge */}
                  {cat.badge && (
                    <span
                      className="absolute top-2 right-2 text-[10px] font-black uppercase px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: cat.color, color: '#000' }}
                    >
                      {cat.badge}
                    </span>
                  )}

                  {/* Icon container */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${cat.color}20` }}
                  >
                    <Icon className="w-8 h-8" style={{ color: cat.color }} strokeWidth={1.8} />
                  </div>

                  {/* Name */}
                  <span className="text-sm font-black text-white uppercase tracking-wide text-center leading-tight">
                    {cat.name}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </section>
      </main>

    </div>
  );
}
