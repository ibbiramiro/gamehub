'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface RotateScreenProps {
  onLandscapeDetected: () => void;
}

export default function RotateScreen({ onLandscapeDetected }: RotateScreenProps) {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    function check() {
      const landscape =
        window.innerWidth > window.innerHeight ||
        (screen.orientation?.type ?? '').includes('landscape');
      setIsLandscape(landscape);
      if (landscape) onLandscapeDetected();
    }
    check();
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, [onLandscapeDetected]);

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center px-6 text-center">
      {/* Animated phone-rotate icon */}
      <motion.div
        animate={{ rotate: [0, -90, -90, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.8 }}
        className="mb-10"
      >
        {/* Custom SVG phone rotating to landscape */}
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Circle background */}
          <circle cx="50" cy="50" r="46" stroke="#C0F300" strokeWidth="3" strokeDasharray="8 5"
            opacity="0.4" />
          {/* Phone shape (portrait) */}
          <rect x="33" y="20" width="34" height="52" rx="5" stroke="#C0F300" strokeWidth="3" />
          {/* Phone screen */}
          <rect x="37" y="26" width="26" height="36" rx="2" fill="#C0F300" opacity="0.2" />
          {/* Home button */}
          <circle cx="50" cy="66" r="3" fill="#C0F300" opacity="0.6" />
          {/* Rotation arrow */}
          <path
            d="M 22 38 A 30 30 0 0 1 78 38"
            stroke="#C0F300"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <polygon points="78,38 72,32 72,44" fill="#C0F300" />
        </svg>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-black text-white mb-4 uppercase tracking-tight"
      >
        Rotate Your Phone
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="text-gray-400 text-base leading-relaxed max-w-[80%]"
      >
        This game is played in landscape mode.
        Hold the phone against your forehead!
      </motion.p>

      {/* Status hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-10 flex items-center gap-2 text-sm text-gray-600"
      >
        <RefreshCw className="w-4 h-4 animate-spin" style={{ animationDuration: '2s' }} />
        <span>Menunggu rotasi layar...</span>
      </motion.div>

      {/* Dev bypass button — tap to skip on desktop */}
      <motion.button
        id="btn-skip-rotate"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        onClick={onLandscapeDetected}
        className="mt-8 px-6 py-2.5 rounded-xl border border-gray-700 text-gray-500 text-sm
                   hover:border-[#C0F300] hover:text-[#C0F300] transition-all duration-200"
      >
        Lanjut tanpa rotasi (desktop) →
      </motion.button>
    </div>
  );
}
