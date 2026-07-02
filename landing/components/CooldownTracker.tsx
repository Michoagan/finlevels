"use client";

import { useEffect } from "react";
import { trackEvent } from "../lib/analytics";

type CooldownTrackerProps = {
  day: number;
  path: string;
};

export default function CooldownTracker({ day, path }: CooldownTrackerProps) {
  useEffect(() => {
    trackEvent("cooldown_hit", { day, path });
  }, [day, path]);

  return null;
}
