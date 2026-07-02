"use client";

import { useState, useEffect } from "react";

const VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export function usePushNotifications(userId?: number) {
  const [enabled, setEnabled] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) return;
    setBlocked(Notification.permission === "denied");
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => setEnabled(sub !== null))
      .catch(() => {});
  }, []);

  async function subscribe() {
    setLoading(true);
    try {
      if (!VAPID_KEY) {
        console.warn("NEXT_PUBLIC_VAPID_PUBLIC_KEY is not defined");
        return { ok: false, reason: "missing_key" };
      }
      if (Notification.permission === "denied") return { ok: false, reason: "denied" };

      const permission = await Notification.requestPermission();
      if (permission !== "granted") return { ok: false, reason: "denied" };

      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_KEY),
      });

      // Send to backend
      const subscriptionJson = subscription.toJSON();
      const res = await fetch("/api/push-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscriptionJson.keys?.p256dh,
            auth: subscriptionJson.keys?.auth,
          },
          userId: userId,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to register subscription with backend");
      }

      setEnabled(true);
      return { ok: true };
    } catch (err) {
      console.error("Failed to subscribe to push notifications:", err);
      return { ok: false, reason: "error" };
    } finally {
      setLoading(false);
    }
  }

  async function unsubscribe() {
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.getSubscription();
      if (!subscription) return;

      await subscription.unsubscribe();

      await fetch("/api/push-subscription", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });

      setEnabled(false);
    } catch (err) {
      console.error("Failed to unsubscribe from push notifications:", err);
    } finally {
      setLoading(false);
    }
  }

  return { subscribe, unsubscribe, enabled, blocked, loading };
}
