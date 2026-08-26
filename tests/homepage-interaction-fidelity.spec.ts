import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";

const viewports = [
  { height: 568, width: 320 },
  { height: 667, width: 375 },
  { height: 844, width: 390 },
  { height: 932, width: 430 },
  { height: 1024, width: 768 },
  { height: 900, width: 1440 },
  { height: 1080, width: 1920 },
] as const;

async function scrollInstant(page: Page, top: number) {
  await page.evaluate(
    (nextTop) => window.scrollTo({ behavior: "instant", top: nextTop }),
    top,
  );
  await page.waitForTimeout(80);
}

async function documentTops(locator: Locator) {
  return locator.evaluateAll((elements) =>
    elements.map((element) => {
      const bounds = element.getBoundingClientRect();
      return bounds.top + window.scrollY;
    }),
  );
}

async function viewportTops(locator: Locator) {
  return locator.evaluateAll((elements) =>
    elements.map((element) => element.getBoundingClientRect().top),
  );
}

test("hero exposes direct, previous, next, keyboard, and swipe controls", async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto("/");

  const stage = page.getByTestId("home-service-stage");
  const visual = page.getByTestId("home-service-visual");
  const tabs = stage.getByRole("tab");
  const previous = stage.getByRole("button", { name: "Previous service" });
  const next = stage.getByRole("button", { name: "Next service" });
  const initialHeight = (await stage.boundingBox())?.height ?? 0;

  await expect(previous).toBeVisible();
  await expect(next).toBeVisible();
  await expect(tabs).toHaveCount(8);
  await expect(stage.getByText("01 / 08", { exact: true })).toBeVisible();

  await next.click();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(stage.getByText("02 / 08", { exact: true })).toBeVisible();

  await previous.click();
  await expect(tabs.first()).toHaveAttribute("aria-selected", "true");

  await tabs.nth(3).click();
  await expect(tabs.nth(3)).toHaveAttribute("aria-selected", "true");
  await tabs.nth(3).press("ArrowRight");
  await expect(tabs.nth(4)).toHaveAttribute("aria-selected", "true");

  await visual.dispatchEvent("pointerdown", {
    bubbles: true,
    clientX: 300,
    isPrimary: true,
    pointerId: 1,
    pointerType: "touch",
  });
  await visual.dispatchEvent("pointerup", {
    bubbles: true,
    clientX: 120,
    isPrimary: true,
    pointerId: 1,
    pointerType: "touch",
  });
  await expect(tabs.nth(5)).toHaveAttribute("aria-selected", "true");
  expect((await stage.boundingBox())?.height ?? 0).toBeCloseTo(
    initialHeight,
    0,
  );
});

test("expertise panels interpolate and every long title wraps without clipping", async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto("/");

  const expertise = page.getByTestId("home-expertise");
  const panels = expertise.locator('[data-testid^="expertise-service-"]');
  const firstInitialWidth = (await panels.first().boundingBox())?.width ?? 0;
  const secondInitialWidth = (await panels.nth(1).boundingBox())?.width ?? 0;

  await panels.nth(1).getByRole("button").click();
  await page.waitForTimeout(180);
  const firstMidWidth = (await panels.first().boundingBox())?.width ?? 0;
  const secondMidWidth = (await panels.nth(1).boundingBox())?.width ?? 0;
  expect(firstMidWidth).toBeLessThan(firstInitialWidth);
  expect(firstMidWidth).toBeGreaterThan(secondInitialWidth);
  expect(secondMidWidth).toBeGreaterThan(secondInitialWidth);
  expect(secondMidWidth).toBeLessThan(firstInitialWidth);

  await page.waitForTimeout(650);
  await expect(panels.nth(1)).toHaveAttribute("data-active", "true");
  await expect(expertise.getByRole("region")).toHaveCount(1);

  for (const name of [
    "Implementation and onboarding",
    "Automation and operations",
    "Integrations and development",
    "Websites and Content Hub",
    "Managed HubSpot support",
  ]) {
    const button = expertise.getByRole("button", { name });
    await button.click();
    await page.waitForTimeout(720);

    const activePanel = expertise.locator('[data-active="true"]');
    const title = activePanel.locator("h3");
    const geometry = await title.evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      const panelBounds =
        element.closest("article")?.getBoundingClientRect() ?? bounds;
      return {
        panelRight: panelBounds.right,
        right: bounds.right,
        scrollWidth: element.scrollWidth,
        whiteSpace: getComputedStyle(element).whiteSpace,
        width: bounds.width,
      };
    });

    expect(geometry.whiteSpace).toBe("normal");
    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.width + 1);
    expect(geometry.right).toBeLessThanOrEqual(geometry.panelRight + 1);
    await expect(title).toBeVisible();
  }
});

