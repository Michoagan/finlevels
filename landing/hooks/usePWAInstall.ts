"use client";

import { useState, useEffect } from "react";

export function usePWAInstall() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect iOS
    const userAgent = window.navigator.userAgent || "";
    const ios = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    // Detect if already installed (standalone mode)
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Check if prompt is already stored
    if ((window as any).deferredPrompt) {
      setIsInstallable(true);
    }

    const handleInstallable = () => {
      setIsInstallable(true);
    };

    window.addEventListener("pwa-installable", handleInstallable);
    return () => {
      window.removeEventListener("pwa-installable", handleInstallable);
    };
  }, []);

  const triggerInstall = async (): Promise<boolean> => {
    if (typeof window === "undefined") return false;

    const deferredPrompt = (window as any).deferredPrompt;
    if (!deferredPrompt) {
      console.log("No install prompt available (PWA might be already installed or iOS is used)");
      return false;
    }

    try {
      // Show native install banner
      deferredPrompt.prompt();

      // Wait for user outcome
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA install user outcome: ${outcome}`);

      // Clear the prompt since it can only be used once
      (window as any).deferredPrompt = null;
      setIsInstallable(false);
      return outcome === "accepted";
    } catch (err) {
      console.error("PWA install prompt error:", err);
      return false;
    }
  };

  return { isInstallable, triggerInstall, isIOS, isStandalone };
}
