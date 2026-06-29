'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, CheckCircle2, XCircle, RefreshCw,
  LayoutGrid, Trash2, Medal,
} from 'lucide-react';
import type { WordResult, LeaderboardEntry } from '@/lib/gameTypes';

interface ResultsScreenProps {
  playerName: string;
  wordResults: WordResult[];
  leaderboard: LeaderboardEntry[];
  onPlayAgain: () => void;
  onOtherCategory: () => void;
  onResetLeaderboard: () => void;
}

type ActiveTab = 'words' | 'leaderboard';

/* ── Medal colors for top 3 ─────────────────────────────────────── */
const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

export default function ResultsScreen({
  playerName,
  wordResults,
  leaderboard,
  onPlayAgain,
  onOtherCategory,
  onResetLeaderboard,
}: ResultsScreenProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('words');

  const correctCount = wordResults.filter(r => r.status === 'correct').length;
  const sortedBoard  = [...leaderboard].sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white">
      {/* ── WAKTU HABIS! Banner ──────────────────────────────────── */}
      <div className="px-4 pt-6 pb-2">
        <motion.div
          initial={{ opacity: 0, rotate: -2, y: -20 }}
          animate={{ opacity: 1, rotate: -1.5, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          className="rounded-2xl border-2 border-[#C0F300] bg-[#1A1A1A] px-5 py-4 text-center
                     shadow-[0_0_24px_rgba(192,243,0,0.4)]"
        >
          <span
            className="text-3xl font-black uppercase tracking-widest"
            style={{
              color: '#C0F300',
              textShadow: '0 0 20px rgba(192,243,0,0.8)',
            }}
          >
            ⏱ Waktu Habis!
          </span>
        </motion.div>
      </div>

      {/* ── Score Card ───────────────────────────────────────────── */}
      <div className="px-4 py-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
          className="relative rounded-2xl bg-[#1E1E1E] border border-gray-800 px-6 py-5 overflow-hidden"
        >
          {/* Star watermark */}
          <span
            className="absolute -right-4 -bottom-4 text-[120px] select-none pointer-events-none"
            style={{ color: 'rgba(255,255,255,0.04)' }}
          >
            ★
          </span>

          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
            Skor {playerName}
          </p>

          <div className="flex items-center gap-4">
            <Trophy
              className="w-10 h-10 shrink-0"
              style={{ color: '#C0F300', filter: 'drop-shadow(0 0 10px rgba(192,243,0,0.7))' }}
            />
            <motion.span
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 250, damping: 15 }}
              className="text-7xl font-black text-white leading-none"
              style={{ textShadow: '0 0 30px rgba(255,255,255,0.2)' }}
            >
              {correctCount}
            </motion.span>
          </div>
          <p className="text-gray-500 text-xs mt-1">
            dari {wordResults.length} kata dimainkan
          </p>
        </motion.div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────── */}
      <div className="px-4">
        <div className="flex rounded-xl overflow-hidden border border-gray-800 bg-[#1A1A1A]">
          {(
            [
              { id: 'words' as ActiveTab,       label: 'Kata Ditebak'  },
              { id: 'leaderboard' as ActiveTab,  label: 'Klasemen'      },
            ] as const
          ).map(({ id, label }) => (
            <button
              key={id}
              id={`tab-${id}`}
              onClick={() => setActiveTab(id)}
              className={`flex-1 py-2.5 text-sm font-bold transition-all duration-200
                ${activeTab === id
                  ? 'bg-[#C0F300] text-black'
                  : 'text-gray-400 hover:text-white'}`}
              style={activeTab === id ? { boxShadow: '0 0 12px rgba(192,243,0,0.4)' } : {}}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ──────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-36 space-y-2">
        <AnimatePresence mode="wait">
          {activeTab === 'words' ? (
            <motion.div
              key="words"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              {/* Header row */}
              <div className="flex justify-between text-xs text-gray-500 font-semibold uppercase tracking-wider px-1">
                <span>Kata Ditebak</span>
                <span>Status</span>
              </div>

              {wordResults.map((result, i) => (
                <motion.div
                  key={result.word + i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between bg-[#1E1E1E] rounded-xl px-4 py-3
                             border border-gray-800"
                >
                  <span
                    className={`font-semibold text-sm
                      ${result.status === 'pass' ? 'line-through text-gray-500' : 'text-white'}`}
                  >
                    {result.word}
                  </span>

                  {result.status === 'correct' ? (
                    <span
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase"
                      style={{
                        backgroundColor: 'rgba(192,243,0,0.15)',
                        color: '#C0F300',
                        border: '1px solid rgba(192,243,0,0.4)',
                      }}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Benar
                    </span>
                  ) : (
                    <span
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase
                                 bg-red-900/30 text-red-400 border border-red-700/40"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Lewat
                    </span>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              {sortedBoard.length === 0 && (
                <p className="text-center text-gray-600 py-8 text-sm">
                  Belum ada pemain di klasemen.
                </p>
              )}

              {sortedBoard.map((entry, i) => (
                <motion.div
                  key={entry.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 border
                    ${i === 0
                      ? 'bg-[#C0F300]/10 border-[#C0F300]/40'
                      : 'bg-[#1E1E1E] border-gray-800'}`}
                >
                  {/* Rank */}
                  {i < 3 ? (
                    <Medal className="w-5 h-5 shrink-0" style={{ color: MEDAL_COLORS[i] }} />
                  ) : (
                    <span className="w-5 text-center text-gray-500 font-bold text-sm shrink-0">
                      {i + 1}
                    </span>
                  )}

                  <span className={`flex-1 font-bold text-sm ${i === 0 ? 'text-[#C0F300]' : 'text-white'}`}>
                    {entry.name}
                  </span>

                  <span className={`font-black text-base tabular-nums
                    ${i === 0 ? 'text-[#C0F300]' : 'text-gray-300'}`}>
                    {entry.totalScore}
                    <span className="text-xs font-medium text-gray-500 ml-1">poin</span>
                  </span>
                </motion.div>
              ))}

              {/* Reset leaderboard */}
              {sortedBoard.length > 0 && (
                <button
                  id="btn-reset-leaderboard"
                  onClick={onResetLeaderboard}
                  className="flex items-center gap-2 text-red-500 hover:text-red-400
                             text-sm font-semibold mt-4 mx-auto px-4 py-2 rounded-xl
                             border border-red-800/40 hover:bg-red-900/20 transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                  Reset Leaderboard
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Action Buttons ────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pb-5 pt-2
                      bg-gradient-to-t from-[#121212] via-[#121212]/95 to-transparent space-y-3">
        {/* MAIN LAGI */}
        <motion.button
          id="btn-play-again"
          onClick={onPlayAgain}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl font-black text-xl uppercase tracking-wider
                     text-black flex items-center justify-center gap-3
                     transition-all duration-150"
          style={{
            backgroundColor: '#C0F300',
            boxShadow: '0 0 24px rgba(192,243,0,0.55)',
          }}
        >
          <RefreshCw className="w-6 h-6" />
          Main Lagi
        </motion.button>

        {/* KATEGORI LAIN */}
        <motion.button
          id="btn-other-category"
          onClick={onOtherCategory}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3.5 rounded-2xl font-black text-lg uppercase tracking-wider
                     text-black flex items-center justify-center gap-3
                     transition-all duration-150"
          style={{
            backgroundColor: '#00E5FF',
            boxShadow: '0 0 20px rgba(0,229,255,0.45)',
          }}
        >
          <LayoutGrid className="w-5 h-5" />
          Kategori Lain
        </motion.button>
      </div>
    </div>
  );
}