test("expertise stage height stays stable across every desktop service", async ({
  page,
}) => {
  for (const viewport of [
    { height: 900, width: 1440 },
    { height: 1080, width: 1920 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const expertise = page.getByTestId("home-expertise");
    const panels = expertise.locator('[data-testid^="expertise-service-"]');
    const initialHeight = (await expertise.boundingBox())?.height ?? 0;

    for (let index = 0; index < 8; index += 1) {
      const panel = panels.nth(index);
      await panel.getByRole("button").click();
      await page.waitForTimeout(720);

      const activePanel = expertise.locator('[data-active="true"]');
      const activeContent = activePanel.locator(
        ".home-expertise-content__inner > div",
      );
      const contentGeometry = await activeContent.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        const stageBounds = element
          .closest('[data-testid="home-expertise"]')!
          .getBoundingClientRect();
        return {
          bottom: bounds.bottom,
          right: bounds.right,
          scrollHeight: element.scrollHeight,
          scrollWidth: element.scrollWidth,
          stageBottom: stageBounds.bottom,
          stageRight: stageBounds.right,
        };
      });

      expect((await expertise.boundingBox())?.height ?? 0).toBeCloseTo(
        initialHeight,
        0,
      );
      expect(contentGeometry.bottom).toBeLessThanOrEqual(
        contentGeometry.stageBottom + 1,
      );
      expect(contentGeometry.right).toBeLessThanOrEqual(
        contentGeometry.stageRight + 1,
      );
      expect(contentGeometry.scrollHeight).toBeLessThanOrEqual(
        Math.ceil((await activeContent.boundingBox())?.height ?? 0) + 1,
      );
      expect(contentGeometry.scrollWidth).toBeLessThanOrEqual(
        Math.ceil((await activeContent.boundingBox())?.width ?? 0) + 1,
      );
      await expect(
        activePanel.getByRole("link", { name: "Explore this service" }),
      ).toBeVisible();

      const capabilities = activePanel.locator(
        ".home-expertise-content__tags > *",
      );
      await expect(capabilities).not.toHaveCount(0);
      for (
        let capability = 0;
        capability < (await capabilities.count());
        capability += 1
      ) {
        await expect(capabilities.nth(capability)).toBeVisible();
      }
    }
  }
});

test("How We Work begins staggered, aligns through scroll, and reverses", async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto("/");
  await scrollInstant(page, 0);

  const cards = page.getByTestId("home-how-we-work").getByRole("listitem");
  const naturalTops = await documentTops(cards);
  const stickyTop = await cards
    .first()
    .evaluate((element) => Number.parseFloat(getComputedStyle(element).top));
  const range = naturalTops.at(-1)! - naturalTops[0];

  expect(range).toBeGreaterThan(700);
  await scrollInstant(page, naturalTops[0] - stickyTop);
  const entryTops = await viewportTops(cards);
  expect(entryTops[1] - entryTops[0]).toBeGreaterThan(200);

  await scrollInstant(page, naturalTops[0] - stickyTop + range / 2);
  const middleTops = await viewportTops(cards);
  expect(middleTops.at(-1)! - middleTops[0]).toBeLessThan(
    entryTops.at(-1)! - entryTops[0],
  );

  await scrollInstant(page, naturalTops.at(-1)! - stickyTop);
  const alignedTops = await viewportTops(cards);
  expect(Math.max(...alignedTops) - Math.min(...alignedTops)).toBeLessThan(3);

  await scrollInstant(page, naturalTops[0] - stickyTop);
  const reversedTops = await viewportTops(cards);
  expect(reversedTops[1] - reversedTops[0]).toBeGreaterThan(200);
});

test("Delivery Pathways stack in order and release after the final card", async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto("/");
  await scrollInstant(page, 0);

  const stack = page.getByTestId("home-engagement-showcase");
  const cards = stack.locator(".home-engagement-stack-card");
  const naturalTops = await documentTops(cards);
  const stickyTop = await cards
    .first()
    .evaluate((element) => Number.parseFloat(getComputedStyle(element).top));

  await scrollInstant(page, naturalTops[0] - stickyTop);
  const firstState = await viewportTops(cards);
  expect(firstState[0]).toBeCloseTo(stickyTop, 0);
  expect(firstState[1]).toBeGreaterThan(firstState[0] + 300);

  await scrollInstant(page, naturalTops[1] - stickyTop);
  const secondState = await viewportTops(cards);
  expect(Math.abs(secondState[1] - secondState[0])).toBeLessThan(3);

  await scrollInstant(page, naturalTops.at(-1)! - stickyTop);
  const finalState = await viewportTops(cards);
  expect(Math.max(...finalState) - Math.min(...finalState)).toBeLessThan(3);
  expect(
    await cards.evaluateAll((elements) =>
      elements.map((element) => Number(getComputedStyle(element).zIndex)),
    ),
  ).toEqual([1, 2, 3, 4]);

  await scrollInstant(page, naturalTops.at(-1)! - stickyTop + 220);
  const releasedState = await viewportTops(cards);
  expect(releasedState.at(-1)!).toBeLessThan(stickyTop);
  await expect(page.getByTestId("home-latest-insights")).toBeAttached();
});

test("reduced motion presents stable, non-sticky arrangements", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto("/");

  const processCards = page
    .getByTestId("home-how-we-work")
    .getByRole("listitem");
  const stackCards = page
    .getByTestId("home-engagement-showcase")
    .locator(".home-engagement-stack-card");

  expect(
    await processCards.evaluateAll((elements) =>
      elements.every(
        (element) =>
          getComputedStyle(element).position === "static" &&
          getComputedStyle(element).marginTop === "0px",
      ),
    ),
  ).toBe(true);
  expect(
    await stackCards.evaluateAll((elements) =>
      elements.every(
        (element) => getComputedStyle(element).position === "static",
      ),
    ),
  ).toBe(true);
});

for (const viewport of viewports) {
  test(`homepage interaction layout remains stable at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const geometry = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 1);
    await expect(
      page.getByRole("button", { name: "Next service" }),
    ).toBeVisible();

    const processPosition = await page
      .getByTestId("home-how-we-work")
      .getByRole("listitem")
      .first()
      .evaluate((element) => getComputedStyle(element).position);
    expect(processPosition).toBe(viewport.width >= 1280 ? "sticky" : "static");
  });
}

test("interaction pass introduces no serious accessibility or console errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .include("main")
    .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
    .analyze();
  expect(
    results.violations.filter(
      ({ impact }) => impact === "serious" || impact === "critical",
    ),
  ).toEqual([]);
  expect(errors).toEqual([]);
});
