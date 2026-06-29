'use client';

import Link from 'next/link';
import {
  Sparkles,
  ArrowLeftRight,
  FlaskConical,
  Dice5,
  Smartphone,
  Zap,
} from 'lucide-react';
import type { Game } from '@/types/game';

/* ─── Icon map ──────────────────────────────────────────────── */
type IconKey = 'bottle' | 'arrows' | 'test-tube' | 'dice' | 'phone';

const iconMap: Record<IconKey, React.ElementType> = {
  bottle:      Sparkles,
  arrows:      ArrowLeftRight,
  'test-tube': FlaskConical,
  dice:        Dice5,
  phone:       Smartphone,
};

/* ─── Border → neon glow map ────────────────────────────────── */
interface BorderConfig {
  borderColor: string;     // CSS hex/rgba value
  glowColor:   string;     // CSS rgba for box-shadow
  iconBg:      string;     // icon container background
  iconColor:   string;     // icon stroke color
}

const borderMap: Record<string, BorderConfig> = {
  'border-pink-300': {
    borderColor: '#f9a8d4',
    glowColor:   'rgba(249,168,212,0.40)',
    iconBg:      'rgba(249,168,212,0.12)',
    iconColor:   '#f9a8d4',
  },
  'border-cyan-400': {
    borderColor: '#22d3ee',
    glowColor:   'rgba(34,211,238,0.40)',
    iconBg:      'rgba(34,211,238,0.12)',
    iconColor:   '#22d3ee',
  },
  'border-orange-300': {
    borderColor: '#fdba74',
    glowColor:   'rgba(253,186,116,0.40)',
    iconBg:      'rgba(253,186,116,0.12)',
    iconColor:   '#fdba74',
  },
  'border-blue-300': {
    borderColor: '#93c5fd',
    glowColor:   'rgba(147,197,253,0.40)',
    iconBg:      'rgba(147,197,253,0.12)',
    iconColor:   '#93c5fd',
  },
  'border-lime-400': {
    borderColor: '#a3e635',
    glowColor:   'rgba(163,230,53,0.40)',
    iconBg:      'rgba(163,230,53,0.12)',
    iconColor:   '#a3e635',
  },
};

const defaultConfig: BorderConfig = {
  borderColor: '#6b7280',
  glowColor:   'rgba(107,114,128,0.30)',
  iconBg:      'rgba(107,114,128,0.12)',
  iconColor:   '#9ca3af',
};

/* ─── Component ─────────────────────────────────────────────── */
interface GameCardProps {
  game: Game;
  index: number;
}

export default function GameCard({ game, index }: GameCardProps) {
  const config = borderMap[game.border_color] ?? defaultConfig;
  const IconComponent = iconMap[(game.icon_name as IconKey)] ?? Zap;

  return (
    <Link
      href={`/${game.slug}`}
      id={`game-card-${game.slug}`}
      className="block group"
      aria-label={`Play ${game.title}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <article
        className="relative rounded-xl bg-[#1E1E1E] p-4 transition-all duration-300 
                   group-hover:scale-[1.02] group-hover:brightness-110 active:scale-[0.98]"
        style={{
          border: `2px solid ${config.borderColor}`,
          boxShadow: `0 0 14px 2px ${config.glowColor}, inset 0 0 0 1px ${config.borderColor}10`,
        }}
      >
        <div className="flex items-start gap-4">
          {/* Icon container */}
          <div
            className="shrink-0 flex items-center justify-center w-14 h-14 rounded-xl"
            style={{
              background: config.iconBg,
              border: `1px solid ${config.borderColor}40`,
            }}
          >
            <IconComponent
              className="w-7 h-7"
              style={{ color: config.iconColor }}
              strokeWidth={1.8}
            />
          </div>

          {/* Text */}
          <div className="flex flex-col justify-center min-h-[3.5rem]">
            <h2
              className="font-bold text-lg text-white leading-tight tracking-tight"
            >
              {game.title}
            </h2>
            <p className="text-gray-400 text-sm leading-snug mt-1">
              {game.description}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
