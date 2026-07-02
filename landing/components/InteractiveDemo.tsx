"use client";

import { useState, useEffect } from "react";
import { Sparkles, Coffee, Ban, TrendingUp } from "lucide-react";

function MascotFullSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes penny-blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        @keyframes penny-wave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }
        @keyframes penny-breathe {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }
        @keyframes coin-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-4px) rotate(5deg); }
        }
        .penny-left-eye {
          transform-origin: 38px 51px;
          animation: penny-blink 4s infinite ease-in-out;
        }
        .penny-right-eye {
          transform-origin: 62px 51px;
          animation: penny-blink 4s infinite ease-in-out;
        }
        .penny-waving-arm {
          transform-origin: 74px 58px;
          animation: penny-wave 2s infinite ease-in-out;
        }
        .penny-body-group {
          animation: penny-breathe 3s infinite ease-in-out;
        }
        .penny-coin {
          transform-origin: 50px 18px;
          animation: coin-float 2.5s infinite ease-in-out;
        }
      `}</style>

      <defs>
        <linearGradient id="penny-body-grad" x1="50" y1="30" x2="50" y2="82" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f3e8ff" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
        <linearGradient id="penny-coin-grad" x1="50" y1="10" x2="50" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffe57f" />
          <stop offset="100%" stopColor="#ffb300" />
        </linearGradient>
      </defs>

      {/* Floating Gold Coin */}
      <g className="penny-coin">
        {/* Coin Body */}
        <circle cx="50" cy="18" r="8" fill="url(#penny-coin-grad)" stroke="#ff9100" strokeWidth="1" />
        {/* Coin Inner Border */}
        <circle cx="50" cy="18" r="5.5" stroke="#ff9100" strokeWidth="0.5" fill="none" />
        {/* Coin "C" (Coinstack symbol) */}
        <path d="M 52.5 15.5 A 2.5 2.5 0 1 0 52.5 20.5" stroke="#ff9100" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </g>

      {/* Coin Slot on Head */}
      <ellipse cx="50" cy="31" rx="8" ry="2" fill="#1b1b23" opacity="0.8" />

      {/* Left Foot */}
      <circle cx="36" cy="83" r="7.5" fill="#a855f7" />
      {/* Right Foot */}
      <circle cx="64" cy="83" r="7.5" fill="#a855f7" />

      {/* Curly Tail on the left */}
      <path d="M 22 62 Q 13 60 15 52 Q 19 48 24 53" stroke="#a855f7" strokeWidth="3.5" fill="none" strokeLinecap="round" />

      {/* Waving Right Arm */}
      <g className="penny-waving-arm">
        <path d="M 74 58 Q 88 56 88 42" stroke="#a855f7" strokeWidth="8" strokeLinecap="round" fill="none" />
      </g>
      
      {/* Left Arm */}
      <path d="M 26 58 Q 12 56 12 42" stroke="#a855f7" strokeWidth="8" strokeLinecap="round" fill="none" />

      {/* Body Group (Breathing) */}
      <g className="penny-body-group">
        {/* Body */}
        <circle cx="50" cy="58" r="28" fill="url(#penny-body-grad)" stroke="#a855f7" strokeWidth="1.5" />

        {/* Ears */}
        {/* Left Ear */}
        <path d="M 28 38 Q 16 25 23 20 Q 32 24 35 34 Z" fill="#c084fc" stroke="#a855f7" strokeWidth="1" />
        <path d="M 27 34 Q 20 24 23 22 Q 28 25 31 31 Z" fill="#f3e8ff" />
        {/* Right Ear */}
        <path d="M 72 38 Q 84 25 77 20 Q 68 24 65 34 Z" fill="#c084fc" stroke="#a855f7" strokeWidth="1" />
        <path d="M 73 34 Q 80 24 77 22 Q 72 25 69 31 Z" fill="#f3e8ff" />

        {/* Snout */}
        <ellipse cx="50" cy="65" rx="10.5" ry="7.5" fill="#a855f7" />
        {/* Snout Inner Light */}
        <ellipse cx="50" cy="65" rx="9" ry="6" fill="#c084fc" />
        {/* Nostrils */}
        <circle cx="47" cy="65" r="1.5" fill="#701a75" />
        <circle cx="53" cy="65" r="1.5" fill="#701a75" />

        {/* Mouth */}
        <path d="M 45 73 Q 50 78 55 73" stroke="#1b1b23" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Cheek Blush */}
        <circle cx="28" cy="60" r="4.5" fill="#f472b6" opacity="0.6" />
        <circle cx="72" cy="60" r="4.5" fill="#f472b6" opacity="0.6" />

        {/* Eyes & Pupils */}
        <g className="penny-left-eye">
          <circle cx="38" cy="51" r="7" fill="#1b1b23" />
          <circle cx="36.5" cy="48.5" r="2.2" fill="white" />
        </g>
        <g className="penny-right-eye">
          <circle cx="62" cy="51" r="7" fill="#1b1b23" />
          <circle cx="60.5" cy="48.5" r="2.2" fill="white" />
        </g>
      </g>
    </svg>
  );
}

export default function InteractiveDemo() {
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(30);
  const [coins, setCoins] = useState(120);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [floatingParticles, setFloatingParticles] = useState<{ id: number; text: string; x: number; y: number }[]>([]);

  // Quest Handler
  const handleQuestClick = (xpGain: number, coinsGain: number, savedVal: number) => {
    if (isLevelingUp) return;

    // trigger mascot react
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 400);

    // add stats
    setCoins(prev => prev + coinsGain);
    
    const newXp = xp + xpGain;
    if (newXp >= 100) {
      setXp(newXp - 100);
      setLevel(prev => prev + 1);
      setIsLevelingUp(true);
      setTimeout(() => setIsLevelingUp(false), 1800);
    } else {
      setXp(newXp);
    }

    // spawn float animation relative to center container
    const id = Date.now() + Math.random();
    const randX = 20 + Math.floor(Math.random() * 45); // offset starting position
    const randY = 40 + Math.floor(Math.random() * 20);
    setFloatingParticles(prev => [
      ...prev,
      { id, text: `+$${savedVal} Saved • +${xpGain} XP`, x: randX, y: randY }
    ]);
  };

  // Cleanup particles
  useEffect(() => {
    if (floatingParticles.length > 0) {
      const timer = setTimeout(() => {
        setFloatingParticles(prev => prev.slice(1));
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [floatingParticles]);

  return (
    <section className="bg-gradient-to-b from-[#f8fafc] to-[#e8e4f8] text-[#1b1b23] py-24 relative overflow-hidden border-t border-slate-200/80" id="offers">
      <style>{`
        @keyframes demo-float-up-fade {
          0% {
            transform: translate(-50%, 0) translateY(0px) scale(0.9);
            opacity: 0;
          }
          15% {
            opacity: 1;
            transform: translate(-50%, 0) translateY(-10px) scale(1.05);
          }
          100% {
            transform: translate(-50%, 0) translateY(-85px) scale(0.95);
            opacity: 0;
          }
        }

        @keyframes demo-scale-pop {
          0% { transform: scale(0.5); opacity: 0; }
          15% { transform: scale(1.05); opacity: 1; }
          30% { transform: scale(1.0); }
          85% { transform: scale(1.0); opacity: 1; }
          100% { transform: scale(0.85); opacity: 0; }
        }

        @keyframes demo-mascot-jump {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px) scaleY(0.93); }
        }

        .animate-float-up {
          animation: demo-float-up-fade 1.1s forwards ease-out;
        }

        .animate-scale-pop {
          animation: demo-scale-pop 1.8s forwards cubic-bezier(0.175, 0.885, 0.32, 1.2);
        }

        .animate-mascot-jump-trigger {
          animation: demo-mascot-jump 0.4s ease-out;
        }
      `}</style>

      {/* Decorative background glows */}
      <div className="absolute left-0 top-0 w-[400px] h-[400px] bg-violet-600/5 rounded-full filter blur-[150px] pointer-events-none" />
      <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full filter blur-[150px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          
          {/* Left Column: Demo Controls */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            <span className="inline-flex rounded-full bg-[#4648d4]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#4648d4] border border-[#4648d4]/20 shadow-sm">
              Interactive Demo
            </span>
            <h2 className="text-4xl font-black tracking-[-0.04em] sm:text-5xl leading-tight text-[#1b1b23]">
              Try the game. <br />
              <span className="text-[#4648d4]">Feel the reward.</span>
            </h2>
            <p className="text-base font-semibold text-slate-600 max-w-xl leading-relaxed">
              Select a daily quest below to see how FinLevels turns everyday financial decisions into satisfying wins. Watch your stats grow on the simulator screen in real-time.
            </p>

            <div className="space-y-4 w-full max-w-lg pt-2">
              {/* Quest 1 */}
              <button
                onClick={() => handleQuestClick(30, 20, 5)}
                className="w-full text-left flex justify-between items-center bg-white border border-slate-200 hover:border-[#4648d4]/30 hover:bg-slate-50 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20 shrink-0">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#1b1b23] text-sm sm:text-base group-hover:text-[#4648d4] transition-colors">Brewed coffee at home</h4>
                    <p className="text-xs font-bold text-slate-500">Instead of buying takeaway coffee</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs font-black text-[#006b5f] bg-[#e8fffb] px-3 py-1 rounded-full border border-[#a3f0e1] whitespace-nowrap">
                    Saved $5
                  </span>
                  <span className="text-[10px] font-black text-[#4648d4]">+30 XP</span>
                </div>
              </button>

              {/* Quest 2 */}
              <button
                onClick={() => handleQuestClick(50, 45, 15)}
                className="w-full text-left flex justify-between items-center bg-white border border-slate-200 hover:border-[#4648d4]/30 hover:bg-slate-50 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center border border-red-500/20 shrink-0">
                    <Ban className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#1b1b23] text-sm sm:text-base group-hover:text-[#4648d4] transition-colors">Skipped impulse buy</h4>
                    <p className="text-xs font-bold text-slate-500">Resisted ordering fast food or clothes</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs font-black text-[#006b5f] bg-[#e8fffb] px-3 py-1 rounded-full border border-[#a3f0e1] whitespace-nowrap">
                    Saved $15
                  </span>
                  <span className="text-[10px] font-black text-[#4648d4]">+50 XP</span>
                </div>
              </button>

              {/* Quest 3 */}
              <button
                onClick={() => handleQuestClick(40, 30, 10)}
                className="w-full text-left flex justify-between items-center bg-white border border-slate-200 hover:border-[#4648d4]/30 hover:bg-slate-50 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20 shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#1b1b23] text-sm sm:text-base group-hover:text-[#4648d4] transition-colors">Sent $10 to savings</h4>
                    <p className="text-xs font-bold text-slate-500">Automated your emergency backup fund</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs font-black text-[#006b5f] bg-[#e8fffb] px-3 py-1 rounded-full border border-[#a3f0e1] whitespace-nowrap">
                    Saved $10
                  </span>
                  <span className="text-[10px] font-black text-[#4648d4]">+40 XP</span>
                </div>
              </button>
            </div>
          </div>

          {/* Right Column: Phone Simulator */}
          <div className="lg:col-span-5 flex justify-center items-center">
            {/* Phone Mockup Chassis */}
            <div className="relative w-[285px] h-[525px] bg-[#0c0c1e] border-[8px] border-slate-900 rounded-[3rem] shadow-2xl p-5 flex flex-col justify-between text-white overflow-hidden select-none">
              
              {/* Phone Top Notch Speaker */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-slate-900 rounded-b-2xl border-x border-b border-white/5 flex items-center justify-center z-40">
                <div className="w-12 h-1 bg-slate-800 rounded-full mb-1" />
              </div>

              {/* Status Bar */}
              <div className="flex justify-between items-center text-[9px] font-black text-slate-400 px-2 mt-1 z-30">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <span>5G</span>
                  <div className="w-3.5 h-2 bg-slate-400 rounded-[2px] flex items-center justify-end p-[0.5px]">
                    <div className="w-2.5 h-full bg-slate-900 rounded-[1px]" />
                  </div>
                </div>
              </div>

              {/* App Level & Currency Headers */}
              <div className="mt-5 flex items-center justify-between z-30">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#4648d4]/20 border border-[#4648d4]/30 flex items-center justify-center text-[10px] font-black text-[#e4ff30] shadow-sm select-none">
                    ★
                  </div>
                  <div>
                    <span className="text-[8px] font-black uppercase text-slate-400 block leading-none tracking-wider">PLAYER</span>
                    <span className="text-xs font-black text-white leading-none">Level {level}</span>
                  </div>
                </div>
                
                <div className="bg-[#e4ff30]/10 border border-[#e4ff30]/25 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-sm">
                  <span className="text-xs">🪙</span>
                  <span className="text-xs font-black text-[#e4ff30]">{coins}</span>
                </div>
              </div>

              {/* Center Mascot & Particle Splash Screen */}
              <div className="relative my-4 flex-1 flex items-center justify-center min-h-[170px] overflow-visible">
                {/* Purple Mesh Background Glow inside phone */}
                <div className="absolute w-36 h-36 bg-[#4648d4]/25 filter blur-[20px] rounded-full pointer-events-none" />

                {/* Floating Float Animation Particles */}
                {floatingParticles.map(particle => (
                  <span
                    key={particle.id}
                    className="absolute text-[10px] font-black text-emerald-400 bg-slate-900/90 border border-emerald-500/25 px-2.5 py-1 rounded-full shadow-lg z-30 select-none pointer-events-none animate-float-up whitespace-nowrap"
                    style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
                  >
                    {particle.text}
                  </span>
                ))}

                {/* Animated SVG Mascot */}
                <div className={`w-36 h-36 z-10 transition-transform select-none ${isJumping ? "animate-mascot-jump-trigger" : ""}`}>
                  <MascotFullSvg className="w-full h-full drop-shadow-[0_10px_20px_rgba(70,72,212,0.35)]" />
                </div>

                {/* Level Up Celebration Screen Overlay */}
                {isLevelingUp && (
                  <div className="absolute inset-0 bg-[#0c0c1e]/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center animate-scale-pop rounded-3xl border border-[#e4ff30]/10">
                    <Sparkles className="h-10 w-10 text-[#e4ff30] animate-pulse" />
                    <h3 className="text-2xl font-black text-[#e4ff30] tracking-wider mt-2 select-none">LEVEL UP!</h3>
                    <p className="text-xs font-black text-white mt-1 select-none">Reaching Level {level}</p>
                  </div>
                )}
              </div>

              {/* Progress bar at the bottom */}
              <div className="space-y-1.5 mt-auto z-30">
                <div className="flex justify-between items-center text-[9px] font-black text-slate-400 tracking-wider">
                  <span>XP PROGRESS</span>
                  <span>{xp} / 100 XP</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3.5 overflow-hidden border border-white/5 p-[2px]">
                  <div
                    className="bg-gradient-to-r from-violet-500 to-[#4648d4] h-full rounded-full transition-all duration-300 shadow-[0_0_8px_#6366f1]"
                    style={{ width: `${xp}%` }}
                  />
                </div>
              </div>

              {/* Mock App Tab Navigation Bar */}
              <div className="mt-4 pt-3.5 border-t border-white/5 flex justify-between items-center text-slate-500 px-3 select-none z-30">
                <span className="text-[9px] font-black text-[#4648d4] flex flex-col items-center">
                  <span>🎮</span>
                  <span className="mt-0.5 scale-90">Quest</span>
                </span>
                <span className="text-[9px] font-black hover:text-white transition-colors flex flex-col items-center cursor-not-allowed">
                  <span>🏆</span>
                  <span className="mt-0.5 scale-90">Ranks</span>
                </span>
                <span className="text-[9px] font-black hover:text-white transition-colors flex flex-col items-center cursor-not-allowed">
                  <span>👤</span>
                  <span className="mt-0.5 scale-90">Hero</span>
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
