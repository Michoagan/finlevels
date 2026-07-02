import { Metadata } from "next";
import { Suspense } from "react";
import ChallengesPageClient from "./ChallengesPageClient";

export const metadata: Metadata = {
  title: "Finlevels Challenges — Gamified Money Quests",
  description:
    "Complete daily financial quests, build streaks, earn XP, and level up your money habits.",
  openGraph: {
    title: "Finlevels Challenges — Gamified Money Quests",
    description:
      "Complete daily financial quests, build streaks, earn XP, and level up your money habits.",
    url: "/challenges",
  },
  twitter: {
    title: "Finlevels Challenges — Gamified Money Quests",
    description:
      "Complete daily financial quests, build streaks, earn XP, and level up your money habits.",
  },
};

function ChallengesPageFallback() {
  return (
    <main className="min-h-screen bg-[#f5f2fe] px-4 py-10 text-[#1b1b23] sm:px-6 sm:py-14 lg:px-10">
      <section className="mx-auto max-w-xl rounded-4xl border border-[#4648d4]/15 bg-white p-6 shadow-[0px_24px_80px_rgba(70,72,212,0.10)] sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#4648d4]">
          Challenges
        </p>
        <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
          Loading your mission...
        </h1>
      </section>
    </main>
  );
}

export default function ChallengesPage() {
  return (
    <Suspense fallback={<ChallengesPageFallback />}>
      <ChallengesPageClient />
    </Suspense>
  );
}
