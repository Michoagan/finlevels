/**
 * Gamified Native Push Notifications Helper (Gen Z US & Europe target)
 * Optimized for mobile web app (PWA) using Service Worker fallback
 */

export type NotificationLocale = "en" | "fr";

const GENZ_MESSAGES = {
  en: {
    quest_started: {
      title: "⚔️ Quest Locked In!",
      body: (name: string) => `Penny: "Let's cook! You started: '${name}'. Don't let your streak decay!" 💰🔥`,
    },
    quest_completed: {
      title: "🏆 QUEST COMPLETED!",
      body: (name: string, xp: number) => `Penny: "Absolute W! You finished '${name}'. Earned +${xp} XP!" 💎✨`,
    },
    boss_damage: {
      title: "💥 CRITICAL HIT!",
      body: (amount: number) => `Penny: "💥 Critical hit! Slashed the Dragon's monthly HP by ${amount}€! Keep cancelling those lazy subs!" 🐉🗡️`,
    },
    boss_defeated: {
      title: "💀 BOSS SLAIN!",
      body: (name: string) => `Penny: "💀 Boss Slain! The ${name} has been defeated! Enjoy your monthly savings!" 🪙👑`,
    },
    streak_alert: {
      title: "🔥 Streak Check!",
      body: (days: number) => `Penny: "Yo! You're on a ${days}-day streak. Don't fumble the bag now!" 👑`,
    },
    encouragement: {
      title: "✨ Keep Cooking!",
      body: (message: string) => `Penny: "No cap: ${message || "you're doing great! Keep compounding your wealth."}" 💎💸`,
    },
    warning_spending: {
      title: "🚨 XP Leak Warning!",
      body: (message: string) => `Penny: "Hold up! ${message || "A new budget leak has been detected in your bank flow!"}" ⚠️📉`,
    },
    streak_warning: {
      title: "⚠️ Streak in Danger!",
      body: (hours: number) => `Penny: "Yo! Your streak decays in less than ${hours}h. Log a safe budget choice now!" ⏳🔥`,
    },
    level_up: {
      title: "🌟 LEVEL UP!",
      body: (level: number) => `Penny: "Evolved to Level ${level}! Your stats just got a permanent boost!" 👑🚀`,
    },
  },
  fr: {
    quest_started: {
      title: "⚔️ Quête activée !",
      body: (name: string) => `Penny : "C'est parti ! Défi lancé : '${name}'. Reste concentré sur ton streak !" 💰🔥`,
    },
    quest_completed: {
      title: "🏆 QUÊTE TERMINÉE !",
      body: (name: string, xp: number) => `Penny : "Masterclass ! Défi '${name}' validé. Tu gagnes +${xp} XP !" 💎✨`,
    },
    boss_damage: {
      title: "💥 COUP CRITIQUE !",
      body: (amount: number) => `Penny : "💥 Coup critique ! Tu as retiré ${amount}€ de HP mensuels au Dragon ! Terrasse ces abonnements !" 🐉🗡️`,
    },
    boss_defeated: {
      title: "💀 BOSS TERRASSÉ !",
      body: (name: string) => `Penny : "💀 Boss battu ! Le ${name} a été vaincu ! Profite de ton argent économisé !" 🪙👑`,
    },
    streak_alert: {
      title: "🔥 Garde ton Streak !",
      body: (days: number) => `Penny : "Wesh! T'es sur une série de ${days} jours. Viens valider ton coffre aujourd'hui !" 👑`,
    },
    encouragement: {
      title: "✨ Masterclass !",
      body: (message: string) => `Penny : "Franchement : ${message || "tu gères ! Continue de faire grossir ton magot."}" 💎💸`,
    },
    warning_spending: {
      title: "🚨 Fuite de Gold !",
      body: (message: string) => `Penny : "Attends ! ${message || "Une fuite de budget a été repérée sur tes comptes !"}" ⚠️📉`,
    },
    streak_warning: {
      title: "⚠️ Série en Danger !",
      body: (hours: number) => `Penny : "Garde ton streak ! Ta série expire dans moins de ${hours}h. Sauve-la maintenant !" ⏳🔥`,
    },
    level_up: {
      title: "🌟 NIVEAU SUPÉRIEUR !",
      body: (level: number) => `Penny : "Évolution au Niveau ${level} ! Tes stats ont reçu un boost permanent !" 👑🚀`,
    },
  },
};

export function getLocale(): NotificationLocale {
  if (typeof navigator !== "undefined") {
    const lang = navigator.language || "";
    if (lang.toLowerCase().startsWith("fr")) {
      return "fr";
    }
  }
  return "en"; // default to US Gen Z English
}

/**
 * Triggers a native system notification (using Service Worker for iOS PWA compatibility)
 */
export async function triggerLocalNotification(
  type: keyof typeof GENZ_MESSAGES.en,
  locale: NotificationLocale,
  dynamicValue: string | number,
  additionalUrl: string = "/dashboard",
  optionalXp?: number
) {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return;
  }

  if (Notification.permission !== "granted") {
    console.warn("[Local Notification] Permission not granted");
    return;
  }

  const messages = GENZ_MESSAGES[locale] || GENZ_MESSAGES.en;
  const config = messages[type];
  if (!config) return;

  let bodyText = "";
  if (type === "quest_started") {
    bodyText = (config.body as (n: string) => string)(String(dynamicValue));
  } else if (type === "quest_completed") {
    bodyText = (config.body as (n: string, x: number) => string)(String(dynamicValue), optionalXp || 100);
  } else if (type === "boss_damage") {
    bodyText = (config.body as (n: number) => string)(Number(dynamicValue));
  } else if (type === "boss_defeated") {
    bodyText = (config.body as (n: string) => string)(String(dynamicValue));
  } else if (type === "streak_alert") {
    bodyText = (config.body as (n: number) => string)(Number(dynamicValue));
  } else if (type === "encouragement") {
    bodyText = (config.body as (n: string) => string)(String(dynamicValue));
  } else if (type === "warning_spending") {
    bodyText = (config.body as (n: string) => string)(String(dynamicValue));
  } else if (type === "streak_warning") {
    bodyText = (config.body as (n: number) => string)(Number(dynamicValue));
  } else if (type === "level_up") {
    bodyText = (config.body as (n: number) => string)(Number(dynamicValue));
  }

  const notificationTitle = config.title;
  const notificationOptions: NotificationOptions = {
    body: bodyText,
    icon: "/logo-purple.svg",
    badge: "/logo-purple.svg",
    tag: type, // Prevent duplicate alerts
    data: { url: additionalUrl },
  };

  try {
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(notificationTitle, notificationOptions);
    } else {
      new Notification(notificationTitle, notificationOptions);
    }
  } catch (err) {
    console.error("[Local Notification] Failed to trigger:", err);
  }
}
