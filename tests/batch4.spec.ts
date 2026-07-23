import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

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
const authorRoutes = ["/insights/author/thierry-luc-denichaud"];

const publicRoutes = [
  ...primaryRoutes,
  ...categoryRoutes,
  ...serviceRoutes,
  ...insightRoutes,
  ...authorRoutes,
];
const unpublishedRoutes = ["/audience", "/industries", "/work"];
const deploymentEnvironment = process.env.SITE_ENVIRONMENT ?? "production";

async function metadataContent(page: Page, selector: string) {
  return page.locator(selector).getAttribute("content");
}

test("production metadata is complete, unique, and canonical", async ({
  page,
}) => {
  test.skip(
    deploymentEnvironment !== "production",
    "Production metadata environment required",
  );

  const titles = new Set<string>();
  const descriptions = new Set<string>();

  for (const route of publicRoutes) {
    const response = await page.goto(route);
    expect(response?.ok(), `${route} should load`).toBeTruthy();

    const title = await page.title();
    const description = await metadataContent(page, 'meta[name="description"]');
    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    const renderedMetadata = await page.locator("head").innerHTML();

    expect(title.length, `${route} title`).toBeGreaterThanOrEqual(10);
    expect(description?.length ?? 0, `${route} description`).toBeGreaterThan(
      40,
    );
    expect(new URL(canonical ?? "").toString()).toBe(
      new URL(route, "https://company42.co").toString(),
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:description"]')).toHaveCount(
      1,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      canonical ?? "",
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /^https:\/\/company42\.co\//,
    );
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
      "content",
      "en_GB",
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    expect(renderedMetadata).not.toMatch(
      /localhost|127\.0\.0\.1|onrender\.com|\u2014/,
    );
    expect(titles.has(title), `${route} title should be unique`).toBeFalsy();
    expect(
      descriptions.has(description ?? ""),
      `${route} description should be unique`,
    ).toBeFalsy();
    titles.add(title);
    descriptions.add(description ?? "");
  }

  await page.goto("/");
  await expect(page).toHaveTitle(
    "HubSpot Consultancy, CRM & Integrations | 42",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Your HubSpot Answer",
  );
});

test("staging search safeguards omit production discovery signals", async ({
  page,
}) => {
  test.skip(
    deploymentEnvironment !== "staging",
    "Staging environment required",
  );

  for (const route of ["/", "/services", insightRoutes[0], "/contact"]) {
    const response = await page.goto(route);
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex.*nofollow/,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    await expect(page.locator('meta[property^="og:"]')).toHaveCount(0);
    await expect(
      page.locator('script[type="application/ld+json"]'),
    ).toHaveCount(0);
  }

  const robots = await (await page.request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /");
  expect(robots).not.toContain("Sitemap:");
  expect(robots).not.toContain("Host:");

  const sitemap = await (await page.request.get("/sitemap.xml")).text();
  expect(sitemap).not.toContain("<url>");
  expect(sitemap).not.toContain("company42.co");
});

test("production robots and sitemap expose only approved public routes", async ({
  page,
}) => {
  test.skip(
    deploymentEnvironment !== "production",
    "Production search environment required",
  );

  const robots = await (await page.request.get("/robots.txt")).text();
  expect(robots).toContain("Allow: /");
  expect(robots).toContain("Disallow: /dev/");
  expect(robots).toContain("Host: https://company42.co");
  expect(robots).toContain("Sitemap: https://company42.co/sitemap.xml");

  const sitemap = await (await page.request.get("/sitemap.xml")).text();
  const locations = Array.from(
    sitemap.matchAll(/<loc>(.*?)<\/loc>/g),
    (match) => match[1],
  );
  expect(new Set(locations).size).toBe(publicRoutes.length);

  for (const route of publicRoutes) {
    expect(locations).toContain(
      new URL(route, "https://company42.co").toString(),
    );
  }
  for (const route of [...unpublishedRoutes, "/dev/design-system"]) {
    expect(sitemap).not.toContain(route);
  }
  expect(sitemap).not.toMatch(/localhost|127\.0\.0\.1|onrender\.com/);
  expect((sitemap.match(/<lastmod>/g) ?? []).length).toBe(insightRoutes.length);
});

test("structured data is accurate and route-specific", async ({ page }) => {
  test.skip(
    deploymentEnvironment !== "production",
    "Production structured-data environment required",
  );

  for (const route of [
    "/",
    serviceRoutes[0],
    insightRoutes[0],
    categoryRoutes[0],
  ]) {
    await page.goto(route);
    const records = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).flatMap((value) => {
      const parsed = JSON.parse(value) as
        Record<string, unknown> | Array<Record<string, unknown>>;
      return Array.isArray(parsed) ? parsed : [parsed];
    });
    const types = records.flatMap((record) =>
      Array.isArray(record["@type"]) ? record["@type"] : [record["@type"]],
    );
    const serialized = JSON.stringify(records);

    expect(types).toContain("Organization");
    expect(types).toContain("ProfessionalService");
    expect(types).toContain("WebSite");
    if (route.startsWith("/services/")) expect(types).toContain("Service");
    if (route.startsWith("/insights/") && !route.includes("/category/")) {
      expect(types).toContain("Article");
    }
    if (route !== "/") expect(types).toContain("BreadcrumbList");
    expect(serialized).toContain("Madeyoulookagency LLC");
    expect(serialized).toContain("North America");
    expect(serialized).toContain("EMEA");
    expect(serialized).not.toMatch(
      /postalCode|streetAddress|telephone|aggregateRating|sameAs|onrender|localhost|\u2014/,
    );
  }
});

