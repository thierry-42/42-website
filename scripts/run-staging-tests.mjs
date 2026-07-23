process.env.SITE_ENVIRONMENT = "staging";
process.env.HUBSPOT_STAGING_REGION = "eu1";
process.env.HUBSPOT_STAGING_PORTAL_ID = "148811132";
process.env.HUBSPOT_STAGING_FORM_ID = "da5e2637-3fc8-4ab0-96b1-4764ecd0f16e";

process.argv.push("--grep", "HubSpot form");

await import("./run-tests.mjs");
