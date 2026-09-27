import React from 'react';

/**
 * TacticsCourt - Realistinen salibandykaukalon vektoripohjainen alusta
 * @param {string} surface - 'court-blue' | 'court-wood' | 'court-neon' | 'court-classic'
 */
export default function TacticsCourt({ surface = 'court-blue' }) {
  if (surface === 'court-classic') {
    return (
      <div className="absolute inset-0 bg-gray-900 flex items-center justify-center pointer-events-none select-none">
        <div className="text-white text-6xl font-black opacity-5 tracking-widest">SEKTA</div>
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 ${surface} rounded-[28px] sm:rounded-[36px] border-[4px] sm:border-[6px] border-white/85 shadow-2xl overflow-hidden pointer-events-none select-none transition-colors duration-500`}>
      {/* Dynamic Arena lighting glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/25 pointer-events-none" />

      {/* SVG Official Floorball Field Markings */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 800 450"
        preserveAspectRatio="none"
      >
        {/* Center Line */}
        <line
          x1="400"
          y1="0"
          x2="400"
          y2="450"
          stroke="rgba(255, 255, 255, 0.75)"
          strokeWidth="3"
        />

        {/* Center Circle & Center Dot */}
        <circle
          cx="400"
          cy="225"
          r="55"
          fill="none"
          stroke="rgba(255, 255, 255, 0.75)"
          strokeWidth="2.5"
        />
        <circle cx="400" cy="225" r="4.5" fill="#f2a24a" />

        {/* 6 Official Floorball Faceoff Crosses */}
        {/* Left corner faceoff spots */}
        <g stroke="rgba(255, 255, 255, 0.8)" strokeWidth="2.5">
          <line x1="120" y1="80" x2="140" y2="80" /><line x1="130" y1="70" x2="130" y2="90" />
          <line x1="120" y1="370" x2="140" y2="370" /><line x1="130" y1="360" x2="130" y2="380" />
        </g>
        {/* Center zone faceoff spots */}
        <g stroke="rgba(255, 255, 255, 0.8)" strokeWidth="2.5">
          <line x1="390" y1="80" x2="410" y2="80" /><line x1="400" y1="70" x2="400" y2="90" />
          <line x1="390" y1="370" x2="410" y2="370" /><line x1="400" y1="360" x2="400" y2="380" />
        </g>
        {/* Right corner faceoff spots */}
        <g stroke="rgba(255, 255, 255, 0.8)" strokeWidth="2.5">
          <line x1="660" y1="80" x2="680" y2="80" /><line x1="670" y1="70" x2="670" y2="90" />
          <line x1="660" y1="370" x2="680" y2="370" /><line x1="670" y1="360" x2="670" y2="380" />
        </g>

        {/* LEFT GOAL CREASE (Maalialue 4m x 5m) & GOALIE AREA (1m x 2.5m) */}
        <rect
          x="32"
          y="160"
          width="85"
          height="130"
          fill="rgba(242, 162, 74, 0.14)"
          stroke="rgba(255, 255, 255, 0.85)"
          strokeWidth="2.5"
          rx="3"
        />
        <rect
          x="54"
          y="192"
          width="42"
          height="66"
          fill="rgba(107, 91, 215, 0.25)"
          stroke="#f2a24a"
          strokeWidth="2"
          rx="2"
        />
        {/* Left Goal Cage (Maali) */}
        <rect
          x="16"
          y="196"
          width="20"
          height="58"
          fill="rgba(255, 255, 255, 0.25)"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeDasharray="2,2"
          rx="2"
        />

        {/* RIGHT GOAL CREASE & GOALIE AREA */}
        <rect
          x="683"
          y="160"
          width="85"
          height="130"
          fill="rgba(242, 162, 74, 0.14)"
          stroke="rgba(255, 255, 255, 0.85)"
          strokeWidth="2.5"
          rx="3"
        />
        <rect
          x="704"
          y="192"
          width="42"
          height="66"
          fill="rgba(107, 91, 215, 0.25)"
          stroke="#f2a24a"
          strokeWidth="2"
          rx="2"
        />
        {/* Right Goal Cage (Maali) */}
        <rect
          x="764"
          y="196"
          width="20"
          height="58"
          fill="rgba(255, 255, 255, 0.25)"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeDasharray="2,2"
          rx="2"
        />

        {/* Center SekTa Emblem Watermark */}
        <g transform="translate(400, 225) scale(0.7)" opacity="0.2">
          <circle r="65" fill="none" stroke="#ffffff" strokeWidth="4" />
          <text
            x="0"
            y="15"
            textAnchor="middle"
            fontSize="42"
            fontWeight="900"
            fill="#ffffff"
            letterSpacing="5"
          >
            SEKTA
          </text>
        </g>
      </svg>
    </div>
  );
}
