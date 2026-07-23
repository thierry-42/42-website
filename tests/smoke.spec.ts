import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function mockHubspotForm(page: Page) {
  const region = process.env.HUBSPOT_STAGING_REGION ?? "eu1";
  const formId =
    process.env.HUBSPOT_STAGING_FORM_ID ??
    "da5e2637-3fc8-4ab0-96b1-4764ecd0f16e";

  await page.route(`https://js-${region}.hsforms.net/**`, async (route) => {
    await route.fulfill({
      body: `
        document.querySelectorAll(".hs-form-frame").forEach(function (frame) {
          var iframe = document.createElement("iframe");
          iframe.title = "HubSpot enquiry form";
          frame.appendChild(iframe);
        });
        window.dispatchEvent(new CustomEvent("hs-form-event:on-ready", {
          detail: { formId: "${formId}" }
        }));
      `,
      contentType: "application/javascript",
      status: 200,
    });
  });
}

const deploymentEnvironment = process.env.SITE_ENVIRONMENT ?? "production";
const stagingFormConfigured =
  deploymentEnvironment !== "production" &&
  Boolean(
    process.env.HUBSPOT_STAGING_REGION &&
    process.env.HUBSPOT_STAGING_PORTAL_ID &&
    process.env.HUBSPOT_STAGING_FORM_ID,
  );

const primaryRoutes = [
  "/",
  "/services",
  "/about",
  "/approach",
  "/insights",
  "/hubspot-review",
  "/contact",
  "/privacy",
  "/terms",
];

const categoryRoutes = [
  "/insights/category/hubspot-strategy-implementation",
  "/insights/category/crm-data-revops",
  "/insights/category/integrations-development",
  "/insights/category/websites-content-hub-accessibility",
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
    if (route === "/contact") await mockHubspotForm(page);

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

for (const route of categoryRoutes) {
  test(`${route} loads a useful, populated category`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.ok()).toBeTruthy();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator('a[href^="/insights/"]').first()).toBeVisible();
  });
}

test("production contact does not fall back to the staging HubSpot form", async ({
  page,
}) => {
  test.skip(
    deploymentEnvironment !== "production",
    "Production environment safeguard",
  );
  await page.goto("/contact");

  await expect(page.locator(".hs-form-frame")).toHaveCount(0);
  await expect(
    page.getByText("The production enquiry form is not configured yet."),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "hello@company42.co" }).first(),
  ).toHaveAttribute("href", "mailto:hello@company42.co");
});

test("staging contact uses the approved HubSpot form variables", async ({
  page,
}) => {
  test.skip(!stagingFormConfigured, "Staging form configuration required");
  await mockHubspotForm(page);
  await page.goto("/contact");

  const form = page.locator(".hs-form-frame");
  await expect(form).toHaveAttribute("data-region", "eu1");
  await expect(form).toHaveAttribute("data-portal-id", "148811132");
  await expect(form).toHaveAttribute(
    "data-form-id",
    "da5e2637-3fc8-4ab0-96b1-4764ecd0f16e",
  );
  await expect(form.locator("iframe")).toHaveAttribute(
    "title",
    "HubSpot enquiry form",
  );
  await expect(page.getByTestId("hubspot-form-loading")).toBeHidden();
  await expect(
    page.getByRole("link", { name: "hello@company42.co" }).first(),
  ).toHaveAttribute("href", "mailto:hello@company42.co");
  await expect(
    page.getByRole("link", { name: "Privacy Policy" }),
  ).toHaveAttribute("href", "/privacy");
});

