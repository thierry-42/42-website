import { mkdirSync } from "node:fs";
import path from "node:path";

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const reviewDirectory = path.join(
  process.cwd(),
  "test-results",
  "motion-proof",
);

test.beforeAll(() => {
  mkdirSync(reviewDirectory, { recursive: true });
});

test("the staging homepage renders a semantic, code-native motion prototype", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  const prohibitedRuntimeRequests: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("request", (request) => {
    if (/\.(?:lottie|wasm|mp4|webm)(?:\?|$)/u.test(request.url())) {
      prohibitedRuntimeRequests.push(request.url());
    }
  });

  await page.setViewportSize({ height: 1000, width: 1440 });
  await page.goto("/");

  const hero = page.getByTestId("home-hero-motion-prototype");
  await expect(hero).toBeVisible();
  await expect(hero).toHaveAttribute("aria-hidden", "true");
  await expect(hero).toHaveAttribute("data-motion-renderer", "svg-css");
  await expect(hero).toHaveAttribute("data-motion-state", "playing");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Your HubSpot Answer",
  );
  await expect(
    page.getByRole("link", { name: "Book a consultation" }).first(),
  ).toBeVisible();
  await expect(hero.locator("svg")).toHaveCount(1);
  await expect(hero.locator("canvas, video, audio")).toHaveCount(0);
  await expect(hero.locator("text")).toHaveCount(0);
  await expect(hero.locator("[tabindex]")).toHaveCount(0);
  await expect(page.getByTestId("hero-answer-field")).toHaveCount(0);
  expect(prohibitedRuntimeRequests).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("the hero pauses outside the viewport and resumes without a frame loop", async ({
  page,
}) => {
  await page.goto("/");
  const hero = page.getByTestId("home-hero-motion-prototype");

  await expect(hero).toHaveAttribute("data-motion-state", "playing");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(hero).toHaveAttribute("data-motion-state", "paused");
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(hero).toHaveAttribute("data-motion-state", "playing");

  expect(
    await hero.evaluate(
      (element) => element.querySelectorAll("canvas, video").length,
    ),
  ).toBe(0);
});

test("reduced motion presents the completed static hero and original card image", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const hero = page.getByTestId("home-hero-motion-prototype");
  await expect(hero).toHaveAttribute("data-motion-state", "static");
  await expect(hero.locator(".motion-accent-disc__hubspot-mark")).toBeVisible();
  expect(
    await hero
      .locator(".motion-accent-disc")
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe("none");

  await page.goto("/services");
  const card = page.getByTestId("strategy-service-card-prototype");
  await card.scrollIntoViewIfNeeded();
  await expect(card.locator('img[src*="strategy-consulting"]')).toBeVisible();
  await expect(page.getByTestId("strategy-motion-card-overlay")).toBeHidden();
});

test("the service card keeps its image and settles into a connected hover state", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"));
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.setViewportSize({ height: 1000, width: 1440 });
  await page.goto("/services");
  const card = page.getByTestId("strategy-service-card-prototype");
  const visual = page.getByTestId("strategy-card-visual");
  const overlay = page.getByTestId("strategy-motion-card-overlay");
  await card.scrollIntoViewIfNeeded();

  await expect(card.locator('img[src*="strategy-consulting"]')).toBeVisible();
  await expect(overlay).toHaveCSS("opacity", "0");
  const before = await visual.boundingBox();

  await card.hover();
  await expect(overlay).toHaveCSS("opacity", "1");
  await expect
    .poll(() =>
      overlay
        .locator(".motion-signal-path__trace")
        .first()
        .evaluate((element) => getComputedStyle(element).strokeDashoffset),
    )
    .toMatch(/^0(?:px)?$/u);
  await expect(overlay.locator(".motion-system-node").first()).toHaveCSS(
    "opacity",
    "1",
  );

  const after = await visual.boundingBox();
  expect(Math.abs((after?.width ?? 0) - (before?.width ?? 0))).toBeLessThan(1);
  expect(Math.abs((after?.height ?? 0) - (before?.height ?? 0))).toBeLessThan(
    1,
  );

  await page.mouse.move(4, 4);
  await expect(overlay).toHaveCSS("opacity", "0");
  expect(consoleErrors).toEqual([]);
});

test("keyboard focus activates the same restrained service-card state", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"));
  await page.goto("/services");
  const card = page.getByTestId("strategy-service-card-prototype");
  const link = card.getByRole("link", { name: "Explore service" });
  const overlay = page.getByTestId("strategy-motion-card-overlay");
  await card.scrollIntoViewIfNeeded();

  await link.focus();
  await expect(link).toBeFocused();
  await expect(overlay).toHaveCSS("opacity", "1");
  await expect(link).toHaveCSS("outline-style", "solid");

  await page.keyboard.press("Tab");
  await expect(overlay).toHaveCSS("opacity", "0");
});

