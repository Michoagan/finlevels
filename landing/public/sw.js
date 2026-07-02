// Réception de la notification push
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data?.json() ?? {};
  } catch {
    // Fallback if data is not JSON or empty
    data = {
      title: "Finlevels Quest Update",
      body: event.data?.text() ?? "You have a new money challenge waiting!"
    };
  }

  event.waitUntil(
    self.registration.showNotification(data.title ?? "Notification", {
      body: data.body ?? "",
      icon: data.icon ?? "/logo-purple.svg",
      data: { url: data.url ?? "/" },
    })
  );
});

// Clic sur la notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      const existing = list.find((c) => c.url === url);
      if (existing) return existing.focus();
      return clients.openWindow(url);
    })
  );
});

// Fetch handler — only intercept same-origin requests.
// Third-party scripts (Plaid, Google, PostHog, etc.) must NOT be intercepted
// or they will fail due to CSP restrictions inherited by the service worker.
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Only handle same-origin requests — let all external requests pass through natively
  if (url.origin !== self.location.origin) {
    return;
  }

  // For same-origin: try cache first, then network, then offline fallback
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
      .catch(() => new Response("", { status: 503 }))
  );
});
