export const analyticsConsentStorageKey = "company42.analyticsConsent.v1";
export const analyticsPreferencesEventName =
  "company42:open-analytics-preferences";
export const analyticsConsentChangedEventName =
  "company42:analytics-consent-changed";
export const googleTagScriptId = "company42-google-analytics";

export type AnalyticsConsent = "denied" | "granted";

const productionAnalyticsHosts = new Set(["company42.co", "www.company42.co"]);

export function isAllowedAnalyticsHostname(hostname: string): boolean {
  return productionAnalyticsHosts.has(
    hostname.trim().toLowerCase().replace(/\.$/u, ""),
  );
}

export function createSafePageLocation(
  origin: string,
  pathname: string,
): string {
  return new URL(pathname, origin).toString();
}

export function createSafePageReferrer(referrer: string): string {
  if (!referrer) return "";

  try {
    const url = new URL(referrer);
    return createSafePageLocation(url.origin, url.pathname);
  } catch {
    return "";
  }
}
