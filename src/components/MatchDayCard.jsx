import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, ExternalLink, Shield } from "lucide-react";

export default function MatchDayCard() {
  // Target date for next match (or fallback to an upcoming weekend)
  const [timeLeft, setTimeLeft] = useState({ days: 4, hours: 16, minutes: 30 });

  useEffect(() => {
    // Target next Saturday 18:30
    const now = new Date();
    const nextMatch = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
    nextMatch.setDate(now.getDate() + daysUntilSaturday);
    nextMatch.setHours(18, 30, 0, 0);

    const updateTimer = () => {
      const current = new Date();
      const diff = nextMatch - current;
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        setTimeLeft({ days, hours, minutes });
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto my-8 relative rounded-3xl p-1 bg-gradient-to-r from-orange-500/50 via-[#6b5bd7]/40 to-orange-500/50 shadow-2xl overflow-hidden group">
      {/* Background glow & blur */}
      <div className="relative rounded-[22px] bg-[#141129]/95 backdrop-blur-xl p-6 sm:p-8 border border-white/10 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-5">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-black uppercase tracking-widest animate-pulse">
            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
            SEURAAVA OTTELU · 3. DIVISIOONA
          </div>

          {/* Teams Grid */}
          <div className="grid grid-cols-3 items-center w-full gap-2 sm:gap-4">
            {/* SekTa Home */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#6b5bd7] to-[#f2a24a] p-0.5 shadow-lg shadow-purple-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-[#0b0a16] rounded-[14px] flex items-center justify-center p-2">
                  <img src="/SekTa_LOGO_ilman_tausta.png" alt="SekTa" className="h-full w-auto object-contain drop-shadow" />
                </div>
              </div>
              <span className="text-base sm:text-lg font-black text-white mt-2 tracking-wide">SekTa</span>
              <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">KOTI</span>
            </div>

            {/* VS & Match Info */}
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-orange-400 font-mono tracking-widest drop-shadow-md">
                VS
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full mt-2 border border-white/10 shadow">
                <Calendar size={12} className="text-orange-400" />
                <span>La klo 18:30</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#b7b3d9] mt-1">
                <MapPin size={11} className="text-purple-400" />
                <span>Lippumäen Areena</span>
              </div>
            </div>

            {/* Opponent Away */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 p-0.5 border border-white/20 shadow-lg flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center font-black text-xl text-slate-300">
                  <Shield size={32} className="text-slate-400" />
                </div>
              </div>
              <span className="text-base sm:text-lg font-black text-white mt-2 tracking-wide">SB Savo</span>
              <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">VIERAS</span>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 sm:gap-3 pt-2">
            <div className="bg-black/60 border border-white/10 rounded-xl px-3 sm:px-4 py-2 text-center min-w-[56px] sm:min-w-[64px]">
              <span className="text-xl sm:text-2xl font-black text-white font-mono">{String(timeLeft.days).padStart(2, '0')}</span>
              <span className="text-[9px] uppercase text-white/50 block font-bold">Päivää</span>
            </div>
            <span className="text-lg font-black text-orange-400">:</span>
            <div className="bg-black/60 border border-white/10 rounded-xl px-3 sm:px-4 py-2 text-center min-w-[56px] sm:min-w-[64px]">
              <span className="text-xl sm:text-2xl font-black text-white font-mono">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-[9px] uppercase text-white/50 block font-bold">Tuntia</span>
            </div>
            <span className="text-lg font-black text-orange-400">:</span>
            <div className="bg-black/60 border border-white/10 rounded-xl px-3 sm:px-4 py-2 text-center min-w-[56px] sm:min-w-[64px]">
              <span className="text-xl sm:text-2xl font-black text-white font-mono">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-[9px] uppercase text-white/50 block font-bold">Minuuttia</span>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap gap-3 justify-center pt-1">
            <a
              href="https://sekta.nimenhuuto.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 hover:scale-105 transition flex items-center gap-1.5"
            >
              <span>Nimenhuuto</span>
              <ExternalLink size={14} />
            </a>
            <Link
              to="/tactics"
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/15 transition"
            >
              Tarkista Kokoonpano
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
