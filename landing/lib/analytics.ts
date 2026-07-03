import posthog from 'posthog-js';

export function trackEvent(eventName: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  // Console log in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics Event] ${eventName}`, properties);
  }

  try {
    // ── PostHog ──────────────────────────────────────────────────────────────
    // posthog-js is initialized via instrumentation-client.ts on app boot.
    // We call capture() directly here so every trackEvent() is sent to PostHog.
    posthog.capture(eventName, properties);

    // ── GTM dataLayer (optional, keep for future GTM integration) ────────────
    const w = window as unknown as {
      dataLayer?: Record<string, unknown>[];
      finlevels_events?: Record<string, unknown>[];
    };

    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({
      event: eventName,
      ...properties,
      timestamp: new Date().toISOString(),
    });

    // Custom events queue for debugging / verification
    w.finlevels_events = w.finlevels_events || [];
    w.finlevels_events.push({
      name: eventName,
      properties,
      timestamp: Date.now(),
    });
  } catch (e) {
    console.error("Failed to track event:", e);
  }
}
