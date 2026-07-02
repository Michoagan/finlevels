/**
 * Utility to load and execute Google reCAPTCHA v3 on the client side.
 */
export async function executeRecaptcha(action: string): Promise<string> {
  if (typeof window === "undefined") {
    return "";
  }

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey) {
    console.warn("reCAPTCHA site key (NEXT_PUBLIC_RECAPTCHA_SITE_KEY) is not configured.");
    return "";
  }

interface Grecaptcha {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
}

  // Get the global grecaptcha object if it exists
  const getGrecaptcha = (): Grecaptcha | undefined => {
    return (window as unknown as { grecaptcha?: Grecaptcha }).grecaptcha;
  };

  // Helper to ensure the reCAPTCHA script is loaded
  const loadScript = (): Promise<void> => {
    return new Promise<void>((resolve) => {
      if (getGrecaptcha()) {
        resolve();
        return;
      }

      // Check if the script is already added in the document
      const existingScript = document.querySelector('script[src*="recaptcha/api.js"]');
      if (existingScript) {
        // Wait until grecaptcha object is fully loaded and ready
        const interval = setInterval(() => {
          const gr = getGrecaptcha();
          if (gr && gr.ready) {
            clearInterval(interval);
            gr.ready(resolve);
          }
        }, 100);
        return;
      }

      // Append script tag dynamically
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        const checkReady = () => {
          const gr = getGrecaptcha();
          if (gr && gr.ready) {
            gr.ready(resolve);
          } else {
            setTimeout(checkReady, 50);
          }
        };
        checkReady();
      };
      script.onerror = () => {
        console.error("Failed to load reCAPTCHA script.");
        resolve(); // resolve anyway to avoid hanging UI
      };
      document.head.appendChild(script);
    });
  };

  try {
    await loadScript();
    const grecaptcha = getGrecaptcha();
    if (!grecaptcha || typeof grecaptcha.execute !== "function") {
      console.warn("reCAPTCHA is not loaded or loaded incorrectly.");
      return "";
    }

    return new Promise<string>((resolve) => {
      grecaptcha.ready(async () => {
        try {
          const token = await grecaptcha.execute(siteKey, { action });
          resolve(token);
        } catch (err) {
          console.error("reCAPTCHA execution error:", err);
          resolve("");
        }
      });
    });
  } catch (error) {
    console.error("Error during reCAPTCHA verification setup:", error);
    return "";
  }
}
