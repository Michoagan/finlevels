"use client";

import { Sparkles, AlertTriangle, ArrowLeft, Bell } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePushNotifications } from "../../../hooks/usePushNotifications";
import {
  saveChallengeCompletion,
  allocateGoalSavings,
  getUserGoals,
  saveUserGoalsToDb,
  type UserGoal,
  type ChallengePath,
} from "../../../lib/challenges";
import HoloTradingCard, { renderCharacterSvg } from "../../../components/HoloTradingCard";

type ProfileName =
  | "The Survivor" | "The Explorer" | "The Stabilizer" | "The Saver"
  | "The Builder"  | "The Investor" | "The Strategist" | "The Wealth Architect"
  | "The Opportunist";

const profileImages: Record<ProfileName, string> = {
  "The Survivor": "/profile-survivor.png",
  "The Explorer": "/profile-explorer.png",
  "The Stabilizer": "/profile-stabilizer.png",
  "The Saver": "/profile-saver.png",
  "The Builder": "/profile-builder.png",
  "The Investor": "/profile-investor.png",
  "The Strategist": "/profile-strategist.png",
  "The Opportunist": "/profile-opportunist.png",
  "The Wealth Architect": "/profile-wealth-architect.png",
};


function resolveProfileName(s: number, sv: number, iv: number): ProfileName {
  const hasHighStability = s >= 4;
  const hasHighSaving = sv >= 4;
  const hasHighInvesting = iv >= 4;

  if (s <= 1 && sv <= 1 && iv <= 1) return "The Survivor";
  if (hasHighStability && hasHighSaving && hasHighInvesting) return "The Wealth Architect";
  if (hasHighStability && hasHighSaving && !hasHighInvesting) return "The Builder";
  if (!hasHighStability && hasHighSaving && hasHighInvesting) return "The Opportunist";
  if (hasHighStability && !hasHighSaving && hasHighInvesting) return "The Strategist";
  if (hasHighStability && !hasHighSaving && !hasHighInvesting) return "The Stabilizer";
  if (!hasHighStability && hasHighSaving && !hasHighInvesting) return "The Saver";
  if (!hasHighStability && !hasHighSaving && hasHighInvesting) return "The Investor";
  return "The Explorer";
}
import {
  generateTransactions,
  getDailyQuestDetail,
  getScaleFactor,
} from "../../../lib/transaction-simulator";
import ShareChallengeButton from "../../../components/ShareChallengeButton";
import { trackEvent } from "../../../lib/analytics";

function renderGoalChestSvg(category: string, isActive: boolean) {
  const activeColor = isActive ? "#E4FF30" : "#a855f7";
  const glowClass = isActive ? "animate-pulse filter drop-shadow-[0_0_8px_rgba(228,255,48,0.5)]" : "opacity-75";

  switch (category) {
    case "stability":
      return (
        <svg viewBox="0 0 100 100" className={`w-14 h-14 ${glowClass} transition-all duration-300`}>
          {/* Reinforced Vault Chest */}
          <rect x="20" y="25" width="60" height="50" rx="8" fill="#334155" stroke="#475569" strokeWidth="2" />
          <rect x="25" y="30" width="50" height="40" rx="4" fill="#1e293b" />
          {/* Vault Wheel */}
          <circle cx="50" cy="50" r="14" fill="#64748b" stroke={activeColor} strokeWidth="2" />
          <circle cx="50" cy="50" r="6" fill="#475569" />
          {/* Vault notches */}
          <line x1="50" y1="32" x2="50" y2="40" stroke={activeColor} strokeWidth="1.5" />
          <line x1="50" y1="60" x2="50" y2="68" stroke={activeColor} strokeWidth="1.5" />
          <line x1="32" y1="50" x2="40" y2="50" stroke={activeColor} strokeWidth="1.5" />
          <line x1="60" y1="50" x2="68" y2="50" stroke={activeColor} strokeWidth="1.5" />
          {/* LED light */}
          <circle cx="70" cy="35" r="2" fill={isActive ? "#E4FF30" : "#ef4444"} className={isActive ? "animate-ping" : ""} />
        </svg>
      );
    case "saving":
      return (
        <svg viewBox="0 0 100 100" className={`w-14 h-14 ${glowClass} transition-all duration-300`}>
          {/* Piggy Bank Chest */}
          <path d="M 50,25 C 65,25 78,35 78,50 C 78,65 65,75 50,75 C 42,75 36,71 32,67 L 22,67 C 18,67 18,57 22,57 C 22,57 20,53 20,50 C 20,35 35,25 50,25 Z" fill="#ec4899" stroke="#f472b6" strokeWidth="2" />
          {/* Curly tail */}
          <path d="M 78 50 Q 85 45 83 38" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" />
          {/* Coin slot */}
          <ellipse cx="50" cy="33" rx="6" ry="1.5" fill="#1f2937" />
          {/* Eye */}
          <circle cx="34" cy="45" r="2.5" fill="#1f2937" />
          <circle cx="33.5" cy="44" r="0.8" fill="#fff" />
          {/* Snout */}
          <ellipse cx="22" cy="50" rx="3" ry="5" fill="#db2777" />
          {/* Feet */}
          <rect x="35" y="70" width="8" height="10" rx="2" fill="#db2777" />
          <rect x="57" y="70" width="8" height="10" rx="2" fill="#db2777" />
          {/* Glowing Coin above Piggy */}
          {isActive && (
            <g className="animate-bounce">
              <circle cx="50" cy="15" r="4" fill="#ffd700" stroke="#f5af19" strokeWidth="1" />
              <text x="50" y="17.5" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#904900">$</text>
            </g>
          )}
        </svg>
      );
    case "investing":
    default:
      return (
        <svg viewBox="0 0 100 100" className={`w-14 h-14 ${glowClass} transition-all duration-300`}>
          {/* Quantum Rocket Chest */}
          <polygon points="50,15 80,45 80,75 50,85 20,75 20,45" fill="#312e81" stroke="#4f46e5" strokeWidth="2" />
          {/* Holographic inner grid lines */}
          <line x1="50" y1="15" x2="50" y2="85" stroke="#818cf8" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="20" y1="45" x2="80" y2="45" stroke="#818cf8" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="20" y1="75" x2="80" y2="75" stroke="#818cf8" strokeWidth="1" strokeDasharray="2,2" />
          {/* Glowing Center Core */}
          <circle cx="50" cy="50" r="10" fill="#06b6d4" opacity="0.3" className="animate-pulse" />
          <circle cx="50" cy="50" r="5" fill={activeColor} className="animate-ping" />
          <circle cx="50" cy="50" r="3" fill="#ffffff" />
          {/* Rocket details / float vectors */}
          <path d="M 50 15 L 65 30 M 50 15 L 35 30" stroke={activeColor} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
  }
}

type ChallengeTokenPageClientProps = {
  token: string;
  challengePath: ChallengePath;
  challengeDay: number;
  initialStreak: number;
  initialIsCompleted: boolean;
  userName: string;
  userId: number;
  stabilityLevel: number;
  savingLevel: number;
  investingLevel: number;
  initialGoals: UserGoal[];
  plaidAccessToken?: string;
  plaidBankName?: string;
};

type ConfettiParticle = {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
};

function playCoinSound() {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    // First tone at 987.77 Hz (B5) then jump to 1318.51 Hz (E6)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(987.77, now);
    osc.frequency.setValueAtTime(1318.51, now + 0.08);
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.45);
  } catch (e) {
    console.error("Audio playback error:", e);
  }
}

function ConfettiCanvas({ trigger }: { trigger: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!trigger) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    
    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const colors = ["#4648d4", "#62fae3", "#ffdcc5", "#E4FF30", "#006b5f", "#904900"];
    const particles: ConfettiParticle[] = [];
    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.65,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)] || "#4648d4",
        speedX: (Math.random() - 0.5) * 16,
        speedY: -Math.random() * 15 - 6,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
      });
    }

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let active = false;
      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += 0.38; // Gravity
        p.speedX *= 0.97; // Friction
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();

        if (p.y < canvas.height && p.x > 0 && p.x < canvas.width) {
          active = true;
        }
      }

      if (active) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [trigger]);

  if (!trigger) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
    />
  );
}

