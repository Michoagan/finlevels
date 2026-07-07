"use client";

import Image from "next/image";
import { useState, useEffect, type FormEvent, type ReactNode } from "react";
import { usePlaidLink } from "react-plaid-link";
import { Sparkles, Shield, PiggyBank, TrendingUp } from "lucide-react";
import { saveWaitlistEmail } from "../../lib/waitlist";
import { executeRecaptcha } from "../../lib/recaptcha";
import { supabase } from "../../lib/supabase";
import { trackEvent } from "../../lib/analytics";
import { saveUserGoalsToDb, type UserGoal } from "../../lib/challenges";

/* ─────────────────────────────────────────────
   Plaid Link Button — separate component so
   usePlaidLink always gets a real (non-empty)
   token and `ready` becomes true reliably.
───────────────────────────────────────────── */
function PlaidLinkButton({
  token,
  onSuccess,
  onExit,
  submitting,
}: {
  token: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onExit: any;
  submitting: boolean;
}) {
  const { open, ready } = usePlaidLink({ token, onSuccess, onExit });

  return (
    <button
      type="button"
      onClick={() => open()}
      disabled={!ready || submitting}
      className={`relative mt-5 w-full rounded-full py-4 text-sm font-black shadow-lg active:scale-95 transition-all ${
        ready && !submitting
          ? "bg-[#e4ff30] text-[#0f0e1f] hover:bg-[#d4ef20] hover:scale-[1.02] cursor-pointer shadow-[0_0_20px_rgba(228,255,48,0.25)]"
          : "bg-white/10 text-white/40 cursor-not-allowed"
      }`}
    >
      {submitting
        ? "Analyzing..."
        : !ready
        ? "⏳ Loading Plaid..."
        : "🏦 Connect my bank with Plaid"}
    </button>
  );
}


type QuizCoin = "stability" | "saving" | "investing";
type QuizOptionId = "A" | "B" | "C" | "D";
type CoinLevel = 0 | 1 | 2 | 3 | 4 | 5;
type ProfileName =
  | "The Survivor"
  | "The Explorer"
  | "The Stabilizer"
  | "The Saver"
  | "The Builder"
  | "The Investor"
  | "The Strategist"
  | "The Wealth Architect"
  | "The Opportunist";

type QuizOption = {
  id: QuizOptionId;
  text: string;
  points: 0 | 1 | 2 | 3;
};

type QuizQuestion = {
  id: number;
  prompt: string;
  coinImpact: QuizCoin;
  options: readonly QuizOption[];
};

type QuizAnswers = Partial<Record<number, QuizOptionId>>;



type CoinScoreDetail = {
  baseScore: number;
  finalScore: number;
  level: CoinLevel;
  levelName: string;
  levelDescription: string;
};

type ProfileDetails = {
  displayName: string;
  description: string;
  imageSrc: string;
  strengths: readonly string[];
  growthAreas: readonly string[];
};

type QuizTrackCard = {
  key: QuizCoin;
  label: string;
  questionRange: string;
  summary: string;
  badgeClassName: string;
  barClassName: string;
};

type QuizProfileResult = {
  profileName: ProfileName;
  displayName: string;
  description: string;
  imageSrc: string;
  strengths: readonly string[];
  growthAreas: readonly string[];
  stability: CoinScoreDetail;
  saving: CoinScoreDetail;
  investing: CoinScoreDetail;
  coinPriority: readonly QuizCoin[];
  primaryFocusCoin: QuizCoin;
  totalPoints: number;
  answeredQuestions: number;
  maxPoints: number;
};

const quizQuestions: readonly QuizQuestion[] = [
  {
    id: 1,
    prompt: "Which best describes your monthly money situation and cash flow?",
    coinImpact: "stability",
    options: [
      { id: "A", text: "I struggle to cover basic needs / run out early", points: 0 },
      { id: "B", text: "I cover basics but usually reach almost zero", points: 1 },
      { id: "C", text: "I cover everything and have a little left over", points: 2 },
      { id: "D", text: "I feel comfortable and have significant money left", points: 3 },
    ],
  },
  {
    id: 2,
    prompt: "You see something you didn't plan to buy. What usually happens?",
    coinImpact: "stability",
    options: [
      { id: "A", text: "I buy it immediately", points: 0 },
      { id: "B", text: "I often end up buying it", points: 1 },
      { id: "C", text: "I think before buying", points: 2 },
      { id: "D", text: "I rarely buy impulsively", points: 3 },
    ],
  },
  {
    id: 3,
    prompt: "How aware are you of where your money goes?",
    coinImpact: "stability",
    options: [
      { id: "A", text: "I honestly don't know", points: 0 },
      { id: "B", text: "I have a rough idea", points: 1 },
      { id: "C", text: "I check sometimes", points: 2 },
      { id: "D", text: "I clearly track my spending", points: 3 },
    ],
  },
  {
    id: 4,
    prompt: "Which best describes your current debt situation?",
    coinImpact: "stability",
    options: [
      { id: "A", text: "My debt feels overwhelming", points: 0 },
      { id: "B", text: "I have debt I struggle with", points: 1 },
      { id: "C", text: "I have manageable debt", points: 2 },
      { id: "D", text: "I have no debt", points: 3 },
    ],
  },
  {
    id: 5,
    prompt: "Do you follow a budget?",
    coinImpact: "stability",
    options: [
      { id: "A", text: "Never", points: 0 },
      { id: "B", text: "Sometimes", points: 1 },
      { id: "C", text: "Often", points: 2 },
      { id: "D", text: "Consistently", points: 3 },
    ],
  },
  {
    id: 6,
    prompt: "When you receive money (paycheck, bonus, gift), what usually happens first?",
    coinImpact: "saving",
    options: [
      { id: "A", text: "I spend most of it", points: 0 },
      { id: "B", text: "I save only if possible", points: 1 },
      { id: "C", text: "I usually save a part", points: 2 },
      { id: "D", text: "I save before spending", points: 3 },
    ],
  },
  {
    id: 7,
    prompt: "Which best describes your habits for saving and investing?",
    coinImpact: "saving",
    options: [
      { id: "A", text: "I neither save nor invest regularly", points: 0 },
      { id: "B", text: "I save occasionally, but I do not invest yet", points: 1 },
      { id: "C", text: "I save most months and invest occasionally", points: 2 },
      { id: "D", text: "I save every month and invest regularly", points: 3 },
    ],
  },
  {
    id: 8,
    prompt: "When thinking about money, what matters most to you right now?",
    coinImpact: "investing",
    options: [
      { id: "A", text: "Surviving month-to-month", points: 0 },
      { id: "B", text: "Spending without stress", points: 1 },
      { id: "C", text: "Building savings security", points: 2 },
      { id: "D", text: "Growing long-term wealth", points: 3 },
    ],
  },
] as const;

// const quizTrackOrder: readonly QuizCoin[] = [
//   "stability",
//   "saving",
//   "investing",
// ];

const quizTracks: Record<QuizCoin, QuizTrackCard> = {
  stability: {
    key: "stability",
    label: "Stability",
    questionRange: "Q1-Q5",
    summary:
      "Monthly pressure, impulse spending, awareness, debt, and budgeting.",
    badgeClassName: "bg-[#c0c1ff]/20 text-[#4648d4]",
    barClassName: "bg-[#4648d4]",
  },
  saving: {
    key: "saving",
    label: "Saving",
    questionRange: "Q6-Q7",
    summary: "Saving priority and saving/investing consistency.",
    badgeClassName: "bg-[#62fae3]/20 text-[#006b5f]",
    barClassName: "bg-[#006b5f]",
  },
  investing: {
    key: "investing",
    label: "Investing",
    questionRange: "Q7-Q8",
    summary: "Investing participation and long-term mindset.",
    badgeClassName: "bg-[#ffdcc5]/30 text-[#904900]",
    barClassName: "bg-[#904900]",
  },
};



