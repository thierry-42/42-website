import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const primaryRoutes = [
  "/",
  "/services",
  "/work",
  "/about",
  "/approach",
  "/audience",
  "/industries",
  "/insights",
  "/hubspot-review",
  "/contact",
  "/privacy",
  "/terms",
];

const serviceRoutes = [
  "/services/hubspot-strategy-consulting",
  "/services/implementation-onboarding",
  "/services/crm-revops",
  "/services/automation-operations",
  "/services/integrations-custom-development",
  "/services/websites-content-hub",
  "/services/service-hub-customer-experience",
  "/services/managed-hubspot-support",
];

const insightRoutes = [
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

for (const route of primaryRoutes) {
  test(`${route} loads without browser errors`, async ({ page }) => {
    const browserErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") browserErrors.push(message.text());
    });
    page.on("pageerror", (error) => browserErrors.push(error.message));

    const response = await page.goto(route);

    expect(response?.ok()).toBeTruthy();
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(browserErrors).toEqual([]);
  });
}

for (const route of serviceRoutes) {
  test(`${route} renders the shared service template`, async ({ page }) => {
    const response = await page.goto(route);

    expect(response?.ok()).toBeTruthy();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "A focused scope, built from the right capabilities.",
      }),
    ).toBeVisible();
  });
}

for (const route of insightRoutes) {
  test(`${route} renders a complete sourced article`, async ({ page }) => {
    const response = await page.goto(route);

    expect(response?.ok()).toBeTruthy();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Article contents" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Sources and further reading" }),
    ).toBeVisible();
    await expect(
      page.locator('script[type="application/ld+json"]'),
    ).toHaveCount(1);
  });
}

test("insights index exposes every published guide", async ({ page }) => {
  await page.goto("/insights");

  for (const route of insightRoutes) {
    await expect(page.locator(`a[href="${route}"]`).first()).toBeVisible();
  }
});

test("desktop navigation exposes the Services treatment", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop project only");
  await page.goto("/");

  const servicesSummary = page.locator("header details summary");
  await servicesSummary.focus();
  await page.keyboard.press("Enter");

  await expect(page.getByTestId("services-menu")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "View all services" }),
  ).toBeVisible();

  const menuBox = await page.getByTestId("services-menu").boundingBox();
  const viewport = page.viewportSize();
  expect(menuBox).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(
    Math.abs(
      (menuBox?.x ?? 0) +
        (menuBox?.width ?? 0) / 2 -
        (viewport?.width ?? 0) / 2,
    ),
  ).toBeLessThan(2);
});

test("primary navigation exposes Approach and Industries", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  const mobile = testInfo.project.name.includes("mobile");
  if (mobile) {
    await page.getByRole("button", { name: "Open navigation" }).click();
  }
  const primaryNavigation = page.getByRole("navigation", {
    name: mobile ? "Mobile navigation" : "Primary navigation",
  });

  await expect(
    primaryNavigation.getByRole("link", { name: "Approach" }),
  ).toHaveAttribute("href", "/approach");
  await expect(
    primaryNavigation.getByRole("link", { name: "Industries" }),
  ).toHaveAttribute("href", "/industries");
});

test("Approach and Industries use the reconciled wireframe structures", async ({
  page,
}) => {
  await page.goto("/approach");
  for (const stage of ["Understand", "Architect", "Build", "Enable"]) {
    await expect(
      page.getByText(
        `Step 0${["Understand", "Architect", "Build", "Enable"].indexOf(stage) + 1} / ${stage}`,
      ),
    ).toBeVisible();
  }

  await page.goto("/industries");
  for (const industry of [
    "Manufacturing and distribution",
    "SaaS and technology",
    "Professional services",
    "Education and training",
    "Energy and technical services",
    "E-commerce and product businesses",
  ]) {
    await expect(page.getByRole("heading", { name: industry })).toBeVisible();
  }
});

test("About renders approved team records with labelled portrait placeholders", async ({
  page,
}) => {
  await page.goto("/about");

  for (const member of [
    "Thierry-Luc Denichaud",
    "Luca Codevilla",
    "Zane Smith",
    "Emma Black",
  ]) {
    await expect(page.getByRole("heading", { name: member })).toBeVisible();
  }
  await expect(page.getByText("AI portrait placeholder")).toHaveCount(4);
});

test("How 42 thinks cards reveal a pointer-local inversion", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Fine pointer only");
  await page.goto("/about");

  const card = page.getByTestId("principle-spotlight").first();
  const overlay = card.locator(".spotlight-card__overlay");
  await expect(overlay).toHaveCSS("opacity", "0");
  await card.hover({ position: { x: 80, y: 80 } });
  await expect(overlay).toHaveCSS("opacity", "1");
});

