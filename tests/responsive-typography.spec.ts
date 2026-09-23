import { expect, test, type Locator, type Page } from "@playwright/test";

const viewports = [
  { height: 568, width: 320 },
  { height: 800, width: 360 },
  { height: 667, width: 375 },
  { height: 844, width: 390 },
  { height: 932, width: 430 },
  { height: 1112, width: 834 },
  { height: 900, width: 1024 },
  { height: 900, width: 1280 },
  { height: 900, width: 1440 },
] as const;

async function lineWordCounts(locator: Locator) {
  return locator.evaluate((element) => {
    const lines = new Map<number, number>();
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) =>
        node.textContent?.trim()
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT,
    });
    let node = walker.nextNode();

    while (node) {
      const text = node.textContent ?? "";
      for (const word of text.matchAll(/\S+/gu)) {
        const range = document.createRange();
        const start = word.index ?? 0;
        range.setStart(node, start);
        range.setEnd(node, start + word[0].length);
        const bounds = range.getBoundingClientRect();

        if (bounds.width > 0) {
          const top = Math.round(bounds.top);
          lines.set(top, (lines.get(top) ?? 0) + 1);
        }
      }
      node = walker.nextNode();
    }

    return [...lines.entries()]
      .sort(([first], [second]) => first - second)
      .map(([, count]) => count);
  });
}

async function expectBalancedWrap(locator: Locator) {
  await expect(locator).toBeVisible();
  const counts = await lineWordCounts(locator);
  expect(counts.length).toBeGreaterThan(0);
  if (counts.length > 1) expect(counts.at(-1)).toBeGreaterThan(1);
}

async function expectNoHorizontalOverflow(locator: Locator) {
  await expect(locator).toBeVisible();
  const geometry = await locator.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 1);
}

async function expectNoDocumentOverflow(page: Page) {
  const geometry = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 1);
}

