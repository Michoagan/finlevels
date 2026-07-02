
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, UserCheck, Trash2, ArrowLeft, RefreshCw, Flame } from "lucide-react";
import HoloTradingCard from "../../../components/HoloTradingCard";
import { usePushNotifications } from "../../../hooks/usePushNotifications";
import {
  getProfileOverride,
  saveProfileOverride,
  saveUserGoalsToDb,
  type UserGoal,
  type ChallengePath,
} from "../../../lib/challenges";
import {
  type Transaction,
} from "../../../lib/transaction-simulator";
import { triggerLocalNotification, getLocale } from "../../../lib/notifications";

type ProfileName =
  | "The Survivor" | "The Explorer" | "The Stabilizer" | "The Saver"
  | "The Builder"  | "The Investor" | "The Strategist" | "The Wealth Architect"
  | "The Opportunist";

function StreakFlame({ active, className = "h-4 w-4" }: { active: boolean; className?: string }) {
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
          : "text-slate-600"
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

      {/* Floating Gold Coin */}
      <g className="penny-coin">
        <circle cx="50" cy="18" r="8" fill="url(#penny-coin-grad-prof)" stroke="#ff9100" strokeWidth="1" />
        <circle cx="50" cy="18" r="5.5" stroke="#ff9100" strokeWidth="0.5" fill="none" />
        <path d="M 52.5 15.5 A 2.5 2.5 0 1 0 52.5 20.5" stroke="#ff9100" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </g>

      <ellipse cx="50" cy="31" rx="8" ry="2" fill="#1b1b23" opacity="0.8" />
      <circle cx="36" cy="83" r="7.5" fill="#a855f7" />
      <circle cx="64" cy="83" r="7.5" fill="#a855f7" />
      <path d="M 22 62 Q 13 60 15 52 Q 19 48 24 53" stroke="#a855f7" strokeWidth="3.5" fill="none" strokeLinecap="round" />

      <g className="penny-waving-arm">
        <path d="M 74 58 Q 88 56 88 42" stroke="#a855f7" strokeWidth="8" strokeLinecap="round" fill="none" />
      </g>
      
      <path d="M 26 58 Q 12 56 12 42" stroke="#a855f7" strokeWidth="8" strokeLinecap="round" fill="none" />

      <g className="penny-body-group">
        <circle cx="50" cy="58" r="28" fill="url(#penny-body-grad-prof)" stroke="#a855f7" strokeWidth="1.5" />

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

        <g className="penny-left-eye">
          <circle cx="38" cy="51" r="7" fill="#1b1b23" />
          <circle cx="36.5" cy="48.5" r="2.2" fill="white" />
        </g>
        <g className="penny-right-eye">
          <circle cx="62" cy="51" r="7" fill="#1b1b23" />
          <circle cx="60.5" cy="48.5" r="2.2" fill="white" />
        </g>
      </g>

      <defs>
        <linearGradient id="penny-body-grad-prof" x1="50" y1="30" x2="50" y2="82" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f3e8ff" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
        <linearGradient id="penny-coin-grad-prof" x1="50" y1="10" x2="50" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffe57f" />
          <stop offset="100%" stopColor="#ffb300" />
        </linearGradient>
      </defs>
    </svg>
  );
}

type ProfileTokenPageClientProps = {
  token: string;
  userId: number;
  email: string;
  initialProfileName: ProfileName;
  stabilityLevel: number;
  savingLevel: number;
  investingLevel: number;
  primaryFocusCoin: ChallengePath;
  challengeCompletions: Record<string, number>;
  totalCompletions: number;
  playerLevel: number;
  activeChallengeToken: string;
  allDone: boolean;
  nextEmailSent: boolean;
  nextNeededDay: number;
  nextChallengeToken: string;
  firstName: string;
  initialGoals: UserGoal[];
  userStreak: number;
  plaidAccessToken?: string;
  plaidBankName?: string;
  analysisSummary?: string;
  lastAnalysisAt?: string;
  initialQuests?: Quest[];
  initialBosses?: Boss[];
  initialStreaks?: Streak[];
};

interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  target_merchant: string;
  target_amount: number;
  duration_days: number;
  status: "pending" | "active" | "completed" | "failed";
  xp_reward: number;
  coin_reward: number;
}

interface Boss {
  id: string;
  name: string;
  max_hp: number;
  current_hp: number;
  status: "active" | "defeated";
  gold_reward: number;
  target_subscriptions?: (string | { merchant?: string; name?: string })[];
}

interface Streak {
  id: string;
  current_streak: number;
  max_streak: number;
  last_activity_date: string;
}

