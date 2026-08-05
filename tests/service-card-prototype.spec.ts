import { readFileSync, statSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

const animationPath = path.join(
  process.cwd(),
  "public",
  "animations",
  "strategy-architecture",
  "strategy-architecture.lottie",
);
const sourcePath = path.join(
  process.cwd(),
  "src",
  "animations",
  "strategy-architecture",
  "animation.json",
);

test("the card asset is a compact transparent vector overlay", () => {
  const archive = readFileSync(animationPath);
  const animation = JSON.parse(readFileSync(sourcePath, "utf8")) as {
    fr: number;
    ip: number;
    layers: Array<{ nm: string; ty: number }>;
    op: number;
  };

  expect(archive.subarray(0, 2).toString()).toBe("PK");
  expect(statSync(animationPath).size).toBeLessThan(10_000);
  expect((animation.op - animation.ip) / animation.fr).toBe(5);
  expect(animation.layers).toHaveLength(23);
  expect(animation.layers.every((layer) => layer.ty === 4)).toBe(true);
  expect(
    animation.layers.some((layer) => layer.nm === "Central CRM core"),
  ).toBe(true);
  expect(
    animation.layers.some((layer) => layer.nm === "Background surface"),
  ).toBe(false);
});

test("the prototype enhances only the staging Strategy card", async ({
  page,
}) => {
  await page.goto("/services");
  const card = page.getByTestId("strategy-service-card-prototype");

  await expect(card).toHaveCount(1);
  await expect(
    card.getByRole("heading", { name: "Strategy and consulting" }),
  ).toBeVisible();
  await expect(
    card.getByRole("link", { name: "Explore service" }),
  ).toBeVisible();
  await expect(card.locator('img[src*="strategy-consulting"]')).toBeVisible();

  await page.goto("/");
  await expect(page.getByTestId("strategy-service-card-prototype")).toHaveCount(
    0,
  );
});

test("desktop hover plays the overlay and settles without layout shift", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"));
  await page.setViewportSize({ height: 900, width: 1440 });

  const animationRequests: string[] = [];
  const runtimeRequests: string[] = [];
  const consoleErrors: string[] = [];
  page.on("request", (request) => {
    if (request.url().endsWith("strategy-architecture.lottie")) {
      animationRequests.push(request.url());
    }
    if (request.url().endsWith("dotlottie-player.wasm")) {
      runtimeRequests.push(request.url());
    }
  });
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto("/services");
  const card = page.getByTestId("strategy-service-card-prototype");
  const visual = page.getByTestId("strategy-card-visual");
  const animation = page.getByTestId("strategy-architecture-animation");
  await card.scrollIntoViewIfNeeded();
  await expect(animation).toHaveAttribute("data-playback-state", "idle");
  const before = await visual.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    return { height: bounds.height, width: bounds.width };
  });

  await card.hover();
  await expect(card).toHaveAttribute("data-hover-active", "true");
  await expect(animation).toHaveAttribute("data-playback-state", "playing");
  const player = page.getByTestId("strategy-architecture-player");
  await expect(player).toBeVisible();
  await expect.poll(() => animationRequests.length).toBe(1);
  await expect.poll(() => runtimeRequests.length).toBe(1);

  const canvasCost = await player.evaluate((element) => {
    const canvas = element as HTMLCanvasElement;
    return {
      backingHeight: canvas.height,
      backingWidth: canvas.width,
      clientHeight: canvas.clientHeight,
      clientWidth: canvas.clientWidth,
    };
  });
  expect(canvasCost.backingWidth / canvasCost.clientWidth).toBeLessThanOrEqual(
    1.55,
  );
  expect(
    canvasCost.backingHeight / canvasCost.clientHeight,
  ).toBeLessThanOrEqual(1.55);

  const after = await visual.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    return { height: bounds.height, width: bounds.width };
  });
  expect(Math.abs(after.width - before.width)).toBeLessThan(1);
  expect(Math.abs(after.height - before.height)).toBeLessThan(1);

  await page.mouse.move(2, 2);
  await expect(card).toHaveAttribute("data-hover-active", "false");
  await expect(animation).toHaveAttribute("data-playback-state", "idle");
  expect(consoleErrors).toEqual([]);
});

test("reduced motion keeps the original card image and skips the player", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const animationRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().endsWith("strategy-architecture.lottie")) {
      animationRequests.push(request.url());
    }
  });

  await page.goto("/services");
  const card = page.getByTestId("strategy-service-card-prototype");
  await card.scrollIntoViewIfNeeded();

  await expect(card.locator('img[src*="strategy-consulting"]')).toBeVisible();
  await expect(page.getByTestId("strategy-architecture-player")).toHaveCount(0);
  expect(animationRequests).toHaveLength(0);
});

