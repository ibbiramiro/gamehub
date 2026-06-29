'use client';

import { Home, BarChart2, User } from 'lucide-react';
import { useState } from 'react';

type Tab = 'home' | 'ranks' | 'profile';

export default function BottomNav() {
  const [active, setActive] = useState<Tab>('home');

  const tabs: { id: Tab; icon: React.ElementType; label: string }[] = [
    { id: 'home',    icon: Home,       label: 'Home'    },
    { id: 'ranks',   icon: BarChart2,  label: 'Ranks'   },
    { id: 'profile', icon: User,       label: 'Profile' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md
                 bg-[#1A1A1A] border-t border-gray-800 z-50"
      aria-label="Bottom Navigation"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map(({ id, icon: Icon, label }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              id={`nav-${id}`}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => setActive(id)}
              className={`
                flex flex-col items-center justify-center gap-1
                transition-all duration-200 rounded-xl
                ${isActive
                  ? 'bg-[#C0F300] text-black px-6 py-2 shadow-[0_0_16px_4px_rgba(192,243,0,0.45)]'
                  : 'text-gray-400 px-6 py-2 hover:text-gray-200'
                }
              `}
            >
              <Icon
                className={`${isActive ? 'w-5 h-5' : 'w-5 h-5'}`}
                strokeWidth={isActive ? 2.4 : 1.8}
              />
              <span className={`text-xs font-semibold ${isActive ? 'text-black' : ''}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
