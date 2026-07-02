"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "../lib/supabase";
import WaitlistButton from "./WaitlistButton";

const navItems = [
  ["How it works", "/#how"],
  ["Coins", "/#coins"],
  ["Challenges", "/challenges"],
  ["About", "/#profiles"],
];

export default function Header() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hide the landing header when the user is logged in (on profile or detailed challenges)
  const isProfilePage = pathname?.startsWith("/profile/");
  const isChallengeDetailPage = pathname?.startsWith("/challenges/") && pathname !== "/challenges";

  if (isProfilePage || isChallengeDetailPage) {
    return null;
  }

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (e) {
      console.error("Login trigger error:", e);
      setIsLoading(false);
    }
  };

  return (
    <header className="relative bg-[#f5f2fe] px-2 py-3 sm:px-6 lg:px-10 z-50">
      <div className="relative mx-auto max-w-7xl">
        <nav className="flex items-center justify-between rounded-full border border-[#4648d4]/15 bg-white/90 px-3 py-2 shadow-[0px_16px_40px_rgba(70,72,212,0.10)] backdrop-blur sm:px-4 sm:py-2.5 md:px-5">
          <Link href="/" className="flex min-w-0 items-center gap-1.5">
            <Image
              src="/logo-purple.svg"
              alt="Finlevels Logo"
              width={24}
              height={24}
              className="size-5"
            />
            <span className="truncate text-lg font-black tracking-tight text-[#4648d4] notranslate" translate="no">
              Finlevels
            </span>
          </Link>

          <div className="hidden items-center gap-7 text-sm font-extrabold text-[#464554] md:flex">
            {navItems.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="transition-colors hover:text-[#4648d4]"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-4">
            <button
              type="button"
              onClick={handleLogin}
              disabled={isLoading}
              className="hidden sm:inline-flex items-center gap-2 text-sm font-extrabold text-[#464554] hover:text-[#4648d4] transition-colors"
            >
              <span>{isLoading ? "Logging in..." : "Log in"}</span>
            </button>
            
            <WaitlistButton className="rounded-full bg-[#4648d4] px-3.5 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm font-extrabold text-white shadow-[0px_12px_30px_rgba(70,72,212,0.22)] transition-transform hover:scale-105">
              Join the Waitlist
            </WaitlistButton>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 hover:text-[#4648d4] focus-visible:outline-none md:hidden"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 p-5 bg-white/95 border border-[#4648d4]/15 rounded-3xl shadow-[0px_24px_55px_rgba(10,10,30,0.15)] backdrop-blur-md md:hidden flex flex-col gap-4 z-50 animate-[fade-in_0.2s_ease-out_forwards]">
            <div className="flex flex-col gap-2">
              {navItems.map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl hover:bg-[#f5f2fe] text-base font-extrabold text-[#464554] hover:text-[#4648d4] transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
            
            <div className="h-px bg-slate-100 my-1" />

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogin();
                }}
                disabled={isLoading}
                className="w-full py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-sm font-extrabold text-[#464554] transition-colors"
              >
                {isLoading ? "Logging in..." : "Log in"}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
