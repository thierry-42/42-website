import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const mobileViewports = [
  { height: 568, width: 320 },
  { height: 667, width: 375 },
  { height: 844, width: 390 },
  { height: 932, width: 430 },
] as const;

async function expectNoDocumentOverflow(page: Page) {
  const geometry = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 1);
}

test("homepage selector and expertise accordion expose accessible state", async ({
  page,
}) => {
  await page.goto("/");

  const stage = page.getByTestId("home-service-stage");
  const heroTabs = stage.getByRole("tab");
  await expect(heroTabs).toHaveCount(8);
  await expect(heroTabs.first()).toHaveAttribute("aria-selected", "true");
  await heroTabs.first().press("ArrowRight");
  await expect(heroTabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(
    stage.getByRole("heading", { name: "Implementation and onboarding" }),
  ).toBeVisible();

  const expertise = page.getByTestId("home-expertise");
  const expertiseTabs = expertise.getByRole("button");
  await expect(expertiseTabs).toHaveCount(8);
  await expertiseTabs.first().press("End");
  await expect(expertiseTabs.last()).toHaveAttribute("aria-expanded", "true");
  await expertiseTabs.last().press("ArrowLeft");
  await expect(expertiseTabs.nth(6)).toHaveAttribute("aria-expanded", "true");
  await expect(
    expertise.getByRole("heading", {
      name: "Service Hub and customer experience",
    }),
  ).toBeVisible();
  await expect(expertise.getByRole("region")).toHaveCount(1);
});

test("homepage contains one coherent semantic redesign", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Your HubSpot Answer" }),
  ).toHaveCount(1);
  await expect(
    page.getByRole("heading", {
      name: "Expertise for the full HubSpot system.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "From question to working answer." }),
  ).toHaveCount(1);
  await expect(
    page.getByTestId("home-how-we-work").getByRole("listitem"),
  ).toHaveCount(4);
  await expect(
    page.getByTestId("home-engagement-showcase").getByRole("article"),
  ).toHaveCount(4);
  await expect(
    page.getByTestId("home-latest-insights").getByRole("article"),
  ).toHaveCount(3);
  await expect(page.getByText("Connected capability")).toHaveCount(0);
  await expect(page.locator('a[href^="/work"]')).toHaveCount(0);
});

for (const viewport of mobileViewports) {
  test(`homepage redesign reflows at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");

    await expectNoDocumentOverflow(page);
    await expect(page.getByTestId("home-service-stage")).toBeVisible();

    const expertise = page.getByTestId("home-expertise");
    const crmTab = expertise.getByRole("button", { name: /CRM and RevOps/ });
    await crmTab.click();
    await expect(crmTab).toHaveAttribute("aria-expanded", "true");
    await expect(expertise.getByRole("region")).toHaveCount(1);

    const processItems = page
      .getByTestId("home-how-we-work")
      .getByRole("listitem");
    await expect(processItems).toHaveCount(4);
    expect(
      await processItems.evaluateAll((items) =>
        items.every((item) => item.getBoundingClientRect().height > 300),
      ),
    ).toBe(true);

    await expectNoDocumentOverflow(page);
  });
}

test("homepage interactions respect reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const stage = page.getByTestId("home-service-stage");
  const images = stage.locator("img");
  expect(
    await images
      .first()
      .evaluate((element) =>
        Number.parseFloat(getComputedStyle(element).transitionDuration),
      ),
  ).toBeLessThanOrEqual(0.00001);

  const expertise = page.getByTestId("home-expertise");
  const crmTab = expertise.getByRole("button", { name: /CRM and RevOps/ });
  await crmTab.click();
  await expect(crmTab).toHaveAttribute("aria-expanded", "true");
  expect(
    await page
      .getByTestId("expertise-service-crm-revops")
      .evaluate((element) =>
        Number.parseFloat(getComputedStyle(element).transitionDuration),
      ),
  ).toBeLessThanOrEqual(0.00001);
});

test("homepage redesign remains compatible with visual preferences", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open visual preferences" });
  test.skip(
    (await trigger.count()) === 0,
    "Visual preferences are environment gated",
  );
  await trigger.click();

  for (const option of [
    "Light",
    "Dark",
    "Protan support",
    "Deutan support",
    "Tritan support",
    "Monochrome",
    "High contrast",
  ]) {
    await page.getByRole("radio", { name: option }).check();
    await expect(page.getByTestId("home-service-stage")).toBeVisible();
    await expect(page.getByTestId("home-expertise")).toBeVisible();
  }
});

test("homepage redesign has no serious accessibility violations", async ({
  page,
}) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .include("main")
    .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
    .analyze();
  const seriousViolations = results.violations.filter(
    ({ impact }) => impact === "serious" || impact === "critical",
  );

  expect(seriousViolations).toEqual([]);
});
