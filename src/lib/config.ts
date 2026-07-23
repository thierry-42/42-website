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

const optionalHubspotRegion = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/)
    .optional(),
);

const approvedHubspotForm = {
  formId: "da5e2637-3fc8-4ab0-96b1-4764ecd0f16e",
  portalId: "148811132",
  region: "eu1",
} as const;

const publicEnvironmentSchema = z.object({
  NEXT_PUBLIC_SITE_URL: optionalUrl,
  NEXT_PUBLIC_BOOKING_URL: optionalUrl,
  NEXT_PUBLIC_CONTACT_EMAIL: optionalEmail,
  NEXT_PUBLIC_LINKEDIN_URL: optionalUrl,
  NEXT_PUBLIC_HUBSPOT_REGION: optionalHubspotRegion,
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
  hubspotRegion:
    environment.NEXT_PUBLIC_HUBSPOT_REGION ?? approvedHubspotForm.region,
  hubspotPortalId:
    environment.NEXT_PUBLIC_HUBSPOT_PORTAL_ID ?? approvedHubspotForm.portalId,
  hubspotFormId:
    environment.NEXT_PUBLIC_HUBSPOT_FORM_ID ?? approvedHubspotForm.formId,
  gaMeasurementId: environment.NEXT_PUBLIC_GA_MEASUREMENT_ID,
} as const;

export const localSiteOrigin = "http://localhost:3000";

export function getSiteOrigin(): string {
  return siteConfig.siteUrl ?? localSiteOrigin;
}
