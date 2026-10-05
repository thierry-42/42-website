export const analyticsConsentStorageKey = "company42.analyticsConsent.v1";
export const analyticsPreferencesEventName =
  "company42:open-analytics-preferences";
export const analyticsConsentChangedEventName =
  "company42:analytics-consent-changed";
export const googleTagScriptId = "company42-google-analytics";

export type AnalyticsConsent = "denied" | "granted";
export type ValidatedCampaignParameters = Partial<{
  campaign_medium: string;
  campaign_name: string;
  campaign_source: string;
}>;

const productionAnalyticsHosts = new Set(["company42.co", "www.company42.co"]);
const campaignParameterMap = [
  ["utm_source", "campaign_source"],
  ["utm_medium", "campaign_medium"],
  ["utm_campaign", "campaign_name"],
] as const;
const campaignTokenPattern = /^[A-Za-z0-9][A-Za-z0-9._~-]{0,99}$/u;
const campaignTokenSeparatorsPattern = /[._~-]/gu;

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

export function createValidatedCampaignParameters(
  search: string,
): ValidatedCampaignParameters {
  const searchParameters = new URLSearchParams(search);
  const campaignParameters: ValidatedCampaignParameters = {};

  for (const [queryName, campaignName] of campaignParameterMap) {
    const values = searchParameters.getAll(queryName);

    if (values.length !== 1) continue;

    const value = values[0]?.trim();

    if (!value || !campaignTokenPattern.test(value)) continue;

    const tokenWithoutSeparators = value.replace(
      campaignTokenSeparatorsPattern,
      "",
    );

    // Reject phone-shaped values while allowing campaign tokens such as 42_launch.
    if (/^\d{7,}$/u.test(tokenWithoutSeparators)) continue;

    campaignParameters[campaignName] = value;
  }

  return campaignParameters;
}