test("staging HubSpot form exposes accessible success and load-failure states", async ({
  page,
}) => {
  test.skip(!stagingFormConfigured, "Staging form configuration required");
  await mockHubspotForm(page);
  await page.goto("/contact");
  await expect(page.locator(".hs-form-frame iframe")).toHaveCount(1);
  await expect(page.getByTestId("hubspot-form-loading")).toBeHidden();

  await page.evaluate((formId) => {
    window.dispatchEvent(
      new CustomEvent("hs-form-event:on-submission:success", {
        detail: { formId },
      }),
    );
  }, process.env.HUBSPOT_STAGING_FORM_ID);
  await expect(page.getByTestId("hubspot-form-success")).toHaveAttribute(
    "role",
    "status",
  );
  await expect(page.getByTestId("hubspot-form-success")).toContainText(
    "submitted to 42",
  );

  await page.unrouteAll();
  await page.route("https://js-eu1.hsforms.net/**", async (route) => {
    await route.abort("failed");
  });
  await page.reload();
  await expect(
    page.getByText("The enquiry form could not be loaded."),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "hello@company42.co" }).first(),
  ).toHaveAttribute("href", "mailto:hello@company42.co");
});

for (const route of serviceRoutes) {
  test(`${route} renders the shared service template`, async ({ page }) => {
    const response = await page.goto(route);

    expect(response?.ok()).toBeTruthy();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "A focused scope, made tangible.",
      }),
    ).toBeVisible();
    await expect(page.getByText("Who this service is for")).toBeVisible();
    await expect(page.getByText("Typical problems")).toBeVisible();
    await expect(page.getByText("Related insights")).toBeVisible();
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
    ).not.toHaveCount(0);
  });
}