test("the decorative motion introduces no serious accessibility violations", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByTestId("home-hero-motion-prototype")).toBeVisible();

  const results = await new AxeBuilder({ page })
    .include("main > section:first-of-type")
    .analyze();
  const materialViolations = results.violations.filter((violation) =>
    ["critical", "serious"].includes(violation.impact ?? ""),
  );

  expect(materialViolations).toEqual([]);
});

test("the prototypes remain decorative and legible across Visual Preferences", async ({
  page,
}) => {
  await page.goto("/");
  const hero = page.getByTestId("home-hero-motion-prototype");
  await page.getByRole("button", { name: "Open visual preferences" }).click();

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
    await expect(hero).toBeVisible();
    await expect(hero.locator(".motion-accent-disc__face")).not.toHaveCSS(
      "fill",
      "rgba(0, 0, 0, 0)",
    );
  }

  await expect(hero.locator(".motion-accent-disc__shadow")).toBeHidden();
});

for (const viewport of [
  { height: 568, width: 320 },
  { height: 667, width: 375 },
  { height: 844, width: 390 },
  { height: 932, width: 430 },
  { height: 1024, width: 768 },
  { height: 1000, width: 1440 },
  { height: 1200, width: 1920 },
]) {
  test(`the motion prototype has no overflow or content collision at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const geometry = await page.evaluate(() => {
      const hero = document
        .querySelector('[data-testid="home-hero-motion-prototype"]')
        ?.getBoundingClientRect();
      const heading = document.querySelector("h1")?.getBoundingClientRect();
      const buttons = document
        .querySelector("h1")
        ?.parentElement?.querySelectorAll("a");
      const lastButton = buttons
        ?.item(buttons.length - 1)
        .getBoundingClientRect();

      return {
        documentWidth: document.documentElement.scrollWidth,
        headingBottom: heading?.bottom ?? 0,
        heroBottom: hero?.bottom ?? 0,
        heroLeft: hero?.left ?? -1,
        heroRight: hero?.right ?? Number.POSITIVE_INFINITY,
        heroTop: hero?.top ?? 0,
        lastButtonBottom: lastButton?.bottom ?? 0,
        viewportWidth: window.innerWidth,
      };
    });

    expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth);
    expect(geometry.heroLeft).toBeGreaterThanOrEqual(0);
    expect(geometry.heroRight).toBeLessThanOrEqual(geometry.viewportWidth);
    expect(geometry.heroBottom).toBeGreaterThan(geometry.heroTop);

    if (viewport.width < 1024) {
      expect(geometry.heroTop).toBeGreaterThan(geometry.lastButtonBottom);
      expect(geometry.heroTop).toBeGreaterThan(geometry.headingBottom);
    }
  });
}

test.describe("touch fallback", () => {
  test.use({
    hasTouch: true,
    isMobile: true,
    viewport: { height: 844, width: 390 },
  });

  test("touch keeps the original card image without a hover dependency", async ({
    page,
  }) => {
    await page.goto("/services");
    const card = page.getByTestId("strategy-service-card-prototype");
    const overlay = page.getByTestId("strategy-motion-card-overlay");
    await card.scrollIntoViewIfNeeded();

    expect(
      await page.evaluate(
        () => window.matchMedia("(hover: hover) and (pointer: fine)").matches,
      ),
    ).toBe(false);
    await expect(card.locator('img[src*="strategy-consulting"]')).toBeVisible();
    await expect(overlay).toHaveCSS("opacity", "0");
    await expect(
      card.getByRole("link", { name: "Explore service" }),
    ).toBeVisible();
  });
});

test.describe("JavaScript fallback", () => {
  test.use({ javaScriptEnabled: false });

  test("the homepage remains complete with a static server-rendered scene", async ({
    page,
  }) => {
    await page.goto("/");
    const hero = page.getByTestId("home-hero-motion-prototype");

    await expect(hero).toBeVisible();
    await expect(hero).toHaveAttribute("data-motion-state", "static");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Your HubSpot Answer",
    );
    await expect(
      page.getByRole("link", { name: "Book a consultation" }).first(),
    ).toBeVisible();
  });
});

test("capture motion proof review images", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"));

  await page.setViewportSize({ height: 1000, width: 1440 });
  await page.goto("/");
  await page.waitForTimeout(4700);
  await page
    .locator("main > section")
    .first()
    .screenshot({
      path: path.join(reviewDirectory, "homepage-hero-desktop.png"),
    });

  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/");
  await page.waitForTimeout(7200);
  await page
    .locator("main > section")
    .first()
    .screenshot({
      path: path.join(reviewDirectory, "homepage-hero-mobile.png"),
    });

  await page.setViewportSize({ height: 1000, width: 1440 });
  await page.goto("/services");
  const card = page.getByTestId("strategy-service-card-prototype");
  await card.scrollIntoViewIfNeeded();
  await card.screenshot({
    path: path.join(reviewDirectory, "service-card-resting.png"),
  });
  await card.hover();
  await page.waitForTimeout(1100);
  await card.screenshot({
    path: path.join(reviewDirectory, "service-card-hover.png"),
  });
});