const profileGuidance: Record<ProfileName, ProfileDetails> = {
  "The Survivor": {
    displayName: "The Survivor",
    imageSrc: "/profile-survivor.png",
    description:
      "All three coins are still at the early stage. Money may feel overwhelming right now, so your first focus is stability and awareness.",
    strengths: [
      "You are aware that your money habits need attention",
      "You have a clear starting point for progress",
    ],
    growthAreas: [
      "Build basic spending awareness",
      "Create simple stability routines",
      "Reduce month-to-month financial pressure",
    ],
  },
  "The Explorer": {
    displayName: "The Explorer",
    imageSrc: "/profile-explorer.png",
    description:
      "Your coins are developing, but none are strong yet. You are past the starting line, and your next step is building consistent habits across stability, saving, and investing.",
    strengths: [
      "You have started building financial awareness",
      "You have room to grow across every coin",
      "Small improvements can create balanced progress quickly",
    ],
    growthAreas: [
      "Build consistency across all three coins",
      "Strengthen your lowest coin first",
      "Turn early progress into repeatable money habits",
    ],
  },
  "The Stabilizer": {
    displayName: "The Stabilizer",
    imageSrc: "/profile-stabilizer.png",
    description:
      "Your Stability coin is strong, but Saving and Investing are still low. You control spending well, and now it is time to add growth habits.",
    strengths: [
      "Controlled spending habits",
      "A stronger foundation than most beginners",
    ],
    growthAreas: [
      "Introduce consistent saving",
      "Start learning investing basics",
      "Turn stability into long-term growth",
    ],
  },
  "The Saver": {
    displayName: "The Saver",
    imageSrc: "/profile-saver.png",
    description:
      "Your Saving coin is strong, but Stability and Investing need more support. You know how to put money aside; now connect that habit to a stronger foundation and future growth.",
    strengths: [
      "Strong saving mindset",
      "Ability to delay spending and protect money",
    ],
    growthAreas: [
      "Strengthen financial stability",
      "Improve spending and debt control",
      "Build investing education step by step",
    ],
  },
  "The Builder": {
    displayName: "The Builder",
    imageSrc: "/profile-builder.png",
    description:
      "Your Stability and Saving coins are strong, while Investing is still low. You have a solid base and are ready to move from protection into wealth-building.",
    strengths: [
      "Stable money habits",
      "Consistent saving discipline",
      "A strong foundation for growth",
    ],
    growthAreas: [
      "Learn investing fundamentals",
      "Start small wealth-building actions",
      "Move beyond conservative money habits",
    ],
  },
  "The Investor": {
    displayName: "The Investor",
    imageSrc: "/profile-investor.png",
    description:
      "Your Investing coin is strong, but Stability and Saving are still low. You are interested in wealth-building, but your foundation needs more protection.",
    strengths: [
      "Long-term wealth mindset",
      "Comfort with investing and growth ideas",
    ],
    growthAreas: [
      "Strengthen spending control",
      "Build a reliable saving foundation",
      "Reduce risk from weak stability habits",
    ],
  },
  "The Wealth Architect": {
    displayName: "The Wealth Architect",
    imageSrc: "/profile-wealth-architect.png",
    description:
      "All three coins are strong. You have comprehensive financial mastery and are ready for more advanced optimization challenges.",
    strengths: [
      "Balanced financial habits",
      "Strong saving and investing discipline",
      "Consistent control across all coins",
    ],
    growthAreas: [
      "Optimize returns and systems",
      "Keep habits consistent",
      "Protect and compound your momentum",
    ],
  },
  "The Strategist": {
    displayName: "The Strategist",
    imageSrc: "/profile-strategist.png",
    description:
      "Your Stability and Investing coins are strong, but Saving is still developing. You have control and long-term ambition, but need a stronger cash buffer to support your wealth-building strategy.",
    strengths: [
      "Strong spending control",
      "Long-term wealth mindset",
      "Ability to think strategically about money",
    ],
    growthAreas: [
      "Build a consistent saving rhythm",
      "Create a stronger emergency buffer",
      "Balance investing ambition with short-term liquidity",
    ],
  },
  "The Opportunist": {
    displayName: "The Opportunist",
    imageSrc: "/profile-opportunist.png",
    description:
      "Your Saving and Investing coins are strong, but Stability is low. You are growth-oriented and willing to take action, but your financial foundation needs more control.",
    strengths: ["Strong growth mindset", "Momentum in saving and investing"],
    growthAreas: [
      "Improve stability and spending control",
      "Reduce foundation risk",
      "Balance opportunity with consistency",
    ],
  },
};







// function QuizTrackSummaryCard({ track }: { track: QuizTrackCard }) {
//   return (
//     <div
//       data-testid={`quiz-track-${track.key}`}
//       className="rounded-[22px] border border-[#e7e1f6] bg-white p-4"
//     >
//       <div className="flex items-center justify-between gap-3">
//         <div>
//           <p className="text-sm font-semibold text-[#1b1b23]">{track.label}</p>
//           <p className="mt-1 text-xs font-medium text-[#464554]">
//             {track.questionRange}
//           </p>
//         </div>
//         <span
//           className={`rounded-full px-3 py-1 text-xs font-semibold ${track.badgeClassName}`}
//         >
//           {track.label}
//         </span>
//       </div>
//       <p className="mt-3 text-sm leading-6 text-[#464554]">{track.summary}</p>
//     </div>
//   );
// }

function CoinScoreCard({
  coin,
  detail,
}: {
  coin: QuizTrackCard;
  detail: CoinScoreDetail;
}) {
  const isStability = coin.key === "stability";
  const isSaving = coin.key === "saving";
  
  const theme = isStability
    ? {
        border: "border-indigo-100",
        bg: "bg-indigo-50/50",
        barBg: "bg-indigo-100",
        barFill: "bg-indigo-600",
        badge: "bg-indigo-100 text-indigo-700",
        icon: <Shield className="w-5 h-5 text-indigo-600" />,
      }
    : isSaving
    ? {
        border: "border-emerald-100",
        bg: "bg-emerald-50/50",
        barBg: "bg-emerald-100",
        barFill: "bg-emerald-600",
        badge: "bg-emerald-100 text-emerald-700",
        icon: <PiggyBank className="w-5 h-5 text-emerald-600" />,
      }
    : {
        border: "border-amber-100",
        bg: "bg-amber-50/50",
        barBg: "bg-amber-100",
        barFill: "bg-amber-500",
        badge: "bg-amber-100 text-amber-700",
        icon: <TrendingUp className="w-5 h-5 text-amber-600" />,
      };

  return (
    <div
      data-testid={`quiz-coin-${coin.key}`}
      className={`rounded-3xl border p-4 shadow-sm flex flex-col justify-between ${theme.border} ${theme.bg}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100">
            {theme.icon}
          </div>
          <div>
            <p className="text-sm font-black tracking-tight text-slate-900">
              {coin.label}
            </p>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {detail.levelName}
            </p>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-black shadow-sm ${theme.badge}`}>
          LVL {detail.level}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-end mb-1.5">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Coin Power
          </p>
          <p className="text-sm font-black text-slate-900">
            {detail.finalScore} <span className="text-[10px] font-bold text-slate-400">/ 100 XP</span>
          </p>
        </div>
        
        <div className={`h-3 w-full rounded-full overflow-hidden p-0.5 ${theme.barBg} shadow-inner`}>
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out relative ${theme.barFill}`}
            style={{ width: `${detail.finalScore}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-full" />
          </div>
        </div>
      </div>
      
      <p className="mt-2.5 text-[11px] font-medium leading-normal text-slate-500">
        Base {detail.baseScore.toFixed(1)} · {detail.levelDescription}
      </p>
    </div>
  );
}

function ShellCard({
  children,
  className = "",
  testId,
}: {
  children: ReactNode;
  className?: string;
  testId: string;
}) {
  return (
    <section
      data-testid={testId}
      className={`rounded-4xl border border-[#e7e1f6] bg-white p-6 shadow-[0px_24px_80px_rgba(70,72,212,0.10)] md:p-8 ${className}`}
    >
      {children}
    </section>
  );
}



function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
    </svg>
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

