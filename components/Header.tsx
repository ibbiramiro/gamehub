import { UserCircle, Settings } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#151515]/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-md mx-auto flex items-center justify-between px-4 py-3">
        {/* Left – User icon */}
        <button
          id="btn-profile-header"
          aria-label="User Profile"
          className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
        >
          <UserCircle className="w-7 h-7 text-white" strokeWidth={1.5} />
        </button>

        {/* Center – GAME HUB logo */}
        <div className="flex flex-col leading-none select-none">
          <span
            className="text-[2rem] font-black tracking-tighter text-[#C0F300]"
            style={{
              fontFamily: 'Inter, sans-serif',
              lineHeight: 0.9,
              textShadow: '0 0 16px rgba(192,243,0,0.6), 0 0 8px rgba(192,243,0,0.4)',
              letterSpacing: '-0.04em',
            }}
          >
            GAME
          </span>
          <span
            className="text-[2rem] font-black tracking-tighter text-[#C0F300]"
            style={{
              fontFamily: 'Inter, sans-serif',
              lineHeight: 0.9,
              textShadow: '0 0 16px rgba(192,243,0,0.6), 0 0 8px rgba(192,243,0,0.4)',
              letterSpacing: '-0.04em',
            }}
          >
            HUB
          </span>
        </div>

        {/* Right – Settings icon */}
        <button
          id="btn-settings"
          aria-label="Settings"
          className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
        >
          <Settings className="w-7 h-7 text-white" strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}