export default function ProfileTokenPageClient({
  token,
  userId,
  initialProfileName,
  playerLevel: initialPlayerLevel,
  activeChallengeToken,
  firstName,
  initialGoals,
  userStreak,
  plaidAccessToken,
  plaidBankName,
  analysisSummary,
  lastAnalysisAt,
  initialQuests,
  initialBosses,
  initialStreaks,
  primaryFocusCoin,
}: ProfileTokenPageClientProps) {
  // Client state
  const [profileName, setProfileName] = useState<ProfileName>(initialProfileName);
  const [playerLevel, setPlayerLevel] = useState(initialPlayerLevel);
  const [goals, setGoals] = useState<UserGoal[]>(initialGoals);
  const [activeGoalId, setActiveGoalId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"game" | "coach">("game");

  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("1000");
  const [newGoalCategory, setNewGoalCategory] = useState("saving");
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);

  const [isBankConnected, setIsBankConnected] = useState(!!plaidAccessToken);
  const [bankName, setBankName] = useState(plaidBankName || "");


  // Gamified Destiny Engine States
  const [quests, setQuests] = useState<Quest[]>(initialQuests || []);
  const [bosses, setBosses] = useState<Boss[]>(initialBosses || []);
  const [streaks, setStreaks] = useState<Streak[]>(initialStreaks || []);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [bankAccounts, setBankAccounts] = useState<{ name: string; balances?: { current?: number } }[]>([]);

  const loadGameData = async () => {
    try {
      const res = await fetch("/api/profile/game-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          setQuests(result.quests || []);
          setBosses(result.bosses || []);
          setStreaks(result.streaks || []);
        }
      }
    } catch (err) {
      console.error("Failed to load quests/bosses from DB API:", err);
    }
  };

  const handlePlaidSync = async () => {
    const savedToken = localStorage.getItem(`plaid_access_token_${userId}`) || plaidAccessToken;
    if (!savedToken) {
      alert("Connect your bank in the quiz first! 🏦");
      return;
    }
    setSyncing(true);
    setSyncMessage("Récupération des comptes et transactions...");
    try {
      const res = await fetch("/api/plaid/sync-and-validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken: savedToken,
          token: token,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          accounts?: { name: string; balances?: { current?: number } }[];
          updatedQuests?: Quest[];
          updatedBosses?: Boss[];
        };
        setSyncMessage("Mise à jour des quêtes...");
        if (Array.isArray(data.accounts)) {
          setBankAccounts(data.accounts);
        }
        await loadGameData();
        
        const lang = getLocale();
        const completedQuest = data.updatedQuests?.find((q) => q.status === "completed");
        if (completedQuest) {
          triggerLocalNotification("quest_completed", lang, completedQuest.title, `/profile/${token}`, completedQuest.xp_reward);
        } else if (data.updatedBosses && data.updatedBosses.length > 0) {
          const activeBoss = bosses.find(b => b.status === "active");
          const updatedBoss = data.updatedBosses[0];
          if (activeBoss && updatedBoss) {
            const damage = Number(activeBoss.current_hp) - Number(updatedBoss.current_hp);
            if (damage > 0) {
              triggerLocalNotification("boss_damage", lang, damage, `/profile/${token}`);
            }
          }
        }

        if ((data.updatedQuests && data.updatedQuests.length > 0) || (data.updatedBosses && data.updatedBosses.length > 0)) {
          alert("Quests and Boss updated after analyzing your spending! 🎉");
        } else {
          alert("Sync complete! Your challenges are up to date. ⚔️");
        }
      } else {
        throw new Error("Synchronization failed.");
      }
    } catch (err) {
      const error = err as Error;
      alert(error.message || "Error during synchronization.");
    } finally {
      setSyncing(false);
      setSyncMessage("");
    }
  };

  const handleActivateQuest = async (questId: string) => {
    setSyncing(true);
    setSyncMessage("Activation de la quête...");
    try {
      const res = await fetch("/api/quests/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          questId,
        }),
      });

      if (res.ok) {
        // Find quest title before reload
        const activeQ = quests.find(q => q.id === questId);
        const activeName = activeQ?.title || "Nouvelle Quête";
        
        await loadGameData();
        
        // Trigger local notification
        const lang = getLocale();
        triggerLocalNotification("quest_started", lang, activeName, `/profile/${token}`);
        
        alert("Quest activated successfully! Let the adventure begin! ⚔️");
      } else {
        const errData = await res.json();
        throw new Error(errData.error || "Activation failed.");
      }
    } catch (err) {
      const error = err as Error;
      alert(error.message || "Error during activation.");
    } finally {
      setSyncing(false);
      setSyncMessage("");
    }
  };


  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("welcome") === "true") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setShowWelcomeBanner(true);
      }
      
      const savedToken = localStorage.getItem(`plaid_access_token_${userId}`) || plaidAccessToken;
      const savedBank = localStorage.getItem(`plaid_bank_name_${userId}`) || plaidBankName;
      if (savedToken) {
        setIsBankConnected(true);
        setBankName(savedBank || "Banque Plaid");

        // Quietly fetch balances on mount
        fetch("/api/plaid/sync-and-validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessToken: savedToken,
            token: token,
          }),
        })
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.accounts)) {
            setBankAccounts(data.accounts);
          }
        })
        .catch(err => console.error("Quiet Plaid accounts fetch failed:", err));

        // Silent AI analysis check (every 2 weeks / 14 days)
        const lastAnalysis = lastAnalysisAt ? new Date(lastAnalysisAt).getTime() : 0;
        const twoWeeksMs = 14 * 24 * 60 * 60 * 1000;
        if (Date.now() - lastAnalysis > twoWeeksMs) {
          console.log("[AI Analysis] Stale data (> 2 weeks). Triggering silent analysis update...");
          fetch("/api/plaid/analyze-transactions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              accessToken: savedToken,
              token: token,
            }),
          })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              console.log("[AI Analysis] Silent update completed successfully.");
              // Reload game and dashboard data silently if needed
              loadGameData();
            }
          })
          .catch(err => console.error("Silent AI analysis auto-trigger failed:", err));
        }
      }

      loadGameData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, plaidAccessToken, plaidBankName, lastAnalysisAt]);

  // Push notifications hook
  const { subscribe, unsubscribe, enabled, blocked, loading } = usePushNotifications(userId);

  const handleNotificationToggle = async () => {
    if (enabled) {
      await unsubscribe();
    } else {
      const result = await subscribe();
      if (result && result.reason === "denied") {
        alert("Please enable notifications in your browser settings.");
      }
    }
  };

  // Transactions state for Month-End Evaluation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  
  // Persistent Player Stats
  const [playerStats, setPlayerStats] = useState({ level: playerLevel, xp: 0, coins: 0 });

  // Month-end evaluation modal
  const [showEvalModal, setShowEvalModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [evalSavings, setEvalSavings] = useState(0);

  // Load client-side overrides and goals on mount
  useEffect(() => {
    // 1. Profile override
    const savedProfile = getProfileOverride(userId);
    if (savedProfile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfileName(savedProfile as ProfileName);
    }

    // Load persistent stats
    if (typeof window !== "undefined") {
      const savedLvl = localStorage.getItem("finlevels_level");
      const savedXp = localStorage.getItem("finlevels_total_xp");
      const savedCoins = localStorage.getItem("finlevels_total_coins");
      setPlayerStats({
        level: savedLvl ? parseInt(savedLvl, 10) : playerLevel,
        xp: savedXp ? parseInt(savedXp, 10) : 0,
        coins: savedCoins ? parseInt(savedCoins, 10) : 0,
      });
    }

    // 2. Goals
    const active = goals.find((g) => g.isActive);
    if (active) {
      setActiveGoalId(active.id);
    } else if (goals.length > 0 && goals[0]) {
      setActiveGoalId(goals[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, goals]);

  // Load real challenge transactions on mount & changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const txKey = `transactions_${userId}`;
      const saved = localStorage.getItem(txKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as { id?: string }[];
          const realChallengeTxs = parsed.filter((tx) => tx.id && tx.id.startsWith("real-tx-")) as unknown as Transaction[];
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setAllTransactions(realChallengeTxs);
        } catch (e) {
          console.error(e);
        }
      } else {
        setAllTransactions([]);
      }
    }
  }, [userId]);

  // Handle active goal change
  const handleSelectActiveGoal = async (goalId: string) => {
    setActiveGoalId(goalId);
    const updatedGoals = goals.map((g) => ({
      ...g,
      isActive: g.id === goalId,
    }));
    setGoals(updatedGoals);

    // Save to database & localStorage fallback
    const key = `user_goals_${userId}`;
    localStorage.setItem(key, JSON.stringify(updatedGoals));
    try {
      await saveUserGoalsToDb(token, updatedGoals);
    } catch (e) {
      console.error("Failed to sync active goal to DB:", e);
    }
  };

  // Add new Goal
  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalName.trim()) return;

    const newGoal: UserGoal = {
      id: `goal-${Date.now()}`,
      name: newGoalName,
      target: parseFloat(newGoalTarget) || 1000,
      current: 0,
      category: newGoalCategory,
      isActive: true, // Make newly created goal ACTIVE by default
    };

    // Deactivate all other goals and append the new one
    const updatedGoals = goals.map(g => ({ ...g, isActive: false })).concat(newGoal);
    setGoals(updatedGoals);
    setActiveGoalId(newGoal.id);

    // Save to database & localStorage fallback
    localStorage.setItem(`user_goals_${userId}`, JSON.stringify(updatedGoals));
    try {
      await saveUserGoalsToDb(token, updatedGoals);
    } catch (err) {
      console.error("Failed to sync new goal to DB:", err);
    }

    // Reset
    setNewGoalName("");
    setNewGoalTarget("1000");
    setShowAddGoalModal(false);
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet objectif ? Les économies associées seront perdues.")) return;

    const updatedGoals = goals.filter((g) => g.id !== goalId);
    
    // If the deleted goal was active, activate another remaining goal if possible
    if (goalId === activeGoalId && updatedGoals.length > 0 && updatedGoals[0]) {
      updatedGoals[0].isActive = true;
      setActiveGoalId(updatedGoals[0].id);
    } else if (updatedGoals.length === 0) {
      setActiveGoalId("");
    }

    setGoals(updatedGoals);

    // Save to database & localStorage fallback
    localStorage.setItem(`user_goals_${userId}`, JSON.stringify(updatedGoals));
    try {
      await saveUserGoalsToDb(token, updatedGoals);
    } catch (e) {
      console.error("Failed to sync goal deletion to DB:", e);
    }
  };





  const handleConfirmUpgrade = () => {
    // Evolve profile to next archetype
    const archetypeOrder: ProfileName[] = [
      "The Survivor",
      "The Explorer",
      "The Saver",
      "The Builder",
      "The Investor",
      "The Wealth Architect",
    ];

    const currentIdx = archetypeOrder.indexOf(profileName);
    if (currentIdx >= 0 && currentIdx < archetypeOrder.length - 1) {
      const nextProfile = archetypeOrder[currentIdx + 1]!;
      setProfileName(nextProfile);
      saveProfileOverride(userId, nextProfile);
      setPlayerLevel((prev) => prev + 1);

      // Trigger level up notification
      const lang = getLocale();
      triggerLocalNotification("level_up", lang, playerLevel + 1, `/profile/${token}`);

      // Add level up bonus to coins in localStorage
      const savedCoins = localStorage.getItem("finlevels_total_coins");
      const newCoins = (savedCoins ? parseInt(savedCoins, 10) : 0) + 150;
      localStorage.setItem("finlevels_total_coins", String(newCoins));
      localStorage.setItem("finlevels_level", String(playerLevel + 1));
      
      // Update active goal by depositing some coins bonus
      if (activeGoalId) {
        const bonusDeposit = 100;
        const updatedGoals = goals.map((g) => {
          if (g.id === activeGoalId) {
            return { ...g, current: Math.min(g.target, g.current + bonusDeposit) };
          }
          return g;
        });
        setGoals(updatedGoals);
        localStorage.setItem(`user_goals_${userId}`, JSON.stringify(updatedGoals));
        saveUserGoalsToDb(token, updatedGoals).catch((err) =>
          console.error("Failed to sync evolution bonus deposit to DB:", err)
        );
      }
    }
    setShowEvalModal(false);
  };

  return (
    <main className="min-h-screen bg-[#F8F7FC] text-[#1A1833] px-4 py-8 selection:bg-[#5B5DF2] selection:text-white sm:px-6 sm:py-12 lg:px-10 relative overflow-hidden">
      {/* Decorative vector meshes */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-500/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[150px] pointer-events-none" />

      <section className="mx-auto max-w-6xl space-y-6 relative z-10">
        <header className="rounded-3xl border border-[#E9E8F3] bg-white/70 backdrop-blur-xl px-4 py-3 flex items-center justify-between gap-4 shadow-[0_8px_30px_rgba(70,72,212,0.03)] mb-6">
          {/* Back button & Brand Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link href="/" className="text-slate-500 hover:text-slate-900 transition-all flex items-center justify-center w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 active:scale-95">
              <ArrowLeft className="h-4 w-4" />
            </Link>
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
          <nav className="flex items-center gap-0.5 bg-slate-100/80 border border-slate-200/55 rounded-full p-0.5 shrink-1">
            <Link
              href={`/challenges/${encodeURIComponent(activeChallengeToken)}`}
              className="px-2.5 py-1.5 sm:px-3.5 rounded-full text-[10px] sm:text-xs font-black text-slate-600 hover:text-[#1A1833] hover:bg-white/50 transition-all"
            >
              <span className="sm:hidden">Quests</span>
              <span className="hidden sm:inline">Daily Quests</span>
            </Link>
            <span className="px-2.5 py-1.5 sm:px-3.5 rounded-full text-[10px] sm:text-xs font-black bg-[#5B5DF2] text-white shadow-[0_4px_12px_rgba(91,93,242,0.2)]">
              <span className="sm:hidden">Profile</span>
              <span className="hidden sm:inline">My Profile</span>
            </span>
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

        <style>{`
          @keyframes bubble-bounce {
            0% { opacity: 0; transform: scale(0.9) translateY(10px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes penny-mascot-container-idle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
          .animate-mascot-idle {
            animation: penny-mascot-container-idle 4s infinite ease-in-out;
          }
        `}</style>

        {showWelcomeBanner && (
          <div className="w-full flex flex-col md:flex-row items-center gap-4 p-4 rounded-3xl border border-violet-100 bg-gradient-to-tr from-violet-50/90 to-indigo-50/90 text-violet-950 relative overflow-hidden text-left mb-6 shadow-[0_8px_30px_rgba(91,93,242,0.06)] animate-[bubble-bounce_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(91,93,242,0.05)_0%,transparent_70%)] pointer-events-none" />
            
            <div className="relative shrink-0 flex flex-col items-center justify-center w-16 h-16 bg-white/80 border border-violet-200 rounded-2xl p-1 shadow-sm">
              <MascotFullSvg className="h-12 w-auto animate-mascot-idle" />
              <span className="absolute -bottom-2 bg-[#5B5DF2] text-white font-black text-[6px] px-1.5 py-0.5 rounded-full uppercase tracking-wider leading-none shadow-sm">
                Penny
              </span>
            </div>

            <div className="flex-1 pr-6 relative">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-violet-600">
                  Welcome to your Dashboard! 🎉
                </span>
                <span className="text-[8px] font-medium text-slate-400">· Coach Penny</span>
              </div>
              <p className="text-[11px] font-semibold leading-relaxed">
                &ldquo;Welcome to your Finlevels Dashboard, {firstName}! I&apos;m Penny, your game companion. Here, you can track your archetype status, launch daily quests, and grow your savings chest shield. Let&apos;s make smart choices together! 🛡️✨&rdquo;
              </p>
            </div>

            <button
              onClick={() => setShowWelcomeBanner(false)}
              className="absolute top-3 right-3 text-violet-400 hover:text-[#1A1833] transition-colors p-1 text-xs font-black"
              aria-label="Dismiss welcome message"
            >
              ✕
            </button>
          </div>
        )}

        {/* Dashboard Layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Sidebar Column: Holo Card */}
          <div className="w-full lg:w-[240px] shrink-0 flex flex-col items-center gap-4">
            <HoloTradingCard
              profileName={profileName}
              playerLevel={playerStats.level}
              userName={firstName}
              focusPath={primaryFocusCoin}
            />
            {/* XP Progression Bar under Card */}
            <div className="w-full max-w-[210px] min-[360px]:max-w-[225px] min-[390px]:max-w-[240px] bg-white/70 border border-[#E9E8F3] rounded-2xl p-3 text-center shadow-xs">
              <div className="flex justify-between items-center text-[9px] font-black text-slate-500 mb-1">
                <span>XP PROGRESSION</span>
                <span>{playerStats.xp % 300} / 300 XP</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${(playerStats.xp % 300) / 3}%` }} />
              </div>
            </div>

            {isBankConnected ? (
              <button
                type="button"
                onClick={handlePlaidSync}
                disabled={syncing}
                className={`w-full max-w-[210px] min-[360px]:max-w-[225px] min-[390px]:max-w-[240px] rounded-2xl p-3 text-center shadow-xs flex flex-col items-center justify-center gap-1.5 border transition-all active:scale-95 ${
                  syncing
                    ? "bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-emerald-50 hover:bg-emerald-100/70 border-emerald-100 text-emerald-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin text-slate-400" : "text-emerald-600"}`} />
                  <span className="text-[10px] font-black uppercase tracking-wider truncate">
                    {syncing ? "Syncing..." : `Sync: ${bankName}`}
                  </span>
                </div>
                {syncing && <span className="text-[8px] text-slate-400 font-semibold">{syncMessage}</span>}
              </button>
            ) : (
              <div className="w-full max-w-[210px] min-[360px]:max-w-[225px] min-[390px]:max-w-[240px] bg-amber-50/80 border border-amber-100 rounded-2xl p-3 text-center shadow-xs flex items-center justify-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider">
                  Bank disconnected
                </span>
              </div>
            )}


            {/* PWA Settings / Push Notifications Panel */}
            <div className="w-full max-w-[210px] min-[360px]:max-w-[225px] min-[390px]:max-w-[240px] bg-white/70 border border-[#E9E8F3] rounded-2xl p-3 shadow-xs">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-2">SETTINGS</p>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h5 className="text-[11px] font-black text-[#1A1833] leading-none">Push Alerts</h5>
                  <p className="text-[8px] text-slate-500 mt-1 leading-snug">Quest updates when offline</p>
                </div>
                <button
                  type="button"
                  disabled={loading || blocked}
                  onClick={handleNotificationToggle}
                  className={`w-8 h-4 rounded-full relative transition-all duration-300 ${
                    enabled ? "bg-[#5B5DF2]" : "bg-slate-200"
                  } ${loading ? "opacity-50 cursor-wait" : ""} ${blocked ? "opacity-30 cursor-not-allowed" : ""}`}
                  style={{ minWidth: "32px" }}
                >
                  <span
                    className={`w-3 h-3 rounded-full bg-white absolute top-0.5 left-0.5 transition-transform duration-300 ${
                      enabled ? "translate-x-4" : "translate-x-0"
                    } shadow-sm`}
                  />
                </button>
              </div>
              {blocked && (
                <p className="text-[7px] font-bold text-red-500 mt-2 leading-normal">
                  Notifications blocked in your browser settings.
                </p>
              )}
            </div>
          </div>

          {/* Main Column: Dynamic ledger, Goals & Quests */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Tab Selector */}
            <div className="flex border-b border-slate-200/60 gap-4 sm:gap-6 mb-2">
              <button
                type="button"
                onClick={() => setActiveTab("game")}
                className={`pb-3 text-xs font-black uppercase tracking-wider transition-all relative ${
                  activeTab === "game"
                    ? "text-[#5B5DF2]"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Dashboard & Quests
                {activeTab === "game" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5B5DF2] rounded-full animate-fade-in" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("coach")}
                className={`pb-3 text-xs font-black uppercase tracking-wider transition-all relative flex items-center gap-1.5 ${
                  activeTab === "coach"
                    ? "text-[#5B5DF2]"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <span className="sm:hidden">Coach Penny 🦉</span>
                <span className="hidden sm:inline">Coach Penny&apos;s Diagnostic 🦉</span>
                <span className="bg-violet-100 text-violet-700 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-normal">AI</span>
                {activeTab === "coach" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5B5DF2] rounded-full animate-fade-in" />
                )}
              </button>
            </div>

            {activeTab === "game" ? (
              <>
                {/* Top row: Wallet & Goals side-by-side on desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Real Plaid Bank Balances Card */}
                  <div className="rounded-3xl border border-[#E9E8F3] bg-white/70 backdrop-blur-md p-6 flex flex-col justify-between relative overflow-hidden shadow-xs min-h-[140px]">
                    {/* Holographic stripes background indicator */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full filter blur-2xl pointer-events-none" />
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-black text-violet-600 uppercase tracking-widest block">PLAID BANK BALANCE</span>
                        <span className="text-2xl font-black tracking-tight block mt-0.5 text-[#1A1833]">
                          ${bankAccounts.reduce((sum, acc) => sum + (acc.balances?.current || 0), 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Linked accounts</span>
                        <span className="text-xs font-black text-emerald-600">
                          {bankAccounts.length} active
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 max-h-[100px] overflow-y-auto pr-1">
                      {bankAccounts.length > 0 ? (
                        bankAccounts.map((acc, index) => (
                          <div key={index} className="flex justify-between items-center text-[10px] font-bold text-slate-600 border-b border-slate-100/50 pb-1 last:border-b-0 last:pb-0">
                            <span className="truncate max-w-[140px]">{acc.name || "Checking Account"}</span>
                            <span className="text-[#1A1833]">${(acc.balances?.current || 0).toFixed(2)}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-[9px] text-slate-400 font-bold italic">
                          No balance available. Click &quot;Sync&quot; above to refresh balances.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Goals Management Panel */}
                  <div className="rounded-3xl border border-[#E9E8F3] bg-white/70 backdrop-blur-md p-6 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-black text-[#1A1833] uppercase tracking-wider">Active Goals (&quot;Side Quests&quot;)</h3>
                        <p className="text-[10px] font-bold text-slate-500">Savings from daily choices flow into the active goal</p>
                      </div>
                      <button
                        onClick={() => {
                          if (goals.length >= 3) {
                            alert("You can't create more than 3 goals at once. Delete one to create space! 🛡️");
                            return;
                          }
                          setShowAddGoalModal(true);
                        }}
                        className={`p-1.5 rounded-lg border transition-all ${
                          goals.length >= 3
                            ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
                            : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 active:scale-95"
                        }`}
                        title="Add goal"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {goals.filter(g => g.isActive || g.current > 0).length > 0 ? (
                        goals.filter(g => g.isActive || g.current > 0).map((goal) => {
                          const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
                          const isActive = goal.id === activeGoalId;
                          return (
                            <div
                              key={goal.id}
                              onClick={() => handleSelectActiveGoal(goal.id)}
                              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                                isActive
                                  ? "bg-violet-50/60 border-violet-200 shadow-[0_4px_20px_rgba(91,93,242,0.06)]"
                                  : "bg-slate-50/50 border-slate-100 hover:bg-slate-50"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                                      isActive ? "border-[#5B5DF2]" : "border-slate-300"
                                    }`}
                                  >
                                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#5B5DF2]" />}
                                  </div>
                                  <span className={`text-xs font-black ${isActive ? "text-[#1A1833]" : "text-slate-600"}`}>
                                    {goal.name}
                                  </span>
                                </div>
                                <span className="text-[11px] font-black text-[#5B5DF2]">
                                  {goal.current.toFixed(0)} <span className="text-slate-400">/ {goal.target.toFixed(0)} USD</span>
                                </span>
                              </div>

                              {/* Goal progress bar */}
                              <div className="h-2 w-full bg-slate-200/60 rounded-full overflow-hidden p-0.5">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-[#5B5DF2] transition-all duration-500"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>

                              <div className="flex justify-between items-center mt-2.5 relative z-20">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                                  {goal.category} path goal
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteGoal(goal.id);
                                    }}
                                    className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                    title="Delete goal"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-6 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                          <p className="text-xs font-bold text-slate-500">No active side quest goals</p>
                          <p className="text-[9px] text-slate-400 mt-1">Tap the &quot;+&quot; button to set a savings goal.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Active Plaid Quests & Boss Battles */}
                <div className="space-y-6">
                  {/* 1. Combat de Boss Actif */}
                  {bosses.filter(b => b.status === "active").map((boss) => {
                    const hpPct = Math.round((Number(boss.current_hp) / Number(boss.max_hp)) * 100);
                    return (
                      <div key={boss.id} className="rounded-3xl border border-red-200 bg-red-50/40 backdrop-blur-md p-6 shadow-sm border-2 relative overflow-hidden">
                        <div className="absolute top-[-20%] right-[-10%] w-[150px] h-[150px] rounded-full bg-red-500/10 blur-[40px] pointer-events-none animate-pulse" />
                        
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                              Active Boss Battle
                            </span>
                            <h4 className="mt-2 text-base font-black text-slate-900 flex items-center gap-1.5">
                              {boss.name}
                            </h4>
                            <p className="mt-1 text-xs text-slate-600 font-semibold">
                              HP : <span className="font-black text-red-600">${boss.current_hp}</span> / ${boss.max_hp} per month
                            </p>
                          </div>
                          <span className="text-3xl animate-bounce">🐉</span>
                        </div>

                        {/* Boss HP Bar */}
                        <div className="mt-4">
                          <div className="h-3 w-full bg-red-100 border border-red-200 rounded-full overflow-hidden p-0.5 shadow-inner">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-1000"
                              style={{ width: `${hpPct}%` }}
                            />
                          </div>
                          <div className="flex justify-between items-center text-[9px] font-black text-slate-500 mt-1">
                            <span>HP Remaining: {hpPct}%</span>
                            <span className="text-red-600">Cancel subscriptions to deal damage!</span>
                          </div>
                        </div>

                        {/* Target Subscriptions */}
                        <div className="mt-4 bg-white/70 rounded-2xl p-3 border border-red-100">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-2">Subscriptions to defeat:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {Array.isArray(boss.target_subscriptions) && boss.target_subscriptions.map((sub: string | { merchant?: string; name?: string }, i: number) => {
                              const subName = typeof sub === "string" ? sub : (sub?.merchant || sub?.name || "Subscription");
                              return (
                                <span key={i} className="text-[10px] font-bold px-2.5 py-1 bg-red-100/50 text-red-800 rounded-xl border border-red-200/40">
                                  ❌ {subName}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* 2. Personalized Plaid Quests */}
                  <div className="rounded-3xl border border-[#E9E8F3] bg-white/70 backdrop-blur-md p-6 shadow-xs space-y-4">
                    {(() => {
                      const activeQuests = quests.filter(q => q.status === "active" || q.status === "completed" || q.status === "failed");
                      const pendingQuests = quests.filter(q => q.status === "pending");

                      // Case A: User has an active, completed, or failed quest
                      if (activeQuests.length > 0) {
                        return (
                          <>
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <span className="text-[9px] font-black uppercase tracking-wider text-violet-600">
                                  ACTIVE WEEKLY QUEST ⚔️
                                </span>
                                <p className="mt-1 text-xs font-semibold text-slate-600 leading-relaxed">
                                  Challenge your budget to complete your quest and claim your loot.
                                </p>
                              </div>
                              {streaks.length > 0 && (
                                <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-800 px-2.5 py-1 rounded-xl text-[10px] font-black shrink-0">
                                  <Flame className="h-3.5 w-3.5 text-amber-600" />
                                  <span>{streaks[0]?.current_streak || 0} days</span>
                                </div>
                              )}
                            </div>

                            <div className="space-y-3">
                              {activeQuests.map((quest) => (
                                <div key={quest.id} className={`p-4 rounded-2xl border transition-all relative overflow-hidden bg-white ${
                                  quest.status === "completed"
                                    ? "border-emerald-200 bg-emerald-50/10"
                                    : quest.status === "failed"
                                    ? "border-red-100 bg-red-50/10"
                                    : "border-slate-100 shadow-sm"
                                }`}>
                                  <div className="flex items-start justify-between gap-4">
                                    <div>
                                      <div className="flex items-center gap-1.5">
                                        <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                          quest.difficulty === "epic"
                                            ? "bg-purple-100 text-purple-800"
                                            : quest.difficulty === "hard"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-blue-100 text-blue-800"
                                        }`}>
                                          {quest.difficulty}
                                        </span>
                                        <span className="text-xs font-black text-slate-900">{quest.title}</span>
                                      </div>
                                      <p className="text-[10px] font-semibold text-slate-500 mt-1 leading-snug">{quest.description}</p>
                                    </div>

                                    <div className="text-right shrink-0">
                                      {quest.status === "completed" ? (
                                        <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                                          ✓ Success
                                        </span>
                                      ) : quest.status === "failed" ? (
                                        <span className="text-xs font-black text-red-500">
                                          ✗ Failed
                                        </span>
                                      ) : (
                                        <div className="flex flex-col items-end">
                                          <span className="text-xs font-black text-violet-600">Limit: ${quest.target_amount}</span>
                                          <span className="text-[8px] text-slate-400 font-bold">{quest.duration_days} days</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        );
                      }

                      // Case B: No active quest, but exactly 3 pending proposals
                      if (pendingQuests.length === 3) {
                        return (
                          <>
                            <div className="text-left">
                              <span className="text-[9px] font-black uppercase tracking-wider text-violet-600">
                                CHOOSE YOUR NEXT QUEST 🗺️
                              </span>
                              <h4 className="text-sm font-black text-[#1A1833] mt-1 uppercase tracking-tight">3 Proposals from Coach Penny</h4>
                              <p className="text-[10px] font-semibold text-slate-500 leading-normal mt-0.5">
                                Select the weekly challenge that best fits your current goals. The other options will be archived.
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                              {pendingQuests.map((quest) => {
                                let borderClass = "border-slate-100 hover:border-slate-300";
                                let bgAccent = "bg-slate-500/5";
                                let iconColor = "text-slate-500";

                                if (quest.category === "stability") {
                                  borderClass = "border-rose-100 hover:border-rose-300 hover:shadow-[0_4px_20px_rgba(244,63,94,0.06)]";
                                  bgAccent = "bg-rose-50/50";
                                  iconColor = "text-rose-500";
                                } else if (quest.category === "saving") {
                                  borderClass = "border-[#E9E8F3] hover:border-[#5B5DF2] hover:shadow-[0_4px_20px_rgba(91,93,242,0.06)]";
                                  bgAccent = "bg-violet-50/50";
                                  iconColor = "text-[#5B5DF2]";
                                } else if (quest.category === "investing") {
                                  borderClass = "border-emerald-100 hover:border-emerald-300 hover:shadow-[0_4px_20px_rgba(16,185,129,0.06)]";
                                  bgAccent = "bg-emerald-50/50";
                                  iconColor = "text-emerald-500";
                                }

                                return (
                                  <div
                                    key={quest.id}
                                    className={`rounded-2xl border p-4 flex flex-col justify-between transition-all bg-white relative overflow-hidden ${borderClass}`}
                                  >
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between gap-2">
                                        <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600`}>
                                          {quest.difficulty}
                                        </span>
                                        <span className={`text-[8px] font-black uppercase tracking-widest ${iconColor}`}>
                                          {quest.category}
                                        </span>
                                      </div>

                                      <div>
                                        <h5 className="text-xs font-black text-[#1A1833] leading-snug line-clamp-2">
                                          {quest.title}
                                        </h5>
                                        <p className="text-[9px] font-bold text-slate-500 mt-1.5 leading-relaxed">
                                          {quest.description}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-slate-50 space-y-3">
                                      <div className="flex justify-between items-center text-[9px] font-semibold text-slate-400">
                                        <span>Target: <strong className="text-slate-700">${quest.target_amount}</strong></span>
                                        <span>Duration: <strong className="text-slate-700">{quest.duration_days} days</strong></span>
                                      </div>

                                      <div className={`p-2 rounded-xl text-[9px] font-bold flex justify-between items-center ${bgAccent}`}>
                                        <span className="text-slate-500">Loot:</span>
                                        <span className="text-[#1A1833] font-black">+{quest.xp_reward} XP · +{quest.coin_reward} Gold</span>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() => handleActivateQuest(quest.id)}
                                        className="w-full py-2 bg-[#5B5DF2] hover:bg-[#4648d4] text-white text-[9px] font-black uppercase tracking-wider rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                                      >
                                        Accept Challenge ⚔️
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        );
                      }

                      // Case C: Neither (empty state or first load)
                      return (
                        <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
                          <p className="text-xs font-bold text-slate-500">Bank analysis in progress...</p>
                          <p className="text-[10px] text-slate-400 mt-1">
                            Penny is inspecting your budget to generate your weekly challenge proposals. Click &quot;Sync&quot; above to refresh balances.
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </>
            ) : (
              /* Diagnostic de Coach Penny tab */
              <div className="rounded-3xl border border-violet-100 bg-white/70 backdrop-blur-md p-6 shadow-sm space-y-6 text-left relative overflow-hidden animate-[bubble-bounce_0.35s_ease-out]">
                <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] rounded-full bg-violet-500/5 blur-[80px] pointer-events-none" />
                
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                  <div className="flex flex-col items-center justify-center w-14 h-14 bg-violet-50 border border-violet-100 rounded-2xl p-1 shadow-inner">
                    <MascotFullSvg className="h-10 w-auto animate-mascot-idle" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#1A1833] uppercase tracking-wider">Coach Penny Diagnostic</h3>
                    <p className="text-[10px] text-slate-400 font-bold">Personalized financial analysis report based on Plaid</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[9px] font-black text-violet-600 uppercase tracking-widest block mb-2">Behavioral Analysis</span>
                    <div className="bg-violet-50/40 border border-violet-100/50 rounded-2xl p-4">
                      <p className="text-xs font-semibold text-slate-700 leading-relaxed italic whitespace-pre-line">
                        {analysisSummary ? `“ ${analysisSummary} ”` : "“ Hey! Connect your bank and sync your data so I can create your full financial profile and help you improve! ”"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Identified Strengths</span>
                      <ul className="text-[10px] font-semibold text-slate-600 space-y-1 mt-2">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500">✓</span> 
                          <span>Secure and synchronized bank connection</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500">✓</span> 
                          <span>Determination of your financial archetype ({profileName})</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Areas for Growth</span>
                      <ul className="text-[10px] font-semibold text-slate-600 space-y-1 mt-2">
                        <li className="flex items-start gap-2">
                          <span className="text-amber-500">⚠️</span>
                          <span>Prioritize focus path: <span className="font-black text-violet-600 uppercase text-[9px]">{primaryFocusCoin}</span></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-500">⚠️</span> 
                          <span>Complete weekly quests to earn XP</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Goal Add Modal */}
      {showAddGoalModal && (
        <div className="fixed inset-0 z-50 bg-[#000]/40 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl border border-[#E9E8F3] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] space-y-4 text-[#1A1833]">
            <div>
              <h3 className="text-base font-black text-[#1A1833] tracking-tight">Create Side Quest Goal</h3>
              <p className="text-[10px] font-bold text-slate-500 mt-0.5">Define a target and name it (Gen Z slang allowed)</p>
            </div>

            {/* Presets Suggestions */}
            <div className="space-y-1.5 bg-slate-50 border border-slate-100 rounded-2xl p-3">
              <label className="text-[9px] font-black uppercase text-slate-500 block tracking-wider">Goal Suggestions</label>
              <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto pr-1">
                {[
                  { name: "🚨 Emergency Fund", target: 1000, category: "stability" },
                  { name: "🩺 Dental Buffer", target: 500, category: "stability" },
                  { name: "✈️ Tokyo Summer Trip", target: 2500, category: "saving" },
                  { name: "🎟️ Coachella VIP Pass", target: 800, category: "saving" },
                  { name: "🚀 Moonshot Crypto Bag", target: 500, category: "investing" },
                  { name: "📈 Index ETF Shares", target: 1200, category: "investing" }
                ].map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setNewGoalName(preset.name);
                      setNewGoalTarget(String(preset.target));
                      setNewGoalCategory(preset.category);
                    }}
                    className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100/50 border border-slate-200/50 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-600 transition-all cursor-pointer"
                  >
                    {preset.name} (${preset.target})
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddGoal} className="space-y-3 text-slate-700">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Goal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 🎟️ Coachella VIP Drip"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-[#1A1833] focus:outline-none focus:border-violet-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Target ($ USD)</label>
                  <input
                    type="number"
                    required
                    min="10"
                    max="50000"
                    placeholder="1000"
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-[#1A1833] focus:outline-none focus:border-violet-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Category</label>
                  <select
                    value={newGoalCategory}
                    onChange={(e) => setNewGoalCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1833] focus:outline-none focus:border-violet-500 focus:bg-white appearance-none"
                  >
                    <option value="stability" className="bg-white">Stability</option>
                    <option value="saving" className="bg-white">Saving</option>
                    <option value="investing" className="bg-white">Investing</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddGoalModal(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-500 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#5B5DF2] text-white font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_4px_14px_rgba(91,93,242,0.25)] cursor-pointer"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Month-End Evaluation Modal */}
      {showEvalModal && (
        <div className="fixed inset-0 z-50 bg-[#000]/40 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-[#E9E8F3] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] space-y-5 text-center text-[#1A1833]">
            <div className="mx-auto w-16 h-16 rounded-full bg-violet-50 border border-violet-100 flex items-center justify-center">
              <UserCheck className="w-8 h-8 text-[#5B5DF2]" />
            </div>

            <div>
              <span className="text-[10px] font-black text-[#5B5DF2] uppercase tracking-[0.2em]">Evaluation Report</span>
              <h3 className="text-xl font-black text-[#1A1833] tracking-tight mt-1">Month End Review</h3>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Current Archetype Class:</span>
                <span className="font-black text-[#1A1833]">{profileName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Net Savings Rate:</span>
                <span className="font-black text-emerald-600">+${evalSavings} USD/mo</span>
              </div>
              <div className="h-px bg-slate-200" />
              <p className="text-xs font-semibold text-slate-600 leading-normal">
                Penny&apos;s Audit: &quot;No cap, your budget looks clean! You managed to keep leaks low and compound your side quests. Ready to level up your status?&quot;
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setShowEvalModal(false)}
                className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-500 cursor-pointer"
              >
                Keep Current Archetype
              </button>
              <button
                type="button"
                onClick={handleConfirmUpgrade}
                className="px-6 py-2.5 rounded-full bg-[#5B5DF2] text-white font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_4px_14px_rgba(91,93,242,0.25)] cursor-pointer"
              >
                Evolve Archetype! 🌟
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
