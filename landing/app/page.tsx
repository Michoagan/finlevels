"use client";

import { useState } from "react";
import {
  ArrowRight,
  ChevronRight,
  Flame,
  Gamepad2,
  Share,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProfileCardFan from "../components/ProfileCardFan";
import WaitlistButton from "../components/WaitlistButton";
import InteractiveDemo from "../components/InteractiveDemo";
import { usePWAInstall } from "../hooks/usePWAInstall";

// Existing profiles array
const profileExamples = [
  {
    name: "The Survivor",
    metric: "all coins early",
    color: "bg-[#ffe7ef] text-[#9b174c] border-[#ffb2ce]",
    imageSrc: "/profile-survivor.png",
    challengeGoal:
      "Start with simple stability habits that make money feel less overwhelming.",
    path: [
      "Track one spending category for the week",
      "Pick one pressure point to reduce first",
      "Build awareness before adding bigger goals",
    ],
  },
  {
    name: "The Explorer",
    metric: "all coins developing",
    color: "bg-[#e1e0ff] text-[#4648d4] border-[#b8b5ff]",
    imageSrc: "/profile-explorer.png",
    challengeGoal:
      "Turn early progress into consistent habits across Stability, Saving, and Investing.",
    path: [
      "Practice one short habit for each coin during the week",
      "Focus first on the coin with the lowest level",
      "Repeat small actions until progress becomes a routine",
    ],
  },
  {
    name: "The Stabilizer",
    metric: "stability high",
    color: "bg-[#fff3c4] text-[#904900] border-[#ffe28a]",
    imageSrc: "/profile-stabilizer.png",
    challengeGoal:
      "Use your strong spending control as the base for saving and investing habits.",
    path: [
      "Keep your stability routines visible",
      "Add one automatic saving action",
      "Introduce investing basics without rushing",
    ],
  },
  {
    name: "The Saver",
    metric: "saving high",
    color: "bg-[#e8fffb] text-[#006b4e] border-[#a3f0e1]",
    imageSrc: "/profile-saver.png",
    challengeGoal:
      "Connect your saving strength to better stability and future investing confidence.",
    path: [
      "Protect the saving rhythm you already have",
      "Review spending pressure that could interrupt it",
      "Learn one investing concept at a time",
    ],
  },
  {
    name: "The Builder",
    metric: "stability + saving high",
    color: "bg-[#e8fffb] text-[#006b4e] border-[#a3f0e1]",
    imageSrc: "/profile-builder.png",
    challengeGoal:
      "Move from protection into wealth-building by introducing investing with confidence.",
    path: [
      "Maintain your stable spending and saving systems",
      "Learn investing fundamentals through short daily lessons",
      "Practice small wealth-building actions without abandoning your foundation",
    ],
  },
  {
    name: "The Investor",
    metric: "investing high",
    color: "bg-[#dff0ff] text-[#005b9f] border-[#afd5ff]",
    imageSrc: "/profile-investor.png",
    challengeGoal:
      "Support your investing ambition with stronger stability and saving systems.",
    path: [
      "Check whether spending pressure is increasing risk",
      "Build an emergency buffer that handles unexpected bills",
      "Keep your investing habits active",
    ],
  },
  {
    name: "The Strategist",
    metric: "stability + investing high",
    color: "bg-[#f5f2fe] text-[#4648d4] border-[#c7c0ff]",
    imageSrc: "/profile-strategist.png",
    challengeGoal:
      "Support your control and growth perspective with a consistent saving rhythm.",
    path: [
      "Maintain your spending control and investing plan",
      "Start a small, automatic saving habit",
      "Build a cash reserve that matches your investing goals",
    ],
  },
  {
    name: "The Wealth Architect",
    metric: "all coins high",
    color: "bg-[#e8fffb] text-[#006b5f] border-[#a3f0e1]",
    imageSrc: "/profile-wealth-architect.png",
    challengeGoal:
      "Optimize your balanced habits and keep your momentum consistent.",
    path: [
      "Check where you can optimize systems or fees",
      "Keep your daily savings and investing automatic",
      "Use advanced challenges to test your financial routines",
    ],
  },
  {
    name: "The Opportunist",
    metric: "saving + investing high",
    color: "bg-[#fff3c4] text-[#904900] border-[#ffe28a]",
    imageSrc: "/profile-opportunist.png",
    challengeGoal:
      "Support your growth focus with stronger spending and stability habits.",
    path: [
      "Track where your everyday spending might increase risk",
      "Add simple stability routines to protect your saving power",
      "Review your financial foundation once a week",
    ],
  },
] as const;

// Custom SVGs for Mascot
function MascotFaceSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes penny-face-blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        @keyframes penny-face-breathe {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-1.5px); }
        }
        @keyframes penny-face-coin-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(5deg); }
        }
        .penny-face-left-eye {
          transform-origin: 37px 50px;
          animation: penny-face-blink 4s infinite ease-in-out;
        }
        .penny-face-right-eye {
          transform-origin: 63px 50px;
          animation: penny-face-blink 4s infinite ease-in-out;
        }
        .penny-face-body-group {
          animation: penny-face-breathe 3s infinite ease-in-out;
        }
        .penny-face-coin {
          transform-origin: 50px 16px;
          animation: penny-face-coin-float 2.5s infinite ease-in-out;
        }
      `}</style>

      <defs>
        <linearGradient id="penny-face-body-grad" x1="50" y1="28" x2="50" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f3e8ff" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
        <linearGradient id="penny-face-coin-grad" x1="50" y1="6" x2="50" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffe57f" />
          <stop offset="100%" stopColor="#ffb300" />
        </linearGradient>
      </defs>

      <g className="penny-face-body-group">
        {/* Floating Gold Coin */}
        <g className="penny-face-coin">
          {/* Coin Body */}
          <circle cx="50" cy="15" r="7" fill="url(#penny-face-coin-grad)" stroke="#ff9100" strokeWidth="0.8" />
          {/* Coin Inner Border */}
          <circle cx="50" cy="15" r="4.5" stroke="#ff9100" strokeWidth="0.4" fill="none" />
          {/* Coin "C" */}
          <path d="M 52 13 A 2 2 0 1 0 52 17" stroke="#ff9100" strokeWidth="1" fill="none" strokeLinecap="round" />
        </g>

        {/* Coin Slot on Head */}
        <ellipse cx="50" cy="27" rx="7.5" ry="1.8" fill="#1b1b23" opacity="0.8" />

        {/* Head/Body */}
        <circle cx="50" cy="58" r="32" fill="url(#penny-face-body-grad)" stroke="#a855f7" strokeWidth="1.5" />

        {/* Ears */}
        {/* Left Ear */}
        <path d="M 25 36 Q 12 22 20 17 Q 30 21 33 32 Z" fill="#c084fc" stroke="#a855f7" strokeWidth="1" />
        <path d="M 24 32 Q 17 21 20 19 Q 26 22 29 29 Z" fill="#f3e8ff" />
        {/* Right Ear */}
        <path d="M 75 36 Q 88 22 80 17 Q 70 21 67 32 Z" fill="#c084fc" stroke="#a855f7" strokeWidth="1" />
        <path d="M 76 32 Q 83 21 80 19 Q 74 22 71 29 Z" fill="#f3e8ff" />

        {/* Snout */}
        <ellipse cx="50" cy="65" rx="11" ry="8" fill="#a855f7" />
        {/* Snout Inner Light */}
        <ellipse cx="50" cy="65" rx="9.5" ry="6.5" fill="#c084fc" />
        {/* Nostrils */}
        <circle cx="47" cy="65" r="1.5" fill="#701a75" />
        <circle cx="53" cy="65" r="1.5" fill="#701a75" />

        {/* Mouth */}
        <path d="M 45 74 Q 50 79 55 74" stroke="#1b1b23" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Blush */}
        <circle cx="25" cy="60" r="5" fill="#f472b6" opacity="0.6" />
        <circle cx="75" cy="60" r="5" fill="#f472b6" opacity="0.6" />

        {/* Eyes grouped here */}
        <g className="penny-face-left-eye">
          <circle cx="37" cy="50" r="8" fill="#1b1b23" />
          <circle cx="35" cy="47" r="2.5" fill="white" />
        </g>
        <g className="penny-face-right-eye">
          <circle cx="63" cy="50" r="8" fill="#1b1b23" />
          <circle cx="61" cy="47" r="2.5" fill="white" />
        </g>
      </g>
    </svg>
  );
}



function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.95 1.2 2.27 2 3.75 2.27v3.91c-1.77-.07-3.48-.75-4.85-1.92-.09-.07-.12-.08-.12.04-.03 2.19-.01 4.38-.03 6.57-.09 1.77-.69 3.48-1.78 4.85-1.2 1.52-2.95 2.53-4.88 2.8-1.54.21-3.12.03-4.57-.52-1.83-.7-3.32-2.11-4.1-3.88-.88-2.02-.91-4.36-.08-6.4 1-2.48 3.19-4.27 5.86-4.63.14-.02.26-.06.26-.23v3.98c-.1-.01-.2.03-.3.04-1.07.13-2.09.67-2.77 1.51-.77.95-1.09 2.19-.88 3.39.2 1.14.92 2.15 1.95 2.68.99.51 2.15.53 3.16.05 1.15-.55 1.94-1.67 2.1-2.95.06-1 .03-2 .04-3V.02h.02z" />
    </svg>
  );
}

function RedditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.85-1.64-6.23-1.72l1.37-4.34 3.84.88C18 5.75 19 6.75 20.25 6.75c1.24 0 2.25-1.01 2.25-2.25S21.49 2.25 20.25 2.25c-1.12 0-2.05.83-2.22 1.9l-4.13-.94c-.23-.05-.47.09-.53.32l-1.63 5.17C9.36 6.84 7.15 7.48 5.51 8.48c-.56-.76-1.46-1.24-2.42-1.24-1.65 0-3 1.35-3 3 0 1.14.64 2.14 1.59 2.63C1.63 13.19 1.6 13.59 1.6 14c0 3.89 4.67 7 10.4 7s10.4-3.11 10.4-7c0-.41-.03-.81-.08-1.21.95-.49 1.58-1.49 1.58-2.63zm-14.75 1c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm8.4 4.5c-1.2 1.2-3.45 1.3-4.15 1.3-.7 0-2.95-.1-4.15-1.3-.18-.18-.18-.47 0-.65.18-.18.47-.18.65 0 .93.93 2.76 1.05 3.5 1.05s2.57-.12 3.5-1.05c.18-.18.47-.18.65 0 .18.18.18.47 0 .65zm-2.4-3c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5z" />
    </svg>
  );
}

export default function Home() {
  const [activeRpgTab, setActiveRpgTab] = useState(0);
  const router = useRouter();
  const { triggerInstall, isIOS, isStandalone } = usePWAInstall();
  const [showIosInstallDrawer, setShowIosInstallDrawer] = useState(false);

  const handleStartAdventure = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isIOS && !isStandalone) {
      setShowIosInstallDrawer(true);
    } else {
      await triggerInstall();
      router.push("/quiz");
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f2fe] text-[#1b1b23] selection:bg-[#E4FF30] selection:text-[#1b1b23]">
      {/* Custom Keyframe Animations */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-12px) rotate(6deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(-10deg); }
          50% { transform: translateY(-16px) rotate(-4deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 5s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }
        .phone-mockup-3d {
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 15px 25px 50px -10px rgba(0, 0, 0, 0.35), 
                      5px 10px 20px -5px rgba(0, 0, 0, 0.25),
                      0px 0px 0px 1px rgba(255, 255, 255, 0.08) inset;
        }
        @media (min-width: 640px) {
          .phone-mockup-3d {
            transform: perspective(1500px) rotateX(6deg) rotateY(14deg) rotateZ(4deg);
          }
        }
        .group:hover .phone-mockup-3d {
          transform: perspective(1500px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1.03);
          box-shadow: 0 45px 90px -25px rgba(0, 0, 0, 0.4),
                      0 15px 30px -10px rgba(0, 0, 0, 0.2),
                      0px 0px 0px 1px rgba(255, 255, 255, 0.12) inset;
        }
        @keyframes lp-bubble-in {
          0% { opacity: 0; transform: scale(0.7) translateY(8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes lp-typing {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes lp-typewriter {
          0% { opacity: 0; clip-path: inset(0 100% 0 0); }
          100% { opacity: 1; clip-path: inset(0 0% 0 0); }
        }
        @keyframes lp-badge-pop {
          0% { opacity: 0; transform: scale(0) translateY(6px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-10 py-12 md:py-20 overflow-hidden">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">

          {/* Left Column (Hero Content) */}
          <div className="flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#4648d4]/15 bg-white px-4 py-2 text-sm font-extrabold text-[#4648d4] shadow-sm mb-6">
              <span className="notranslate" translate="no">👾 GAMIFY YOUR FINANCES 👾</span>
            </div>

            <h1 className="max-w-2xl text-4xl font-black tracking-[-0.055em] text-[#1b1b23] sm:text-5xl md:text-6xl leading-[1.05]">
              Learn better money habits by playing.
            </h1>

            {/* Gamified RPG Penny Coach Dialogue Encounter */}
            <div className="mt-6 max-w-xl">
              <div className="relative flex items-stretch gap-0">

                {/* Penny Mascot with Glow Aura */}
                <div className="relative shrink-0 w-20 sm:w-24 flex items-end self-end">
                  {/* Glow ring behind Penny */}
                  <div className="absolute inset-0 -inset-x-3 bottom-0 rounded-full bg-violet-400/15 blur-2xl animate-pulse pointer-events-none" />
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 w-full h-auto drop-shadow-lg">
                    <style>{`
                      @keyframes lp-blink { 0%, 90%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
                      @keyframes lp-wave { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(15deg); } }
                      @keyframes lp-breathe { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
                      @keyframes lp-coin { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-4px) rotate(5deg); } }
                      .lp-le { transform-origin: 38px 51px; animation: lp-blink 4s infinite ease-in-out; }
                      .lp-re { transform-origin: 62px 51px; animation: lp-blink 4s infinite ease-in-out; }
                      .lp-wa { transform-origin: 74px 58px; animation: lp-wave 2s infinite ease-in-out; }
                      .lp-bg { animation: lp-breathe 3s infinite ease-in-out; }
                      .lp-cn { transform-origin: 50px 18px; animation: lp-coin 2.5s infinite ease-in-out; }
                    `}</style>
                    <g className="lp-cn">
                      <circle cx="50" cy="18" r="8" fill="url(#lpcg)" stroke="#ff9100" strokeWidth="1" />
                      <circle cx="50" cy="18" r="5.5" stroke="#ff9100" strokeWidth="0.5" fill="none" />
                      <path d="M 52.5 15.5 A 2.5 2.5 0 1 0 52.5 20.5" stroke="#ff9100" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                    </g>
                    <ellipse cx="50" cy="31" rx="8" ry="2" fill="#1b1b23" opacity="0.8" />
                    <circle cx="36" cy="83" r="7.5" fill="#a855f7" />
                    <circle cx="64" cy="83" r="7.5" fill="#a855f7" />
                    <path d="M 22 62 Q 13 60 15 52 Q 19 48 24 53" stroke="#a855f7" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                    <g className="lp-wa">
                      <path d="M 74 58 Q 88 56 88 42" stroke="#a855f7" strokeWidth="8" strokeLinecap="round" fill="none" />
                    </g>
                    <path d="M 26 58 Q 12 56 12 42" stroke="#a855f7" strokeWidth="8" strokeLinecap="round" fill="none" />
                    <g className="lp-bg">
                      <circle cx="50" cy="58" r="28" fill="url(#lpbg)" stroke="#a855f7" strokeWidth="1.5" />
                      <path d="M 28 38 Q 16 25 23 20 Q 32 24 35 34 Z" fill="#c084fc" stroke="#a855f7" strokeWidth="1" />
                      <path d="M 27 34 Q 20 24 23 22 Q 28 25 31 31 Z" fill="#f3e8ff" />
                      <path d="M 72 38 Q 84 25 77 20 Q 68 24 65 34 Z" fill="#c084fc" stroke="#a855f7" strokeWidth="1" />
                      <path d="M 73 34 Q 80 24 77 22 Q 72 25 69 31 Z" fill="#f3e8ff" />
                      <ellipse cx="50" cy="65" rx="10.5" ry="7.5" fill="#a855f7" />
                      <ellipse cx="50" cy="65" rx="9" ry="6" fill="#c084fc" />
                      <circle cx="47" cy="65" r="1.5" fill="#701a75" />
                      <circle cx="53" cy="65" r="1.5" fill="#701a75" />
                      <path d="M 45 73 Q 50 78 55 73" stroke="#1b1b23" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                      <circle cx="28" cy="60" r="4.5" fill="#f472b6" opacity="0.6" />
                      <circle cx="72" cy="60" r="4.5" fill="#f472b6" opacity="0.6" />
                      <g className="lp-le"><circle cx="38" cy="51" r="7" fill="#1b1b23" /><circle cx="36.5" cy="48.5" r="2.2" fill="white" /></g>
                      <g className="lp-re"><circle cx="62" cy="51" r="7" fill="#1b1b23" /><circle cx="60.5" cy="48.5" r="2.2" fill="white" /></g>
                    </g>
                    <defs>
                      <linearGradient id="lpbg" x1="50" y1="30" x2="50" y2="82" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#f3e8ff" /><stop offset="100%" stopColor="#c084fc" />
                      </linearGradient>
                      <linearGradient id="lpcg" x1="50" y1="10" x2="50" y2="26" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#ffe57f" /><stop offset="100%" stopColor="#ffb300" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* RPG Dialogue Frame */}
                <div className="relative flex-1 min-w-0 -ml-2" style={{ animation: "lp-bubble-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.3s both" }}>
                  {/* Outer RPG frame border */}
                  <div className="relative rounded-2xl border-2 border-violet-300/40 bg-gradient-to-br from-white via-violet-50/80 to-indigo-50/60 p-[1px] shadow-[0_12px_40px_rgba(91,93,242,0.10),0_0_0_1px_rgba(91,93,242,0.04)]">
                    <div className="rounded-[14px] bg-white/90 backdrop-blur-sm px-4 py-3.5 sm:px-5 sm:py-4">

                      {/* Header: NPC name badge + quest marker */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          {/* Quest marker diamond */}
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-br from-amber-400 to-yellow-500 shadow-sm" style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600">Coach Penny</span>
                        </div>
                        {/* Typing indicator dots */}
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-400" style={{ animation: "lp-typing 1.4s infinite ease-in-out 0s" }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-400" style={{ animation: "lp-typing 1.4s infinite ease-in-out 0.2s" }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-400" style={{ animation: "lp-typing 1.4s infinite ease-in-out 0.4s" }} />
                        </div>
                      </div>

                      {/* Dialogue text with typewriter feel */}
                      <p className="text-[13px] sm:text-sm font-semibold leading-relaxed text-[#2d2b3d]" style={{ animation: "lp-typewriter 0.8s ease-out 0.6s both" }}>
                        &ldquo;Ready to build better money habits with me? Let&apos;s turn your finances into an adventure — with daily challenges, XP streaks, and real savings missions!&rdquo; ⚔️✨
                      </p>

                      {/* Floating gamification stat badges */}
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span
                          className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 border border-violet-200/50 px-2.5 py-1 text-[10px] font-black text-violet-700 shadow-xs"
                          style={{ animation: "lp-badge-pop 0.4s cubic-bezier(0.175,0.885,0.32,1.275) 1.0s both" }}
                        >
                          ⚡ +50 XP per quest
                        </span>
                        <span
                          className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-50 to-yellow-100 border border-amber-200/50 px-2.5 py-1 text-[10px] font-black text-amber-700 shadow-xs"
                          style={{ animation: "lp-badge-pop 0.4s cubic-bezier(0.175,0.885,0.32,1.275) 1.2s both" }}
                        >
                          💰 Earn coins daily
                        </span>
                        <span
                          className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-50 to-orange-100 border border-rose-200/50 px-2.5 py-1 text-[10px] font-black text-rose-700 shadow-xs"
                          style={{ animation: "lp-badge-pop 0.4s cubic-bezier(0.175,0.885,0.32,1.275) 1.4s both" }}
                        >
                          🔥 Streaks & habits
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Speech bubble pointer towards Penny */}
                  <div className="absolute left-[-5px] bottom-6 w-3.5 h-3.5 rotate-45 bg-white border-l-2 border-b-2 border-violet-300/40 pointer-events-none" />
                </div>

              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row w-full sm:w-auto">
              <button
                type="button"
                onClick={handleStartAdventure}
                className="group cursor-pointer inline-flex items-center justify-center gap-2 rounded-full bg-[#4648d4] px-8 py-4 text-base font-extrabold text-white shadow-[0_16px_40px_rgba(70,72,212,0.22)] transition-all hover:scale-[1.02] hover:bg-[#393bbb] w-full sm:w-auto"
              >
                Start Your Adventure
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <WaitlistButton className="inline-flex justify-center items-center rounded-full border border-[#4648d4]/15 bg-white px-8 py-4 text-base font-extrabold text-[#4648d4] shadow-sm transition-all hover:scale-[1.02] hover:bg-[#f5f2fe] w-full sm:w-auto">
                Join the Waitlist
              </WaitlistButton>
            </div>

          </div>

          {/* Right Column (High Fidelity Phone Simulator) */}
          <div className="relative flex items-center justify-center lg:justify-end">

            {/* Phone container wrapper to keep floaters relative to the phone */}
            <div className="relative w-72 h-[590px] group">

              {/* Floating XP badge */}
              <div className="absolute -left-10 top-16 z-30 transition-transform duration-500 ease-out group-hover:-translate-x-3 group-hover:-translate-y-2 hidden sm:block">
                <div className="bg-violet-600 text-white font-extrabold text-sm px-4 py-2 rounded-2xl shadow-lg border border-violet-400/30 animate-float-fast">
                  +50 XP
                </div>
              </div>

              {/* Floating Gold Coin */}
              <div className="absolute -right-8 top-28 z-30 transition-transform duration-500 ease-out group-hover:translate-x-3 group-hover:-translate-y-1 hidden sm:block">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-300 to-yellow-500 shadow-xl border-2 border-yellow-200 flex items-center justify-center animate-float-medium">
                  <div className="w-11 h-11 rounded-full border-2 border-dashed border-yellow-100 flex items-center justify-center text-yellow-100 text-2xl font-black">
                    $
                  </div>
                </div>
              </div>

              {/* Floating Game Controller */}
              <div className="absolute -left-12 bottom-20 z-30 transition-transform duration-500 ease-out group-hover:-translate-x-3 group-hover:translate-y-2 hidden sm:block">
                <div className="w-16 h-16 rounded-2xl bg-[#5c5edf] shadow-2xl border border-indigo-400/40 flex items-center justify-center rotate-[15deg] animate-float-slow text-white">
                  <Gamepad2 className="h-9 w-9" />
                </div>
              </div>

              {/* Simulated iPhone Frame */}
              <div className="relative w-full h-full bg-slate-950 rounded-[3.2rem] p-3 border-[3px] border-slate-800/80 ring-1 ring-white/10 phone-mockup-3d origin-center shadow-2xl">

                {/* Screen Content Container (Dark Mode Mockup with Demo Video) */}
                <div className="w-full h-full bg-[#131326] rounded-[2.6rem] overflow-hidden relative ring-1 ring-white/5">

                  {/* Dynamic Screen Glare / Reflection Sweep */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/8 to-transparent pointer-events-none z-50 transition-transform duration-700 ease-out translate-x-[-100%] translate-y-[-100%] group-hover:translate-x-[100%] group-hover:translate-y-[100%]" />

                  {/* Dynamic Island Notch */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-4.5 bg-black rounded-full z-40" />

                  {/* Autoplaying Demo Video */}
                  <video
                    src="/demo.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* Preserved Profile Section: Your profile explains your next move */}
      <section className="py-20 bg-[#4648d4] text-white overflow-hidden" id="profiles">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">

          {/* Header & Coins Progression Side-by-Side Grid */}
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center mb-16">
            {/* Left side: Heading */}
            <div className="flex flex-col items-start text-left">
              <span className="inline-flex rounded-full bg-white/10 border border-white/20 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#E4FF30]">
                Personalized Path
              </span>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl leading-tight">
                Your profile explains your next move.
              </h2>
              <p className="mt-4 text-lg font-medium leading-8 text-white/80">
                Your profile connects your current habits to a clearer path, so
                you know whether to focus on stability, saving, or investing next.
              </p>
            </div>

            {/* Right side: 3 Coins Progression (Simple & Fluid) */}
            <div className="space-y-4 w-full">
              {[
                {
                  title: "Stability Coin",
                  level: "Lvl 8",
                  desc: "Build discipline, reduce chaos, and take control of your everyday.",
                  image: "/coin-stability.png",
                  progressWidth: "w-[80%]",
                  color: "bg-[#E4FF30]",
                  bgColor: "bg-white/5 border-white/10 hover:bg-white/10",
                  textColor: "text-[#E4FF30]"
                },
                {
                  title: "Saving Coin",
                  level: "Lvl 6",
                  desc: "Save more consistently without feeling restricted.",
                  image: "/coin-saving.png",
                  progressWidth: "w-[60%]",
                  color: "bg-[#2dd4bf]",
                  bgColor: "bg-white/5 border-white/10 hover:bg-white/10",
                  textColor: "text-[#2dd4bf]"
                },
                {
                  title: "Investing Coin",
                  level: "Lvl 4",
                  desc: "Start thinking long-term and build your future self.",
                  image: "/coin-investing.png",
                  progressWidth: "w-[40%]",
                  color: "bg-[#fb923c]",
                  bgColor: "bg-white/5 border-white/10 hover:bg-white/10",
                  textColor: "text-[#fb923c]"
                },
              ].map((coin) => (
                <div
                  key={coin.title}
                  className={`flex items-center gap-4 rounded-2xl p-3 border shadow-sm transition-all hover:scale-[1.01] ${coin.bgColor}`}
                >
                  <div className="relative w-10 h-10 shrink-0 flex items-center justify-center bg-white/10 rounded-xl border border-white/10 shadow-sm">
                    <Image
                      src={coin.image}
                      alt={coin.title}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  <div className="w-full min-w-0">
                    <div className="flex justify-between items-center text-xs font-black text-white mb-1">
                      <span>{coin.title}</span>
                      <span className={`font-extrabold ${coin.textColor}`}>{coin.level}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-1">
                      <div className={`h-full ${coin.color} rounded-full ${coin.progressWidth}`} />
                    </div>
                    <p className="text-[10px] font-semibold leading-relaxed text-white/70 truncate">
                      {coin.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ProfileCardFan profiles={profileExamples} />

          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={handleStartAdventure}
              className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-[#E4FF30] px-8 py-5 text-lg font-black text-[#1b1b23] shadow-md transition-transform hover:scale-[1.02]"
            >
              Start Your Adventure
              <ChevronRight className="size-5 text-[#1b1b23]" />
            </button>
          </div>
        </div>
      </section>

      {/* Section 4: Gamified RPG block (Stunning Light Lavender Glassmorphism Theme) */}
      <section className="relative bg-gradient-to-b from-[#f5f3ff] to-[#e8e4f8] text-[#1b1b23] py-24 border-t border-[#4648d4]/10 overflow-hidden" id="coins">
        {/* Soft Background Glow Effects */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#5c5edf]/5 rounded-full filter blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] bg-indigo-500/5 rounded-full filter blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 relative z-10">

          <div className="max-w-3xl mb-16 space-y-4">
            <span className="inline-flex rounded-full bg-[#e1e0ff] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#4648d4] shadow-sm">
              Level Up Your Financial Life
            </span>
            <h2 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl md:text-5xl leading-tight text-[#1b1b23]">
              FinLevels turns <br />
              personal finance into a game.
            </h2>
            <div className="text-base font-medium text-[#464554] max-w-2xl leading-relaxed space-y-2">
              <p>
                Complete challenges, earn XP, build streaks, and unlock new levels as you develop better money habits.
              </p>
              <p className="text-sm text-[#4648d4] font-semibold italic">
                Because financial growth shouldn&apos;t feel like homework.
              </p>
            </div>
          </div>
          {/* Mobile Card Carousel (Segmented Control tab) */}
          <div className="md:hidden flex flex-col gap-4 w-full">
            {/* Custom Segmented Control Header */}
            <div className="flex bg-[#e1e0ff]/40 p-1.5 rounded-full justify-between gap-1 w-full max-w-sm mx-auto mb-2 border border-[#4648d4]/5">
              {["Quests", "Streaks", "Levels"].map((tab, idx) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveRpgTab(idx)}
                  className={`flex-1 text-center py-2.5 rounded-full text-xs font-black transition-all ${activeRpgTab === idx
                      ? "bg-[#4648d4] text-white shadow-md scale-[1.02]"
                      : "text-[#464554] hover:text-[#4648d4]"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Active Tab Card with smooth entry animation */}
            <div key={activeRpgTab} className="animate-[fade-in_0.3s_ease-out_forwards]">
              {activeRpgTab === 0 && (
                <div className="group rounded-[2.5rem] border border-white/80 bg-white/40 backdrop-blur-md p-8 flex flex-col justify-between shadow-sm min-h-[340px]">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-black text-[#1b1b23]">Complete Quests</h3>
                        <p className="mt-2 text-xs font-bold text-[#464554] leading-relaxed">Small actions. Real progress.</p>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shadow-[0_0_8px_#8b5cf6]" />
                    </div>

                    {/* Mini mockup Card */}
                    <div className="mt-8 bg-[#f5f2fe] border border-[#4648d4]/10 rounded-3xl p-5 shadow-sm">
                      <span className="text-[8px] font-black uppercase tracking-wider text-[#4648d4]">Daily Quest</span>
                      <p className="mt-2 text-sm font-extrabold leading-tight text-[#1b1b23]">Avoid an impulse buy today.</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-[10px] font-black text-[#006b5f] bg-[#e8fffb] px-2 py-0.5 rounded-full border border-[#a3f0e1]">+50 XP • +20 coins</span>
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black shadow-[0_0_8px_#10b981]">
                          ✓
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link href="/challenges" className="mt-8 inline-flex items-center gap-1.5 text-sm font-extrabold text-[#4648d4] hover:text-[#393bbb] group/link">
                    See all challenges <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              )}

              {activeRpgTab === 1 && (
                <div className="group rounded-[2.5rem] border border-white/80 bg-white/40 backdrop-blur-md p-8 flex flex-col justify-between shadow-sm min-h-[340px]">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-black text-[#1b1b23]">Build Your Streak</h3>
                        <p className="mt-2 text-xs font-bold text-[#464554] leading-relaxed">Consistency is the real asset.</p>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]" />
                    </div>

                    {/* Mini mockup Card */}
                    <div className="mt-8 bg-[#f5f2fe] border border-[#4648d4]/10 rounded-3xl p-5 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Flame className="h-6 w-6 text-orange-500 fill-orange-500 animate-pulse" />
                        <span className="text-base font-black text-[#1b1b23]">14 days</span>
                      </div>
                      <div className="flex gap-1 justify-between mt-4">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black shadow-[0_0_8px_#f97316]">✓</div>
                        ))}
                        <div className="w-6 h-6 rounded-full bg-[#e1e0ff] flex items-center justify-center text-xs font-black text-[#4648d4]">S</div>
                      </div>
                    </div>
                  </div>
                  <span className="mt-8 text-sm font-extrabold text-orange-500 cursor-default">Keep your streak alive</span>
                </div>
              )}

              {activeRpgTab === 2 && (
                <div className="group rounded-[2.5rem] border border-white/80 bg-white/40 backdrop-blur-md p-8 flex flex-col justify-between shadow-sm min-h-[340px]">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-black text-[#1b1b23]">Earn XP & Climb Levels</h3>
                        <p className="mt-2 text-xs font-bold text-[#464554] leading-relaxed">Every action moves you forward.</p>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
                    </div>

                    {/* Mini mockup Card */}
                    <div className="mt-8 bg-[#f5f2fe] border border-[#4648d4]/10 rounded-3xl p-5 shadow-sm">
                      <div className="flex justify-between items-center text-xs font-black text-slate-700 mb-2">
                        <span className="text-[#4648d4] font-black">Level 12</span>
                        <span className="text-[#464554]">2,450 / 3,000 XP</span>
                      </div>
                      <div className="w-full h-2.5 bg-[#e1e0ff] rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-violet-500 to-[#4648d4] h-full w-[80%] rounded-full shadow-[0_0_8px_rgba(70,72,212,0.3)]" />
                      </div>
                    </div>
                  </div>
                  <span className="mt-8 text-sm font-extrabold text-[#4648d4] transition-colors cursor-pointer">See Ranks</span>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Grid Layout (Hidden on Mobile) */}
          <div className="hidden md:grid gap-8 md:grid-cols-3">

            {/* Box 1: Complete challenges (Violet/Indigo Theme) */}
            <div className="group rounded-[2.5rem] border border-white/80 bg-white/40 backdrop-blur-md p-8 flex flex-col justify-between shadow-sm transition-all duration-300 hover:border-violet-300 hover:bg-white/70 hover:shadow-[0_20px_50px_rgba(70,72,212,0.06)] hover:-translate-y-1">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-black text-[#1b1b23] group-hover:text-[#4648d4] transition-colors">Complete Quests</h3>
                    <p className="mt-2 text-xs font-bold text-[#464554] leading-relaxed">Small actions. Real progress.</p>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shadow-[0_0_8px_#8b5cf6]" />
                </div>

                {/* Mini mockup Card */}
                <div className="mt-8 bg-[#f5f2fe] border border-[#4648d4]/10 rounded-3xl p-5 shadow-sm">
                  <span className="text-[8px] font-black uppercase tracking-wider text-[#4648d4]">Daily Quest</span>
                  <p className="mt-2 text-sm font-extrabold leading-tight text-[#1b1b23]">Avoid an impulse buy today.</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] font-black text-[#006b5f] bg-[#e8fffb] px-2 py-0.5 rounded-full border border-[#a3f0e1]">+50 XP • +20 coins</span>
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black shadow-[0_0_8px_#10b981]">
                      ✓
                    </div>
                  </div>
                </div>
              </div>
              <Link href="/challenges" className="mt-8 inline-flex items-center gap-1.5 text-sm font-extrabold text-[#4648d4] hover:text-[#393bbb] group/link">
                See all challenges <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
              </Link>
            </div>

            {/* Box 2: Build your streak (Orange/Amber Theme) */}
            <div className="group rounded-[2.5rem] border border-white/80 bg-white/40 backdrop-blur-md p-8 flex flex-col justify-between shadow-sm transition-all duration-300 hover:border-orange-300 hover:bg-white/70 hover:shadow-[0_20px_50px_rgba(249,115,22,0.06)] hover:-translate-y-1">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-black text-[#1b1b23] group-hover:text-orange-600 transition-colors">Build Your Streak</h3>
                    <p className="mt-2 text-xs font-bold text-[#464554] leading-relaxed">Consistency is the real asset.</p>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]" />
                </div>

                {/* Mini mockup Card */}
                <div className="mt-8 bg-[#f5f2fe] border border-[#4648d4]/10 rounded-3xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="h-6 w-6 text-orange-500 fill-orange-500 animate-pulse" />
                    <span className="text-base font-black text-[#1b1b23]">14 days</span>
                  </div>
                  <div className="flex gap-1 justify-between mt-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black shadow-[0_0_8px_#f97316]">✓</div>
                    ))}
                    <div className="w-6 h-6 rounded-full bg-[#e1e0ff] flex items-center justify-center text-xs font-black text-[#4648d4]">S</div>
                  </div>
                </div>
              </div>
              <span className="mt-8 text-sm font-extrabold text-orange-500 cursor-default">Keep your streak alive</span>
            </div>

            {/* Box 3: Earn XP & climb levels (Electric Blue/Yellow Theme) */}
            <div className="group rounded-[2.5rem] border border-white/80 bg-white/40 backdrop-blur-md p-8 flex flex-col justify-between shadow-sm transition-all duration-300 hover:border-indigo-300 hover:bg-white/70 hover:shadow-[0_20px_50px_rgba(70,72,212,0.06)] hover:-translate-y-1">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-black text-[#1b1b23] group-hover:text-[#4648d4] transition-colors">Earn XP & Climb Levels</h3>
                    <p className="mt-2 text-xs font-bold text-[#464554] leading-relaxed">Every action moves you forward.</p>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
                </div>

                {/* Mini mockup Card */}
                <div className="mt-8 bg-[#f5f2fe] border border-[#4648d4]/10 rounded-3xl p-5 shadow-sm">
                  <div className="flex justify-between items-center text-xs font-black text-slate-700 mb-2">
                    <span className="text-[#4648d4] font-black">Level 12</span>
                    <span className="text-[#464554]">2,450 / 3,000 XP</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#e1e0ff] rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-violet-500 to-[#4648d4] h-full w-[80%] rounded-full shadow-[0_0_8px_rgba(70,72,212,0.3)]" />
                  </div>
                </div>
              </div>
              <span className="mt-8 text-sm font-extrabold text-[#4648d4] hover:text-[#393bbb] transition-colors cursor-pointer">See Ranks</span>
            </div>
          </div>
        </div>
      </section>

      <InteractiveDemo />

      {/* Footer Bar */}
      <footer className="bg-white text-[#1b1b23] py-16 border-t border-slate-200/80" id="footer">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-semibold text-slate-600">
            <div>
              <span className="text-sm font-black text-[#1b1b23] notranslate" translate="no">FINLEVELS</span>
              <p className="mt-1 text-slate-500">Turn money knowledge into money habits.</p>
            </div>

            <div className="flex flex-wrap gap-6 justify-center">
              <a href="#how" className="text-slate-600 hover:text-[#4648d4] transition-colors">How it works</a>
              <a href="#coins" className="text-slate-600 hover:text-[#4648d4] transition-colors">Coins</a>
              <a href="#profiles" className="text-slate-600 hover:text-[#4648d4] transition-colors">Profiles</a>
            </div>

            {/* Social Links Bar */}
            <div className="flex flex-col items-center md:items-end gap-2 text-right">
              <div className="flex items-center gap-3">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/finlevelsapp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-200/50 flex items-center justify-center text-slate-600 hover:text-[#4648d4] hover:bg-[#4648d4]/10 transition-all shadow-sm"
                  title="Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>

                {/* X */}
                <a
                  href="https://x.com/finlevelsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-200/50 flex items-center justify-center text-slate-600 hover:text-[#4648d4] hover:bg-[#4648d4]/10 transition-all shadow-sm"
                  title="X (Twitter)"
                >
                  <XIcon className="w-4 h-4" />
                </a>

                {/* TikTok (Coming Soon) */}
                <div
                  className="relative w-8 h-8 rounded-full bg-slate-200/50 flex items-center justify-center text-slate-400 cursor-not-allowed group/social"
                  title="TikTok (Coming Soon)"
                >
                  <TikTokIcon className="w-4 h-4" />
                  <span className="absolute bottom-full mb-2 hidden group-hover/social:block bg-slate-800 text-white text-[9px] font-bold py-1 px-2 rounded shadow-md whitespace-nowrap">
                    TikTok (Coming Soon)
                  </span>
                </div>

                {/* Reddit (Coming Soon) */}
                <div
                  className="relative w-8 h-8 rounded-full bg-slate-200/50 flex items-center justify-center text-slate-400 cursor-not-allowed group/social"
                  title="Reddit (Coming Soon)"
                >
                  <RedditIcon className="w-4 h-4" />
                  <span className="absolute bottom-full mb-2 hidden group-hover/social:block bg-slate-800 text-white text-[9px] font-bold py-1 px-2 rounded shadow-md whitespace-nowrap flex-shrink-0">
                    Reddit (Coming Soon)
                  </span>
                </div>
              </div>
              <p className="text-[9px] text-slate-500">Follow our adventures!</p>
            </div>

            <div className="text-center md:text-left">
              <p>© Finlevels 2026. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* iOS PWA Installation Drawer */}
      {showIosInstallDrawer && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-xs animate-[fade-in_0.2s_ease-out]">
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={() => setShowIosInstallDrawer(false)} />

          <div className="relative w-full max-w-md rounded-t-3xl border-t border-white/10 bg-gradient-to-b from-[#16152a] to-[#0c0b17] p-6 pb-8 shadow-[0_-8px_32px_rgba(0,0,0,0.5)] animate-[slideUp_0.3s_cubic-bezier(0.16,1,0.3,1)]">
            {/* Top indicator bar */}
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-white/15" />

            <button
              type="button"
              onClick={() => setShowIosInstallDrawer(false)}
              className="absolute right-4 top-4 rounded-full bg-white/5 p-2 text-slate-400 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 border border-white/10 shadow-inner overflow-hidden p-2.5">
                <Image
                  src="/logo-purple.svg"
                  alt="Finlevels Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Install Finlevels on your iPhone</h3>
              <p className="mt-2 text-sm text-slate-300">
                Get full immersion, notifications, and real-time streaking updates straight from your home screen.
              </p>
            </div>

            <div className="mt-6 space-y-4 rounded-2xl bg-white/[0.03] border border-white/5 p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-300">
                  <span className="text-xs font-black">1</span>
                </div>
                <p className="text-xs font-medium text-slate-200">
                  Tap the Safari <span className="inline-flex items-center justify-center p-1 rounded-md bg-white/10 text-white"><Share className="h-3.5 w-3.5" /></span> Share button in your bottom browser bar.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-300">
                  <span className="text-xs font-black">2</span>
                </div>
                <p className="text-xs font-medium text-slate-200">
                  Scroll down the share list and select <span className="font-black text-violet-400">Add to Home Screen</span>.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-300">
                  <span className="text-xs font-black">3</span>
                </div>
                <p className="text-xs font-medium text-slate-200">
                  Tap <span className="font-black text-[#E4FF30]">Add</span> at the top-right corner to launch the RPG dashboard!
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowIosInstallDrawer(false);
                  router.push("/quiz");
                }}
                className="w-full rounded-full bg-[#E4FF30] py-3.5 text-center text-sm font-black text-slate-900 shadow-md transition active:scale-98"
              >
                Done! Let&apos;s start ⚡
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowIosInstallDrawer(false);
                  router.push("/quiz");
                }}
                className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-300 transition py-1"
              >
                Skip and use standard browser web-app
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
