'use client';

import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Settings, Minus, Plus, Dices, Trash2, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import type { QuestionPair } from '@/lib/this-or-that/gameData';
import { DEFAULT_PAIRS, PAIR_BANK } from '@/lib/this-or-that/gameData';

/* ─── Shared header ─────────────────────────────────────────────── */
export function ElectricHeader() {
  return (
    <header className="sticky top-0 z-40 bg-[#121212]/95 backdrop-blur-sm border-b border-gray-800
                        px-4 py-3 flex items-center justify-between">
      <Link href="/" id="btn-back-home" aria-label="Back to Home" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
        <ArrowLeft className="w-6 h-6 text-white" />
      </Link>
      <h1
        className="text-xl font-black tracking-tight"
        style={{
          color: '#C0F300',
          textShadow: '0 0 20px rgba(192,243,0,0.7), 0 0 8px rgba(192,243,0,0.5)',
        }}
      >
        ELECTRIC SOCIAL
      </h1>
      <button id="btn-settings-es" aria-label="Pengaturan" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
        <Settings className="w-6 h-6 text-white" />
      </button>
    </header>
  );
}

/* ─── Props ─────────────────────────────────────────────────────── */
interface SetupScreenProps {
  onStart: (pairs: QuestionPair[], count: number) => void;
}

/* ─── Helpers ───────────────────────────────────────────────────── */
let pairCounter = 100;
function makePair(o1 = '', o2 = ''): QuestionPair {
  return { id: String(++pairCounter), option1: o1, option2: o2, desc1: '', desc2: '' };
}

