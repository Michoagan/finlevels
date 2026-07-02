"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export default function PlayerStatsWidget() {
  const [stats, setStats] = useState<{ level: number; xp: number; coins: number } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLvl = localStorage.getItem("finlevels_level");
      const savedXp = localStorage.getItem("finlevels_total_xp");
      const savedCoins = localStorage.getItem("finlevels_total_coins");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStats({
        level: savedLvl ? parseInt(savedLvl, 10) : 1,
        xp: savedXp ? parseInt(savedXp, 10) : 0,
        coins: savedCoins ? parseInt(savedCoins, 10) : 0,
      });
    }
  }, []);

  if (!stats) return null;

  const currentLevelXpBase = (stats.level - 1) * 300;
  const xpInCurrentLevel = stats.xp - currentLevelXpBase;
  const xpNeededForNextLevel = 300;
  const xpPercent = Math.min(Math.max(Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100), 0), 100);

  return (
    <div className="rounded-4xl border border-[#4648d4]/15 bg-[#f5f2fe] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-md">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">RPG Stats</p>
          <p className="text-sm font-black text-[#1b1b23]">Level {stats.level} Character</p>
        </div>
      </div>

      <div className="flex-1 max-w-xs">
        <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mb-1">
          <span>XP Progression</span>
          <span>{xpInCurrentLevel} / 300 XP</span>
        </div>
        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${xpPercent}%` }} />
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white border border-[#4648d4]/10 rounded-2xl px-4 py-2 self-start sm:self-auto shadow-sm">
        <span className="text-xs font-black text-[#464554] uppercase tracking-wide">Wallet:</span>
        <span className="font-black text-amber-600 text-sm">💰 {stats.coins} Coins</span>
      </div>
    </div>
  );
}