function StreakFlame({ active, className = "h-12 w-12" }: { active: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} transition-all duration-700 ${
        active
          ? "text-orange-500 drop-shadow-[0_0_12px_rgba(249,115,22,0.65)] animate-[pulse_2s_infinite]"
          : "text-gray-300"
      }`}
      aria-hidden="true"
    >
      <path
        fill={active ? "currentColor" : "none"}
        d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
      />
    </svg>
  );
}

const CHEST_ANIMATIONS_CSS = `
  @keyframes chest-wiggle-anim {
    0%, 100% { transform: rotate(0deg) scale(1); }
    10% { transform: rotate(-6deg) scale(1.05); }
    20% { transform: rotate(5deg) scale(1.05); }
    30% { transform: rotate(-5deg) scale(1.05); }
    40% { transform: rotate(4deg) scale(1.05); }
    50% { transform: rotate(-4deg) scale(1.05); }
    60% { transform: rotate(3deg) scale(1.02); }
    70% { transform: rotate(-2deg) scale(1.02); }
    80% { transform: rotate(1deg) scale(1.01); }
    90% { transform: rotate(-1deg) scale(1.01); }
  }

  @keyframes lid-open-anim {
    0% { transform: translateY(0) rotate(0deg); }
    100% { transform: translateY(-26px) rotate(-15deg) scaleY(0.85); }
  }

  @keyframes glow-pulse-anim {
    0%, 100% { opacity: 0.35; transform: scale(1.1); }
    50% { opacity: 0.7; transform: scale(1.3); }
  }

  @keyframes loot-card-slide-up {
    0% { opacity: 0; transform: translateY(30px) scale(0.9); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes fade-in {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  .animate-chest-wiggle {
    animation: chest-wiggle-anim 1.2s cubic-bezier(.36,.07,.19,.97) both;
    transform-origin: bottom center;
  }

  .animate-lid-open {
    animation: lid-open-anim 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    transform-origin: 40px 110px;
  }

  .animate-glow-pulse {
    animation: glow-pulse-anim 2s infinite ease-in-out;
    transform-origin: center;
  }

  .animate-loot-card {
    opacity: 0;
    animation: loot-card-slide-up 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }

  @keyframes quizMascotJump {
    0%, 100% {
      transform: translateY(0) scale(1);
    }
    30% {
      transform: translateY(2px) scaleY(0.9);
    }
    50% {
      transform: translateY(-24px) scaleY(1.05) rotate(5deg);
    }
    70% {
      transform: translateY(-8px) scaleY(0.95);
    }
  }
  .animate-mascot-jump-trigger {
    animation: quizMascotJump 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }
  @keyframes quiz-mascot-container-idle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
  .animate-mascot-idle {
    animation: quiz-mascot-container-idle 4s infinite ease-in-out;
  }
  @keyframes neon-glow-purple-anim {
    0%, 100% { box-shadow: 0 0 12px rgba(139,92,246,0.15), inset 0 0 10px rgba(139,92,246,0.05); border-color: rgba(139,92,246,0.25); }
    50% { box-shadow: 0 0 24px rgba(139,92,246,0.45), inset 0 0 15px rgba(139,92,246,0.2); border-color: rgba(139,92,246,0.55); }
  }
  @keyframes neon-glow-cyan-anim {
    0%, 100% { box-shadow: 0 0 12px rgba(6,182,212,0.15), inset 0 0 10px rgba(6,182,212,0.05); border-color: rgba(6,182,212,0.25); }
    50% { box-shadow: 0 0 24px rgba(6,182,212,0.45), inset 0 0 15px rgba(6,182,212,0.2); border-color: rgba(6,182,212,0.55); }
  }
  .animate-neon-purple {
    animation: neon-glow-purple-anim 3s infinite ease-in-out;
  }
  .animate-neon-cyan {
    animation: neon-glow-cyan-anim 3s infinite ease-in-out;
  }
  @keyframes bubble-bounce {
    0% { opacity: 0; transform: scale(0.9) translateY(10px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
`;

function RewardChest({ state }: { state: "idle" | "wiggle" | "opening" | "opened" }) {
  const isWiggling = state === "wiggle";
  const isOpen = state === "opening" || state === "opened";
  
  return (
    <div className="relative flex items-center justify-center w-48 h-48">
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full filter blur-2xl transition-all duration-1000 ${
          isOpen ? "opacity-45 scale-125 animate-glow-pulse" : "opacity-0 scale-50"
        }`}
      />
      
      <svg 
        viewBox="0 0 200 200" 
        className={`w-full h-full overflow-visible transition-transform duration-500 ${
          isWiggling ? "animate-chest-wiggle" : ""
        }`}
      >
        <defs>
          <linearGradient id="wood-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6e4726" />
            <stop offset="50%" stopColor="#4c3019" />
            <stop offset="100%" stopColor="#2b1a0d" />
          </linearGradient>
          
          <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd942" />
            <stop offset="50%" stopColor="#f5af19" />
            <stop offset="100%" stopColor="#c76e00" />
          </linearGradient>

          <linearGradient id="iron-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8a95a5" />
            <stop offset="100%" stopColor="#4b525d" />
          </linearGradient>

          <filter id="chest-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#4648d4" floodOpacity="0.15" />
          </filter>
        </defs>

        {isOpen && (
          <g className="animate-[fade-in_0.4s_ease-out_forwards]">
            <path 
              d="M 50,110 Q 100,60 150,110 Z" 
              fill="url(#gold-grad)" 
              opacity="0.85" 
              filter="blur(4px)"
            />
            <circle cx="75" cy="85" r="3" fill="#fff" className="animate-pulse" />
            <circle cx="125" cy="80" r="2" fill="#fff" className="animate-pulse" />
            <circle cx="100" cy="70" r="4" fill="#fff" className="animate-pulse" />
            <path d="M98,60 L102,60 L100,56 Z" fill="#ffd942" className="animate-ping" />
            <path d="M72,75 L76,75 L74,71 Z" fill="#ffd942" className="animate-ping" />
          </g>
        )}

        <g filter="url(#chest-shadow)">
          <g id="chest-base-group">
            <path 
              d="M 46,110 L 154,110 L 146,170 C 146,175 141,180 136,180 L 64,180 C 59,180 54,175 54,170 Z" 
              fill="url(#wood-grad)" 
              stroke="#1b1a0d" 
              strokeWidth="3.5" 
            />
            
            <path d="M 46,110 L 58,110 L 62,180 L 54,180 C 51,176 49,173 49,170 Z" fill="url(#wood-grad)" stroke="#1b1a0d" strokeWidth="1.5" />
            <path d="M 154,110 L 142,110 L 138,180 L 146,180 C 149,176 151,173 151,170 Z" fill="url(#wood-grad)" stroke="#1b1a0d" strokeWidth="1.5" />
            
            <rect x="91" y="110" width="18" height="70" fill="url(#gold-grad)" stroke="#1b1a0d" strokeWidth="1.5" />
            
            <circle cx="53" cy="120" r="1.5" fill="#1b1a0d" />
            <circle cx="56" cy="145" r="1.5" fill="#1b1a0d" />
            <circle cx="59" cy="170" r="1.5" fill="#1b1a0d" />
            <circle cx="147" cy="120" r="1.5" fill="#1b1a0d" />
            <circle cx="144" cy="145" r="1.5" fill="#1b1a0d" />
            <circle cx="141" cy="170" r="1.5" fill="#1b1a0d" />
            
            <rect x="85" y="110" width="30" height="24" rx="4" fill="#1a1c1e" stroke="#1b1a0d" strokeWidth="2" />
            <rect x="88" y="112" width="24" height="20" rx="3" fill="url(#gold-grad)" />
            <circle cx="100" cy="120" r="3.5" fill="#1a1c1e" />
            <path d="M 100,120 L 100,129" stroke="#1a1c1e" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          <g 
            id="chest-lid-group" 
            className={isOpen ? "animate-lid-open" : ""}
          >
            <path 
              d="M 46,110 C 46,65 65,50 100,50 C 135,50 154,65 154,110 Z" 
              fill="url(#wood-grad)" 
              stroke="#1b1a0d" 
              strokeWidth="3.5" 
            />
            
            <path d="M 46,110 C 46,65 65,50 70,50 C 65,65 58,90 58,110 Z" fill="url(#wood-grad)" stroke="#1b1a0d" strokeWidth="1.5" />
            <path d="M 154,110 C 154,65 135,50 130,50 C 135,65 142,90 142,110 Z" fill="url(#wood-grad)" stroke="#1b1a0d" strokeWidth="1.5" />
            
            <path d="M 91,110 L 91,50 L 109,50 L 109,110 Z" fill="url(#gold-grad)" stroke="#1b1a0d" strokeWidth="1.5" />
            
            <path d="M 82,50 C 82,38 118,38 118,50" fill="none" stroke="url(#gold-grad)" strokeWidth="5" strokeLinecap="round" />
            <circle cx="82" cy="50" r="3" fill="#1b1a0d" />
            <circle cx="118" cy="50" r="3" fill="#1b1a0d" />

            <circle cx="53" cy="95" r="1.5" fill="#1b1a0d" />
            <circle cx="62" cy="72" r="1.5" fill="#1b1a0d" />
            <circle cx="138" cy="72" r="1.5" fill="#1b1a0d" />
            <circle cx="147" cy="95" r="1.5" fill="#1b1a0d" />

            <path 
              d="M 91,102 L 109,102 L 106,118 L 94,118 Z" 
              fill="url(#gold-grad)" 
              stroke="#1b1a0d" 
              strokeWidth="1.5" 
            />
            <circle cx="100" cy="110" r="2.5" fill="#1b1a0d" />
          </g>
        </g>
      </svg>
    </div>
  );
}

type LootCardProps = {
  type: "xp" | "coins" | "badge";
  title: string;
  subtitle: string;
  delayMs: number;
};

function LootCard({ type, title, subtitle, delayMs }: LootCardProps) {
  const theme = {
    xp: {
      bgColor: "bg-violet-500/15",
      borderColor: "border-violet-500/30",
      textColor: "text-violet-300",
      iconColor: "text-violet-400",
      glowColor: "shadow-[0_0_15px_rgba(139,92,246,0.2)]",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      )
    },
    coins: {
      bgColor: "bg-amber-500/15",
      borderColor: "border-amber-500/30",
      textColor: "text-amber-300",
      iconColor: "text-amber-400",
      glowColor: "shadow-[0_0_15px_rgba(245,158,11,0.2)]",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="12" cy="12" r="6" />
          <text x="12" y="16.5" fontSize="13" fontWeight="900" textAnchor="middle" fill="currentColor">$</text>
        </svg>
      )
    },
    badge: {
      bgColor: "bg-emerald-500/15",
      borderColor: "border-emerald-500/30",
      textColor: "text-emerald-300",
      iconColor: "text-emerald-400",
      glowColor: "shadow-[0_0_15px_rgba(16,185,129,0.2)]",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path d="M18 2H6v2c0 2.2 1.8 4 4 4h1v2.58C8.24 11.23 6 13.84 6 17H5c-1.1 0-2 .9-2 2v2h18v-2c0-1.1-.9-2-2-2h-1c0-3.16-2.24-5.77-5-6.42V8h1c2.2 0 4-1.8 4-4V2zm-12 4V4h2v2c0 1.1-.9 2-2 2zm10 0c-1.1 0-2-.9-2-2V4h2v2z" />
        </svg>
      )
    }
  }[type];

  return (
    <div 
      style={{ animationDelay: `${delayMs}ms` }}
      className={`flex flex-col items-center p-4 rounded-2xl border bg-[#151430] ${theme.borderColor} ${theme.glowColor} text-center transition-all hover:scale-105 duration-300 animate-loot-card`}
    >
      <div className={`p-3.5 rounded-2xl ${theme.bgColor} ${theme.iconColor} mb-4 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10 bg-current animate-ping" />
        {theme.icon}
      </div>
      <p className={`text-2xl font-black tracking-tight ${theme.textColor}`}>
        {title}
      </p>
      <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
        {subtitle}
      </p>
    </div>
  );
}

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

function formatTransactionAmount(amount: number, categoryName: string): string {
  if (amount === 0) return "$0.00";
  if (categoryName === "Income") {
    return `+${Math.abs(amount).toLocaleString("en-US", { style: "currency", currency: "USD" })}`;
  }
  return `-${Math.abs(amount).toLocaleString("en-US", { style: "currency", currency: "USD" })}`;
}

function getChoiceEmoji(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("coffee") || lower.includes("starbucks")) return "☕";
  if (lower.includes("pasta") || lower.includes("cook")) return "🍝";
  if (lower.includes("ubereats") || lower.includes("delivery") || lower.includes("munchies")) return "🍔";
  if (lower.includes("netflix") || lower.includes("streaming") || lower.includes("subscription")) return "📺";
  if (lower.includes("gym")) return "🏋️";
  if (lower.includes("shoes") || lower.includes("nike")) return "👟";
  if (lower.includes("vault") || lower.includes("savings") || lower.includes("save")) return "💰";
  if (lower.includes("etf") || lower.includes("invest") || lower.includes("shares") || lower.includes("brokerage")) return "📈";
  if (lower.includes("altcoins") || lower.includes("volatile")) return "🚀";
  if (lower.includes("checking") || lower.includes("cash")) return "💵";
  return "💸";
}

type PennyCoachCompanionProps = {
  pennyMessage: string;
  leakDetector: string;
  budgetFeedbackMessage: string;
  isCompleted: boolean;
  savingsDeposited: number;
  activeGoalName: string;
  questState: "selecting" | "allocating" | "completed";
  profileName: string;
  animationState: "idle" | "wiggle" | "opening" | "loot";
};

function PennyCoachCompanion({
  pennyMessage,
  leakDetector,
  budgetFeedbackMessage,
  isCompleted,
  savingsDeposited,
  activeGoalName,
  questState,
  profileName,
  animationState
}: PennyCoachCompanionProps) {
  let stateType: "intro" | "warning" | "analysis" | "success" = "intro";
  let displayTitle = "Penny Coach";
  let displayText = pennyMessage;
  let bubbleColorClass = "bg-white border-slate-200/80 text-slate-700 shadow-[0_8px_30px_rgba(91,93,242,0.04)]";
  let headerColorClass = "text-violet-600";
  let mascotAnimation = "animate-mascot-idle";
  
  if (isCompleted) {
    stateType = "success";
    displayTitle = "Penny says: Victory! 🎉";
    displayText = savingsDeposited > 0 && activeGoalName
      ? `OMG! You saved $${savingsDeposited.toFixed(2)} today and deposited it into your "${activeGoalName}" chest! That is absolute main character energy! 🏦✨`
      : "Quest completed successfully! You claimed your XP and Coins. Keep up this streak, your rank is going up! 🏆";
    bubbleColorClass = "bg-gradient-to-tr from-emerald-50/95 to-teal-50/95 border-emerald-200 text-emerald-950 shadow-[0_8px_30px_rgba(16,185,129,0.06)]";
    headerColorClass = "text-emerald-600";
    mascotAnimation = "animate-mascot-jump-trigger";
  } else if (budgetFeedbackMessage) {
    stateType = "warning";
    displayTitle = "Penny Coach Alert ⚠️";
    displayText = budgetFeedbackMessage.replace("⚠️ Warning: ", "").replace("Penny says: '", "").replace("'", "");
    bubbleColorClass = "bg-gradient-to-tr from-rose-50/95 to-pink-50/95 border-rose-200 text-rose-950 shadow-[0_8px_30px_rgba(244,63,94,0.06)]";
    headerColorClass = "text-rose-600";
    mascotAnimation = "animate-[pulse_1.5s_infinite] scale-105 duration-300";
  } else if (questState === "allocating") {
    stateType = "analysis";
    displayTitle = "Penny Analysis: Deposit time! 💰";
    displayText = "Your choices are within budget! Choose which chest to lock this savings into to grow your financial shield.";
    bubbleColorClass = "bg-gradient-to-tr from-violet-50/95 to-indigo-50/95 border-violet-200 text-violet-950 shadow-[0_8px_30px_rgba(91,93,242,0.06)]";
    headerColorClass = "text-violet-600";
    mascotAnimation = "animate-mascot-idle";
  } else if (leakDetector) {
    stateType = "analysis";
    displayTitle = "Penny's Leak Analysis 📊";
    displayText = leakDetector;
    bubbleColorClass = "bg-gradient-to-tr from-amber-50/95 to-orange-50/95 border-amber-200 text-amber-950 shadow-[0_8px_30px_rgba(245,158,11,0.06)]";
    headerColorClass = "text-amber-600";
    mascotAnimation = "animate-mascot-idle";
  }

  return (
    <div className="w-full flex flex-col md:flex-row items-center gap-4 p-4 rounded-3xl border border-[#E9E8F3] bg-white/80 backdrop-blur-md shadow-[0_8px_30px_rgba(70,72,212,0.02)] transition-all duration-500 relative overflow-hidden text-left mb-4">
      {stateType === "warning" && (
        <div className="absolute inset-0 bg-rose-500/3 filter blur-[80px] pointer-events-none rounded-3xl" />
      )}
      {stateType === "success" && (
        <div className="absolute inset-0 bg-emerald-500/3 filter blur-[80px] pointer-events-none rounded-3xl" />
      )}

      <div className="relative shrink-0 flex flex-col items-center justify-center w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl p-1 group shadow-inner">
        <MascotFullSvg className={`h-12 w-auto transition-all ${mascotAnimation}`} />
        <span className="absolute -bottom-2 bg-[#5B5DF2] text-white font-black text-[6px] px-1.5 py-0.5 rounded-full uppercase tracking-wider leading-none shadow-sm">
          Penny
        </span>
      </div>

      <div className={`flex-1 w-full rounded-2xl border p-4 relative transition-all duration-500 animate-[bubble-bounce_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards] ${bubbleColorClass}`}>
        <div className="hidden md:block absolute left-[-6px] top-1/2 -translate-y-1/2 rotate-45 w-3 h-3 bg-inherit border-l border-b border-inherit pointer-events-none" />
        <div className="block md:hidden absolute left-1/2 top-[-6px] -translate-x-1/2 rotate-45 w-3 h-3 bg-inherit border-t border-l border-inherit pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className={`text-[9px] font-black uppercase tracking-widest ${headerColorClass}`}>
              {displayTitle}
            </span>
            <span className="text-[8px] font-medium text-slate-400">· Coach Penny</span>
          </div>
          <p className="text-[11px] font-semibold leading-relaxed">
            &ldquo;{displayText}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ChallengeTokenPageClient({
  token,
  challengePath,
  challengeDay,
  initialStreak,
  initialIsCompleted,
  userName,
  userId,
  stabilityLevel,
  savingLevel,
  investingLevel,
  initialGoals,
  plaidAccessToken,
  plaidBankName,
}: ChallengeTokenPageClientProps) {
  // RPG gameplay states
  const [profileName, setProfileName] = useState<ProfileName>("The Explorer");
  const [goals, setGoals] = useState<UserGoal[]>(initialGoals);
  const [activeGoalId, setActiveGoalId] = useState("");
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);

  const scaleFactor = getScaleFactor(stabilityLevel, savingLevel, investingLevel);
  const characterName = profileName.replace("The ", "");
  const questDetail = getDailyQuestDetail(
    challengePath,
    challengeDay,
    characterName,
    userId,
    stabilityLevel,
    savingLevel,
    investingLevel
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(initialIsCompleted);
  const [questState, setQuestState] = useState<"selecting" | "allocating" | "completed">(
    initialIsCompleted ? "completed" : "selecting"
  );
  const [challengeScreen, setChallengeScreen] = useState<"quest" | "allocation" | "gains">(
    initialIsCompleted ? "gains" : "quest"
  );
  const [savingsDeposited, setSavingsDeposited] = useState(0);
  const [activeGoalName, setActiveGoalName] = useState("");

  // Push notification opt-in banner ("peak delight" strategy)
  const { subscribe, enabled: pushEnabled, blocked: pushBlocked, loading: pushLoading } = usePushNotifications();
  const [showPushBanner, setShowPushBanner] = useState(false);
  const [pushBannerDismissed, setPushBannerDismissed] = useState(false);

  // Keep exactly one goal per category
  const filteredGoals = (() => {
    const categories = ["stability", "saving", "investing"];
    const result: UserGoal[] = [];
    
    categories.forEach(cat => {
      const found = goals.find(g => g.category === cat);
      if (found) {
        result.push(found);
      } else {
        if (cat === "stability") {
          result.push({ id: "emergency", name: "🚨 Emergency Fund", target: 1000, current: 150, category: "stability", isActive: false });
        } else if (cat === "saving") {
          result.push({ id: "trip", name: "✈️ Tokyo Summer Trip", target: 2500, current: 0, category: "saving", isActive: false });
        } else {
          result.push({ id: "crypto", name: "🚀 Moonshot Crypto Bag", target: 500, current: 0, category: "investing", ticker: "BTC", isActive: false });
        }
      }
    });
    return result;
  })();

  // Keep activeGoalId synchronized with filteredGoals
  useEffect(() => {
    if (filteredGoals.length > 0) {
      const isCurrentActiveInFiltered = filteredGoals.some(g => g.id === activeGoalId);
      if (!isCurrentActiveInFiltered) {
        const activeInFiltered = filteredGoals.find(g => g.isActive);
        if (activeInFiltered) {
          setActiveGoalId(activeInFiltered.id);
          setActiveGoalName(activeInFiltered.name);
        } else if (filteredGoals[0]) {
          setActiveGoalId(filteredGoals[0].id);
          setActiveGoalName(filteredGoals[0].name);
        }
      }
    }
  }, [goals, activeGoalId, filteredGoals]);

  const [currentStabilityLevel, setCurrentStabilityLevel] = useState(stabilityLevel);
  const [currentStabilityXp, setCurrentStabilityXp] = useState(stabilityLevel * 100);

  const [currentSavingLevel, setCurrentSavingLevel] = useState(savingLevel);
  const [currentSavingXp, setCurrentSavingXp] = useState(savingLevel * 100);

  const [currentInvestingLevel, setCurrentInvestingLevel] = useState(investingLevel);
  const [currentInvestingXp, setCurrentInvestingXp] = useState(investingLevel * 100);

  const [pennySpeechText, setPennySpeechText] = useState(
    `Bonjour ${userName} ! Les défis CoinStack sont désormais basés sur votre score de transactions réelles Plaid. Chaque action financière aura un impact immédiat sur vos niveaux ! 🏦`
  );

  const [plaidTransactions, setPlaidTransactions] = useState<any[]>([]);

  const [totalSpent, setTotalSpent] = useState(0);
  const [pastChallengeExpenses, setPastChallengeExpenses] = useState<any[]>([]);
  const [showRecentActivity, setShowRecentActivity] = useState(false);

  const getMonthlyBudget = (name: ProfileName) => {
    switch (name) {
      case "The Survivor": return 900;
      case "The Explorer": return 1400;
      case "The Saver":
      case "The Stabilizer": return 1700;
      case "The Builder":
      case "The Strategist":
      case "The Opportunist": return 2200;
      case "The Wealth Architect": return 3600;
      default: return 1400;
    }
  };
  const monthlyBudget = getMonthlyBudget(profileName);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Resolve profile override
        const saved = localStorage.getItem(`profile_override_${userId}`);
        if (saved) {
          setProfileName(saved as ProfileName);
        } else {
          setProfileName(resolveProfileName(stabilityLevel, savingLevel, investingLevel));
        }

        // Load goals
        const userGoals = goals.length > 0 ? goals : getUserGoals(userId);
        setGoals(userGoals);
        const active = userGoals.find((g) => g.isActive);
        if (active) {
          setActiveGoalId(active.id);
          setActiveGoalName(active.name);
        } else if (userGoals.length > 0 && userGoals[0]) {
          setActiveGoalId(userGoals[0].id);
          setActiveGoalName(userGoals[0].name);
        }

        // Load total spent
        const rawSpent = localStorage.getItem(`actual_spending_${userId}`);
        if (rawSpent) {
          const spentList = JSON.parse(rawSpent);
          const sum = spentList.reduce((acc: number, item: any) => acc + Math.abs(item.cost), 0);
          setTotalSpent(sum);
        }

        // Load past challenge transactions
        const txKey = `transactions_${userId}`;
        const savedTx = localStorage.getItem(txKey);
        if (savedTx) {
          const txList = JSON.parse(savedTx);
          const realChallengeTxs = txList.filter((tx: any) => tx.id && tx.id.startsWith("real-tx-"));
          setPastChallengeExpenses(realChallengeTxs);
        }

        // Retrieve real Plaid transactions dynamically
        const savedToken = localStorage.getItem(`plaid_access_token_${userId}`) || plaidAccessToken;
        if (savedToken) {
          fetch("/api/plaid/sync-and-validate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              accessToken: savedToken,
              token: token
            })
          })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              if (Array.isArray(data.accounts)) {
                setBankAccounts(data.accounts);
              }
              if (Array.isArray(data.transactions)) {
                // Map Plaid transactions for rendering
                const mapped = data.transactions.map((tx: any, idx: number) => {
                  const amt = Number(tx.amount);
                  const isExpense = amt > 0; // Plaid: positive amount represents debit/expense
                  return {
                    id: tx.transaction_id || `tx_plaid_${idx}`,
                    date: tx.date,
                    name: tx.name || tx.merchant_name || "Merchant",
                    amount: isExpense ? -amt : Math.abs(amt),
                    category: tx.category ? tx.category.join(" > ") : "General",
                    scoreEffect: isExpense ? -10 : +15,
                    xpEffect: isExpense ? -5 : +10
                  };
                });
                setPlaidTransactions(mapped);
              }
            }
          })
          .catch(err => console.error("Quiet Plaid transactions fetch failed:", err));
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [userId, stabilityLevel, savingLevel, investingLevel, plaidAccessToken]);




  const handleSelectActiveGoal = async (goalId: string) => {
    setActiveGoalId(goalId);
    
    let updatedGoals = [...goals];
    const exists = updatedGoals.some(g => g.id === goalId);
    if (!exists) {
      const fallback = filteredGoals.find(g => g.id === goalId);
      if (fallback) {
        updatedGoals.push(fallback);
      }
    }

    updatedGoals = updatedGoals.map((g) => ({
      ...g,
      isActive: g.id === goalId,
    }));
    
    setGoals(updatedGoals);
    const active = updatedGoals.find(g => g.isActive);
    if (active) setActiveGoalName(active.name);
    localStorage.setItem(`user_goals_${userId}`, JSON.stringify(updatedGoals));
    try {
      await saveUserGoalsToDb(token, updatedGoals);
    } catch (e) {
      console.error("Failed to sync active goal to DB:", e);
    }
  };
  const [error, setError] = useState("");
  const [selectedChoiceIds, setSelectedChoiceIds] = useState<string[]>([]);
  const [userStreak, setUserStreak] = useState(initialStreak);
  const [triggerConfetti, setTriggerConfetti] = useState(false);
  const [animationState, setAnimationState] = useState<"idle" | "wiggle" | "opening" | "loot">(
    initialIsCompleted ? "loot" : "idle"
  );

  // Persistent Player Stats
  const [playerStats, setPlayerStats] = useState({
    level: 1,
    xp: 0,
    coins: 0,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLvl = localStorage.getItem("finlevels_level");
      const savedXp = localStorage.getItem("finlevels_total_xp");
      const savedCoins = localStorage.getItem("finlevels_total_coins");
      setPlayerStats({
        level: savedLvl ? parseInt(savedLvl, 10) : 1,
        xp: savedXp ? parseInt(savedXp, 10) : 0,
        coins: savedCoins ? parseInt(savedCoins, 10) : 0,
      });
    }
  }, []);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);



  useEffect(() => {
    trackEvent("dashboard_opened", {
      path: challengePath,
      day: challengeDay,
      isCompleted,
    });
    if (!isCompleted) {
      trackEvent("challenge_started", {
        path: challengePath,
        day: challengeDay,
      });
    }
  }, [challengePath, challengeDay, isCompleted]);

  useEffect(() => {
    if (animationState === "wiggle") {
      const timer = setTimeout(() => {
        setAnimationState("opening");
      }, 1200); // 1.2s of shake
      return () => clearTimeout(timer);
    } else if (animationState === "opening") {
      const timer = setTimeout(() => {
        setAnimationState("loot");
      }, 1000); // 1s of opening with glow
      return () => clearTimeout(timer);
    }
  }, [animationState]);

  const selectedChoices = questDetail.choices.filter((c) => selectedChoiceIds.includes(c.id));
  const totalCost = selectedChoices.reduce((sum, c) => sum + c.cost, 0);
  const totalXp = selectedChoices.reduce((sum, c) => sum + c.xpReward, 0);
  const totalCoins = selectedChoices.reduce((sum, c) => sum + c.coinReward, 0);

  const isBudgetValid = questDetail.thresholdType === "max"
    ? totalCost <= questDetail.threshold
    : totalCost >= questDetail.threshold;

  const todayExpectedDeduction = isCompleted
    ? 0
    : (selectedChoiceIds.length > 0
        ? (isBudgetValid ? Math.max(totalCost, questDetail.threshold) : totalCost)
        : 0);

  const remainingWalletBalance = monthlyBudget - totalSpent - todayExpectedDeduction;

  const canSubmit = selectedChoiceIds.length > 0;

  let budgetFeedbackMessage = "";
  if (selectedChoiceIds.length > 0 && !isBudgetValid) {
    if (questDetail.thresholdType === "max") {
      budgetFeedbackMessage = `⚠️ Warning: You're spending $${totalCost.toFixed(2)}, which exceeds your daily threshold of $${questDetail.threshold.toFixed(2)}. Penny says: 'Your wallet is looking kinda cooked! You can complete the quest, but this counts as a budget LEAK, affecting your month-end rank! 💸'`;
    } else {
      budgetFeedbackMessage = `⚠️ Warning: You've only allocated $${totalCost.toFixed(2)} out of your $${questDetail.threshold.toFixed(2)} target. Penny says: 'You can complete the quest, but this counts as a LEAK since you didn't meet the target! 💰'`;
    }
  }

  const handleValidateChallenge = async (depositGoalId?: string) => {
    if (isCompleted || isSubmitting || !canSubmit) return;
    setIsSubmitting(true);
    setError("");

    try {
      const savedAmount = questDetail.thresholdType === "max"
        ? Math.max(0, questDetail.threshold - totalCost)
        : totalCost;

      const firstChoice = selectedChoices[0];
      const choiceLabel = firstChoice ? firstChoice.title : "No choice";

      const proof = `Decisions made: ${selectedChoices.map((c) => `${c.title} (Cost/Redirect: $${c.cost})`).join(", ")} (Total: $${totalCost.toFixed(2)})`;
      
      const { streak: updatedStreak, goals: updatedGoals } = await saveChallengeCompletion({
        token,
        challengeTitle: questDetail.title,
        proof,
        choiceLabel,
        choiceCost: totalCost,
        dailyThreshold: questDetail.threshold,
        savings: savedAmount,
        depositGoalId,
      });

      trackEvent("challenge_completed", {
        path: challengePath,
        day: challengeDay,
        streak: updatedStreak ?? userStreak,
      });

      if (updatedStreak !== null) {
        if (updatedStreak > userStreak) {
          trackEvent("streak_extended", {
            path: challengePath,
            day: challengeDay,
            newStreak: updatedStreak,
            previousStreak: userStreak,
          });
        }
        setUserStreak(updatedStreak);
      }

      if (updatedGoals) {
        setGoals(updatedGoals);
        localStorage.setItem(`user_goals_${userId}`, JSON.stringify(updatedGoals));
        const active = updatedGoals.find(g => g.isActive);
        if (active) {
          setActiveGoalId(active.id);
          setActiveGoalName(active.name);
        }
      }

      // Play sound and trigger animations
      setTriggerConfetti(true);
      playCoinSound();
      setAnimationState("wiggle");

      // XP/Level calculation
      const xpReward = totalXp;
      const coinReward = totalCoins;
      const newXp = playerStats.xp + xpReward;
      let newCoins = playerStats.coins + coinReward;
      let newLevel = playerStats.level;
      let leveledUp = false;

      const xpRequired = playerStats.level * 300;
      if (newXp >= xpRequired) {
        newLevel += 1;
        newCoins += 50; // Level up bonus
        leveledUp = true;
      }

      setPlayerStats({
        level: newLevel,
        xp: newXp,
        coins: newCoins,
      });

      localStorage.setItem("finlevels_level", String(newLevel));
      localStorage.setItem("finlevels_total_xp", String(newXp));
      localStorage.setItem("finlevels_total_coins", String(newCoins));

      if (savedAmount > 0) {
        setSavingsDeposited(savedAmount);
      }

      // Record choices as gameplay expenses
      if (typeof window !== "undefined") {
        try {
          const rawSpent = localStorage.getItem(`actual_spending_${userId}`) || "[]";
          const spentList = JSON.parse(rawSpent);
          selectedChoices.forEach((choice) => {
            spentList.push({
              id: `spent-${Date.now()}-${choice.id}`,
              choiceId: choice.id,
              title: choice.title,
              cost: choice.cost,
              date: new Date().toISOString().split("T")[0]
            });
          });

          // If within budget, also deduct savings transfer from checking balance
          if (isBudgetValid && savedAmount > 0) {
            spentList.push({
              id: `savings-${Date.now()}`,
              choiceId: "savings-deposit",
              title: `Saved: Deposit into ${activeGoalName || "active chest"}`,
              cost: savedAmount,
              date: new Date().toISOString().split("T")[0]
            });
          }

          localStorage.setItem(`actual_spending_${userId}`, JSON.stringify(spentList));

          // Instantly update total spent state
          const newSpentSum = spentList.reduce((acc: number, item: any) => acc + Math.abs(item.cost), 0);
          setTotalSpent(newSpentSum);

          const txKey = `transactions_${userId}`;
          const savedTx = localStorage.getItem(txKey) || "[]";
          const txList = JSON.parse(savedTx);
          selectedChoices.forEach((choice) => {
            txList.unshift({
              id: `real-tx-${Date.now()}-${choice.id}`,
              date: new Date().toISOString().split("T")[0],
              description: choice.title,
              categoryName: questDetail.path === "stability" ? "Food & Drinks" : "Savings & Investing",
              amount: -choice.cost,
              category: questDetail.path === "stability" ? "food" : questDetail.path === "saving" ? "saving" : "investing",
              isLeak: choice.cost > questDetail.threshold && questDetail.thresholdType === "max",
              isSubscription: false
            });
          });

          if (isBudgetValid && savedAmount > 0) {
            txList.unshift({
              id: `real-tx-${Date.now()}-savings`,
              date: new Date().toISOString().split("T")[0],
              description: `Savings Deposit to ${activeGoalName || "active chest"}`,
              categoryName: "Savings & Investing",
              amount: -savedAmount,
              category: "saving",
              isLeak: false,
              isSubscription: false
            });
          }

          localStorage.setItem(txKey, JSON.stringify(txList));
        } catch (e) {
          console.error("Failed to record gameplay transaction:", e);
        }
      }

      setIsCompleted(true);
      setQuestState("completed");
      setChallengeScreen("gains");

      if (leveledUp) {
        setTimeout(() => {
          setShowLevelUpModal(true);
        }, 2600); // Open level up modal after chest animation completes
      }

      // Show push notification opt-in banner 3.5s after completion (peak delight moment)
      if (!pushEnabled && !pushBlocked && !pushBannerDismissed && typeof window !== "undefined" && !localStorage.getItem("push_banner_dismissed")) {
        setTimeout(() => {
          setShowPushBanner(true);
        }, 3500);
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to validate this challenge right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleChoice = (choiceId: string) => {
    if (isCompleted || questState !== "selecting") return;
    setSelectedChoiceIds((prev) =>
      prev.includes(choiceId) ? prev.filter((id) => id !== choiceId) : [...prev, choiceId]
    );
  };

  const currentLevelXpBase = (playerStats.level - 1) * 300;
  const xpInCurrentLevel = playerStats.xp - currentLevelXpBase;
  const xpNeededForNextLevel = 300;
  const xpProgressPercent = Math.min(Math.max(Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100), 0), 100);

  return (
    <main className="min-h-screen bg-[#F8F7FC] text-[#1A1833] px-2 py-4 selection:bg-[#5B5DF2] selection:text-white sm:px-6 sm:py-10 lg:px-10 relative overflow-hidden">
      {/* Background ambient neon glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-500/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <style dangerouslySetInnerHTML={{ __html: CHEST_ANIMATIONS_CSS }} />
      <ConfettiCanvas trigger={triggerConfetti} />

      {/* Level Up Celebration Modal */}
      {showLevelUpModal && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#000]/40 backdrop-blur-xs text-[#1A1833] p-6 animate-fade-in">
          <div className="relative flex flex-col items-center max-w-sm text-center bg-white border border-[#E9E8F3] p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
            <div className="absolute -inset-10 rounded-full bg-violet-500/10 filter blur-3xl animate-pulse" />
            
            <div className="relative w-24 h-24 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-full flex items-center justify-center shadow-xl border-4 border-yellow-200 animate-bounce mb-6">
              <Sparkles className="h-12 w-12 text-[#904900]" />
            </div>

            <span className="text-sm font-black uppercase text-violet-600 tracking-[0.25em]">Achievement</span>
            <h2 className="text-4xl font-black tracking-tight mt-2 text-[#1A1833]">LEVEL UP!</h2>
            <p className="text-slate-600 font-semibold mt-3">
              You reached <span className="text-violet-600 font-extrabold">Level {playerStats.level}</span>! Your financial habits are getting stronger.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 w-full bg-slate-50 border border-slate-100 rounded-3xl p-5">
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Max energy</p>
                <p className="text-lg font-black text-emerald-600">+10% Boost</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Level Reward</p>
                <p className="text-lg font-black text-amber-600">+50 Coins</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowLevelUpModal(false);
                playCoinSound();
              }}
              className="mt-8 w-full rounded-full bg-[#5B5DF2] text-white py-4 font-black shadow-lg shadow-[#5B5DF2]/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              Claim Rewards
            </button>
          </div>
        </div>
      )}
      
      <section className="mx-auto w-full max-w-4xl relative z-10 flex flex-col gap-4">
        
        {/* Unified Layout Header after Login */}
        <header className="rounded-3xl border border-[#E9E8F3] bg-white/70 backdrop-blur-xl px-4 py-3 flex items-center justify-between gap-4 shadow-[0_8px_30px_rgba(70,72,212,0.03)] mb-2">
          {/* Back button & Brand Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link href={`/profile/${encodeURIComponent(token)}`} className="text-slate-500 hover:text-slate-900 transition-all flex items-center justify-center w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 active:scale-95">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span className="lg:hidden bg-[#5B5DF2] text-white font-black text-[8px] px-2 py-1 rounded-lg uppercase tracking-wider leading-none shadow-xs">
              Lvl {playerStats.level}
            </span>
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/logo-purple.svg"
                alt="Finlevels Logo"
                width={28}
                height={28}
                className="w-7 h-7 object-contain"
              />
              <span className="hidden sm:inline font-black text-[#1A1833] tracking-tight text-base group-hover:text-violet-600 transition-colors">
                Finlevels
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 bg-slate-100/80 border border-slate-200/50 rounded-full p-0.5">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-[#5B5DF2] text-white shadow-[0_4px_12px_rgba(91,93,242,0.2)]">
              Daily Quests
            </span>
            <Link
              href={`/profile/${encodeURIComponent(token)}`}
              className="px-3.5 py-1.5 rounded-full text-xs font-black text-slate-600 hover:text-[#1A1833] hover:bg-white/50 transition-all"
            >
              My Profile
            </Link>
          </nav>

          {/* User Stats Summary */}
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-black text-slate-700 shrink-0">
            <span className="flex items-center gap-1 bg-white border border-slate-200/55 px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl shadow-xs">
              <StreakFlame active={userStreak > 0} className="h-3.5 w-3.5" />
              <span>{userStreak}d</span>
            </span>
            <span className="flex items-center gap-1 bg-white border border-slate-200/55 px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl text-amber-600 shadow-xs">
              💰 <span>{playerStats.coins}</span>
            </span>
          </div>
        </header>



        {challengeScreen === "quest" && (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Main gameplay area (Wallet, Companion, Quest) */}
          <div className="flex-1 w-full order-1 lg:order-2 space-y-4">
            
            {/* Real Plaid Bank Balances Card */}
            <div className="rounded-3xl border border-[#E9E8F3] bg-white/70 backdrop-blur-md p-5 flex flex-col justify-between relative overflow-hidden shadow-xs min-h-[120px]">
              {/* Holographic credit card stripes */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full filter blur-2xl pointer-events-none" />
              
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-black text-violet-600 uppercase tracking-widest block">SOLDE BANCAIRE PLAID</span>
                  <span className="text-2xl font-black tracking-tight block mt-0.5 text-[#1A1833]">
                    ${bankAccounts.reduce((sum, acc) => sum + (acc.balances?.current || 0), 0).toFixed(2)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Comptes liés</span>
                  <span className="text-xs font-black text-emerald-600">
                    {bankAccounts.length} actif(s)
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2 max-h-[100px] overflow-y-auto pr-1">
                {bankAccounts.length > 0 ? (
                  bankAccounts.map((acc, index) => (
                    <div key={index} className="flex justify-between items-center text-[10px] font-bold text-slate-600 border-b border-slate-100/50 pb-1 last:border-b-0 last:pb-0">
                      <span className="truncate max-w-[140px]">{acc.name || "Compte Courant"}</span>
                      <span className="text-[#1A1833]">${(acc.balances?.current || 0).toFixed(2)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-[9px] text-slate-400 font-bold italic">
                    Aucune balance disponible. Les soldes seront chargés après connexion.
                  </p>
                )}
              </div>
            </div>

        <PennyCoachCompanion
          pennyMessage={pennySpeechText}
          leakDetector={questDetail.leakDetector}
          budgetFeedbackMessage={budgetFeedbackMessage}
          isCompleted={isCompleted}
          savingsDeposited={savingsDeposited}
          activeGoalName={activeGoalName}
          questState={questState}
          profileName={profileName}
          animationState={animationState}
        />



        {/* Plaid AI Scoring dashboard card */}
        <div className="space-y-4 w-full">
          {/* Coin progression scores card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Stability Gauge */}
            <div className="rounded-3xl border border-[#E9E8F3] bg-white/70 backdrop-blur-md p-5 flex flex-col justify-between shadow-xs min-h-[110px] text-left">
              <div>
                <span className="text-[9px] font-black text-violet-600 uppercase tracking-widest block">PIÈCE STABILITÉ</span>
                <span className="text-xl font-black text-[#1A1833] block mt-0.5">Niveau {currentStabilityLevel} Character</span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase mb-1">
                  <span>PROGRESSION</span>
                  <span>{currentStabilityXp % 100} / 100 XP</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-[#5B5DF2] rounded-full transition-all duration-500"
                    style={{ width: `${currentStabilityXp % 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Saving Gauge */}
            <div className="rounded-3xl border border-[#E9E8F3] bg-white/70 backdrop-blur-md p-5 flex flex-col justify-between shadow-xs min-h-[110px] text-left">
              <div>
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest block">PIÈCE ÉPARGNE</span>
                <span className="text-xl font-black text-[#1A1833] block mt-0.5">Niveau {currentSavingLevel} Character</span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase mb-1">
                  <span>PROGRESSION</span>
                  <span>{currentSavingXp % 100} / 100 XP</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${currentSavingXp % 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Investing Gauge */}
            <div className="rounded-3xl border border-[#E9E8F3] bg-white/70 backdrop-blur-md p-5 flex flex-col justify-between shadow-xs min-h-[110px] text-left">
              <div>
                <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest block">PIÈCE INVESTISSEMENT</span>
                <span className="text-xl font-black text-[#1A1833] block mt-0.5">Niveau {currentInvestingLevel} Character</span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase mb-1">
                  <span>PROGRESSION</span>
                  <span>{currentInvestingXp % 100} / 100 XP</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-500"
                    style={{ width: `${currentInvestingXp % 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Plaid transaction ledger list */}
          <div className="rounded-3xl border border-[#E9E8F3] bg-white/70 backdrop-blur-md p-6 shadow-xs text-left text-[#1A1833]">
            <span className="text-[9px] font-black text-violet-600 uppercase tracking-widest block mb-4">FLUX DE TRANSACTIONS LIÉ (PLAID SANDBOX)</span>
            <div className="space-y-3.5 divide-y divide-slate-100 max-h-[380px] overflow-y-auto pr-1">
              {plaidTransactions.map((tx) => (
                <div key={tx.id} className="flex justify-between items-center pt-3.5 first:pt-0">
                  <div>
                    <h4 className="text-xs font-black text-[#1A1833] flex items-center gap-1.5">
                      <span>{tx.amount < 0 ? "🛍️" : tx.type === "saving" ? "🛡️" : "📈"}</span>
                      <span>{tx.name}</span>
                    </h4>
                    <p className="text-[9px] text-slate-400 font-bold mt-0.5">{tx.date} · {tx.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-xs font-black block ${tx.amount < 0 ? "text-rose-600" : "text-emerald-600"}`}>
                      {tx.amount < 0 ? "-" : "+"}${Math.abs(tx.amount).toFixed(2)}
                    </span>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full mt-1.5 inline-block ${tx.scoreEffect < 0 ? "bg-rose-50 border border-rose-100 text-rose-600" : "bg-emerald-50 border border-emerald-100 text-emerald-600"}`}>
                      {tx.scoreEffect < 0 ? "" : "+"}{tx.scoreEffect} points
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div> {/* End of Main Content Column */}

          {/* Sidebar Column */}
          <div className="hidden lg:flex flex-col items-center gap-4 w-full lg:w-[240px] shrink-0 order-2 lg:order-1 justify-start">
            <HoloTradingCard
              profileName={profileName}
              playerLevel={playerStats.level}
              userName={userName}
              focusPath={challengePath}
            />
            {/* XP Progression Bar under Card */}
            <div className="w-full max-w-[210px] min-[360px]:max-w-[225px] min-[390px]:max-w-[240px] bg-white/70 border border-[#E9E8F3] rounded-2xl p-3 text-center shadow-xs">
              <div className="flex justify-between items-center text-[9px] font-black text-slate-500 mb-1">
                <span>XP PROGRESSION</span>
                <span>{playerStats.xp % 300} / 300 XP</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${xpProgressPercent}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

        {/* Dedicated savings allocation screen */}
        {challengeScreen === "allocation" && (
          <div className="mx-auto max-w-2xl px-4 py-6 select-none text-center animate-fade-in w-full">
            <div className="relative z-10 flex flex-col items-center justify-start rounded-4xl border border-[#e7e1f6] bg-white p-6 sm:p-10 shadow-[0px_24px_80px_rgba(70,72,212,0.06)] min-h-[500px]">
              
              {/* Back to quest selector */}
              <div className="w-full text-left mb-4">
                <button
                  type="button"
                  onClick={() => setChallengeScreen("quest")}
                  className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-500 hover:text-slate-900 transition-all flex items-center gap-1.5 text-xs font-black cursor-pointer"
                >
                  ← Back to choices
                </button>
              </div>

              {/* Dynamic Speech Bubble */}
              <div className="w-full bg-gradient-to-tr from-violet-50/90 to-indigo-50/90 border border-violet-100 rounded-3xl p-6 relative text-left shadow-[0_8px_30px_rgba(91,93,242,0.05)] animate-[bubble-bounce_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
                {/* Pointer arrow pointing down towards Penny */}
                <div className="absolute left-1/2 bottom-[-6px] -translate-x-1/2 rotate-45 w-3.5 h-3.5 bg-[#f5f3ff] border-r border-b border-violet-100 pointer-events-none" />
                
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-violet-600">
                    Penny Coach
                  </span>
                  <span className="text-[9px] font-medium text-slate-400">· Allocation Phase</span>
                </div>
                
                <p className="text-xs font-bold leading-relaxed text-violet-950">
                  {isBudgetValid ? (
                    `Super ${userName}, tu n'as pas dépassé ton montant journalier ! Tu as économisé $${(questDetail.thresholdType === "max" ? Math.max(0, questDetail.threshold - totalCost) : totalCost).toFixed(2)} aujourd'hui. Dans quelle cagnotte (objectif d'épargne) veux-tu déposer cette somme ? 🏆`
                  ) : (
                    `Oups ${userName}, tu as dépassé ton budget aujourd'hui ! Mais pas d'inquiétude, tu gagnes tout de même de l'XP. Choisis une cagnotte pour valider la quête. 🛡️`
                  )}
                </p>
              </div>

              {/* Goals list */}
              <div className="mt-8 w-full text-left space-y-3">
                <span className="text-[9px] font-black text-violet-600 uppercase tracking-wider block mb-1">YOUR CAGNOTTES (GOALS)</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {filteredGoals.map((g) => {
                    const isActive = g.id === activeGoalId;
                    const savedAmt = questDetail.thresholdType === "max" ? Math.max(0, questDetail.threshold - totalCost) : totalCost;
                    const previewAmt = isActive ? Math.min(g.target, g.current + savedAmt) : g.current;
                    const previewPct = Math.round((previewAmt / g.target) * 100);

                    return (
                      <div
                        key={g.id}
                        onClick={() => handleSelectActiveGoal(g.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between text-left relative overflow-hidden group hover:scale-[1.01] ${
                          isActive
                            ? "bg-violet-50/70 border-[#5B5DF2] shadow-[0_4px_14px_rgba(91,93,242,0.06)] text-[#1A1833]"
                            : "bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-100/50"
                        }`}
                      >
                        {/* Chest Icon Wrapper */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xl">🏆</span>
                          <span className="text-[10px] font-black tracking-wider uppercase text-violet-600 bg-white border border-violet-100 px-2 py-0.5 rounded-md">
                            {previewPct}%
                          </span>
                        </div>

                        <div className="mt-3">
                          <h4 className="text-xs font-black tracking-tight line-clamp-1">
                            {g.name}
                          </h4>
                          <p className="text-[9px] font-bold text-slate-400 mt-1">
                            ${previewAmt.toFixed(0)} / ${g.target.toFixed(0)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mascot container */}
              <div className="relative z-10 flex h-36 w-full items-center justify-center mt-6">
                <MascotFullSvg className="h-32 w-auto animate-mascot-idle" />
              </div>

              {/* Action Button */}
              <div className="mt-8 w-full flex justify-center">
                <button
                  type="button"
                  onClick={() => handleValidateChallenge(activeGoalId)}
                  disabled={isSubmitting}
                  className="w-full max-w-sm rounded-full py-3.5 font-black text-center text-sm shadow-md transition-all duration-300 bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:scale-[1.02] hover:shadow-amber-500/20 active:scale-95 cursor-pointer"
                >
                  {isSubmitting ? "Depositing..." : "Deposit Savings & Claim Rewards! 💰"}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Dedicated gains summary screen */}
        {challengeScreen === "gains" && (
          <div className="mx-auto max-w-2xl px-4 py-6 select-none text-center animate-fade-in w-full">
            <div className="relative z-10 flex flex-col items-center justify-start rounded-4xl border border-[#e7e1f6] bg-white p-6 sm:p-10 shadow-[0px_24px_80px_rgba(70,72,212,0.06)] min-h-[500px]">
              
              {/* Reward opening chest animation */}
              <div className="flex justify-center w-full">
                <RewardChest state={animationState === "loot" ? "opened" : animationState} />
              </div>

              {/* Dynamic Speech Bubble */}
              <div className="w-full bg-gradient-to-tr from-emerald-50/90 to-teal-50/90 border border-emerald-100 rounded-3xl p-6 relative text-left shadow-[0_8px_30px_rgba(16,185,129,0.05)] mt-4 animate-[bubble-bounce_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
                {/* Pointer arrow pointing down towards Penny */}
                <div className="absolute left-1/2 bottom-[-6px] -translate-x-1/2 rotate-45 w-3.5 h-3.5 bg-[#f0fdf4] border-r border-b border-emerald-100 pointer-events-none" />
                
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                    Penny Coach
                  </span>
                  <span className="text-[9px] font-medium text-slate-400">· Reward claimed</span>
                </div>
                
                <p className="text-xs font-bold leading-relaxed text-emerald-950">
                  &ldquo;Superbe travail, ${userName} ! Tu as gagné <strong className="text-emerald-600">+{totalXp} XP</strong> et <strong className="text-amber-600">💰 +{totalCoins} Coins</strong> ! Tes économies de <strong className="text-emerald-600">${(savingsDeposited || (questDetail.thresholdType === "max" ? Math.max(0, questDetail.threshold - totalCost) : totalCost)).toFixed(2)}</strong> ont bien été déposées. Reviens demain pour ta prochaine quête quotidienne et préserver ta série de jours actifs ! ⚔️&rdquo;
                </p>
              </div>

              {/* Rewards Loot Grid */}
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 w-full">
                <LootCard 
                  type="xp" 
                  title={`+${totalXp || questDetail.choices[0]?.xpReward || 50} XP`} 
                  subtitle="RPG Experience" 
                  delayMs={100}
                />
                <LootCard 
                  type="coins" 
                  title={`+${totalCoins || questDetail.choices[0]?.coinReward || 15} Coins`} 
                  subtitle="Wallet Balance" 
                  delayMs={250}
                />
                {(selectedChoices.find((c) => c.badge)?.badge || questDetail.choices.find((c) => c.badge)?.badge) && (
                  <LootCard 
                    type="badge" 
                    title={selectedChoices.find((c) => c.badge)?.badge || questDetail.choices.find((c) => c.badge)?.badge || ""} 
                    subtitle="New Achieved Badge" 
                    delayMs={400}
                  />
                )}
              </div>

              {/* Mascot container */}
              <div className="relative z-10 flex h-36 w-full items-center justify-center mt-6">
                <MascotFullSvg className="h-32 w-auto animate-mascot-idle" />
              </div>

              {/* Action Button */}
              <div className="mt-8 w-full flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = `/profile/${encodeURIComponent(token)}`;
                  }}
                  className="w-full max-w-sm rounded-full py-3.5 font-black text-center text-sm shadow-md transition-all duration-300 bg-[#5B5DF2] text-white hover:scale-[1.02] hover:shadow-violet-500/20 active:scale-95 cursor-pointer animate-[pulse_2s_infinite]"
                >
                  Return to Dashboard
                </button>
              </div>

            </div>
          </div>
        )}

        {error ? (
          <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-800">
            {error}
          </p>
        ) : null}

        {isCompleted ? (
          <div className="mt-5 grid gap-3">
            <ShareChallengeButton token={token} path={challengePath} day={challengeDay} userName={userName} />

            <Link
              href={`/profile/${encodeURIComponent(token)}`}
              className="rounded-full border border-transparent bg-[#5B5DF2] px-5 py-3 text-center text-sm font-black text-white transition hover:scale-[1.01] hover:bg-[#4648D4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 shadow-[0_4px_14px_rgba(91,93,242,0.25)]"
            >
              See my profile evolution path
            </Link>
          </div>
        ) : null}

        {/* Push Notification Opt-in Banner — appears at peak delight after quest completion */}
        {showPushBanner && !pushEnabled && !pushBannerDismissed && (
          <div className="mt-4 animate-[slideUp_0.5s_ease-out] rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-50/95 to-indigo-50/95 backdrop-blur-xl p-4 shadow-[0_8px_32px_rgba(91,93,242,0.06)] text-[#1A1833]">
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5 w-9 h-9 rounded-xl bg-violet-100 border border-violet-200 flex items-center justify-center">
                <Bell className="w-4.5 h-4.5 text-violet-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black text-violet-600 uppercase tracking-wider">Penny says</p>
                <p className="mt-1 text-[13px] font-bold text-slate-700 leading-snug">
                  🔥 Nice streak! Want me to ping you tomorrow so you don&apos;t lose it?
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    disabled={pushLoading}
                    onClick={async () => {
                      const result = await subscribe();
                      if (result?.ok) {
                        setShowPushBanner(false);
                      } else {
                        setPushBannerDismissed(true);
                        setShowPushBanner(false);
                        localStorage.setItem("push_banner_dismissed", "1");
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-[#5B5DF2] text-white text-xs font-black transition-all hover:scale-[1.03] active:scale-95 shadow-[0_4px_14px_rgba(91,93,242,0.2)] cursor-pointer"
                  >
                    {pushLoading ? "Enabling..." : "Yes, remind me ⚡"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPushBannerDismissed(true);
                      setShowPushBanner(false);
                      localStorage.setItem("push_banner_dismissed", "1");
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200/50 text-xs font-bold text-slate-500 transition-all cursor-pointer"
                  >
                    Maybe later
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </section>
    </main>
  );
}