for (const viewport of viewports) {
  test(`homepage typography remains deliberate at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);

    const expertise = page.getByTestId("home-expertise");
    const implementationPanel = expertise.getByTestId(
      "expertise-service-implementation-onboarding",
    );
    const implementationLabel = implementationPanel.locator(
      ".home-expertise-button-title",
    );

    if (viewport.width < 1280) {
      await expectNoHorizontalOverflow(implementationLabel);
      await expectBalancedWrap(implementationLabel);
      if (viewport.width >= 430) {
        expect(await lineWordCounts(implementationLabel)).toHaveLength(1);
      }
    }

    const activePanel = expertise.locator('[data-active="true"]');
    const detailHeading = activePanel.locator("h3");
    await expectBalancedWrap(detailHeading);
    await expectNoHorizontalOverflow(detailHeading);

    const longCapability = activePanel
      .locator(".home-expertise-content__tags > span")
      .filter({ hasText: "Discovery and process mapping" })
      .first();
    await expectBalancedWrap(longCapability);
    await expectNoHorizontalOverflow(longCapability);

    await expectBalancedWrap(
      page.getByRole("heading", {
        name: "Expertise for the full HubSpot system.",
      }),
    );
    await expectBalancedWrap(
      page.getByRole("heading", {
        name: "Book a conversation with a HubSpot consultant.",
      }),
    );
    await expectBalancedWrap(
      page
        .getByRole("heading", {
          name: "What kind of HubSpot work does 42 handle?",
        })
        .locator("span")
        .first(),
    );

    const header = page.getByTestId("site-header");
    if (viewport.width >= 1024) {
      const logo = header.getByRole("link", {
        name: "42 HubSpot consultancy, home",
      });
      const navigation = header.getByRole("navigation", {
        name: "Primary navigation",
      });
      const consultation = header.getByRole("link", {
        name: /Book a consultation/,
      });
      const positions = await Promise.all(
        [logo, navigation, consultation].map((item) => item.boundingBox()),
      );
      expect(positions.every(Boolean)).toBe(true);
      expect(positions[0]!.x + positions[0]!.width).toBeLessThanOrEqual(
        positions[1]!.x,
      );
      expect(positions[1]!.x + positions[1]!.width).toBeLessThanOrEqual(
        positions[2]!.x,
      );
    } else {
      await expect(
        header.getByRole("button", { name: "Open navigation" }),
      ).toBeVisible();
    }

    if (viewport.width >= 1280) {
      const collapsedLabels = expertise.locator(
        '[data-active="false"] .home-expertise-button-title',
      );
      expect(
        await collapsedLabels.evaluateAll((elements) =>
          elements.every((element) => {
            const label = element.getBoundingClientRect();
            const button = element.closest("button")!.getBoundingClientRect();
            const style = getComputedStyle(element);
            return (
              style.writingMode === "vertical-rl" &&
              style.whiteSpace === "nowrap" &&
              label.top >= button.top - 1 &&
              label.right <= button.right + 1 &&
              label.bottom <= button.bottom + 1 &&
              label.left >= button.left - 1
            );
          }),
        ),
      ).toBe(true);
    }

    await expectNoHorizontalOverflow(page.getByTestId("site-footer"));
    await expectNoDocumentOverflow(page);
  });
}

test("collapsed expertise labels remain fully visible on wide screens", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const viewport of [
    { height: 900, width: 1280 },
    { height: 900, width: 1440 },
    { height: 1451, width: 2006 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);

    const geometry = await page
      .getByTestId("home-expertise")
      .locator('[data-active="false"] .home-expertise-button-title')
      .evaluateAll((elements) =>
        elements.map((element) => {
          const button = element.closest("button")!;
          const buttonBounds = button.getBoundingClientRect();
          const range = document.createRange();
          range.selectNodeContents(element);
          const textBounds = range.getBoundingClientRect();

          return {
            buttonDisplay: getComputedStyle(button).display,
            buttonBounds: {
              bottom: buttonBounds.bottom,
              left: buttonBounds.left,
              right: buttonBounds.right,
              top: buttonBounds.top,
            },
            clientHeight: element.clientHeight,
            clientWidth: element.clientWidth,
            scrollHeight: element.scrollHeight,
            scrollWidth: element.scrollWidth,
            textBounds: {
              bottom: textBounds.bottom,
              left: textBounds.left,
              right: textBounds.right,
              top: textBounds.top,
            },
          };
        }),
      );

    expect(geometry).toHaveLength(7);
    for (const label of geometry) {
      expect(label.buttonDisplay).toBe("flex");
      expect(label.clientWidth).toBeGreaterThan(0);
      expect(label.scrollWidth).toBeLessThanOrEqual(label.clientWidth + 1);
      expect(label.scrollHeight).toBeLessThanOrEqual(label.clientHeight + 1);
      expect(label.textBounds.top).toBeGreaterThanOrEqual(
        label.buttonBounds.top - 1,
      );
      expect(label.textBounds.bottom).toBeLessThanOrEqual(
        label.buttonBounds.bottom + 1,
      );
      expect(label.textBounds.left).toBeGreaterThanOrEqual(
        label.buttonBounds.left - 1,
      );
      expect(label.textBounds.right).toBeLessThanOrEqual(
        label.buttonBounds.right + 1,
      );
    }
  }
});

for (const viewport of viewports) {
  test(`shared page typography and cards reflow at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/services");
    await page.evaluate(() => document.fonts.ready);

    await expectBalancedWrap(page.getByRole("heading", { level: 1 }));
    await expectBalancedWrap(
      page.getByRole("heading", {
        name: "Design, build, connect, and improve HubSpot.",
      }),
    );
    await expectBalancedWrap(
      page.getByRole("heading", { name: "Websites and Content Hub" }).first(),
    );
    await expectBalancedWrap(
      page.getByRole("heading", {
        name: "An implementation that stopped at setup",
      }),
    );

    const audiencePill = page
      .locator(".rounded-full")
      .filter({
        hasText: "Companies already using HubSpot but underutilising it",
      })
      .first();
    await expectBalancedWrap(audiencePill);
    await expectNoHorizontalOverflow(audiencePill);

    for (const button of await page.locator("[data-button]:visible").all()) {
      await expectNoHorizontalOverflow(button);
    }

    await expectNoHorizontalOverflow(page.getByTestId("site-footer"));
    await expectNoDocumentOverflow(page);
  });
}
