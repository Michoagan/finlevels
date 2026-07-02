"use client";

import {
  useEffect,
  useId,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { saveWaitlistEmail } from "../lib/waitlist";
import { supabase } from "../lib/supabase";
import { executeRecaptcha } from "../lib/recaptcha";


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

type WaitlistButtonProps = {
  className: string;
  children?: ReactNode;
};

export default function WaitlistButton({
  className,
  children = "Join waitlist",
}: WaitlistButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const recaptchaToken = await executeRecaptcha("waitlist_submit");
      const savedEmail = await saveWaitlistEmail(
        trimmedEmail,
        "waitlist",
        undefined,
        recaptchaToken,
      );
      setSubmittedEmail(savedEmail.email);
      setEmail(savedEmail.email);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to join the waitlist right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleGoogleSubscribe = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
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
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to start Google subscription."
      );
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const modalContent = isOpen ? (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0d0d1a]/85 px-4 py-5 backdrop-blur-md sm:px-5 sm:py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onMouseDown={handleClose}
    >
      <div
        className="relative max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl border border-white/10 bg-[#16162a]/95 p-6 shadow-[0px_32px_96px_rgba(70,72,212,0.3)] sm:p-8"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Glow decoration */}
        <div className="absolute -right-20 -top-20 -z-10 h-48 w-48 rounded-full bg-[#4648d4]/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 -z-10 h-48 w-48 rounded-full bg-[#E4FF30]/10 blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex rounded-full bg-[#4648d4]/20 border border-[#4648d4]/30 px-3.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#E4FF30]">
              Waitlist
            </span>
            <h2
              id={titleId}
              className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em] text-white sm:text-4xl"
            >
              Get early access to Finlevels.
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close waitlist modal"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl leading-none text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline-none"
          >
            ×
          </button>
        </div>

        {submittedEmail ? (
          <p
            id={descriptionId}
            className="mt-6 wrap-break-words rounded-2xl border border-emerald-500/35 bg-emerald-500/10 p-5 text-sm font-bold leading-6 text-emerald-400"
            aria-live="polite"
          >
            You’re on the list. We’ll email {submittedEmail} when Finlevels
            is ready.
          </p>
        ) : (
          <>
            <p
              id={descriptionId}
              className="mt-4 text-sm font-medium leading-relaxed text-slate-400 sm:text-base"
            >
              Join the launch list and be first to try the habit-building
              app for Stability, Saving, and Investing.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label
                  htmlFor="waitlist-modal-email"
                  className="block text-xs font-black text-slate-300 uppercase tracking-wider"
                >
                  Email address
                </label>
                <input
                  id="waitlist-modal-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-semibold text-white placeholder:text-white/30 shadow-sm focus:outline-none focus:border-[#E4FF30] focus:ring-1 focus:ring-[#E4FF30] transition disabled:cursor-not-allowed disabled:bg-white/5 disabled:opacity-50"
                />
              </div>
              {submitError ? (
                <p
                  className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs leading-6 text-red-400 font-bold"
                  aria-live="polite"
                >
                  {submitError}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full rounded-xl py-3.5 text-sm font-black transition-all ${
                  isSubmitting
                    ? "cursor-not-allowed bg-white/10 text-white/30"
                    : "bg-[#E4FF30] text-[#1b1b23] shadow-[0px_16px_40px_rgba(228,255,48,0.15)] hover:scale-[1.01]"
                }`}
              >
                {isSubmitting ? "Joining..." : "Join waitlist ⚡"}
              </button>
            </form>

             <div className="my-5 flex items-center justify-center gap-3">
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">or</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSubscribe}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-3.5 text-sm font-black text-white transition hover:scale-[1.01]"
            >
              <GoogleIcon className="w-5 h-5 shrink-0" />
              Join waitlist with Google
            </button>
            <p className="mt-3 text-center text-[9px] font-bold text-slate-500 uppercase tracking-widest">
              ⚡ Secure 1-click OAuth connection
            </p>
          </>
        )}
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => setIsOpen(true)}
      >
        {children}
      </button>

      {mounted && modalContent ? createPortal(modalContent, document.body) : null}
    </>
  );
}