test("homepage answer field and capability explorer respond to selection", async ({
  page,
}) => {
  await page.goto("/");

  const architect = page.getByTestId("hero-mode-architect");
  await architect.click();
  await expect(architect).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByTestId("hero-answer-field").getByText("HubSpot / 02"),
  ).toBeVisible();

  const explorer = page.getByTestId("capability-explorer");
  const operations = explorer.getByRole("button", { name: /Operations/ });
  await operations.click();
  await expect(operations).toHaveAttribute("aria-pressed", "true");
  await expect(
    explorer.getByRole("heading", {
      name: "Connect customer activity to the operational processes that fulfil it.",
    }),
  ).toBeVisible();
  await expect(explorer.locator("h3")).toHaveCount(1);

  await page.goto("/services");
  const servicesExplorer = page.getByTestId("capability-explorer");
  const platformDesign = servicesExplorer.getByRole("button", {
    name: /Platform design/,
  });
  await platformDesign.click();
  await expect(platformDesign).toHaveAttribute("aria-pressed", "true");
  await expect(
    servicesExplorer.getByRole("heading", {
      name: "Extend the platform when the standard data model or workflow no longer fits.",
    }),
  ).toBeVisible();
  await expect(servicesExplorer.locator("h3")).toHaveCount(1);
});

test("Services engagement cards use the stacked scroll treatment", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop treatment only");
  await page.goto("/services");

  const stack = page.getByTestId("engagement-stack");
  await expect(stack.locator("article")).toHaveCount(4);
  const firstCard = page.getByTestId("engagement-stack-card-1");
  const secondCard = page.getByTestId("engagement-stack-card-2");
  const thirdCard = page.getByTestId("engagement-stack-card-3");

  await expect(firstCard).toHaveCSS("position", "sticky");
  await expect(stack.locator("xpath=ancestor::section")).toHaveCSS(
    "overflow",
    "visible",
  );

  await thirdCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const firstBox = await firstCard.boundingBox();
  const secondBox = await secondCard.boundingBox();
  const thirdBox = await thirdCard.boundingBox();

  expect(firstBox).not.toBeNull();
  expect(secondBox).not.toBeNull();
  expect(thirdBox).not.toBeNull();
  expect((secondBox?.y ?? 0) - (firstBox?.y ?? 0)).toBeLessThan(80);
  expect((thirdBox?.y ?? 0) - (secondBox?.y ?? 0)).toBeLessThan(
    secondBox?.height ?? 0,
  );
});

test("Industry rows preserve a paired content and visual column", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop grid only");
  await page.goto("/industries");

  const rows = page.getByTestId("industry-row");
  await expect(rows).toHaveCount(6);
  const firstRow = rows.first();
  await firstRow.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const columns = firstRow.locator(":scope > div");
  const contentBox = await columns.nth(0).boundingBox();
  const visualBox = await columns.nth(1).boundingBox();

  expect(contentBox).not.toBeNull();
  expect(visualBox).not.toBeNull();
  expect(Math.abs((contentBox?.y ?? 0) - (visualBox?.y ?? 0))).toBeLessThan(2);
  expect((contentBox?.x ?? 0) + (contentBox?.width ?? 0)).toBeLessThan(
    visualBox?.x ?? 0,
  );

  const secondRow = rows.nth(1);
  await secondRow.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const reversedColumns = secondRow.locator(":scope > div");
  const reversedContentBox = await reversedColumns.nth(0).boundingBox();
  const reversedVisualBox = await reversedColumns.nth(1).boundingBox();

  expect(reversedContentBox).not.toBeNull();
  expect(reversedVisualBox).not.toBeNull();
  expect(
    Math.abs((reversedContentBox?.y ?? 0) - (reversedVisualBox?.y ?? 0)),
  ).toBeLessThan(2);
  expect(
    (reversedVisualBox?.x ?? 0) + (reversedVisualBox?.width ?? 0),
  ).toBeLessThan(reversedContentBox?.x ?? 0);
});

test("desktop Services menu closes when clicking outside it", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop project only");
  await page.goto("/");

  await page.locator("header details summary").click();
  await expect(page.getByTestId("services-menu")).toBeVisible();
  const viewport = page.viewportSize();
  await page.mouse.click(12, (viewport?.height ?? 800) - 12);
  await expect(page.getByTestId("services-menu")).toBeHidden();
});

test("FAQ disclosures expose an animated accessible region", async ({
  page,
}) => {
  await page.goto("/hubspot-review");

  const trigger = page.locator("button[aria-controls*='panel']").first();
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("region")).toBeVisible();
});

test("scroll-to-top control returns a long page to the header", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  const control = page.getByRole("button", { name: "Scroll to top" });
  await expect(control).toBeVisible();
  await control.click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(10);
});

test("skip link reaches the main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Skip to main content" });
  await expect(skipLink).toBeFocused();
  await skipLink.press("Enter");
  await expect(page).toHaveURL(/#main-content$/);
});

test("mobile navigation opens, navigates, and closes", async ({
  page,
}, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "Mobile project only");
  await page.goto("/");

  const menuButton = page.getByRole("button", { name: "Open navigation" });
  await menuButton.click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "About" })
    .click();

  await expect(page).toHaveURL(/\/about$/);
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeVisible();
});

test("homepage has no serious automated accessibility violations", async ({
  page,
}) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  expect(results.violations).toEqual([]);
});
