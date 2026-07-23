import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const optionalString = z.preprocess(
  emptyToUndefined,
  z.string().trim().optional(),
);
const optionalUrl = z.preprocess(emptyToUndefined, z.string().url().optional());
const optionalHubspotRegion = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/)
    .optional(),
);

const productionHubspotForm = {
  formId: "da5e2637-3fc8-4ab0-96b1-4764ecd0f16e",
  portalId: "148811132",
  region: "eu1",
} as const;

const environmentSchema = z.object({
  SITE_ENVIRONMENT: z.enum(["development", "staging", "production"]).optional(),
  NEXT_PUBLIC_LINKEDIN_URL: optionalUrl,
  NEXT_PUBLIC_HUBSPOT_REGION: optionalHubspotRegion,
  NEXT_PUBLIC_HUBSPOT_PORTAL_ID: optionalString,
  NEXT_PUBLIC_HUBSPOT_FORM_ID: optionalString,
  HUBSPOT_STAGING_REGION: optionalHubspotRegion,
  HUBSPOT_STAGING_PORTAL_ID: optionalString,
  HUBSPOT_STAGING_FORM_ID: optionalString,
});

const parsedEnvironment = environmentSchema.safeParse(process.env);

if (!parsedEnvironment.success) {
  throw new Error(
    `Invalid environment configuration: ${z.prettifyError(parsedEnvironment.error)}`,
  );
}

const environment = parsedEnvironment.data;
const deploymentEnvironment =
  environment.SITE_ENVIRONMENT ??
  (process.env.NODE_ENV === "development" ? "development" : "staging");

const productionForm = {
  formId:
    environment.NEXT_PUBLIC_HUBSPOT_FORM_ID ?? productionHubspotForm.formId,
  portalId:
    environment.NEXT_PUBLIC_HUBSPOT_PORTAL_ID ?? productionHubspotForm.portalId,
  region:
    environment.NEXT_PUBLIC_HUBSPOT_REGION ?? productionHubspotForm.region,
};

const stagingFormValues = [
  environment.HUBSPOT_STAGING_REGION,
  environment.HUBSPOT_STAGING_PORTAL_ID,
  environment.HUBSPOT_STAGING_FORM_ID,
];
const hasCompleteStagingForm = stagingFormValues.every(Boolean);
const hasPartialStagingForm =
  stagingFormValues.some(Boolean) && !hasCompleteStagingForm;

if (hasPartialStagingForm) {
  throw new Error(
    "HUBSPOT_STAGING_REGION, HUBSPOT_STAGING_PORTAL_ID, and HUBSPOT_STAGING_FORM_ID must be provided together.",
  );
}

const stagingForm = hasCompleteStagingForm
  ? {
      formId: environment.HUBSPOT_STAGING_FORM_ID!,
      portalId: environment.HUBSPOT_STAGING_PORTAL_ID!,
      region: environment.HUBSPOT_STAGING_REGION!,
    }
  : null;

export const siteConfig = {
  siteUrl: "https://company42.co",
  bookingUrl: null,
  contactEmail: "hello@company42.co",
  linkedinUrl: environment.NEXT_PUBLIC_LINKEDIN_URL,
  deploymentEnvironment,
  hubspotForm:
    deploymentEnvironment === "production" ? productionForm : stagingForm,
  usesDevelopmentPortraits: deploymentEnvironment !== "production",
} as const;

export const localSiteOrigin = "http://localhost:3000";

export function getSiteOrigin(): string {
  return siteConfig.siteUrl;
}