test("insights index exposes every published guide", async ({ page }) => {
  await page.goto("/insights");

  for (const route of insightRoutes) {
    await expect(page.locator(`a[href="${route}"]`).first()).toBeVisible();
  }
  for (const route of categoryRoutes) {
    await expect(page.locator(`a[href="${route}"]`)).toBeVisible();
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

test("primary navigation exposes Approach and withholds unpublished routes", async ({
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
  await expect(primaryNavigation.locator('a[href="/industries"]')).toHaveCount(
    0,
  );
  await expect(primaryNavigation.locator('a[href="/work"]')).toHaveCount(0);
});

test("unfinished routes stay unpublished while their features are disabled", async ({
  page,
}, testInfo) => {
  await page.goto("/");

  if (testInfo.project.name.includes("mobile")) {
    await page.getByRole("button", { name: "Open navigation" }).click();
  }

  for (const route of ["/work", "/audience", "/industries"]) {
    await expect(page.locator(`a[href="${route}"]`)).toHaveCount(0);
    const response = await page.goto(route);
    expect(response?.status()).toBe(404);
    await expect(page.getByText("Error 404")).toBeVisible();
  }

  const sitemapResponse = await page.request.get("/sitemap.xml");
  expect(sitemapResponse.ok()).toBeTruthy();
  const sitemap = await sitemapResponse.text();
  for (const route of ["/work", "/audience", "/industries"]) {
    expect(sitemap).not.toContain(`<loc>https://company42.co${route}`);
  }
  for (const route of categoryRoutes) {
    expect(sitemap).toContain(`<loc>https://company42.co${route}`);
  }
});

test("Approach uses the reconciled four-step structure", async ({ page }) => {
  await page.goto("/approach");
  for (const stage of ["Understand", "Architect", "Build", "Enable"]) {
    await expect(
      page.getByText(
        `Step 0${["Understand", "Architect", "Build", "Enable"].indexOf(stage) + 1} / ${stage}`,
      ),
    ).toBeVisible();
  }
});

test("About renders approved team identities with environment-safe portraits", async ({
  page,
}) => {
  await page.goto("/about");

  const members = [
    ["Thierry-Luc Denichaud", "Founder & Senior HubSpot Consultant"],
    ["Zane Smith", "PHP Developer / Integrations Specialist"],
    ["Emma Black", "Marketing Consultant / HubSpot Onboarding Specialist"],
  ];

  for (const [name, role] of members) {
    await expect(page.getByRole("heading", { name })).toBeVisible();
    await expect(page.getByText(role)).toBeVisible();
  }
  await expect(
    page.getByText("Development portrait / approval required"),
  ).toHaveCount(0);
  await expect(page.getByText("Luca Codevilla")).toHaveCount(0);

  if (deploymentEnvironment === "production") {
    await expect(page.locator('img[src*="/images/team/"]')).toHaveCount(0);
  } else {
    await expect(page.locator('img[src*="/images/team/"]')).toHaveCount(3);
  }
});

test("approved author profile is public", async ({ page }) => {
  const response = await page.goto("/insights/author/thierry-luc-denichaud");
  expect(response?.status()).toBe(200);
  await expect(
    page.getByRole("heading", { level: 1, name: "Thierry-Luc Denichaud" }),
  ).toBeVisible();
  const sitemap = await (await page.request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("/insights/author/thierry-luc-denichaud");
});

test("homepage includes selected published insights", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Useful thinking before the next decision.",
    }),
  ).toBeVisible();
  await expect(page.locator('a[href^="/insights/"]')).not.toHaveCount(0);
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

test("custom cursor stays responsive and yields to native interaction zones", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Fine pointer only");
  await page.goto("/");

  const html = page.locator("html");
  const dot = page.getByTestId("custom-cursor-dot");
  const ring = page.getByTestId("custom-cursor-ring");

  await expect(html).toHaveAttribute("data-custom-cursor", "active");
  await page.mouse.move(120, 140);
  await expect(dot).toHaveCSS("opacity", "1");
  await expect(dot).toHaveAttribute(
    "style",
    /translate3d\(120px, 140px, 0px\)/,
  );
  await expect(ring).toHaveCSS("opacity", "1");

  const consultationLink = page
    .getByRole("link", { name: "Book a consultation" })
    .first();
  await consultationLink.hover();
  await expect(dot).toHaveAttribute("data-active", "true");

  await page.goto("/contact");
  const formShell = page.getByTestId("hubspot-form-shell");
  await expect(formShell).toHaveAttribute("data-native-cursor", "true");
  await formShell.hover();
  await expect(page.getByTestId("custom-cursor-dot")).toHaveCSS("opacity", "0");
  await expect(formShell).toHaveCSS("cursor", "auto");

  await page.evaluate(() => {
    const frame = document.createElement("iframe");
    frame.title = "Cross-origin cursor test";
    frame.src = "about:blank";
    frame.style.cssText =
      "position:fixed;left:16px;bottom:16px;width:120px;height:80px;z-index:200";
    document.body.appendChild(frame);
  });
  await page.locator('iframe[title="Cross-origin cursor test"]').hover();
  await expect(page.getByTestId("custom-cursor-dot")).toHaveCSS("opacity", "0");
});

test("custom cursor stays disabled for touch and reduced-motion contexts", async ({
  page,
}, testInfo) => {
  if (testInfo.project.name.includes("mobile")) {
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveAttribute(
      "data-custom-cursor",
      "active",
    );
    await expect(page.getByTestId("custom-cursor-dot")).toHaveCSS(
      "opacity",
      "0",
    );
    await expect(page.locator("body")).toHaveCSS("cursor", "auto");
    return;
  }

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-custom-cursor",
    "active",
  );
  await expect(page.locator("body")).toHaveCSS("cursor", "auto");
});

test("homepage answer field and capability explorer respond to selection", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.locator("main > section").first()).toHaveAttribute(
    "data-surface",
    "light",
  );

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
  await page.goto("/");

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

test("legal pages use the confirmed operator without public review status", async ({
  page,
}) => {
  const operatorStatement =
    "42 is the public-facing brand of Company42, a trading name of Madeyoulookagency LLC, a limited liability company registered in California, United States of America.";

  await page.goto("/privacy");
  await expect(page.getByText(operatorStatement)).toBeVisible();
  await expect(page.getByText("Approval required")).toHaveCount(0);
  await expect(page.getByText(/owner and legal review/i)).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Cookies and browser storage" }),
  ).toBeVisible();
  await expect(page.getByText(/draft/i)).toHaveCount(0);

  await page.goto("/terms");
  await expect(page.getByText(operatorStatement)).toBeVisible();
  await expect(page.getByText("Approval required")).toHaveCount(0);
  await expect(page.getByText(/owner and legal review/i)).toHaveCount(0);
  await expect(page.getByText(/draft/i)).toHaveCount(0);
  await expect(
    page.getByText("Laws of the State of California."),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Consultancy engagements" }),
  ).toBeVisible();
});
