import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/",
  "/services",
  "/about",
  "/approach",
  "/insights",
  "/hubspot-review",
  "/contact",
  "/privacy",
  "/terms",
  "/insights/category/hubspot-strategy-implementation",
  "/insights/category/crm-data-revops",
  "/insights/category/integrations-development",
  "/insights/category/websites-content-hub-accessibility",
  "/services/hubspot-strategy-consulting",
  "/services/implementation-onboarding",
  "/services/crm-revops",
  "/services/automation-operations",
  "/services/integrations-custom-development",
  "/services/websites-content-hub",
  "/services/service-hub-customer-experience",
  "/services/managed-hubspot-support",
  "/insights/signs-your-hubspot-portal-needs-an-audit",
  "/insights/prepare-for-hubspot-crm-implementation",
  "/insights/before-connecting-your-website-to-hubspot",
  "/insights/why-your-crm-reports-are-not-reliable",
  "/insights/what-to-include-in-a-custom-integration-brief",
  "/insights/plan-a-website-redesign-around-crm-and-lead-capture",
  "/insights/basic-website-accessibility-checks",
  "/insights/what-managed-hubspot-support-should-include",
  "/insights/clean-up-duplicate-crm-properties",
  "/insights/hubspot-pricing-and-ai-credits-explained",
];

const prohibitedTokens = [
  String.fromCodePoint(0x2014),
  "&" + "mdash;",
  "&#" + "8212;",
  "&#x" + "2014;",
  "\\" + "u2014",
];

test("every public route renders without prohibited em-dash forms", async ({
  page,
}) => {
  await page.route("https://js-*.hsforms.net/**", async (route) => {
    await route.fulfill({
      body: "",
      contentType: "application/javascript",
      status: 200,
    });
  });

  for (const route of publicRoutes) {
    const response = await page.goto(route);
    expect(response?.ok(), `${route} should load`).toBeTruthy();

    const renderedCopy = await page.evaluate(() => {
      const metadata = Array.from(
        document.querySelectorAll(
          "meta, link, script[type='application/ld+json']",
        ),
      ).map((element) => element.outerHTML);
      const attributes = Array.from(document.querySelectorAll("*")).flatMap(
        (element) =>
          Array.from(element.attributes).map(
            (attribute) => `${attribute.name}=${attribute.value}`,
          ),
      );

      return JSON.stringify({
        accessibilityAndAttributes: attributes,
        body: document.body.innerText,
        metadata,
        title: document.title,
      });
    });

    for (const token of prohibitedTokens) {
      expect(
        renderedCopy.toLowerCase(),
        `${route} should not render ${JSON.stringify(token)}`,
      ).not.toContain(token.toLowerCase());
    }
  }
});
