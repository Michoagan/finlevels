export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window === "undefined") return;

  // Console log in development
  console.log(`[Analytics Event] ${eventName}`, properties);

  try {
    const w = window as any;

    // Push to Google Tag Manager compatible dataLayer
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({
      event: eventName,
      ...properties,
      timestamp: new Date().toISOString(),
    });

    // Custom events queue for verification or custom integrations
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
