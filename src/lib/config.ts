import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const optionalUrl = z.preprocess(emptyToUndefined, z.string().url().optional());
const optionalHubspotRegion = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/)
    .optional(),
);
const optionalHubspotPortalId = z.preprocess(
  emptyToUndefined,
  z.string().trim().regex(/^\d+$/).optional(),
);
const optionalHubspotFormId = z.preprocess(
  emptyToUndefined,
  z.string().trim().uuid().optional(),
);

const environmentSchema = z.object({
  SITE_ENVIRONMENT: z.enum(["development", "staging", "production"]).optional(),
  NEXT_PUBLIC_LINKEDIN_URL: optionalUrl,
  HUBSPOT_STAGING_REGION: optionalHubspotRegion,
  HUBSPOT_STAGING_PORTAL_ID: optionalHubspotPortalId,
  HUBSPOT_STAGING_FORM_ID: optionalHubspotFormId,
  HUBSPOT_PRODUCTION_REGION: optionalHubspotRegion,
  HUBSPOT_PRODUCTION_PORTAL_ID: optionalHubspotPortalId,
  HUBSPOT_PRODUCTION_FORM_ID: optionalHubspotFormId,
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

type HubspotFormConfig = {
  formId: string;
  portalId: string;
  region: string;
};

function resolveHubspotForm(
  label: "STAGING" | "PRODUCTION",
  values: {
    formId?: string;
    portalId?: string;
    region?: string;
  },
): HubspotFormConfig | null {
  const suppliedValues = [values.region, values.portalId, values.formId];
  const hasCompleteForm = suppliedValues.every(Boolean);
  const hasPartialForm = suppliedValues.some(Boolean) && !hasCompleteForm;

  if (hasPartialForm) {
    throw new Error(
      `HUBSPOT_${label}_REGION, HUBSPOT_${label}_PORTAL_ID, and HUBSPOT_${label}_FORM_ID must be provided together.`,
    );
  }

  return hasCompleteForm
    ? {
        formId: values.formId!,
        portalId: values.portalId!,
        region: values.region!,
      }
    : null;
}

const stagingForm = resolveHubspotForm("STAGING", {
  formId: environment.HUBSPOT_STAGING_FORM_ID,
  portalId: environment.HUBSPOT_STAGING_PORTAL_ID,
  region: environment.HUBSPOT_STAGING_REGION,
});
const productionForm = resolveHubspotForm("PRODUCTION", {
  formId: environment.HUBSPOT_PRODUCTION_FORM_ID,
  portalId: environment.HUBSPOT_PRODUCTION_PORTAL_ID,
  region: environment.HUBSPOT_PRODUCTION_REGION,
});

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