export default function QuizPage() {
  const [step, setStep] = useState<"onboarding" | "intro" | "plaid_link" | "result">("onboarding");
  const [plaidLinkToken, setPlaidLinkToken] = useState<string | null>(null);
  const [aiProfile, setAiProfile] = useState<QuizProfileResult | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [waitlistEmail, setWaitlistEmail] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [waitlistUnlocked, setProfileUnlocked] = useState(false);
  const [profileToken, setProfileToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [onboardingSlideIndex, setOnboardingSlideIndex] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [waitlistSubmitting, setWaitlistSubmitting] = useState(false);
  const [waitlistError, setWaitlistError] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMsg, setLoadingMsg] = useState("");

  useEffect(() => {
    // 1. Initialise the step from URL parameter if present (e.g. step=plaid_link)
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const stepParam = params.get("step");
      if (stepParam === "plaid_link") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStep("plaid_link");
      }
    }

    async function checkSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user && session.user.email) {
          const response = await fetch("/api/auth/resolve-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: session.user.email }),
          });

          if (response.ok) {
            const result = await response.json();
            setWaitlistEmail(session.user.email);
            setProfileToken(result.token);
            setUserId(result.userId);

            const linkTokenRes = await fetch("/api/plaid/create-link-token", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: result.userId }),
            });

            if (linkTokenRes.ok) {
              const linkTokenData = await linkTokenRes.json();
              setPlaidLinkToken(linkTokenData.link_token);
            }
          }
        }
      } catch (e) {
        console.error("Quiet auto-session check failed:", e);
      }
    }
    checkSession();
  }, []);

  const getMonthlyBudget = (name: string) => {
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

  const profile = aiProfile || {
    profileName: "The Explorer" as ProfileName,
    displayName: "The Explorer",
    description: "Your profile is being analyzed using Plaid transactions...",
    imageSrc: "/profile-explorer.png",
    stability: { level: 1, baseScore: 0, finalScore: 0, levelName: "Basic", levelDescription: "" } as CoinScoreDetail,
    saving: { level: 1, baseScore: 0, finalScore: 0, levelName: "Basic", levelDescription: "" } as CoinScoreDetail,
    investing: { level: 1, baseScore: 0, finalScore: 0, levelName: "Basic", levelDescription: "" } as CoinScoreDetail,
    coinPriority: ["stability", "saving", "investing"] as const,
    primaryFocusCoin: "stability" as QuizCoin,
    strengths: [] as string[],
    growthAreas: [] as string[],
    totalPoints: 0,
    answeredQuestions: 0,
    maxPoints: 0,
  };




  
  interface VaultExplosionParticle {
    id: number;
    x: number;
    y: number;
    dx: number;
    dy: number;
    rot: number;
    sc: number;
    dur: number;
    type: "coin" | "star" | "sparkle";
    delay: number;
  }
  const [vaultParticles, setVaultParticles] = useState<VaultExplosionParticle[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const triggerVaultExplosion = () => {
    const particles: VaultExplosionParticle[] = [];
    const count = 45;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 80 + Math.random() * 180;
      const dx = Math.cos(angle) * speed;
      const dy = Math.sin(angle) * speed;
      const rot = Math.random() * 720 - 360;
      const sc = 0.4 + Math.random() * 0.7;
      const dur = 1.2 + Math.random() * 0.8;
      const type = Math.random() < 0.5 ? ("coin" as const) : Math.random() < 0.85 ? ("star" as const) : ("sparkle" as const);
      const delay = Math.random() * 0.25;

      particles.push({
        id: Date.now() + i + Math.random(),
        x: 50,
        y: 50,
        dx,
        dy,
        rot,
        sc,
        dur,
        type,
        delay,
      });
    }
    setVaultParticles(particles);

    setTimeout(() => {
      setVaultParticles([]);
    }, 2800);
  };



  // Use dynamic variable mapping to bypass compiler unused state warnings if needed
  const profileUnlocked = waitlistUnlocked;

  const handleWaitlistSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = waitlistEmail.trim();

    if (!email) {
      return;
    }

    setWaitlistSubmitting(true);
    setWaitlistError("");
    setLoadingProgress(0);

    const messages = [
      "Consulting Coach Penny...",
      "Analyzing stability levels...",
      "Synthesizing savings traits...",
      "Calculating investing multipliers...",
      "Forging your financial character sheet...",
      "Opening Coinstack vault..."
    ];
    
    setLoadingMsg(messages[0]!);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 8) + 6;
      if (currentProgress >= 95) {
        currentProgress = 95;
        clearInterval(interval);
      }
      setLoadingProgress(currentProgress);
      
      const msgIdx = Math.min(
        Math.floor((currentProgress / 100) * messages.length),
        messages.length - 1
      );
      setLoadingMsg(messages[msgIdx] || "Generating sheet...");
    }, 150);    try {
      const recaptchaToken = await executeRecaptcha("quiz_submit");
      const result = await saveWaitlistEmail(
        email,
        "quiz",
        undefined,
        recaptchaToken,
      );

      // Create Plaid Link Token
      const linkTokenRes = await fetch("/api/plaid/create-link-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: result.userId }),
      });

      if (!linkTokenRes.ok) {
        throw new Error("Failed to initialize Plaid bank connection.");
      }

      const linkTokenData = await linkTokenRes.json();

      clearInterval(interval);
      setLoadingProgress(100);
      setLoadingMsg("Account created successfully! 🎉");
      
      await new Promise((resolve) => setTimeout(resolve, 600));

      setWaitlistEmail(result.email);
      setProfileToken(result.token);
      setUserId(result.userId);
      setPlaidLinkToken(linkTokenData.link_token);
      setWaitlistSubmitting(false); // must be false BEFORE mounting PlaidLinkButton
      setStep("plaid_link");

      trackEvent("profile_generated", {
        method: "email",
        profileName: "The Explorer",
        primaryFocusCoin: "stability",
      });
    } catch (error) {
      clearInterval(interval);
      setWaitlistError(
        error instanceof Error
          ? error.message
          : "Unable to unlock your profile right now.",
      );
    } finally {
      setWaitlistSubmitting(false);
    }
  };

  const analyzePlaidTransactions = async (accessToken: string) => {
    if (!profileToken) return;

    setWaitlistSubmitting(true);
    setWaitlistError("");
    setLoadingProgress(0);

    const messages = [
      "Bank connection established...",
      "Retrieving transactions (last 2 months)...",
      "Penny is analyzing your habits...",
      "Identifying impulsive spending patterns...",
      "Determining your archetype and levels...",
      "Generating personalized goals...",
      "Finalizing your player profile..."
    ];

    setLoadingMsg(messages[0]!);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 5) + 3;
      if (currentProgress >= 96) {
        currentProgress = 96;
        clearInterval(interval);
      }
      setLoadingProgress(currentProgress);

      const msgIdx = Math.min(
        Math.floor((currentProgress / 100) * messages.length),
        messages.length - 1
      );
      setLoadingMsg(messages[msgIdx] || "Analyzing...");
    }, 200);

    try {
      const response = await fetch("/api/plaid/analyze-transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken,
          token: profileToken,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "L'analyse des transactions a échoué.");
      }

      const data = await response.json();

      setAiProfile({
        profileName: data.archetype,
        displayName: data.archetype,
        description: data.analysisSummary,
        imageSrc: profileGuidance[data.archetype as ProfileName]?.imageSrc || "/profile-survivor.png",
        stability: { level: data.stabilityLevel, baseScore: 0, finalScore: 0, levelName: "", levelDescription: "" },
        saving: { level: data.savingLevel, baseScore: 0, finalScore: 0, levelName: "", levelDescription: "" },
        investing: { level: data.investingLevel, baseScore: 0, finalScore: 0, levelName: "", levelDescription: "" },
        coinPriority: ["stability", "saving", "investing"],
        primaryFocusCoin: "stability",
        strengths: profileGuidance[data.archetype as ProfileName]?.strengths || [],
        growthAreas: profileGuidance[data.archetype as ProfileName]?.growthAreas || [],
        totalPoints: 0,
        answeredQuestions: 0,
        maxPoints: 0,
      });

      const staticGoals = [
        { id: "goal_emergency", name: "🛡️ Build a $500 emergency shield", target: 500, category: "stability" },
        { id: "goal_impulsive", name: "🛒 Limit impulsive online shopping", target: 100, category: "stability" },
        { id: "goal_coffee", name: "☕ Cut down on coffee & food delivery", target: 50, category: "saving" },
        { id: "goal_saving_10", name: "💰 Save 10% of my available income", target: 150, category: "saving" },
        { id: "goal_investing_etf", name: "📈 Open an ETF investment plan", target: 100, category: "investing" },
        { id: "goal_investing_stock", name: "📊 Buy dividend stocks", target: 200, category: "investing" }
      ];

      const mappedGoals: UserGoal[] = selectedGoals.map((id) => {
        const found = staticGoals.find((g) => g.id === id);
        return {
          id,
          name: found ? found.name : "Savings Goal",
          target: found ? found.target : 1000,
          current: 0,
          category: found ? found.category as "stability" | "saving" | "investing" : "saving",
          isActive: true,
        };
      });

      if (userId) {
        localStorage.setItem(`user_goals_${userId}`, JSON.stringify(mappedGoals));
      }

      if (profileToken) {
        try {
          await saveUserGoalsToDb(profileToken, mappedGoals);
        } catch (err) {
          console.error("Failed to save goals to DB:", err);
        }
      }

      clearInterval(interval);
      setLoadingProgress(100);
      setLoadingMsg("Analyse complétée avec succès ! Redirection... 🎉");

      await new Promise((resolve) => setTimeout(resolve, 1000));
      window.location.href = `/profile/${encodeURIComponent(profileToken)}?welcome=true`;
    } catch (err) {
      clearInterval(interval);
      const error = err as Error;
      setWaitlistError(error.message || "Erreur lors de l'analyse.");
      setStep("plaid_link");
    } finally {
      setWaitlistSubmitting(false);
    }
  };


  const handleGoogleUnlock = async () => {
    setWaitlistSubmitting(true);
    setWaitlistError("");
    setLoadingProgress(0);
    setLoadingMsg("Redirecting to Google Auth portal...");

    try {
      localStorage.setItem(
        "pending_quiz_profile",
        JSON.stringify({
          profileName: profile.profileName,
          stabilityLevel: profile.stability.level,
          savingLevel: profile.saving.level,
          investingLevel: profile.investing.level,
          coinPriority: profile.coinPriority,
          primaryFocusCoin: profile.primaryFocusCoin,
        })
      );

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      setWaitlistError(
        error instanceof Error
          ? error.message
          : "Unable to start Google login."
      );
      setWaitlistSubmitting(false);
    }
  };

  return (
    <main
      data-testid="quiz-page"
      data-step={step}
      className="min-h-screen overflow-x-hidden bg-[#f5f2fe] text-[#1b1b23] selection:bg-[#E4FF30] selection:text-[#1b1b23]"
    >
      <style>{`
        @keyframes bubble-bounce {
          0% { opacity: 0; transform: scale(0.9) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes gameParticleFloat {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) scale(0.6);
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) rotate(var(--rot)) scale(var(--sc));
            opacity: 0;
          }
        }
        .animate-game-particle {
          animation: gameParticleFloat var(--dur) cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
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
        .holo-card {
          position: relative;
          transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease;
        }
        .holo-card:hover {
          transform: translateY(-4px) scale(1.01);
          box-shadow: 0px 40px 120px rgba(114, 117, 240, 0.35);
        }
        @keyframes swipeOutLeft {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(-140%, -10px) rotate(-12deg);
            opacity: 0;
          }
        }
        @keyframes swipeOutRight {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(140%, -10px) rotate(12deg);
            opacity: 0;
          }
        }
        @keyframes swipeIn {
          0% {
            transform: scale(0.95) translateY(12px);
            opacity: 0;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        .animate-swipe-out-left {
          animation: swipeOutLeft 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .animate-swipe-out-right {
          animation: swipeOutRight 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .animate-swipe-in {
          animation: swipeIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        @keyframes vaultParticleExplode {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) scale(0);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) rotate(var(--rot)) scale(var(--sc));
            opacity: 0;
          }
        }
        .animate-vault-particle {
          animation: vaultParticleExplode var(--dur) cubic-bezier(0.1, 0.8, 0.3, 1) var(--delay) forwards;
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
      `}</style>
      <div className="mx-auto flex w-full max-w-6xl flex-col px-4 py-8 sm:px-5 sm:py-10 md:px-10 md:py-14">
        {step === "intro" && (
          <div className="mx-auto mb-8 flex max-w-lg flex-col items-center justify-center text-center">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-full bg-[#4648d4] text-white text-[10px] font-black flex items-center justify-center">1</div>
                <span className="text-xs font-bold text-[#4648d4]">Create account</span>
              </div>
              <div className="w-8 h-px bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 text-[10px] font-black flex items-center justify-center">2</div>
                <span className="text-xs font-bold text-slate-400">Connect bank</span>
              </div>
            </div>

            <div className="w-full rounded-4xl border border-[#e7e1f6] bg-white px-6 py-10 shadow-[0px_24px_80px_rgba(70,72,212,0.10)] sm:px-8">
              {/* Email icon */}
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e1e0ff]">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#4648d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </div>

              <span className="inline-flex rounded-full bg-[#e1e0ff] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#4648d4]">
                Step 1 — Identification
              </span>
              <h1 className="mt-3 text-2xl font-black leading-tight tracking-tight text-[#1b1b23] sm:text-3xl">
                Create your Finlevels account
              </h1>

              {profileToken && waitlistEmail ? (
                <>
                  <div className="mt-5 w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-left">
                    <p className="text-xs font-black text-emerald-700 uppercase tracking-wider">✅ Already signed in</p>
                    <p className="mt-1 text-sm font-semibold text-emerald-800">{waitlistEmail}</p>
                    <p className="mt-1 text-xs text-emerald-600">Your account is ready. Proceed to bank connection!</p>
                  </div>
                  <button
                    type="button"
                    disabled={waitlistSubmitting}
                    onClick={async () => {
                      if (plaidLinkToken) {
                        setStep("plaid_link");
                        return;
                      }
                      setWaitlistSubmitting(true);
                      setWaitlistError("");
                      try {
                        const linkTokenRes = await fetch("/api/plaid/create-link-token", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ userId }),
                        });
                        if (!linkTokenRes.ok) throw new Error("Failed to prepare Plaid connection.");
                        const linkTokenData = await linkTokenRes.json();
                        setPlaidLinkToken(linkTokenData.link_token);
                        setWaitlistSubmitting(false); // false before mounting PlaidLinkButton
                        setStep("plaid_link");
                      } catch (err) {
                        const error = err as Error;
                        setWaitlistError(error.message || "Error while preparing Plaid.");
                      } finally {
                        setWaitlistSubmitting(false);
                      }
                    }}
                    className={`mt-5 w-full rounded-full px-4 py-3.5 text-sm font-black text-white shadow-md transition-all active:scale-95 ${
                      waitlistSubmitting ? "bg-slate-300 cursor-not-allowed" : "bg-[#4648d4] hover:scale-[1.01] hover:bg-[#3d3fbe]"
                    }`}
                  >
                    {waitlistSubmitting ? "Preparing..." : "Continue → Bank connection"}
                  </button>
                </>
              ) : (
                <>
                  <p className="mt-3 text-xs font-medium leading-relaxed text-[#464554] sm:text-sm">
                    Enter your email to create your secure Finlevels account.
                  </p>

                  <form className="mt-5 w-full text-left space-y-3" onSubmit={handleWaitlistSubmit}>
                    <label htmlFor="waitlist-email" className="block text-xs font-black text-[#1b1b23] uppercase tracking-wider">
                      Email address
                    </label>
                    <input
                      id="waitlist-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@example.com"
                      value={waitlistEmail}
                      onChange={(event) => setWaitlistEmail(event.target.value)}
                      disabled={waitlistSubmitting}
                      className="w-full rounded-2xl border border-[#e7e1f6] bg-white px-4 py-3.5 text-sm font-semibold text-[#1b1b23] placeholder:text-[#9d9aac] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#4648d4]/40 disabled:cursor-not-allowed disabled:bg-[#f8f6fd]"
                    />
                    {waitlistError ? (
                      <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs leading-relaxed text-red-700">{waitlistError}</p>
                    ) : null}
                    <button
                      type="submit"
                      disabled={waitlistSubmitting}
                      className={`w-full rounded-full px-4 py-3.5 text-sm font-black shadow-md transition-all active:scale-95 ${
                        waitlistSubmitting ? "cursor-not-allowed bg-[#ece9f7] text-[#9291a3]" : "bg-[#4648d4] text-white hover:scale-[1.01] hover:bg-[#3d3fbe]"
                      }`}
                    >
                      {waitlistSubmitting ? "Loading..." : "Continue →"}
                    </button>
                  </form>

                  <div className="my-5 w-full flex items-center justify-center gap-3">
                    <span className="h-px flex-1 bg-[#1b1b23]/10" />
                    <span className="text-[10px] font-bold text-[#9d9aac] uppercase tracking-wider">or</span>
                    <span className="h-px flex-1 bg-[#1b1b23]/10" />
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleUnlock}
                    disabled={waitlistSubmitting}
                    className="w-full flex items-center justify-center gap-3 rounded-full border border-[#e7e1f6] bg-white px-4 py-3.5 text-sm font-black text-[#1b1b23] shadow-xs transition hover:scale-[1.01] hover:bg-[#f5f2fe] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4648d4]/40 disabled:cursor-not-allowed disabled:bg-[#f8f6fd] disabled:text-[#9291a3]"
                  >
                    <GoogleIcon className="w-5 h-5 shrink-0" />
                    Sign in with Google ⚡
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {step === "plaid_link" && (
          <div className="mx-auto max-w-lg px-4 py-8 select-none text-center">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-6 justify-center">
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center">✓</div>
                <span className="text-xs font-bold text-emerald-600">Compte créé</span>
              </div>
              <div className="w-8 h-px bg-[#4648d4]" />
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-full bg-[#4648d4] text-white text-[10px] font-black flex items-center justify-center">2</div>
                <span className="text-xs font-bold text-[#4648d4]">Connecter ma banque</span>
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-start rounded-4xl overflow-hidden border border-[#1b1b40] bg-[#0f0e1f] p-6 sm:p-10 shadow-[0px_24px_80px_rgba(70,72,212,0.25)] min-h-[420px] text-white">
              {/* Ambient glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(91,93,242,0.2)_0%,transparent_70%)] pointer-events-none" />

              {/* Bank icon */}
              <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5b5df2]/20 border border-[#5b5df2]/30">
                <svg className="w-8 h-8 text-[#a5b4fc]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M8 10v11M12 10v11M16 10v11M20 10v11"/>
                </svg>
              </div>

              <span className="relative inline-flex rounded-full bg-[#5b5df2]/20 border border-[#5b5df2]/30 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#a5b4fc]">
                Step 2 — Secure bank connection
              </span>
              <h2 className="relative mt-3 text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">
                Connect your bank via Plaid
              </h2>
              <p className="relative mt-2 text-xs font-medium leading-relaxed text-slate-400">
                Penny will analyze your last 2 months of transactions to identify your habits and build your player profile.
              </p>

              {/* Security badges */}
              <div className="relative mt-5 flex items-center justify-center gap-3 flex-wrap">
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold text-slate-400">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  256-bit SSL Encryption
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold text-slate-400">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  Sandbox Mode — test data
                </span>
              </div>

              {/* Penny speech bubble */}
              <div className="relative mt-6 w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#a5b4fc]">Penny</span>
                  <span className="text-[9px] font-medium text-slate-500">· Plaid Connection</span>
                </div>
                <p className="text-xs font-semibold leading-relaxed text-slate-300">
                  No banking credentials are stored. Plaid acts as a secure intermediary 🔒
                </p>
              </div>

              {/* Mascot */}
              <div className="relative flex h-32 w-full items-center justify-center mt-4">
                <MascotFullSvg className="h-28 w-auto animate-mascot-idle" />
              </div>

              {waitlistError && (
                <p className="relative w-full mt-3 rounded-2xl border border-red-500/30 bg-red-900/20 p-4 text-xs font-semibold leading-relaxed text-red-300">
                  {waitlistError}
                </p>
              )}


              {/* Sandbox credentials hint */}
              <div className="relative mt-4 w-full rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">🧪</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Sandbox Mode — test credentials</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">User&apos;s name</p>
                    <p className="text-xs font-black text-amber-300 font-mono tracking-wide">user_transactions_dynamic</p>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">User&apos;s password</p>
                    <p className="text-xs font-black text-amber-300 font-mono tracking-wide">pass_good</p>
                    <p className="text-xs font-black text-amber-300 font-mono tracking-wide">code: 123456</p>
                  </div>
                </div>
                <p className="mt-2 text-[9px] font-medium text-slate-500 leading-relaxed">
                  Use these credentials in the Plaid window that will open. No real bank is connected.
                </p>
              </div>

              {/* Action Button — mounts only when we have a real token */}
              {plaidLinkToken ? (
                <PlaidLinkButton
                  token={plaidLinkToken}
                  submitting={waitlistSubmitting}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onSuccess={async (publicToken: string, metadata: any) => {
                    try {
                      setWaitlistSubmitting(true);
                      setLoadingProgress(10);
                      setLoadingMsg("Exchanging access token...");

                      const bankName = metadata.institution?.name || "Plaid Bank";
                      const exchangeRes = await fetch("/api/plaid/exchange-public-token", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ 
                          public_token: publicToken,
                          userId: userId,
                          bankName: bankName
                        }),
                      });

                      if (!exchangeRes.ok) throw new Error("L'échange du jeton Plaid a échoué.");

                      const exchangeData = await exchangeRes.json();

                      if (userId) {
                        localStorage.setItem(`plaid_access_token_${userId}`, exchangeData.access_token);
                        localStorage.setItem(`plaid_bank_name_${userId}`, bankName);
                      }

                      await analyzePlaidTransactions(exchangeData.access_token);
                    } catch (err) {
                      const error = err as Error;
                      setWaitlistError(error.message || "Erreur d'association de compte.");
                      setWaitlistSubmitting(false);
                    }
                  }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onExit={(error: any) => {
                    if (error) {
                      setWaitlistError(error.display_message || error.error_message || "La connexion Plaid a été annulée.");
                    }
                  }}
                />
              ) : (
                <button
                  type="button"
                  disabled
                  className="relative mt-5 w-full rounded-full py-4 text-sm font-black bg-white/10 text-white/40 cursor-not-allowed"
                >
                  ⏳ Préparation du lien bancaire...
                </button>
              )}
            </div>
          </div>
        )}



        {step === "onboarding" ? (
          <div className="mx-auto max-w-2xl px-4 py-8 select-none text-center">
            {/* Ambient Background lighting */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-violet-500/10 rounded-full filter blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center justify-start rounded-4xl border border-[#e7e1f6] bg-white/90 backdrop-blur-md p-6 sm:p-10 shadow-[0px_24px_80px_rgba(70,72,212,0.06)] min-h-[500px]">
              
              {/* Slide Progress indicator dots */}
              <div className="flex gap-1.5 justify-center mb-6">
                {[0, 1, 2, 3].map((idx) => (
                  <span
                    key={idx}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === onboardingSlideIndex ? "w-6 bg-[#5B5DF2]" : "w-2 bg-slate-200"
                    }`}
                  />
                ))}
              </div>

              {/* Dynamic Speech Bubble */}
              <div className="w-full bg-gradient-to-tr from-violet-50/90 to-indigo-50/90 border border-violet-100 rounded-3xl p-6 relative text-left shadow-[0_8px_30px_rgba(91,93,242,0.05)] animate-[bubble-bounce_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
                {/* Pointer arrow pointing down towards Penny */}
                <div className="absolute left-1/2 bottom-[-6px] -translate-x-1/2 rotate-45 w-3.5 h-3.5 bg-[#f5f3ff] border-r border-b border-violet-100 pointer-events-none" />
                
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-violet-600">
                    Penny&apos;s Guide
                  </span>
                  <span className="text-[9px] font-medium text-slate-400">· Step {onboardingSlideIndex + 1}/4</span>
                </div>
                
                <div className="text-xs font-bold leading-relaxed text-violet-950 space-y-2">
                  {onboardingSlideIndex === 0 && (
                    <>
                      <p className="text-sm font-black text-violet-700 mb-1">
                        Welcome to your Money Quest! ⚔️
                      </p>
                      <p>
                        I&apos;m Penny, your AI game guide. We&apos;re turning your real bank balances into an active RPG adventure!
                      </p>
                      <p className="mt-1">
                        No boring forms. Just link your sandbox bank to unlock your Archetype and customize your weekly quests!
                      </p>
                    </>
                  )}
                  {onboardingSlideIndex === 1 && (
                    <>
                      <p className="text-sm font-black text-violet-700 mb-1">
                        Your Available Loot Chest
                      </p>
                      <p>
                        Each month, you&apos;ll manage a safe spending limit of <strong className="text-violet-700">${getMonthlyBudget(profile.profileName)}</strong>.
                      </p>
                      <p className="mt-1">
                        Don&apos;t panic: your rent and fixed bills are already deducted. This is your pure pocket gold to spend, save, or invest!
                      </p>
                    </>
                  )}
                  {onboardingSlideIndex === 2 && (
                    <>
                      <p className="text-sm font-black text-violet-700 mb-1">
                        Real-world Actions, In-game Progress
                      </p>
                      <p>
                        Your real spending directly shapes your character. Make smart choices to level up your gold chest.
                      </p>
                      <p className="mt-1">
                        Avoid budget leaks to boost your stats, gain player XP, and claim epic gold coins! 🛡️✨
                      </p>
                    </>
                  )}
                  {onboardingSlideIndex === 3 && (
                    <>
                      <p className="text-sm font-black text-violet-700 mb-1">
                        Set Your First Goals
                      </p>
                      <p>
                        Select exactly 3 starting goals to begin building your saving shield:
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Goal checklist (visible only on slide 3) */}
              {onboardingSlideIndex === 3 && (
                <div className="mt-6 w-full text-left space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {([
                    { id: "goal_emergency", name: "🛡️ Build a $500 Emergency Buffer", target: 500, category: "stability" },
                    { id: "goal_impulsive", name: "🛒 Limit impulsive online shopping", target: 100, category: "stability" },
                    { id: "goal_coffee", name: "☕ Cut down coffees & food delivery", target: 50, category: "saving" },
                    { id: "goal_saving_10", name: "💰 Save 10% of pocket gold", target: 150, category: "saving" },
                    { id: "goal_investing_etf", name: "📈 Start a recurring ETF plan", target: 100, category: "investing" },
                    { id: "goal_investing_stock", name: "📊 Research and buy dividend shares", target: 200, category: "investing" }
                  ]).map((goal) => {
                    const isSelected = selectedGoals.includes(goal.id);
                    return (
                      <button
                        key={goal.id}
                        type="button"
                        onClick={() => {
                          setSelectedGoals((prev) =>
                            isSelected ? prev.filter((id) => id !== goal.id) : [...prev, goal.id]
                          );
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-xs font-bold text-left transition-all ${
                          isSelected
                            ? "bg-violet-500/5 border-violet-500 text-violet-950 shadow-xs"
                            : "bg-slate-50 border-slate-200/70 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                          isSelected ? "bg-violet-500 border-violet-500 text-white" : "border-slate-300"
                        }`}>
                          {isSelected && "✓"}
                        </span>
                        <div className="flex-1 flex justify-between items-center">
                          <span>{goal.name}</span>
                          <span className="text-[9px] font-black uppercase tracking-wider text-violet-500 bg-violet-100/50 px-2 py-0.5 rounded-full">{goal.category}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Mascot container */}
              <div className="relative z-10 flex h-40 w-full items-center justify-center mt-6">
                <MascotFullSvg
                  className={`h-36 w-auto transition-transform ${
                    onboardingSlideIndex === 2 ? "animate-mascot-jump-trigger" : "animate-mascot-idle"
                  }`}
                />
              </div>

              <h3 className="relative z-10 mt-2 text-md font-black text-[#1b1b23] flex items-center gap-1.5 justify-center">
                Penny <span className="text-[9px] font-bold text-[#4648d4] bg-[#e1e0ff] px-2 py-0.5 rounded-full uppercase tracking-wider">Coach</span>
              </h3>

              {/* Navigation button */}
              <div className="mt-8 flex gap-3 w-full justify-between items-center relative z-20">
                {onboardingSlideIndex > 0 ? (
                  <button
                    type="button"
                    onClick={() => setOnboardingSlideIndex((prev) => prev - 1)}
                    className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
                  >
                    ← Back
                  </button>
                ) : (
                  <div />
                )}
                
                {onboardingSlideIndex < 3 ? (
                  <button
                    type="button"
                    onClick={() => setOnboardingSlideIndex((prev) => prev + 1)}
                    className="px-6 py-2.5 rounded-full bg-[#5B5DF2] text-xs font-black text-white hover:bg-violet-600 active:scale-95 transition-all shadow-md shadow-violet-500/10"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={selectedGoals.length !== 3}
                    onClick={() => setStep("intro")}
                    className={`px-6 py-3 rounded-full text-xs font-black text-white active:scale-95 transition-all shadow-md ${
                      selectedGoals.length === 3
                        ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/10 cursor-pointer"
                        : "bg-slate-300 cursor-not-allowed"
                    }`}
                  >
                    Lock in my goals & sign up ⚔️
                  </button>
                )}
              </div>

            </div>
          </div>
        ) : null}

        {step === "result" ? (
          <section
            className={
              profileUnlocked
                ? "mx-auto flex w-full max-w-5xl flex-col gap-6"
                : "mx-auto flex w-full max-w-2xl flex-col gap-6"
            }
            data-testid="quiz-result"
            data-profile-unlocked={profileUnlocked}
          >
            <ShellCard testId="quiz-waitlist-card" className="scroll-mt-8">
              {profileUnlocked ? (
                <div className="flex flex-col items-center text-center p-4">
                  <div className="relative w-28 h-28 flex items-center justify-center mb-4">
                    {/* Glowing background */}
                    <div className="absolute inset-0 rounded-full bg-[#62fae3]/30 blur-xl animate-pulse" />
                    
                    {/* Rotating Sunburst / Light Beams */}
                    <div className="absolute w-48 h-48 rounded-full overflow-hidden flex items-center justify-center animate-spin-slow opacity-60 pointer-events-none">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-[#ffdcc5]/40 fill-current">
                        <path d="M50,50 L40,0 L60,0 Z" />
                        <path d="M50,50 L90,20 L100,40 Z" />
                        <path d="M50,50 L100,60 L80,80 Z" />
                        <path d="M50,50 L60,100 L40,100 Z" />
                        <path d="M50,50 L0,80 L0,60 Z" />
                        <path d="M50,50 L0,30 L20,10 Z" />
                      </svg>
                    </div>

                    {/* Open Chest SVG with Sparkles */}
                    <svg viewBox="0 0 100 100" className="w-24 h-24 relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Open Lid */}
                      <path d="M20,35 C20,24 28,15 38,15 L62,15 C72,15 80,24 80,35 L80,45 L20,45 Z" fill="#d69e2e" stroke="#744210" strokeWidth="4" transform="rotate(-15 50 35) translate(0 -10)" />
                      {/* Chest Base */}
                      <path d="M20,50 L80,50 L80,85 C80,89 76,92 72,92 L28,92 C24,92 20,89 20,85 Z" fill="#b7791f" stroke="#744210" strokeWidth="4" />
                      {/* Gold Trim */}
                      <rect x="28" y="50" width="8" height="42" fill="#ecc94b" />
                      <rect x="64" y="50" width="8" height="42" fill="#ecc94b" />
                      {/* Sparkling gems inside */}
                      <circle cx="35" cy="48" r="4" fill="#319795" />
                      <circle cx="50" cy="46" r="5" fill="#ecc94b" />
                      <circle cx="65" cy="48" r="4" fill="#d69e2e" />
                      <polygon points="50,32 53,38 60,40 55,45 56,52 50,48 44,52 45,45 40,40 47,38" fill="#e4ff30" />
                      {/* Open Lock Plate */}
                      <rect x="42" y="45" width="16" height="16" rx="3" fill="#4a5568" stroke="#1a202c" strokeWidth="3" transform="translate(0 10)" />
                    </svg>

                    {/* Exploding Particles */}
                    <div className="absolute inset-0 overflow-visible pointer-events-none">
                      {vaultParticles.map((p) => (
                        <div
                          key={p.id}
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-vault-particle"
                          style={{
                            "--dx": `${p.dx}px`,
                            "--dy": `${p.dy}px`,
                            "--rot": `${p.rot}deg`,
                            "--sc": p.sc,
                            "--dur": `${p.dur}s`,
                            "--delay": `${p.delay}s`,
                            color: p.type === "coin" ? "#ecc94b" : p.type === "star" ? "#e4ff30" : "#319795",
                          } as React.CSSProperties}
                        >
                          {p.type === "coin" ? (
                            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                              <circle cx="12" cy="12" r="10" stroke="#744210" strokeWidth="1.5" />
                              <circle cx="12" cy="12" r="6" fill="#f6e05e" />
                            </svg>
                          ) : p.type === "star" ? (
                            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#744210" strokeWidth="1" />
                            </svg>
                          ) : (
                            <Sparkles className="w-4 h-4 fill-current text-[#319795]" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-[#006b5f]">Profile Unlocked!</h3>
                  <p
                    className="mt-3 wrap-break-words rounded-2xl border border-[#62fae3]/50 bg-[#e8fffb] px-5 py-4 text-sm font-bold leading-6 text-[#006b5f]"
                    data-testid="waitlist-success"
                    aria-live="polite"
                  >
                    We’ve registered <strong>{waitlistEmail.trim()}</strong>! Your full RPG Character Sheet is detailed below.
                  </p>
                </div>
              ) : (
                <>
                  <div id="waitlist">
                    <p className="inline-flex rounded-full bg-[#e1e0ff] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#4648d4]">
                      One last step
                    </p>
                    
                    {/* Locked Chest SVG animation */}
                    <div className="flex flex-col items-center justify-center py-4">
                      <div className={`relative w-28 h-28 flex items-center justify-center transition-all duration-500 ${waitlistSubmitting ? "scale-110 animate-bounce" : ""}`}>
                        <div className={`absolute inset-0 rounded-full bg-[#e4ff30]/20 blur-xl transition-opacity duration-500 ${waitlistSubmitting ? "opacity-100" : "opacity-40"}`} />
                        
                        <svg viewBox="0 0 100 100" className="w-24 h-24 relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <style>{`
                            @keyframes chest-shiver {
                              0%, 100% { transform: rotate(0deg); }
                              20%, 60% { transform: rotate(-5deg); }
                              40%, 80% { transform: rotate(5deg); }
                            }
                            .chest-lock-shiver {
                              transform-origin: 50px 60px;
                              animation: chest-shiver 1.5s infinite ease-in-out;
                            }
                          `}</style>
                          <path d="M20,55 L80,55 L80,85 C80,89 76,92 72,92 L28,92 C24,92 20,89 20,85 Z" fill="#b7791f" stroke="#744210" strokeWidth="4" />
                          <path d="M20,55 L80,55 L80,35 C80,26 72,20 62,20 L38,20 C28,20 20,26 20,35 Z" fill="#d69e2e" stroke="#744210" strokeWidth="4" />
                          <rect x="28" y="55" width="8" height="37" fill="#ecc94b" />
                          <rect x="64" y="55" width="8" height="37" fill="#ecc94b" />
                          <path d="M28,20 L28,55 M64,20 L64,55" stroke="#ecc94b" strokeWidth="4" />
                          <g className="chest-lock-shiver">
                            <rect x="42" y="47" width="16" height="16" rx="3" fill="#4a5568" stroke="#1a202c" strokeWidth="3" />
                            <circle cx="50" cy="53" r="2.5" fill="#1b1b23" />
                            <path d="M49,53 L51,53 L52,60 L48,60 Z" fill="#1b1b23" />
                          </g>
                        </svg>
                      </div>
                    </div>

                    <h3 className="mt-5 text-3xl font-black leading-tight tracking-[-0.04em] text-[#1b1b23] sm:text-4xl">
                      Unlock your financial profile.
                    </h3>
                    <p className="mt-4 text-sm font-medium leading-7 text-[#464554] sm:text-base sm:leading-8">
                      Your answers are ready. Add your email to reveal your
                      profile, coin levels, and the money habit to practice
                      first.
                    </p>
                  </div>

                  <form
                    className="mt-6 space-y-3"
                    onSubmit={handleWaitlistSubmit}
                    data-testid="waitlist-form"
                  >
                    <label
                      htmlFor="waitlist-email"
                      className="block text-sm font-black text-[#1b1b23]"
                    >
                      Email address
                    </label>
                    <input
                      id="waitlist-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@example.com"
                      value={waitlistEmail}
                      onChange={(event) => setWaitlistEmail(event.target.value)}
                      disabled={waitlistSubmitting}
                      data-testid="waitlist-email"
                      className="w-full rounded-2xl border border-[#e7e1f6] bg-white px-4 py-4 text-sm font-semibold text-[#1b1b23] placeholder:text-[#9d9aac] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4648d4]/40 disabled:cursor-not-allowed disabled:bg-[#f8f6fd]"
                    />
                    {waitlistError ? (
                      <p
                        className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700"
                        data-testid="waitlist-error"
                        aria-live="polite"
                      >
                        {waitlistError}
                      </p>
                    ) : null}
                    <button
                      type="submit"
                      disabled={waitlistSubmitting}
                      data-testid="waitlist-submit"
                      className={`w-full rounded-full px-4 py-4 text-sm font-black shadow-[0px_16px_40px_rgba(70,72,212,0.22)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4648d4]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f2fe] ${
                        waitlistSubmitting
                          ? "cursor-not-allowed bg-[#ece9f7] text-[#9291a3]"
                          : "bg-[#4648d4] text-white hover:scale-[1.01] hover:bg-[#3d3fbe]"
                      }`}
                    >
                      {waitlistSubmitting ? "Saving..." : "Discover my profile"}
                    </button>
                  </form>

                  <div className="my-5 flex items-center justify-center gap-3">
                    <span className="h-px flex-1 bg-[#1b1b23]/10" />
                    <span className="text-xs font-bold text-[#9d9aac] uppercase tracking-wider">or</span>
                    <span className="h-px flex-1 bg-[#1b1b23]/10" />
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleUnlock}
                    disabled={waitlistSubmitting}
                    className="w-full flex items-center justify-center gap-3 rounded-full border border-[#e7e1f6] bg-white px-4 py-4 text-sm font-black text-[#1b1b23] shadow-sm transition hover:scale-[1.01] hover:bg-[#f5f2fe] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4648d4]/40 disabled:cursor-not-allowed disabled:bg-[#f8f6fd] disabled:text-[#9291a3]"
                  >
                    <GoogleIcon className="w-5 h-5 shrink-0" />
                    Unlock profile with Google ⚡
                  </button>
                  <p className="mt-2 text-center text-[10px] font-bold text-[#9d9aac] uppercase tracking-[0.08em]">
                    ⚡ Secure 1-click OAuth connection
                  </p>

                  <p className="mt-4 text-xs font-medium leading-6 text-[#464554]">
                    We only use your email for Finlevels launch updates. No
                    spam.
                  </p>
                </>
              )}
            </ShellCard>

            {profileUnlocked ? (
              <>
                <div className="grid gap-8 lg:grid-cols-12 items-stretch" data-testid="quiz-profile-card">
                  {/* Left Column: Holographic RPG Card */}
                  <div className="lg:col-span-5 flex flex-col rounded-4xl border-4 border-[#e4ff30] bg-[#1b1b23] p-6 text-white shadow-[0px_32px_96px_rgba(70,72,212,0.25)] relative overflow-hidden group holo-card">
                    {/* Glowing holographic shine overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out pointer-events-none z-20" />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#4648d4]/20 via-transparent to-[#ffdcc5]/15 opacity-60 pointer-events-none" />
                    
                    <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e4ff30]">
                          CHARACTER PROFILE
                        </span>
                        <h2
                          className="mt-1 text-2xl font-black tracking-tight text-white"
                          data-testid="quiz-profile-name"
                        >
                          {profile.displayName}
                        </h2>
                      </div>
                      <span className="rounded-full bg-[#e4ff30] px-3 py-1 text-xs font-black text-[#1b1b23]">
                        LVL 1
                      </span>
                    </div>

                    <div className="relative z-10 mt-6 mx-auto flex h-64 w-44 items-end justify-center overflow-hidden rounded-t-[3rem] bg-gradient-to-b from-white/5 to-white/15 border border-white/10 p-2 shadow-inner">
                      <Image
                        src={profile.imageSrc}
                        alt={`${profile.displayName} profile illustration`}
                        width={180}
                        height={298}
                        className="h-full w-auto object-contain object-bottom transition-transform duration-500 group-hover:scale-105"
                        priority
                      />
                    </div>

                    <div className="relative z-10 mt-6 flex-1 flex flex-col justify-end text-center">
                      {profile.displayName !== profile.profileName ? (
                        <p
                          className="text-xs font-black uppercase tracking-[0.25em] text-[#e4ff30]/80"
                          data-testid="quiz-profile-archetype"
                        >
                          {profile.profileName}
                        </p>
                      ) : null}
                      <p
                        className="mt-3 text-sm font-medium leading-relaxed text-slate-300"
                        data-testid="quiz-profile-description"
                      >
                        {profile.description}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: RPG Stats & Traits */}
                  <div className="lg:col-span-7 flex flex-col gap-6">
                    {/* Stats Card */}
                    <div className="rounded-4xl border border-[#e7e1f6] bg-white p-6 shadow-[0px_24px_80px_rgba(70,72,212,0.08)]">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#4648d4] mb-5">
                        HUD ATTRIBUTES / COIN LEVELS
                      </p>
                      <div
                        className="grid gap-4"
                        data-testid="quiz-coin-levels"
                      >
                        <CoinScoreCard
                          coin={quizTracks.stability}
                          detail={profile.stability}
                        />
                        <CoinScoreCard
                          coin={quizTracks.saving}
                          detail={profile.saving}
                        />
                        <CoinScoreCard
                          coin={quizTracks.investing}
                          detail={profile.investing}
                        />
                      </div>

                      <div
                        className="mt-5 rounded-3xl border border-[#e7e1f6] bg-[#fcf8ff] p-4 flex items-center justify-between gap-3"
                        data-testid="quiz-score-summary"
                      >
                        <div>
                          <p className="text-xs font-black text-[#1b1b23] uppercase tracking-wider">
                            Total RPG Experience
                          </p>
                          <p className="mt-1 text-xs text-[#464554]">
                            {profile.totalPoints} / {profile.maxPoints} Points Accumulated
                          </p>
                        </div>
                        <span className="text-xs font-black text-[#4648d4] bg-[#e1e0ff] px-3 py-1.5 rounded-full">
                          {profile.answeredQuestions}/{quizQuestions.length} Qs
                        </span>
                      </div>
                    </div>

                    {/* Buffs & Debuffs Split Layout */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* Strengths / Buffs */}
                      <div
                        className="rounded-4xl border border-[#b2f5ea] bg-[#f0fdfa] p-6 shadow-sm flex flex-col"
                        data-testid="quiz-profile-strengths"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#319795] text-white text-xs font-black">
                            +
                          </span>
                          <p className="text-xs font-black text-[#234e52] uppercase tracking-wider">
                            Buffs / Strengths
                          </p>
                        </div>
                        <ul className="space-y-3 text-sm font-medium leading-relaxed text-[#234e52] flex-1">
                          {profile.strengths.map((strength: string) => (
                            <li key={strength} className="flex gap-2">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#319795]" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Growth Areas / Debuffs */}
                      <div
                        className="rounded-4xl border border-[#fed7d7] bg-[#fff5f5] p-6 shadow-sm flex flex-col"
                        data-testid="quiz-profile-growth-areas"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e53e3e] text-white text-xs font-black">
                            -
                          </span>
                          <p className="text-xs font-black text-[#742a2a] uppercase tracking-wider">
                            Debuffs / Next Focus
                          </p>
                        </div>
                        <ul className="space-y-3 text-sm font-medium leading-relaxed text-[#742a2a] flex-1">
                          {profile.growthAreas.map((area: string) => (
                            <li key={area} className="flex gap-2">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e53e3e]" />
                              <span>{area}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <ShellCard
                  testId="quiz-launch-note"
                  className="border-[#ffdcc5]/40 bg-[#ffdcc5]/10 mt-6"
                >
                  <p className="text-sm font-black text-[#904900]">Next step</p>
                  <p className="mt-3 text-sm font-medium leading-7 text-[#464554]">
                    Start with the habit that supports your weakest coin, then
                    keep practicing until each level improves.
                  </p>
                </ShellCard>
              </>
            ) : null}
          </section>
        ) : null}
        {/* Full screen gamified loading overlay */}
        {waitlistSubmitting && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0d0c1d]/95 backdrop-blur-md text-white px-6 select-none animate-[fade-in_0.3s_ease-out_forwards]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(91,93,242,0.15)_0%,transparent_70%)] pointer-events-none" />
            
            {/* Glowing portal ring */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Outer spinning ring */}
              <div className="absolute inset-0 border-4 border-dashed border-[#5b5df2]/40 rounded-full animate-[spin_8s_linear_infinite]" />
              {/* Inner spinning ring */}
              <div className="absolute inset-2 border-2 border-[#e4ff30]/30 rounded-full animate-[spin_4s_linear_infinite_reverse]" />
              
              {/* Bouncing chest */}
              <div className="absolute w-24 h-24 animate-[bounce_1s_infinite]">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_25px_rgba(228,255,48,0.4)]" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20,55 L80,55 L80,85 C80,89 76,92 72,92 L28,92 C24,92 20,89 20,85 Z" fill="#b7791f" stroke="#744210" strokeWidth="4" />
                  <path d="M20,55 L80,55 L80,35 C80,26 72,20 62,20 L38,20 C28,20 20,26 20,35 Z" fill="#d69e2e" stroke="#744210" strokeWidth="4" />
                  <rect x="28" y="55" width="8" height="37" fill="#ecc94b" />
                  <rect x="64" y="55" width="8" height="37" fill="#ecc94b" />
                  <path d="M28,20 L28,55 M64,20 L64,55" stroke="#ecc94b" strokeWidth="4" />
                  <g className="chest-lock-shiver">
                    <rect x="42" y="47" width="16" height="16" rx="3" fill="#e4ff30" stroke="#1a202c" strokeWidth="3" />
                    <circle cx="50" cy="53" r="2.5" fill="#1b1b23" />
                    <path d="M49,53 L51,53 L52,60 L48,60 Z" fill="#1b1b23" />
                  </g>
                </svg>
              </div>
            </div>

            {/* Dynamic loading messages */}
            <div className="mt-8 text-center max-w-sm relative z-10">
              <h3 className="text-lg font-black tracking-widest text-[#e4ff30] flex items-center justify-center gap-2">
                UNSEALING THE VAULT
                <span className="flex gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e4ff30] animate-[bounce_0.6s_infinite_0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e4ff30] animate-[bounce_0.6s_infinite_150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e4ff30] animate-[bounce_0.6s_infinite_300ms]" />
                </span>
              </h3>
              
              <p className="mt-2.5 text-[11px] font-bold text-slate-400 tracking-wide uppercase h-4 min-w-[280px]">
                {loadingMsg}
              </p>
            </div>

            {/* Gamified Loading progress bar */}
            <div className="mt-6 w-56 h-2 bg-[#5b5df2]/25 border border-[#5b5df2]/40 rounded-full overflow-hidden relative">
              <div 
                className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#5b5df2] to-[#e4ff30] rounded-full transition-all duration-200" 
                style={{ width: `${loadingProgress}%` }} 
              />
            </div>
            <span className="mt-2 text-[10px] font-black text-[#5b5df2] tracking-widest">
              {loadingProgress}% COMPLETE
            </span>
          </div>
        )}
      </div>
    </main>
  );
}
