"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

type ProfileName =
  | "The Survivor" | "The Explorer" | "The Stabilizer" | "The Saver"
  | "The Builder"  | "The Investor" | "The Strategist" | "The Wealth Architect"
  | "The Opportunist";

type HoloTradingCardProps = {
  profileName: ProfileName;
  playerLevel: number;
  userName: string;
  focusPath: "stability" | "saving" | "investing";
};

// Custom Inline SVG illustrations representing archetypes
export function renderCharacterSvg(profileName: string) {
  switch (profileName) {
    case "The Survivor":
      return (
        <svg viewBox="0 0 100 100" className="w-40 h-40 object-contain">
          {/* Survivor Piggy */}
          <circle cx="50" cy="55" r="26" fill="#dda0dd" stroke="#9370db" strokeWidth="2" />
          <path d="M35 38 L22 30 L27 45 Z" fill="#9370db" /> {/* left ear */}
          <path d="M65 38 L78 30 L73 45 Z" fill="#9370db" /> {/* right ear */}
          <ellipse cx="50" cy="62" rx="9" ry="6" fill="#ba55d3" /> {/* snout */}
          <circle cx="47" cy="62" r="1.5" fill="#4b0082" />
          <circle cx="53" cy="62" r="1.5" fill="#4b0082" />
          <circle cx="40" cy="48" r="3.5" fill="#1a1a1a" /> {/* left eye */}
          <circle cx="60" cy="48" r="3.5" fill="#1a1a1a" /> {/* right eye */}
          {/* Band-aid */}
          <rect x="35" y="32" width="16" height="6" rx="2" fill="#f4a460" transform="rotate(-15, 43, 35)" />
          <line x1="41" y1="31" x2="45" y2="39" stroke="#cd853f" strokeWidth="1" />
          <line x1="45" y1="31" x2="41" y2="39" stroke="#cd853f" strokeWidth="1" />
          {/* Sweat drop */}
          <path d="M 68 45 C 68 45 71 49 69 51 C 67 53 65 51 65 49 Z" fill="#00bfff" />
          {/* Tired eyes lines */}
          <path d="M 36 53 Q 40 55 44 53" stroke="#8b008b" strokeWidth="1" fill="none" />
          <path d="M 56 53 Q 60 55 64 53" stroke="#8b008b" strokeWidth="1" fill="none" />
        </svg>
      );
    case "The Explorer":
      return (
        <svg viewBox="0 0 100 100" className="w-40 h-40 object-contain">
          {/* Explorer Piggy */}
          <circle cx="50" cy="55" r="26" fill="#e8c7ff" stroke="#a855f7" strokeWidth="2" />
          <path d="M35 38 L22 28 L28 44 Z" fill="#a855f7" /> {/* left ear */}
          <path d="M65 38 L78 28 L72 44 Z" fill="#a855f7" /> {/* right ear */}
          <ellipse cx="50" cy="62" rx="9" ry="6" fill="#a855f7" /> {/* snout */}
          <circle cx="47" cy="62" r="1.5" fill="#701a75" />
          <circle cx="53" cy="62" r="1.5" fill="#701a75" />
          <circle cx="40" cy="48" r="4.5" fill="#1b1b23" /> {/* left eye */}
          <circle cx="39" cy="46" r="1.5" fill="white" />
          <circle cx="60" cy="48" r="4.5" fill="#1b1b23" /> {/* right eye */}
          <circle cx="59" cy="46" r="1.5" fill="white" />
          {/* Hat */}
          <path d="M30 38 Q 50 24 70 38 Z" fill="#d2b48c" stroke="#8b4513" strokeWidth="1.5" />
          <ellipse cx="50" cy="38" rx="22" ry="4" fill="#cd853f" stroke="#8b4513" strokeWidth="1" />
          {/* Compass in arm */}
          <circle cx="70" cy="72" r="8" fill="#f5f5f5" stroke="#8b4513" strokeWidth="1.5" />
          <line x1="70" y1="72" x2="73" y2="68" stroke="#ff0000" strokeWidth="1.5" />
          <line x1="70" y1="72" x2="67" y2="76" stroke="#4648d4" strokeWidth="1.5" />
        </svg>
      );
    case "The Saver":
    case "The Stabilizer":
      return (
        <svg viewBox="0 0 100 100" className="w-40 h-40 object-contain">
          {/* Saver Piggy in vault */}
          {/* Vault back */}
          <rect x="25" y="30" width="50" height="50" rx="6" fill="#4a5568" stroke="#2d3748" strokeWidth="2" />
          {/* Gold coins base */}
          <ellipse cx="50" cy="74" rx="20" ry="8" fill="#ffd700" />
          <ellipse cx="40" cy="76" rx="12" ry="5" fill="#ffaa00" />
          <ellipse cx="60" cy="75" rx="14" ry="6" fill="#ffaa00" />
          {/* Piggy */}
          <circle cx="50" cy="50" r="20" fill="#ffc0cb" stroke="#ff69b4" strokeWidth="2" />
          <ellipse cx="50" cy="54" rx="7" ry="5" fill="#ff69b4" />
          <circle cx="48" cy="54" r="1" fill="#4a0e17" />
          <circle cx="52" cy="54" r="1" fill="#4a0e17" />
          <circle cx="43" cy="45" r="3" fill="#1a1a1a" />
          <circle cx="42" cy="44" r="1" fill="white" />
          <circle cx="57" cy="45" r="3" fill="#1a1a1a" />
          <circle cx="56" cy="44" r="1" fill="white" />
          {/* Smiling mouth */}
          <path d="M 46 61 Q 50 64 54 61" stroke="#ff69b4" strokeWidth="1.5" fill="none" />
        </svg>
      );
    case "The Builder":
      return (
        <svg viewBox="0 0 100 100" className="w-40 h-40 object-contain">
          {/* Builder Piggy */}
          <circle cx="50" cy="56" r="24" fill="#ffdca5" stroke="#d48a37" strokeWidth="2" />
          <path d="M35 40 L24 30 L29 46 Z" fill="#d48a37" /> {/* left ear */}
          <path d="M65 40 L76 30 L71 46 Z" fill="#d48a37" /> {/* right ear */}
          <ellipse cx="50" cy="62" rx="8" ry="5.5" fill="#d48a37" />
          <circle cx="47" cy="62" r="1" fill="#4a1a00" />
          <circle cx="53" cy="62" r="1" fill="#4a1a00" />
          <circle cx="41" cy="49" r="3.5" fill="#1b1b23" />
          <circle cx="59" cy="49" r="3.5" fill="#1b1b23" />
          {/* Construction helmet */}
          <path d="M32 38 C32 20 68 20 68 38 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
          <ellipse cx="50" cy="38" rx="22" ry="3" fill="#f59e0b" />
          <rect x="47" y="24" width="6" height="12" fill="#fbbf24" rx="1" />
          {/* Gold bricks */}
          <rect x="25" y="74" width="18" height="8" fill="#ffd700" stroke="#b8860b" strokeWidth="1" />
          <rect x="45" y="74" width="18" height="8" fill="#ffd700" stroke="#b8860b" strokeWidth="1" />
          <rect x="65" y="74" width="18" height="8" fill="#ffd700" stroke="#b8860b" strokeWidth="1" />
          <rect x="35" y="68" width="18" height="8" fill="#ffd700" stroke="#b8860b" strokeWidth="1" />
          <rect x="55" y="68" width="18" height="8" fill="#ffd700" stroke="#b8860b" strokeWidth="1" />
        </svg>
      );
    case "The Investor":
    case "The Strategist":
    case "The Opportunist":
      return (
        <svg viewBox="0 0 100 100" className="w-40 h-40 object-contain">
          {/* Cyberpunk Investor Piggy */}
          <circle cx="50" cy="55" r="26" fill="#c0a6ff" stroke="#6366f1" strokeWidth="2" />
          <ellipse cx="50" cy="62" rx="9" ry="6" fill="#818cf8" />
          {/* Neon shades */}
          <rect x="30" y="42" width="40" height="10" rx="3" fill="#00ffff" opacity="0.85" stroke="#4f46e5" strokeWidth="1.5" />
          <line x1="30" y1="47" x2="70" y2="47" stroke="#ffffff" strokeWidth="1" />
          {/* Futuristic chart behind */}
          <path d="M 20 75 L 35 60 L 50 68 L 70 45 L 85 30" fill="none" stroke="#62fae3" strokeWidth="3.5" strokeLinecap="round" className="drop-shadow-[0_0_4px_#62fae3]" />
          <circle cx="85" cy="30" r="3" fill="#62fae3" />
          {/* Ears */}
          <path d="M35 38 L22 30 L27 45 Z" fill="#6366f1" />
          <path d="M65 38 L78 30 L73 45 Z" fill="#6366f1" />
        </svg>
      );
    case "The Wealth Architect":
      return (
        <svg viewBox="0 0 100 100" className="w-40 h-40 object-contain">
          {/* Golden wings */}
          <path d="M 28 50 Q 8 40 18 20 Q 30 25 32 40 Z" fill="#ffd700" opacity="0.7" />
          <path d="M 72 50 Q 92 40 82 20 Q 70 25 68 40 Z" fill="#ffd700" opacity="0.7" />
          {/* Wealth Architect Piggy */}
          <circle cx="50" cy="55" r="26" fill="#ffd700" stroke="#d4af37" strokeWidth="2" />
          <ellipse cx="50" cy="62" rx="9" ry="6" fill="#e5c158" />
          <circle cx="47" cy="62" r="1.5" fill="#806517" />
          <circle cx="53" cy="62" r="1.5" fill="#806517" />
          <circle cx="40" cy="48" r="4.5" fill="#1b1b23" />
          <circle cx="39" cy="46" r="1.5" fill="white" />
          <circle cx="60" cy="48" r="4.5" fill="#1b1b23" />
          <circle cx="59" cy="46" r="1.5" fill="white" />
          {/* Crown */}
          <path d="M35 35 L40 22 L50 30 L60 22 L65 35 Z" fill="#ffd700" stroke="#b8860b" strokeWidth="1.5" />
          <circle cx="40" cy="22" r="2" fill="#ff0000" />
          <circle cx="50" cy="30" r="2" fill="#0000ff" />
          <circle cx="60" cy="22" r="2" fill="#ff0000" />
          {/* Sparkles */}
          <path d="M15 15 L17 10 L19 15 L24 17 L19 19 L17 24 L15 19 L10 17 Z" fill="#fff" />
          <path d="M80 75 L82 70 L84 75 L89 77 L84 79 L82 84 L80 79 L75 77 Z" fill="#fff" />
        </svg>
      );
    default:
      return null;
  }
}

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