/* ─── Component ─────────────────────────────────────────────────── */
export default function SetupScreen({ onStart }: SetupScreenProps) {
  const [questionCount, setQuestionCount] = useState(10);
  const [pairs, setPairs] = useState<QuestionPair[]>(() => DEFAULT_PAIRS.slice(0, 5));
  const uid = useId();

  /* Stepper */
  function incCount() { setQuestionCount(c => Math.min(c + 1, 20)); }
  function decCount() { setQuestionCount(c => Math.max(c - 1, 3));  }

  /* Pair mutations */
  function updatePair(id: string, key: 'option1' | 'option2', val: string) {
    setPairs(p => p.map(x => (x.id === id ? { ...x, [key]: val } : x)));
  }
  function deletePair(id: string) {
    setPairs(p => p.filter(x => x.id !== id));
  }
  function randomizePair(id: string) {
    const [o1, o2] = PAIR_BANK[Math.floor(Math.random() * PAIR_BANK.length)];
    setPairs(p => p.map(x => (x.id === id ? { ...x, option1: o1, option2: o2 } : x)));
  }
  function addCustomPair() {
    setPairs(p => [...p, makePair()]);
    // Scroll to bottom after slight delay
    setTimeout(() => window.scrollTo({ top: 99999, behavior: 'smooth' }), 100);
  }

  function handleStart() {
    const valid = pairs.filter(p => p.option1.trim() && p.option2.trim());
    if (valid.length === 0) return;
    onStart(valid, questionCount);
  }

  const canStart = pairs.some(p => p.option1.trim() && p.option2.trim());

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white">
      <ElectricHeader />

      {/* ── Scrollable Content ─────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto pb-28 px-4 pt-5 space-y-5">
        {/* Title */}
        <h2 className="text-2xl font-black uppercase text-gray-200 leading-tight">
          PERSIAPAN:<br />THIS OR THAT
        </h2>

        {/* ── Question Count Stepper ────────────────────────── */}
        <div className="bg-[#1E1E1E] rounded-2xl p-4 border border-gray-800 space-y-2">
          <p className="text-sm font-semibold text-gray-300">Jumlah Pertanyaan?</p>
          <div className="flex items-center gap-3">
            {/* Minus */}
            <button
              id="btn-dec-count"
              onClick={decCount}
              aria-label="Kurangi jumlah"
              className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-black
                         transition-all duration-150 active:scale-90"
              style={{ backgroundColor: '#C0F300', boxShadow: '0 0 12px rgba(192,243,0,0.5)' }}
            >
              <Minus className="w-5 h-5" />
            </button>
            {/* Count */}
            <div className="w-16 h-10 rounded-lg bg-[#2A2A2A] flex items-center justify-center
                            font-black text-xl text-white border border-gray-700">
              {questionCount}
            </div>
            {/* Plus */}
            <button
              id="btn-inc-count"
              onClick={incCount}
              aria-label="Tambah jumlah"
              className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-black
                         transition-all duration-150 active:scale-90"
              style={{ backgroundColor: '#C0F300', boxShadow: '0 0 12px rgba(192,243,0,0.5)' }}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Menghasilkan {questionCount} pasang pilihan otomatis...
          </p>
        </div>

        {/* ── VS Pairs List ─────────────────────────────────── */}
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {pairs.map((pair, idx) => (
              <motion.div
                key={pair.id}
                layout
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 80, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.22 }}
                className="bg-[#1E1E1E] rounded-2xl border border-gray-800 overflow-hidden"
              >
                {/* Option 1 – Cyan */}
                <input
                  id={`${uid}-pair-${idx}-opt1`}
                  type="text"
                  value={pair.option1}
                  onChange={e => updatePair(pair.id, 'option1', e.target.value)}
                  placeholder="Ketik Pilihan 1"
                  className="w-full bg-transparent text-[#00E5FF] font-bold text-sm text-center
                             px-4 py-3 outline-none border-b-2 border-[#00E5FF]/50
                             focus:border-[#00E5FF] placeholder-[#00E5FF]/40
                             transition-colors duration-150"
                />

                {/* VS */}
                <div className="py-2 text-center">
                  <span className="text-2xl font-black text-gray-500 tracking-widest">VS</span>
                </div>

                {/* Option 2 – Orange */}
                <input
                  id={`${uid}-pair-${idx}-opt2`}
                  type="text"
                  value={pair.option2}
                  onChange={e => updatePair(pair.id, 'option2', e.target.value)}
                  placeholder="Ketik Pilihan 2"
                  className="w-full bg-transparent text-[#FF6D00] font-bold text-sm text-center
                             px-4 py-3 outline-none border-t-2 border-[#FF6D00]/50
                             focus:border-[#FF6D00] placeholder-[#FF6D00]/40
                             transition-colors duration-150"
                />

                {/* Action bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-800 bg-[#191919]">
                  <button
                    id={`${uid}-dice-${idx}`}
                    onClick={() => randomizePair(pair.id)}
                    aria-label="Acak pasang"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#2A2A2A]
                               text-gray-300 hover:bg-[#333] text-xs font-semibold
                               transition-all duration-150 active:scale-90"
                  >
                    <Dices className="w-4 h-4" />
                    Acak
                  </button>
                  <button
                    id={`${uid}-delete-${idx}`}
                    onClick={() => deletePair(pair.id)}
                    aria-label="Hapus pasang"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-900/40
                               text-red-400 hover:bg-red-900/70 text-xs font-semibold
                               transition-all duration-150 active:scale-90 border border-red-800/50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* ── Add Custom Button ──────────────────────────── */}
          <button
            id="btn-add-pair"
            onClick={addCustomPair}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-700
                       flex items-center justify-center gap-2 text-gray-400 font-semibold text-sm
                       hover:border-[#C0F300] hover:text-[#C0F300] transition-all duration-200"
          >
            <PlusCircle className="w-5 h-5" />
            Tambah Pilihan Custom
          </button>
        </div>
      </main>

      {/* ── Fixed Footer ─────────────────────────────────────── */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md
                      px-4 pb-5 pt-2 bg-gradient-to-t from-[#121212] via-[#121212]/95 to-transparent">
        <motion.button
          id="btn-start-game"
          onClick={handleStart}
          disabled={!canStart}
          whileHover={canStart ? { scale: 1.02 } : {}}
          whileTap={canStart ? { scale: 0.97 } : {}}
          className={`w-full py-4 rounded-2xl font-black text-xl uppercase tracking-widest
                      flex items-center justify-center gap-3 transition-all duration-200
                      ${canStart
                        ? 'text-black shadow-[0_0_24px_rgba(192,243,0,0.6)]'
                        : 'bg-[#2A2A2A] text-gray-600 cursor-not-allowed'}`}
          style={canStart ? { backgroundColor: '#C0F300' } : {}}
        >
          MULAI GAME! ▶
        </motion.button>
      </div>
    </div>
  );
}