test("the strategy detail hero lazy loads over its fixed poster", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto("/services/hubspot-strategy-consulting");
  const hero = page.getByTestId("strategy-service-hero-prototype");
  const poster = page.getByTestId("strategy-service-hero-poster");
  const before = await hero.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    return { height: bounds.height, width: bounds.width };
  });

  await expect(poster).toHaveAttribute("alt", "");
  await expect(hero).toHaveAttribute("data-renderer", "code-based-2.5d");
  await expect(hero).toHaveAttribute("data-animation-state", "playing");
  await expect(page.getByTestId("strategy-service-hero-scene")).toBeVisible();

  const after = await hero.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    return {
      duration: getComputedStyle(
        element.querySelector(".strategy-hero-scene")!,
      ).getPropertyValue("--strategy-duration"),
      height: bounds.height,
      width: bounds.width,
    };
  });
  expect(after.duration.trim()).toBe("6.4s");
  expect(Math.abs(after.width - before.width)).toBeLessThan(1);
  expect(Math.abs(after.height - before.height)).toBeLessThan(1);
  expect(consoleErrors).toEqual([]);

  await page.goto("/services/implementation-onboarding");
  await expect(page.getByTestId("strategy-service-hero-prototype")).toHaveCount(
    0,
  );
});

test("reduced motion keeps the strategy hero poster static", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/services/hubspot-strategy-consulting");

  const hero = page.getByTestId("strategy-service-hero-prototype");
  await expect(hero).toHaveAttribute("data-animation-state", "poster");
  await expect(page.getByTestId("strategy-service-hero-poster")).toBeVisible();
  await expect(page.getByTestId("strategy-service-hero-scene")).toHaveCount(0);
});

test("the prototype remains intact across visual preferences", async ({
  page,
}) => {
  await page.goto("/services/hubspot-strategy-consulting");
  const hero = page.getByTestId("strategy-service-hero-prototype");
  await expect(hero).toBeVisible();

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
    await expect(
      page.getByTestId("strategy-service-hero-poster"),
    ).toBeVisible();
  }
});

for (const width of [320, 375, 390, 430]) {
  test(`the card and hero remain stable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ height: 760, width });
    await page.goto("/services");

    const card = page.getByTestId("strategy-service-card-prototype");
    await card.scrollIntoViewIfNeeded();
    const cardGeometry = await card.evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      return {
        documentWidth: document.documentElement.scrollWidth,
        left: bounds.left,
        right: bounds.right,
        viewportWidth: window.innerWidth,
      };
    });
    expect(cardGeometry.left).toBeGreaterThanOrEqual(0);
    expect(cardGeometry.right).toBeLessThanOrEqual(width);
    expect(cardGeometry.documentWidth).toBe(width);

    await page.goto("/services/hubspot-strategy-consulting");
    const heading = page.getByRole("heading", {
      name: "Make the right HubSpot decisions before building the wrong system.",
    });
    const hero = page.getByTestId("strategy-service-hero-prototype");
    const geometry = await page.evaluate(() => {
      const headingElement = document.querySelector("h1");
      const heroElement = document.querySelector(
        '[data-testid="strategy-service-hero-prototype"]',
      );
      if (!headingElement || !heroElement) return null;
      const headingBounds = headingElement.getBoundingClientRect();
      const heroBounds = heroElement.getBoundingClientRect();
      return {
        documentWidth: document.documentElement.scrollWidth,
        headingBottom: headingBounds.bottom,
        heroLeft: heroBounds.left,
        heroRight: heroBounds.right,
        heroTop: heroBounds.top,
        ratio: heroBounds.width / heroBounds.height,
      };
    });

    await expect(heading).toBeVisible();
    await expect(hero).toBeVisible();
    expect(geometry).not.toBeNull();
    expect(geometry?.heroLeft ?? -1).toBeGreaterThanOrEqual(0);
    expect(geometry?.heroRight ?? Number.POSITIVE_INFINITY).toBeLessThanOrEqual(
      width,
    );
    expect(geometry?.heroTop ?? 0).toBeGreaterThan(
      geometry?.headingBottom ?? Number.POSITIVE_INFINITY,
    );
    expect(geometry?.ratio).toBeCloseTo(1, 1);
    expect(geometry?.documentWidth).toBe(width);
  });
}

test.describe("touch fallback", () => {
  test.use({
    hasTouch: true,
    isMobile: true,
    viewport: { height: 844, width: 390 },
  });

  test("touch does not load or rely on the card hover animation", async ({
    page,
  }) => {
    await page.goto("/services");
    const card = page.getByTestId("strategy-service-card-prototype");
    await card.scrollIntoViewIfNeeded();

    expect(
      await page.evaluate(
        () => window.matchMedia("(hover: hover) and (pointer: fine)").matches,
      ),
    ).toBe(false);
    await expect(card).toHaveAttribute("data-hover-active", "false");
    await expect(page.getByTestId("strategy-architecture-player")).toHaveCount(
      0,
    );
    await expect(
      card.getByRole("link", { name: "Explore service" }),
    ).toBeVisible();

    await page.goto("/services/hubspot-strategy-consulting");
    const hero = page.getByTestId("strategy-service-hero-prototype");
    await expect(hero).toBeVisible();
    await expect(page.getByTestId("strategy-service-hero-scene")).toBeVisible();
    await expect(hero.locator("canvas")).toHaveCount(0);
    await expect(hero.locator(".strategy-hero-scene__module")).toHaveCount(6);
  });
});