export default function HoloTradingCard({
  profileName,
  playerLevel,
  focusPath,
}: HoloTradingCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);
  const [isHovered, setIsHovered] = useState(false);
  const [currentCaptionIdx, setCurrentCaptionIdx] = useState(0);

  // Dynamic Gen Z quotes from Penny based on profile
  const captions: Record<ProfileName, string[]> = {
    "The Survivor": [
      "Penny says: 'You skipped that DoorDash order? Major gigachad energy! 👑'",
      "Penny says: 'Checking checking balance prevents jump scares 👻'",
      "Penny says: 'We are starting from the bottom, now we lock in 🔒'",
      "Penny says: 'Ramen days build diamonds. We got this 💎'",
    ],
    "The Explorer": [
      "Penny says: 'Exploring new savings rhythms. Keep testing rules! 🗺️'",
      "Penny says: 'Caffeine runs are fine, but homebrew matcha hits different 🍵'",
      "Penny says: 'Finding leaks before they find us. Alert level high 🚨'",
      "Penny says: 'Testing boundaries like subway surfers 🏃‍♂️'",
    ],
    "The Stabilizer": [
      "Penny says: 'Day-to-day spending is fully locked in. Immaculate vibes ✨'",
      "Penny says: 'Cash flow is guarded. Let's make that money grow 📈'",
      "Penny says: 'No spending leak is safe from your audit 🕵️'",
    ],
    "The Saver": [
      "Penny says: 'Your vault is looking juicy. No cap! 💰'",
      "Penny says: 'Saver power level over 9000! 🏦'",
      "Penny says: 'Every dollar saved is a future employee working for you 💼'",
      "Penny says: 'Secure the bag. Protect the bag. Repeat 🔁'",
    ],
    "The Builder": [
      "Penny says: 'Building that cash flow wall, brick by gold brick 🏗️'",
      "Penny says: 'Solid foundations are active. Time to invest! 🚀'",
      "Penny says: 'Compound growth is calling. Let's answer 📞'",
    ],
    "The Investor": [
      "Penny says: 'Compound growth go brrr! 📈'",
      "Penny says: 'Watching index funds stack up is free dopamine 🧠'",
      "Penny says: 'Invested cash works harder than any side hustle 💼'",
    ],
    "The Strategist": [
      "Penny says: 'Risk assessed. Growth routed. Absolute grandmaster moves 🧠'",
      "Penny says: 'Assets are compounding in high definition 📺'",
      "Penny says: 'Tactical savings transfers active 🎯'",
    ],
    "The Opportunist": [
      "Penny says: 'Capitalizing on growth. Yield hunter unlocked 🏹'",
      "Penny says: 'Snagging market gains like a boss 💼'",
      "Penny says: 'High-risk, high-dopamine! 🚀'",
    ],
    "The Wealth Architect": [
      "Penny says: 'Absolute masterclass of financial safety. God mode 👑'",
      "Penny says: 'Portfolio is compounding. Flex on 'em! 💪'",
      "Penny says: 'Immaculate assets. Elite level unlocked 🌟'",
    ],
  };

  const activeCaptions = captions[profileName] || captions["The Explorer"];

  // Carousel timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCaptionIdx((prev) => (prev + 1) % activeCaptions.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeCaptions]);

  // Mouse tilt handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position inside element
    const y = e.clientY - rect.top;  // y position inside element

    // Calculate rotation (-12deg to +12deg)
    const rotX = -((y - rect.height / 2) / (rect.height / 2)) * 12;
    const rotY = ((x - rect.width / 2) / (rect.width / 2)) * 12;

    // Calculate glare position in percent
    const glX = (x / rect.width) * 100;
    const glY = (y / rect.height) * 100;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlareX(glX);
    setGlareY(glY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlareX(50);
    setGlareY(50);
  };

  // Touch tilt handlers for mobile devices
  const handleTouchStart = () => {
    setIsHovered(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const touch = e.touches[0];
    if (!touch) return;

    const rect = card.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    // Calculate rotation (-12deg to +12deg)
    const rotX = -((y - rect.height / 2) / (rect.height / 2)) * 12;
    const rotY = ((x - rect.width / 2) / (rect.width / 2)) * 12;

    // Calculate glare position in percent
    const glX = (x / rect.width) * 100;
    const glY = (y / rect.height) * 100;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlareX(glX);
    setGlareY(glY);
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlareX(50);
    setGlareY(50);
  };

  // Color theme according to focus path
  const pathThemes = {
    stability: {
      border: "border-violet-500/50 shadow-violet-500/20",
      glowBg: "from-violet-500/10 via-transparent to-transparent",
      accent: "text-violet-400 border-violet-500/30 bg-violet-950/20",
      neonClass: "shadow-[0_0_20px_rgba(139,92,246,0.3)] border-violet-500/40",
      badge: "bg-violet-500/20 text-violet-300",
    },
    saving: {
      border: "border-emerald-500/50 shadow-emerald-500/20",
      glowBg: "from-emerald-500/10 via-transparent to-transparent",
      accent: "text-emerald-400 border-emerald-500/30 bg-emerald-950/20",
      neonClass: "shadow-[0_0_20px_rgba(16,185,129,0.3)] border-emerald-500/40",
      badge: "bg-emerald-500/20 text-emerald-300",
    },
    investing: {
      border: "border-amber-500/50 shadow-amber-500/20",
      glowBg: "from-amber-500/10 via-transparent to-transparent",
      accent: "text-amber-400 border-amber-500/30 bg-amber-950/20",
      neonClass: "shadow-[0_0_20px_rgba(245,158,11,0.3)] border-amber-500/40",
      badge: "bg-amber-500/20 text-amber-300",
    },
  };

  const theme = pathThemes[focusPath] || pathThemes.stability;

  return (
    <div className="relative flex flex-col items-center">
      <style>{`
        @keyframes holoCharFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(1deg);
          }
        }
        @keyframes passiveSway {
          0%, 100% {
            transform: perspective(1000px) rotateX(2.5deg) rotateY(-3.5deg);
          }
          50% {
            transform: perspective(1000px) rotateX(-2.5deg) rotateY(3.5deg);
          }
        }
        .animate-holo-char {
          animation: holoCharFloat 5s ease-in-out infinite;
        }
      `}</style>
      {/* 3D tilt card container */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`w-full max-w-[210px] min-[360px]:max-w-[225px] min-[390px]:max-w-[240px] h-[280px] min-[360px]:h-[290px] min-[390px]:h-[300px] rounded-2xl bg-[#0e0d26] border-2 ${theme.border} ${theme.neonClass} relative overflow-hidden transition-all duration-300 cursor-pointer shadow-2xl flex flex-col select-none ${isHovered ? "" : "animate-[passiveSway_6s_ease-in-out_infinite]"}`}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
            : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
          transition: isHovered ? "none" : "transform 0.5s ease, box-shadow 0.3s ease",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Iridescent shine overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 opacity-60 mix-blend-color-dodge"
          style={{
            background: isHovered
              ? `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 80%)`
              : "none",
            opacity: isHovered ? 0.8 : 0,
          }}
        />

        {/* Holo lines pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-40 z-10" />

        {/* Top Header */}
        <div className="p-3 flex items-center justify-between border-b border-white/10 relative z-20">
          <div>
            <span className="text-[7px] font-black uppercase tracking-[0.2em] text-[#E4FF30]">TRADING CARD</span>
            <h4 className="text-sm font-black text-white tracking-tight mt-0.5">{profileName}</h4>
          </div>
          <span className={`rounded-full px-2 py-0.5 text-[9px] font-black ${theme.badge}`}>
            LVL {playerLevel}
          </span>
        </div>

        {/* Illustration Area */}
        <div className="flex-1 flex items-center justify-center p-2 relative overflow-hidden z-20">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-white/0 rounded-full blur-3xl opacity-30 pointer-events-none" />
          
          {/* Neon focus path circle backdrop */}
          <div className={`absolute w-28 h-28 rounded-full bg-gradient-to-tr ${theme.glowBg} blur-2xl opacity-45 pointer-events-none`} />

          {/* PNG Profile Character */}
          <div className="relative z-10 drop-shadow-[0_15px_30px_rgba(0,0,0,0.55)] w-full h-[140px] min-[360px]:h-[155px] min-[390px]:h-[170px] flex items-center justify-center animate-holo-char transition-transform duration-500 hover:scale-110">
            <Image
              src={profileImages[profileName] || "/profile-explorer.png"}
              alt={profileName}
              width={160}
              height={160}
              className="object-contain w-full h-full"
            />
          </div>
        </div>

        {/* Dynamic Status / Penny Coach Slider */}
        <div className="p-2.5 bg-[#141334] border-t border-white/[0.08] relative z-20 overflow-hidden h-[60px] flex flex-col justify-center">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
              {/* Mini Penny Icon */}
              <svg viewBox="0 0 100 100" className="w-4 h-4">
                <circle cx="50" cy="55" r="30" fill="#dda0dd" />
                <ellipse cx="50" cy="62" rx="10" ry="7" fill="#ba55d3" />
                <circle cx="38" cy="46" r="4" fill="#000" />
                <circle cx="62" cy="46" r="4" fill="#000" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[7px] font-black text-[#E4FF30] uppercase tracking-wider block">COACH REPORT</span>
              <div className="relative h-6 w-full overflow-hidden">
                {activeCaptions.map((caption, idx) => (
                  <p
                    key={idx}
                    className={`text-[9px] min-[360px]:text-[10px] font-bold leading-tight text-slate-200 absolute inset-0 transition-all duration-500 flex items-center ${
                      idx === currentCaptionIdx
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4 pointer-events-none"
                    }`}
                  >
                    {caption}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
