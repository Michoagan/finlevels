"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { trackEvent } from "../../../lib/analytics";

export default function AuthCallbackPage() {
  const [statusText, setStatusText] = useState("Connecting to Google...");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function handleAuthSession() {
      try {
        // 1. Récupération de la session courante
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session || !session.user || !session.user.email) {
          // Si pas de session directe, on écoute les changements d'état d'auth
          // car Supabase peut prendre quelques millisecondes pour parser le hash de redirection
          const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
            if (newSession && newSession.user && newSession.user.email && active) {
              if (authListener?.subscription) {
                authListener.subscription.unsubscribe();
              }
              await resolveAndRedirect(newSession.user.email);
            }
          });

          // Security timeout if nothing happens after 6 seconds
          setTimeout(() => {
            if (active) {
              setError("Session not found. Please try logging in again.");
            }
          }, 6000);

          return;
        }

        await resolveAndRedirect(session.user.email);
      } catch (err) {
        console.error("Auth callback handler error:", err);
        if (active) {
          setError(err instanceof Error ? err.message : "Authentication error.");
        }
      }
    }

    async function resolveAndRedirect(email: string) {
      if (!active) return;
      setStatusText("Retrieving your Finlevels profile...");

      try {
        // 2. Lecture d'un éventuel quiz en attente
        let quizDetails = null;
        const pendingQuizRaw = localStorage.getItem("pending_quiz_profile");
        if (pendingQuizRaw) {
          try {
            quizDetails = JSON.parse(pendingQuizRaw);
          } catch (e) {
            console.error("Failed to parse pending quiz profile:", e);
          }
        }

        // 3. Appel de l'API de résolution de profil
        const response = await fetch("/api/auth/resolve-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, quizDetails }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Unable to resolve profile.");
        }

        if (result.redirectTo) {
          localStorage.removeItem("pending_quiz_profile");
          setStatusText("Redirecting to quiz...");
          window.location.href = `${result.redirectTo}?step=plaid_link`;
          return;
        }

        if (quizDetails) {
          trackEvent("profile_generated", {
            method: "google",
            profileName: quizDetails.profileName,
            primaryFocusCoin: quizDetails.primaryFocusCoin,
          });
        }

        // Clear quiz cache
        localStorage.removeItem("pending_quiz_profile");
        setStatusText("Profile unlocked! Redirecting...");

        // 4. Redirection vers le profil RPG
        const token = encodeURIComponent(result.token);
        window.location.href = `/profile/${token}`;
      } catch (err) {
        console.error("Resolve profile error:", err);
        if (active) {
          setError(err instanceof Error ? err.message : "Error resolving profile.");
        }
      }
    }

    handleAuthSession();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f2fe] flex items-center justify-center px-4 text-[#1b1b23]">
      <section className="w-full max-w-md bg-white rounded-4xl border border-[#4648d4]/15 p-8 text-center shadow-[0px_24px_80px_rgba(70,72,212,0.10)]">
        {error ? (
          <>
            <div className="mx-auto w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl font-black mb-6">
              !
            </div>
            <h1 className="text-2xl font-black tracking-[-0.03em]">Login failed</h1>
            <p className="mt-3 text-sm font-semibold leading-6 text-red-600 bg-red-50/50 border border-red-200/50 p-4 rounded-3xl">
              {error}
            </p>
            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="mt-6 w-full rounded-full bg-[#4648d4] text-white px-6 py-4 text-sm font-black transition hover:scale-[1.01] hover:bg-[#3d3fbe]"
            >
              {"Return to Home"}
            </button>
          </>
        ) : (
          <>
            {/* Styled CSS rotating spinner */}
            <div className="mx-auto w-16 h-16 relative mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-[#4648d4]/10" />
              <div className="absolute inset-0 rounded-full border-4 border-t-[#4648d4] animate-spin" />
            </div>
            
            <h1 className="text-2xl font-black tracking-[-0.03em]">Authentication</h1>
            <p className="mt-2 text-sm font-bold text-[#464554] animate-pulse">
              {statusText}
            </p>
          </>
        )}
      </section>
    </main>
  );
}
