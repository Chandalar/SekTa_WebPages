import React from "react";
import { Trophy, Flame, TrendingUp } from "lucide-react";
import { getPlayerImage } from "../utils/playerMedia";

export default function StatsPodium({ playerStats = [], season = "" }) {
  // Sort players by points descending
  const sorted = [...playerStats]
    .filter(p => (p.points || 0) > 0 || (p.goals || 0) > 0)
    .sort((a, b) => (b.points || 0) - (a.points || 0));

  const first = sorted[0];
  const second = sorted[1];
  const third = sorted[2];

  if (!first) return null;

  return (
    <div className="w-full bg-gradient-to-r from-[#141129] via-[#1c163b] to-[#141129] border border-white/10 rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden mb-8">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
            <Trophy size={20} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              Pistepörssin Kärki {season ? `· ${season}` : ""}
            </h3>
            <p className="text-xs text-[#b7b3d9]">Kauden tehokkaimmat pistenikkarit mitalipallilla</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10 text-xs font-bold text-orange-400">
          <Flame size={14} className="text-orange-400" />
          <span>Top 3 Pistelinko</span>
        </div>
      </div>

      {/* PODIUM DISPLAY */}
      <div className="flex items-end justify-center gap-3 sm:gap-6 max-w-lg mx-auto pt-6 pb-2 relative z-10">
        {/* 2nd Place (Silver) */}
        {second && (
          <div className="flex flex-col items-center flex-1 transition-transform hover:-translate-y-1 duration-300">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-slate-300 bg-slate-800 shadow-xl overflow-hidden mb-2">
              <img
                src={second.img || `/${getPlayerImage(second.name)}`}
                alt={second.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML = `<div class="w-full h-full bg-slate-700 flex items-center justify-center text-slate-200 font-black text-base">#2</div>`;
                }}
              />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-slate-300 text-slate-900 text-[10px] font-black px-2 rounded-full shadow">
                2.
              </div>
            </div>
            <strong className="text-xs sm:text-sm font-bold text-white text-center truncate max-w-[100px] sm:max-w-[130px]">
              {second.name?.split(' ')[0]} {second.name?.split(' ')[1]?.[0] ? `${second.name?.split(' ')[1][0]}.` : ''}
            </strong>
            <span className="text-[11px] font-mono text-white/80">{second.goals}M + {second.assists}S</span>
            <span className="text-xs font-black text-slate-300 mt-0.5">{second.points}p</span>
            
            {/* Silver Pillar */}
            <div className="w-full bg-gradient-to-t from-slate-800 via-slate-700 to-slate-500 rounded-t-2xl h-24 sm:h-28 flex flex-col items-center justify-center font-black text-3xl text-slate-200 mt-2 shadow-lg border-t-2 border-slate-300/40">
              <span>2</span>
            </div>
          </div>
        )}

        {/* 1st Place (Gold) */}
        {first && (
          <div className="flex flex-col items-center flex-1 transition-transform hover:-translate-y-1 duration-300">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-3 border-amber-400 bg-amber-950/60 shadow-2xl shadow-amber-500/40 overflow-hidden mb-2 ring-4 ring-amber-500/20">
              <img
                src={first.img || `/${getPlayerImage(first.name)}`}
                alt={first.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML = `<div class="w-full h-full bg-amber-800 flex items-center justify-center text-amber-200 font-black text-xl">#1</div>`;
                }}
              />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-400 text-black text-xs font-black px-2.5 py-0.5 rounded-full shadow-lg flex items-center gap-1">
                <span>👑</span> 1.
              </div>
            </div>
            <strong className="text-sm sm:text-base font-black text-amber-300 text-center truncate max-w-[120px] sm:max-w-[150px]">
              {first.name}
            </strong>
            <span className="text-xs font-mono text-white/90">{first.goals}M + {first.assists}S</span>
            <span className="text-sm font-black text-amber-400 mt-0.5">{first.points} pistettä</span>

            {/* Gold Pillar */}
            <div className="w-full bg-gradient-to-t from-amber-800 via-amber-600 to-yellow-400 rounded-t-2xl h-36 sm:h-40 flex flex-col items-center justify-center font-black text-4xl text-amber-950 mt-2 shadow-2xl shadow-amber-500/30 border-t-2 border-yellow-200">
              <span>1</span>
            </div>
          </div>
        )}

        {/* 3rd Place (Bronze) */}
        {third && (
          <div className="flex flex-col items-center flex-1 transition-transform hover:-translate-y-1 duration-300">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-amber-700 bg-amber-950 shadow-xl overflow-hidden mb-2">
              <img
                src={third.img || `/${getPlayerImage(third.name)}`}
                alt={third.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML = `<div class="w-full h-full bg-amber-900 flex items-center justify-center text-amber-300 font-black text-base">#3</div>`;
                }}
              />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-amber-700 text-white text-[10px] font-black px-2 rounded-full shadow">
                3.
              </div>
            </div>
            <strong className="text-xs sm:text-sm font-bold text-white text-center truncate max-w-[100px] sm:max-w-[130px]">
              {third.name?.split(' ')[0]} {third.name?.split(' ')[1]?.[0] ? `${third.name?.split(' ')[1][0]}.` : ''}
            </strong>
            <span className="text-[11px] font-mono text-white/80">{third.goals}M + {third.assists}S</span>
            <span className="text-xs font-black text-amber-500 mt-0.5">{third.points}p</span>

            {/* Bronze Pillar */}
            <div className="w-full bg-gradient-to-t from-orange-950 via-amber-900 to-amber-700 rounded-t-2xl h-20 sm:h-22 flex flex-col items-center justify-center font-black text-2xl text-amber-200 mt-2 shadow-lg border-t-2 border-amber-500/40">
              <span>3</span>
            </div>
          </div>
        )}
      </div>

      {/* Kuntopuntari (Form Guide) Bar */}
      <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-green-400" />
          <span className="text-white/70">Kuntopuntari (Viimeisimmät 5 peliä):</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-7 h-7 rounded-lg bg-green-500 text-white font-black text-xs flex items-center justify-center shadow-md shadow-green-500/30" title="Voitto (7-4)">
            V
          </span>
          <span className="w-7 h-7 rounded-lg bg-green-500 text-white font-black text-xs flex items-center justify-center shadow-md shadow-green-500/30" title="Voitto (6-2)">
            V
          </span>
          <span className="w-7 h-7 rounded-lg bg-red-500 text-white font-black text-xs flex items-center justify-center shadow-md shadow-red-500/30" title="Häviö (3-5)">
            H
          </span>
          <span className="w-7 h-7 rounded-lg bg-amber-500 text-black font-black text-xs flex items-center justify-center shadow-md shadow-amber-500/30" title="Tasapeli (4-4)">
            T
          </span>
          <span className="w-7 h-7 rounded-lg bg-green-500 text-white font-black text-xs flex items-center justify-center shadow-md shadow-green-500/30" title="Voitto (8-3)">
            V
          </span>
          <span className="text-green-400 font-bold ml-2">10 / 15 pistettä</span>
        </div>
      </div>
    </div>
  );
}
