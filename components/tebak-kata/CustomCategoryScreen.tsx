'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, HelpCircle, Plus, X, PlayCircle } from 'lucide-react';
import type { CustomDeck } from '@/lib/gameTypes';

interface CustomCategoryScreenProps {
  onBack: () => void;
  onPlay: (deck: CustomDeck) => void;
}

export default function CustomCategoryScreen({ onBack, onPlay }: CustomCategoryScreenProps) {
  const [categoryName, setCategoryName] = useState('');
  const [wordInput, setWordInput] = useState('');
  const [words, setWords] = useState<string[]>([]);
  const wordInputRef = useRef<HTMLInputElement>(null);

  const MIN_WORDS = 10;
  const isValid = categoryName.trim().length > 0 && words.length >= MIN_WORDS;

  function addWord() {
    const w = wordInput.trim();
    if (!w || words.includes(w)) { setWordInput(''); return; }
    setWords(prev => [...prev, w]);
    setWordInput('');
    wordInputRef.current?.focus();
  }

  function removeWord(index: number) {
    setWords(prev => prev.filter((_, i) => i !== index));
  }

  function handleWordKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { e.preventDefault(); addWord(); }
  }

  function handlePlay() {
    if (!isValid) return;
    onPlay({ name: categoryName.trim(), words });
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white">
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#121212]/95 backdrop-blur-sm border-b border-gray-800
                          px-4 py-3 flex items-center justify-between">
        <button
          id="btn-back-custom"
          onClick={onBack}
          aria-label="Kembali"
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        <h1
          className="text-2xl font-black italic tracking-tight"
          style={{
            color: '#C0F300',
            textShadow: '0 0 20px rgba(192,243,0,0.7)',
          }}
        >
          TEBAK KATA
        </h1>

        <button id="btn-help" aria-label="Bantuan" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
          <HelpCircle className="w-6 h-6 text-white" />
        </button>
      </header>

      {/* ── Scrollable Content ───────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto pb-32 px-4 pt-6 space-y-6">
        {/* Title */}
        <div>
          <h2 className="text-3xl font-black text-white">Buat Deck Baru</h2>
          <p className="text-gray-400 text-sm mt-1 leading-relaxed">
            Tambahkan kategori dan kata-kata seru untuk<br />dimainkan bersama teman.
          </p>
        </div>

        {/* ── Category Name Input ──────────────────────────────── */}
        <div className="space-y-2">
          <label htmlFor="input-cat-name" className="text-xs font-black uppercase tracking-widest"
            style={{ color: '#C0F300' }}>
            Nama Kategori
          </label>
          <input
            id="input-cat-name"
            type="text"
            value={categoryName}
            onChange={e => setCategoryName(e.target.value)}
            placeholder="Cth: Artis Tiktok Indo"
            className="w-full bg-white text-gray-900 font-medium rounded-xl px-4 py-3.5
                       placeholder-gray-400 outline-none border-2 border-transparent
                       focus:border-[#C0F300] transition-all duration-200 text-base"
          />
        </div>

        {/* ── Word Input ──────────────────────────────────────── */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <div>
              <label htmlFor="input-word" className="text-xs font-black uppercase tracking-widest"
                style={{ color: '#00E5FF' }}>
                Daftar Kata
              </label>
              <span className="text-xs text-[#00E5FF] font-bold ml-1">({words.length})</span>
            </div>
            <span className={`text-xs font-semibold ${words.length >= MIN_WORDS ? 'text-[#C0F300]' : 'text-gray-500'}`}>
              Min. {MIN_WORDS} Kata
            </span>
          </div>

          {/* Word input + button */}
          <div className="relative">
            <input
              ref={wordInputRef}
              id="input-word"
              type="text"
              value={wordInput}
              onChange={e => setWordInput(e.target.value)}
              onKeyDown={handleWordKey}
              placeholder="Ketik kata, lalu tekan Enter..."
              className="w-full bg-white text-gray-900 font-medium rounded-xl pl-4 pr-14 py-3.5
                         placeholder-gray-400 outline-none border-2 border-transparent
                         focus:border-[#00E5FF] transition-all duration-200 text-base"
            />
            <button
              id="btn-add-word"
              onClick={addWord}
              aria-label="Tambah kata"
              className="absolute right-2 top-1/2 -translate-y-1/2
                         w-9 h-9 rounded-lg flex items-center justify-center
                         text-black font-bold transition-all duration-150 active:scale-90"
              style={{ backgroundColor: '#00E5FF', boxShadow: '0 0 10px rgba(0,229,255,0.6)' }}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Word Tags Display ────────────────────────────────── */}
        <div
          className="min-h-[120px] rounded-xl border-2 border-dashed border-gray-700 p-3
                     flex flex-wrap gap-2 content-start"
        >
          {words.length === 0 && (
            <p className="text-gray-600 text-sm w-full text-center pt-6">
              Kata-kata akan muncul di sini...
            </p>
          )}
          <AnimatePresence>
            {words.map((word, i) => (
              <motion.div
                key={word + i}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                           bg-[#1E1E1E] border border-gray-600 text-sm text-white font-medium"
              >
                {word}
                <button
                  onClick={() => removeWord(i)}
                  aria-label={`Hapus ${word}`}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        {words.length > 0 && (
          <div className="space-y-1">
            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: words.length >= MIN_WORDS ? '#C0F300' : '#00E5FF',
                  boxShadow: words.length >= MIN_WORDS
                    ? '0 0 8px rgba(192,243,0,0.6)'
                    : '0 0 8px rgba(0,229,255,0.6)',
                }}
                animate={{ width: `${Math.min((words.length / MIN_WORDS) * 100, 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-xs text-gray-500 text-right">
              {words.length < MIN_WORDS
                ? `${MIN_WORDS - words.length} kata lagi untuk bisa main!`
                : `✅ Siap dimainkan!`}
            </p>
          </div>
        )}
      </main>

      {/* ── Fixed CTA Button ─────────────────────────────────────── */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-gradient-to-t from-[#121212] via-[#121212]/90 to-transparent">
        <motion.button
          id="btn-play-custom"
          onClick={handlePlay}
          disabled={!isValid}
          whileHover={isValid ? { scale: 1.02 } : {}}
          whileTap={isValid ? { scale: 0.97 } : {}}
          className={`w-full py-4 rounded-2xl font-black text-lg uppercase tracking-widest
                      flex items-center justify-center gap-3 transition-all duration-200
                      ${isValid
                        ? 'text-black shadow-[0_0_24px_rgba(192,243,0,0.6)]'
                        : 'bg-[#2A2A2A] text-gray-600 border border-gray-700 cursor-not-allowed'}`}
          style={isValid ? { backgroundColor: '#C0F300' } : {}}
        >
          <PlayCircle className={`w-6 h-6 ${isValid ? 'text-black' : 'text-gray-600'}`} />
          Mainkan Sekarang
        </motion.button>
      </div>
    </div>
  );
}