test("public internal links resolve and unpublished routes have no inbound links", async ({
  page,
}) => {
  const inbound = new Map(publicRoutes.map((route) => [route, 0]));
  const discovered = new Set<string>();

  for (const route of publicRoutes) {
    const response = await page.goto(route);
    expect(response?.ok()).toBeTruthy();
    const hrefs = await page
      .locator("a[href]")
      .evaluateAll((anchors) =>
        anchors.map((anchor) => anchor.getAttribute("href") ?? ""),
      );

    for (const href of hrefs) {
      expect(href, `${route} has an empty or placeholder link`).not.toBe("");
      expect(href, `${route} has a placeholder hash link`).not.toBe("#");
      expect(href).not.toMatch(/localhost|127\.0\.0\.1|onrender\.com/);
      if (
        href.startsWith("mailto:") ||
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("#")
      ) {
        continue;
      }

      const url = new URL(href, "https://company42.co");
      discovered.add(url.pathname);
      if (inbound.has(url.pathname) && url.pathname !== route) {
        inbound.set(url.pathname, (inbound.get(url.pathname) ?? 0) + 1);
      }
      expect(unpublishedRoutes).not.toContain(url.pathname);
    }
  }

  for (const path of discovered) {
    const response = await page.request.get(path);
    expect(response.status(), `${path} should resolve`).toBeLessThan(400);
  }
  for (const route of publicRoutes.filter((route) => route !== "/")) {
    expect(
      inbound.get(route),
      `${route} should have an inbound link`,
    ).toBeGreaterThan(0);
  }

  await page.goto("/contact");
  await expect(page.locator('main a[href="/contact"]')).toHaveCount(0);
});

test("adaptive cursor changes contrast at explicit surface boundaries", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name.includes("mobile"),
    "Fine-pointer behavior only",
  );
  await page.goto("/");
  const finePointer = await page.evaluate(
    () => window.matchMedia("(hover: hover) and (pointer: fine)").matches,
  );
  test.skip(!finePointer, "This browser does not expose a fine pointer");

  const html = page.locator("html");
  const ring = page.locator(".custom-cursor-ring");
  const dot = page.locator(".custom-cursor-dot");
  const sections = page.locator("main > section");

  await sections.first().hover({ position: { x: 24, y: 120 } });
  await expect(html).toHaveAttribute("data-cursor-color", "dark");
  await expect(ring).toHaveCSS("border-color", "rgb(9, 11, 16)");
  await expect(dot).toHaveCSS("background-color", "rgb(9, 11, 16)");

  await sections.nth(1).hover({ position: { x: 24, y: 120 } });
  await expect(html).toHaveAttribute("data-cursor-color", "light");
  await expect(ring).toHaveCSS("border-color", "rgb(247, 245, 239)");
  await expect(ring).toHaveCSS("mix-blend-mode", "normal");

  await page.getByTestId("site-header").hover({ position: { x: 12, y: 12 } });
  await expect(html).toHaveAttribute("data-cursor-color", "light");

  await page.goto("/contact");
  const form = page.getByTestId("hubspot-form-shell");
  await form.hover();
  await expect(page.getByTestId("custom-cursor-dot")).toHaveCSS("opacity", "0");
});

test("native cursor and content remain usable if client scripts are disabled", async ({
  browser,
}) => {
  const context = await browser.newContext({
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000",
    javaScriptEnabled: false,
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-custom-cursor",
    "active",
  );
  await expect(page.locator("body")).toHaveCSS("cursor", "auto");
  await context.close();
});

test("mobile menu contains focus and restores it on Escape", async ({
  page,
}, testInfo) => {
  test.skip(
    !testInfo.project.name.includes("mobile"),
    "Mobile navigation behavior only",
  );
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open navigation" });
  await trigger.click();

  const navigation = page.getByRole("navigation", {
    name: "Mobile navigation",
  });
  await expect(navigation.getByRole("link").first()).toBeFocused();
  await navigation.getByRole("link", { name: "Book a consultation" }).focus();
  await page.keyboard.press("Tab");
  await expect(navigation.getByRole("link").first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeFocused();
});

test("representative routes pass automated accessibility and heading checks", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of [
    "/",
    "/services",
    serviceRoutes[0],
    "/about",
    "/insights",
    insightRoutes[0],
    "/contact",
  ]) {
    const response = await page.goto(route);
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.getByRole("main")).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations, `${route} accessibility violations`).toEqual([]);
  }
});

test("representative pages reflow without horizontal overflow at 200 percent", async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 640 });
  for (const route of [
    "/",
    "/services",
    serviceRoutes[0],
    "/about",
    "/insights",
    insightRoutes[0],
    "/contact",
  ]) {
    await page.goto(route);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow, `${route} horizontal overflow`).toBeLessThanOrEqual(1);
  }
});

test("security headers apply without blocking the approved HubSpot origins", async ({
  page,
}) => {
  const response = await page.request.get("/contact");
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response.headers()["x-frame-options"]).toBe("DENY");
  expect(response.headers()["strict-transport-security"]).toBe(
    "max-age=31536000",
  );
  expect(response.headers()["referrer-policy"]).toBe(
    "strict-origin-when-cross-origin",
  );
  expect(response.headers()["permissions-policy"]).toContain("camera=()");

  const policy = response.headers()["content-security-policy"];
  expect(policy).toContain("default-src 'self'");
  expect(policy).toContain("frame-ancestors 'none'");
  expect(policy).toContain("https://*.hsforms.net");
  expect(policy).toContain("https://*.hsforms.com");
  expect(policy).toContain("https://*.hubspot.com");
});
