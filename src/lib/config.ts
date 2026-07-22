import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const optionalUrl = z.preprocess(emptyToUndefined, z.string().url().optional());
const optionalEmail = z.preprocess(
  emptyToUndefined,
  z.string().email().optional(),
);
const optionalString = z.preprocess(
  emptyToUndefined,
  z.string().trim().optional(),
);

const publicEnvironmentSchema = z.object({
  NEXT_PUBLIC_SITE_URL: optionalUrl,
  NEXT_PUBLIC_BOOKING_URL: optionalUrl,
  NEXT_PUBLIC_CONTACT_EMAIL: optionalEmail,
  NEXT_PUBLIC_LINKEDIN_URL: optionalUrl,
  NEXT_PUBLIC_CONTACT_FORM_ENDPOINT: optionalUrl,
  NEXT_PUBLIC_HUBSPOT_PORTAL_ID: optionalString,
  NEXT_PUBLIC_HUBSPOT_FORM_ID: optionalString,
  NEXT_PUBLIC_GA_MEASUREMENT_ID: optionalString,
});

const parsedEnvironment = publicEnvironmentSchema.safeParse(process.env);

if (!parsedEnvironment.success) {
  throw new Error(
    `Invalid public environment configuration: ${z.prettifyError(parsedEnvironment.error)}`,
  );
}

const environment = parsedEnvironment.data;

export const siteConfig = {
  siteUrl: environment.NEXT_PUBLIC_SITE_URL,
  bookingUrl: environment.NEXT_PUBLIC_BOOKING_URL,
  contactEmail: environment.NEXT_PUBLIC_CONTACT_EMAIL,
  linkedinUrl: environment.NEXT_PUBLIC_LINKEDIN_URL,
  contactFormEndpoint: environment.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT,
  hubspotPortalId: environment.NEXT_PUBLIC_HUBSPOT_PORTAL_ID,
  hubspotFormId: environment.NEXT_PUBLIC_HUBSPOT_FORM_ID,
  gaMeasurementId: environment.NEXT_PUBLIC_GA_MEASUREMENT_ID,
} as const;

export const localSiteOrigin = "http://localhost:3000";

export function getSiteOrigin(): string {
  return siteConfig.siteUrl ?? localSiteOrigin;
}
