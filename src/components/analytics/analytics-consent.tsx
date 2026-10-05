"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import {
  analyticsConsentChangedEventName,
  analyticsConsentStorageKey,
  analyticsPreferencesEventName,
  createSafePageLocation,
  createSafePageReferrer,
  createValidatedCampaignParameters,
  googleTagScriptId,
  isAllowedAnalyticsHostname,
  type AnalyticsConsent,
  type ValidatedCampaignParameters,
} from "@/lib/analytics";

declare global {
  interface Window {
    dataLayer?: (IArguments | unknown[])[];
    gtag?: (...args: unknown[]) => void;
  }
}

const deniedConsent = {
  ad_personalization: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  analytics_storage: "denied",
} as const;

const grantedAnalyticsConsent = {
  ...deniedConsent,
  analytics_storage: "granted",
} as const;

let inMemoryConsent: AnalyticsConsent | null = null;

function readStoredConsent(): AnalyticsConsent | null {
  try {
    const storedConsent = window.localStorage.getItem(
      analyticsConsentStorageKey,
    );

    if (storedConsent === "denied" || storedConsent === "granted") {
      inMemoryConsent = storedConsent;
      return storedConsent;
    }

    if (storedConsent !== null) {
      window.localStorage.removeItem(analyticsConsentStorageKey);
    }

    inMemoryConsent = null;
    return null;
  } catch {
    // Fall back to the in-memory choice when browser storage is unavailable.
  }

  return inMemoryConsent;
}

function storeConsent(consent: AnalyticsConsent) {
  inMemoryConsent = consent;

  try {
    window.localStorage.setItem(analyticsConsentStorageKey, consent);
  } catch {
    // The current page still honours the choice when browser storage is blocked.
  }

  window.dispatchEvent(new Event(analyticsConsentChangedEventName));
}

