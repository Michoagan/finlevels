"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getChallengeProgressForEmail } from "../../lib/challenges";

export default function ChallengesPageClient() {
  const router = useRouter();
  const [setupEmail, setSetupEmail] = useState("");
  const [setupError, setSetupError] = useState("");
  const [isCheckingProgress, setIsCheckingProgress] = useState(false);

  const handleStartChallenge = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = setupEmail.trim().toLowerCase();

    if (!normalizedEmail) {
      setSetupError("Add your email to continue.");
      return;
    }

    setSetupError("");
    setIsCheckingProgress(true);

    try {
      const progress = await getChallengeProgressForEmail(normalizedEmail);

      if (!progress) {
        router.push("/quiz");
        return;
      }

      router.push(`/challenges/${encodeURIComponent(progress.token)}`);
    } catch (caughtError) {
      setSetupError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to check your challenge progress right now.",
      );
    } finally {
      setIsCheckingProgress(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f2fe] px-4 py-10 text-[#1b1b23] selection:bg-[#E4FF30] selection:text-[#1b1b23] sm:px-6 sm:py-14 lg:px-10">
      <section className="mx-auto max-w-xl rounded-4xl border border-[#4648d4]/15 bg-white p-6 shadow-[0px_24px_80px_rgba(70,72,212,0.10)] sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#4648d4]">
          Challenges
        </p>
        <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
          Enter your email
        </h1>
        <p className="mt-3 text-base font-medium leading-7 text-[#464554]">
          Challenges are directly mapped to your financial profile, so if you have
          one, enter the email you used to get your profile.
        </p>

        <form onSubmit={handleStartChallenge} className="mt-6 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-black text-[#1b1b23]">Email</span>
            <input
              type="email"
              value={setupEmail}
              onChange={(event) => setSetupEmail(event.target.value)}
              placeholder="you@example.com"
              className="rounded-2xl border border-[#e7e1f6] bg-[#f5f2fe] px-4 py-3 text-sm font-semibold text-[#1b1b23] outline-none transition placeholder:text-[#9291a3] focus:border-[#4648d4] focus:bg-white focus:ring-2 focus:ring-[#4648d4]/15"
            />
          </label>

          {setupError ? (
            <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-700">
              {setupError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isCheckingProgress}
            className={`inline-flex w-full items-center justify-center rounded-full px-7 py-4 text-sm font-black text-white shadow-[0px_16px_40px_rgba(70,72,212,0.22)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4648d4]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
              isCheckingProgress
                ? "cursor-not-allowed bg-[#ece9f7] text-[#9291a3]"
                : "bg-[#4648d4] hover:scale-[1.02] hover:bg-[#3d3fbe]"
            }`}
          >
            {isCheckingProgress ? "Checking..." : "Continue"}
          </button>
        </form>
      </section>
    </main>
  );
}
