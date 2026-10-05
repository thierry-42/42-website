"use client";

import { useSyncExternalStore } from "react";

import {
  analyticsPreferencesEventName,
  isAllowedAnalyticsHostname,
} from "@/lib/analytics";

export function AnalyticsSettingsButton() {
  const hostIsAllowed = useSyncExternalStore(
    subscribeToStaticHostname,
    getBrowserHostEligibility,
    getServerHostEligibility,
  );

  if (!hostIsAllowed) return null;

  return (
    <li>
      <button
        className="inline-block max-w-full cursor-pointer py-1 text-left text-sm text-pretty [overflow-wrap:anywhere] text-[var(--colour-text-inverse-muted)] hover:text-[var(--colour-text-inverse)]"
        onClick={() =>
          window.dispatchEvent(new Event(analyticsPreferencesEventName))
        }
        type="button"
      >
        Cookie preferences
      </button>
    </li>
  );
}

function subscribeToStaticHostname() {
  return () => undefined;
}

function getBrowserHostEligibility() {
  return isAllowedAnalyticsHostname(window.location.hostname);
}

function getServerHostEligibility() {
  return false;
}