function ensureGoogleTagQueue() {
  window.dataLayer ??= [];
  window.gtag ??= function gtag() {
    // gtag.js requires the function's Arguments object, not a rest-parameter Array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };

  return window.gtag;
}

function loadGoogleAnalytics(
  measurementId: string,
  campaignParameters: ValidatedCampaignParameters,
) {
  if (
    !isAllowedAnalyticsHostname(window.location.hostname) ||
    document.getElementById(googleTagScriptId)
  ) {
    return;
  }

  const gtag = ensureGoogleTagQueue();
  gtag("consent", "default", deniedConsent);
  gtag("consent", "update", grantedAnalyticsConsent);
  gtag("js", new Date());
  gtag("config", measurementId, {
    allow_ad_personalization_signals: false,
    allow_google_signals: false,
    ...campaignParameters,
    page_location: createSafePageLocation(
      window.location.origin,
      window.location.pathname,
    ),
    page_path: window.location.pathname,
    page_referrer: createSafePageReferrer(document.referrer),
  });

  const script = document.createElement("script");
  script.async = true;
  script.id = googleTagScriptId;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
}

function removeGoogleAnalyticsCookies() {
  const cookieNames = document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0]?.trim())
    .filter((name): name is string => Boolean(name?.startsWith("_ga")));
  const domainAttributes = [
    "",
    "; Domain=company42.co",
    "; Domain=.company42.co",
  ];

  for (const name of cookieNames) {
    for (const domain of domainAttributes) {
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain}`;
    }
  }
}

function disableGoogleAnalytics(measurementId: string) {
  const windowRecord = window as unknown as Record<string, unknown>;
  windowRecord[`ga-disable-${measurementId}`] = true;
  window.gtag?.("consent", "update", deniedConsent);
  removeGoogleAnalyticsCookies();
}

export function AnalyticsConsentManager({
  measurementId,
}: {
  measurementId: string;
}) {
  const panelRef = useRef<HTMLElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const landingCampaignParametersRef =
    useRef<ValidatedCampaignParameters | null>(null);
  const [preferencesAreOpen, setPreferencesAreOpen] = useState(false);
  const hostIsAllowed = useSyncExternalStore(
    subscribeToStaticHostname,
    getBrowserHostEligibility,
    getServerHostEligibility,
  );
  const consentSnapshot = useSyncExternalStore(
    subscribeToConsent,
    getBrowserConsentSnapshot,
    getServerConsentSnapshot,
  );
  const consent =
    consentSnapshot === "denied" || consentSnapshot === "granted"
      ? consentSnapshot
      : null;
  const isOpen =
    hostIsAllowed && (consentSnapshot === "unset" || preferencesAreOpen);

  useEffect(() => {
    if (!hostIsAllowed) return;

    landingCampaignParametersRef.current ??= createValidatedCampaignParameters(
      window.location.search,
    );

    if (consent === "granted") {
      loadGoogleAnalytics(measurementId, landingCampaignParametersRef.current);
    }
  }, [consent, hostIsAllowed, measurementId]);

  useEffect(() => {
    const openPreferences = () => {
      returnFocusRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      setPreferencesAreOpen(true);
    };
    window.addEventListener(analyticsPreferencesEventName, openPreferences);

    return () =>
      window.removeEventListener(
        analyticsPreferencesEventName,
        openPreferences,
      );
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    panelRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
  }, [isOpen]);

  function allowAnalytics() {
    landingCampaignParametersRef.current ??= createValidatedCampaignParameters(
      window.location.search,
    );
    storeConsent("granted");
    closePreferences();
    loadGoogleAnalytics(measurementId, landingCampaignParametersRef.current);
  }

  function declineAnalytics() {
    const isWithdrawal = consent === "granted";
    storeConsent("denied");
    closePreferences();

    if (isWithdrawal) {
      disableGoogleAnalytics(measurementId);
      window.location.reload();
    }
  }

  function closePreferences() {
    setPreferencesAreOpen(false);
    window.requestAnimationFrame(() => returnFocusRef.current?.focus());
  }

  if (!hostIsAllowed || !isOpen) return null;

  const hasExistingChoice = consent !== null;

  return (
    <section
      aria-labelledby="analytics-consent-title"
      className="fixed inset-x-3 bottom-3 z-[90] mx-auto max-w-3xl rounded-lg border border-white/18 bg-ink-950 p-5 text-paper-50 shadow-[0_1.5rem_5rem_rgb(9_11_16/0.3)] sm:inset-x-6 sm:bottom-6 sm:p-6"
      data-testid="analytics-consent"
      onKeyDown={(event) => {
        if (event.key === "Escape" && hasExistingChoice) {
          closePreferences();
        }
      }}
      ref={panelRef}
      role={hasExistingChoice ? "dialog" : "region"}
    >
      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div>
          <p className="font-mono text-[0.6875rem] tracking-[0.12em] text-signal-400 uppercase">
            Privacy choice
          </p>
          <h2
            className="mt-2 text-2xl leading-tight font-semibold tracking-[-0.035em]"
            id="analytics-consent-title"
          >
            Optional website analytics
          </h2>
          <p className="mt-3 max-w-[62ch] text-sm leading-6 text-paper-50/72">
            With your permission, 42 uses Google Analytics 4 to understand how
            the website is used. Analytics stays off until you allow it.
            Advertising consent remains denied.
          </p>
          <Link
            className="mt-3 inline-block border-b border-current/35 py-1 text-sm font-semibold hover:border-current"
            href="/privacy"
          >
            Read the Privacy Policy
          </Link>
        </div>

        <div className="flex flex-col gap-2 sm:min-w-48">
          <button
            className="hover:bg-signal-300 min-h-11 rounded-sm border border-signal-400 bg-signal-400 px-4 py-2 text-sm font-semibold text-signal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-400"
            onClick={() => {
              if (consent === "granted") closePreferences();
              else allowAnalytics();
            }}
            type="button"
          >
            {consent === "granted"
              ? "Keep analytics enabled"
              : "Allow analytics"}
          </button>
          <button
            className="min-h-11 rounded-sm border border-white/35 bg-transparent px-4 py-2 text-sm font-semibold text-paper-50 hover:border-white hover:bg-white/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            onClick={declineAnalytics}
            type="button"
          >
            {consent === "granted"
              ? "Withdraw analytics consent"
              : consent === "denied"
                ? "Keep analytics declined"
                : "Decline analytics"}
          </button>
        </div>
      </div>
    </section>
  );
}

type ConsentSnapshot = AnalyticsConsent | "unavailable" | "unset";

function subscribeToStaticHostname() {
  return () => undefined;
}

function getBrowserHostEligibility() {
  return isAllowedAnalyticsHostname(window.location.hostname);
}

function getServerHostEligibility() {
  return false;
}

function subscribeToConsent(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === analyticsConsentStorageKey) onStoreChange();
  };

  window.addEventListener(analyticsConsentChangedEventName, onStoreChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(analyticsConsentChangedEventName, onStoreChange);
    window.removeEventListener("storage", handleStorage);
  };
}

function getBrowserConsentSnapshot(): ConsentSnapshot {
  return readStoredConsent() ?? "unset";
}

function getServerConsentSnapshot(): ConsentSnapshot {
  return "unavailable";
}
