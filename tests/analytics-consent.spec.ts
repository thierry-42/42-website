import { expect, test, type Page } from "@playwright/test";

import {
  analyticsConsentStorageKey,
  isAllowedAnalyticsHostname,
} from "../src/lib/analytics";

const measurementId = "G-FD2J9VL4D5";
const productionOrigin = "https://company42.co";

async function proxyProductionOrigin(page: Page) {
  const localOrigin =
    process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3100";

  await page.route(`${productionOrigin}/**`, async (route) => {
    const request = route.request();
    const productionUrl = new URL(request.url());
    const localUrl = new URL(
      `${productionUrl.pathname}${productionUrl.search}`,
      localOrigin,
    );
    const headers = { ...request.headers() };
    delete headers.host;

    const response = await page.request.fetch(localUrl.toString(), {
      data: request.postDataBuffer() ?? undefined,
      failOnStatusCode: false,
      headers,
      method: request.method(),
    });

    await route.fulfill({ response });
  });
}

test("analytics host allowlist excludes non-production hosts", () => {
  expect(isAllowedAnalyticsHostname("company42.co")).toBe(true);
  expect(isAllowedAnalyticsHostname("www.company42.co")).toBe(true);
  expect(isAllowedAnalyticsHostname("COMPANY42.CO.")).toBe(true);

  for (const hostname of [
    "localhost",
    "127.0.0.1",
    "four2-website-testing.onrender.com",
    "company42-production.onrender.com",
    "preview.company42.co",
    "company42.co.example.com",
  ]) {
    expect(isAllowedAnalyticsHostname(hostname), hostname).toBe(false);
  }
});

test("Google tag stays blocked before consent and after rejection", async ({
  page,
}) => {
  await proxyProductionOrigin(page);
  const googleRequests: string[] = [];
  page.on("request", (request) => {
    if (/google-analytics|googletagmanager/u.test(request.url())) {
      googleRequests.push(request.url());
    }
  });

  await page.goto(productionOrigin);
  const consentPanel = page.getByTestId("analytics-consent");
  await expect(consentPanel).toBeVisible();
  const panelBounds = await consentPanel.boundingBox();
  const viewport = page.viewportSize();
  expect(panelBounds).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(panelBounds!.x).toBeGreaterThanOrEqual(0);
  expect(panelBounds!.x + panelBounds!.width).toBeLessThanOrEqual(
    viewport!.width,
  );
  expect(panelBounds!.y + panelBounds!.height).toBeLessThanOrEqual(
    viewport!.height,
  );
  expect(googleRequests).toEqual([]);
  await expect(
    page.locator(`script[src*="googletagmanager.com/gtag/js"]`),
  ).toHaveCount(0);

  await page.getByRole("button", { name: "Decline analytics" }).click();
  await expect(page.getByTestId("analytics-consent")).toHaveCount(0);
  expect(
    await page.evaluate(
      (key) => window.localStorage.getItem(key),
      analyticsConsentStorageKey,
    ),
  ).toBe("denied");

  await page.reload();
  await expect(page.getByTestId("analytics-consent")).toHaveCount(0);
  const preferencesButton = page.getByRole("button", {
    name: "Cookie preferences",
  });
  await expect(preferencesButton).toBeVisible();
  await preferencesButton.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Allow analytics" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(googleRequests).toEqual([]);
});

test("consent loads GA4 once with advertising denied and supports withdrawal", async ({
  page,
}) => {
  await proxyProductionOrigin(page);
  let googleTagRequests = 0;

  await page.route(
    "https://www.googletagmanager.com/gtag/js**",
    async (route) => {
      googleTagRequests += 1;
      await route.fulfill({
        body: "window.__company42GoogleTagMockLoaded = true;",
        contentType: "application/javascript",
        status: 200,
      });
    },
  );

  await page.goto(`${productionOrigin}/?email=not-sent-to-analytics#private`);
  await page.getByRole("button", { name: "Allow analytics" }).click();
  await expect.poll(() => googleTagRequests).toBe(1);

  const commands = await page.evaluate(() => window.dataLayer ?? []);
  const defaultConsent = commands.find(
    (command) => command[0] === "consent" && command[1] === "default",
  );
  const consentUpdate = commands.find(
    (command) => command[0] === "consent" && command[1] === "update",
  );
  const configCommands = commands.filter((command) => command[0] === "config");
  const manualPageViews = commands.filter(
    (command) => command[0] === "event" && command[1] === "page_view",
  );

  expect(defaultConsent?.[2]).toEqual({
    ad_personalization: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    analytics_storage: "denied",
  });
  expect(consentUpdate?.[2]).toEqual({
    ad_personalization: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    analytics_storage: "granted",
  });
  expect(configCommands).toHaveLength(1);
  expect(configCommands[0]?.[1]).toBe(measurementId);
  expect(configCommands[0]?.[2]).toMatchObject({
    allow_ad_personalization_signals: false,
    allow_google_signals: false,
    page_location: `${productionOrigin}/`,
    page_path: "/",
    page_referrer: "",
  });
  expect(JSON.stringify(configCommands)).not.toContain("not-sent-to-analytics");
  expect(manualPageViews).toHaveLength(0);

  await page
    .getByRole("link", { exact: true, name: "Services" })
    .first()
    .click();
  await expect(page).toHaveURL(`${productionOrigin}/services`);
  const commandsAfterNavigation = await page.evaluate(
    () => window.dataLayer ?? [],
  );
  expect(
    commandsAfterNavigation.filter((command) => command[0] === "config"),
  ).toHaveLength(1);
  expect(
    commandsAfterNavigation.filter(
      (command) => command[0] === "event" && command[1] === "page_view",
    ),
  ).toHaveLength(0);

  await page.evaluate(() => {
    document.cookie = "_ga=consent-test; Path=/; SameSite=Lax";
  });
  await page.getByRole("button", { name: "Cookie preferences" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("button", { name: "Withdraw analytics consent" })
    .click();
  await page.waitForLoadState("domcontentloaded");

  expect(
    await page.evaluate(
      (key) => window.localStorage.getItem(key),
      analyticsConsentStorageKey,
    ),
  ).toBe("denied");
  expect(
    (await page.context().cookies()).some((cookie) => cookie.name === "_ga"),
  ).toBe(false);
  expect(googleTagRequests).toBe(1);
  await expect(
    page.locator(`script[src*="googletagmanager.com/gtag/js"]`),
  ).toHaveCount(0);
});

test("analytics controls stay absent on disallowed hosts", async ({ page }) => {
  const googleRequests: string[] = [];
  page.on("request", (request) => {
    if (/google-analytics|googletagmanager/u.test(request.url())) {
      googleRequests.push(request.url());
    }
  });

  await page.goto("/");
  await expect(page.getByTestId("analytics-consent")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Cookie preferences" }),
  ).toHaveCount(0);
  expect(googleRequests).toEqual([]);
});

test("Privacy Policy describes consent-gated analytics", async ({ page }) => {
  await page.goto("/privacy");
  await expect(
    page.getByText(
      /Google tag is not loaded and no Google Analytics request/iu,
    ),
  ).toBeVisible();
  await expect(
    page.getByText(
      /Advertising storage, user-data, and personalisation consent remain denied/iu,
    ),
  ).toBeVisible();
  await expect(page.getByText(/No cookie banner is active/iu)).toHaveCount(0);
  await expect(
    page.getByText(/No Google Analytics, Google Tag Manager/iu),
  ).toHaveCount(0);
});
