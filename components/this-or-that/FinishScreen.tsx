'use client';

import { motion } from 'framer-motion';
import { RefreshCcw, Trophy } from 'lucide-react';
import { ElectricHeader } from './SetupScreen';
import { VoteResult } from './GameplayScreen';

interface FinishScreenProps {
  results: VoteResult[];
  onPlayAgain: () => void;
}

export default function FinishScreen({ results, onPlayAgain }: FinishScreenProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white">
      <ElectricHeader />

      <main className="flex-1 overflow-y-auto px-4 py-8 pb-32">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#C0F300]/20 mb-4"
          >
            <Trophy className="w-8 h-8 text-[#C0F300]" />
          </motion.div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">
            Hasil Akhir
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            Ini dia ringkasan pilihan kalian!
          </p>
        </div>

        <div className="space-y-4">
          {results.map((res, i) => {
            const total = res.tally.total || 1;
            const pct1 = Math.round((res.tally.votes1 / total) * 100);
            const pct2 = Math.round((res.tally.votes2 / total) * 100);
            const winner = pct1 > pct2 ? 1 : pct2 > pct1 ? 2 : 0; // 0 is tie

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#1E1E1E] border border-gray-800 rounded-2xl p-4 overflow-hidden relative"
              >
                {/* Result progress bar bg */}
                <div className="absolute inset-0 opacity-10 flex">
                  <div style={{ width: `${pct1}%`, backgroundColor: '#00E5FF' }} />
                  <div style={{ width: `${pct2}%`, backgroundColor: '#FF6D00' }} />
                </div>

                <div className="relative z-10">
                  <p className="text-xs text-gray-500 font-bold mb-2">PERTANYAAN {i + 1}</p>
                  
                  {/* THIS Option */}
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-bold ${winner === 1 ? 'text-[#00E5FF]' : 'text-gray-300'}`}>
                      {res.question.option1}
                    </span>
                    <span className="font-black text-[#00E5FF]">{pct1}%</span>
                  </div>

                  {/* THAT Option */}
                  <div className="flex justify-between items-center">
                    <span className={`font-bold ${winner === 2 ? 'text-[#FF6D00]' : 'text-gray-300'}`}>
                      {res.question.option2}
                    </span>
                    <span className="font-black text-[#FF6D00]">{pct2}%</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* ── Fixed Footer ─────────────────────────────────────── */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md
                      px-4 pb-5 pt-4 bg-gradient-to-t from-[#121212] via-[#121212]/95 to-transparent">
        <motion.button
          onClick={onPlayAgain}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl font-black text-base uppercase tracking-widest
                     bg-[#C0F300] text-black flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(192,243,0,0.6)]"
        >
          <RefreshCcw className="w-5 h-5" />
          Main Lagi
        </motion.button>
      </div>
    </div>
  );
}
