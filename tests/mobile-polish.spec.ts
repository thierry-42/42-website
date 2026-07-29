import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const mobileViewports = [
  { height: 568, width: 320 },
  { height: 667, width: 375 },
  { height: 844, width: 390 },
  { height: 932, width: 430 },
] as const;

const representativeRoutes = [
  "/",
  "/services",
  "/services/implementation-onboarding",
  "/approach",
  "/about",
  "/contact",
] as const;

const answerModes = ["understand", "architect", "build", "enable"] as const;

async function expectNoDocumentOverflow(page: Page, route: string) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(
    dimensions.scrollWidth,
    `${route} should not overflow at ${dimensions.clientWidth}px`,
  ).toBeLessThanOrEqual(dimensions.clientWidth + 1);
}

async function answerDiagramGeometry(page: Page) {
  return page.evaluate(() => {
    const toRect = (element: Element) => {
      const rect = element.getBoundingClientRect();
      return {
        bottom: rect.bottom,
        height: rect.height,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        width: rect.width,
      };
    };
    const centre = document.querySelector('[data-testid="hero-answer-centre"]');
    const field = document.querySelector('[data-testid="hero-answer-field"]');
    const signals = Array.from(
      document.querySelectorAll('[data-testid="hero-answer-signal"]'),
    );

    return {
      centre: centre ? toRect(centre) : null,
      fieldHeight: field?.getBoundingClientRect().height ?? 0,
      signals: signals.map(toRect),
    };
  });
}

function rectanglesOverlap(
  first: {
    bottom: number;
    left: number;
    right: number;
    top: number;
  },
  second: {
    bottom: number;
    left: number;
    right: number;
    top: number;
  },
) {
  return !(
    first.right <= second.left + 1 ||
    first.left >= second.right - 1 ||
    first.bottom <= second.top + 1 ||
    first.top >= second.bottom - 1
  );
}

async function expectStableAnswerDiagram(page: Page) {
  const geometry = await answerDiagramGeometry(page);
  expect(geometry.centre).not.toBeNull();
  expect(geometry.signals).toHaveLength(3);

  if (!geometry.centre) return geometry.fieldHeight;

  for (const signal of geometry.signals) {
    expect(rectanglesOverlap(geometry.centre, signal)).toBe(false);
  }

  for (let first = 0; first < geometry.signals.length; first += 1) {
    for (
      let second = first + 1;
      second < geometry.signals.length;
      second += 1
    ) {
      expect(
        rectanglesOverlap(geometry.signals[first], geometry.signals[second]),
      ).toBe(false);
    }
  }

  return geometry.fieldHeight;
}

async function capture(
  page: Page,
  locator: Locator,
  name: string,
): Promise<void> {
  const artifactDirectory = process.env.MOBILE_POLISH_ARTIFACT_DIR;
  if (!artifactDirectory) return;

  await mkdir(artifactDirectory, { recursive: true });
  await locator.screenshot({
    animations: "disabled",
    path: path.join(artifactDirectory, name),
  });
}

for (const viewport of mobileViewports) {
  test(`public routes reflow without document overflow at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);

    for (const route of representativeRoutes) {
      await page.goto(route);
      await expectNoDocumentOverflow(page, route);
    }
  });
}

test("mobile cards are content-driven and use legible output titles", async ({
  page,
}) => {
  await page.setViewportSize({ height: 844, width: 390 });

  await page.goto("/approach");
  const outputCards = page.getByTestId("typical-output-card");
  expect(await outputCards.count()).toBeGreaterThan(0);
  const firstOutput = outputCards.locator("p").filter({
    hasText: "Goals and measures of success",
  });
  await expect(firstOutput).toHaveCSS("font-size", "19.5px");
  expect(
    await outputCards.evaluateAll((elements) =>
      elements.every((element) => {
        const value = getComputedStyle(element).minHeight;
        return value === "auto" || Number.parseFloat(value) <= 1;
      }),
    ),
  ).toBe(true);

  await page.goto("/services/implementation-onboarding");
  const deliverableCards = page.getByTestId("deliverable-card");
  expect(await deliverableCards.count()).toBeGreaterThan(0);
  expect(
    await deliverableCards.evaluateAll((elements) =>
      elements.every((element) => {
        const value = getComputedStyle(element).minHeight;
        return value === "auto" || Number.parseFloat(value) <= 1;
      }),
    ),
  ).toBe(true);
  const deliverableTitle = deliverableCards.locator("h3");
  const sizes = await deliverableTitle.evaluateAll((elements) =>
    elements.map((element) =>
      Number.parseFloat(getComputedStyle(element).fontSize),
    ),
  );
  expect(Math.min(...sizes)).toBeGreaterThanOrEqual(18);
});

test("stakeholders use one compact semantic mobile list", async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });

  for (const route of ["/services", "/about"]) {
    await page.goto(route);
    const list = page.getByTestId("stakeholder-list");
    await expect(list).toHaveCount(1);
    await expect(list).toHaveCSS("display", "grid");
    await expect(list.getByRole("listitem")).toHaveCount(8);
    await expectNoDocumentOverflow(page, route);

    if (route === "/services") {
      await capture(page, list, "after-stakeholders-390.png");
    }
  }
});

for (const viewport of mobileViewports) {
  test(`About principle title avoids an orphan at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/about");

    const card = page
      .getByTestId("principle-spotlight")
      .filter({ hasText: "Keep it as simple as it can be" });
    const title = card.getByText("Keep it as simple as it can be", {
      exact: true,
    });
    const lineWordCounts = await title.evaluate((element) => {
      const node = element.firstChild;
      if (!node || node.nodeType !== Node.TEXT_NODE) return [];

      const text = node.textContent ?? "";
      const words = [...text.matchAll(/\S+/gu)];
      const lines = new Map<number, number>();

      for (const word of words) {
        const range = document.createRange();
        const start = word.index ?? 0;
        range.setStart(node, start);
        range.setEnd(node, start + word[0].length);
        const top = Math.round(range.getBoundingClientRect().top);
        lines.set(top, (lines.get(top) ?? 0) + 1);
      }

      return [...lines.entries()]
        .sort(([first], [second]) => first - second)
        .map(([, count]) => count);
    });

    expect(lineWordCounts.at(-1)).toBeGreaterThan(1);

    if (viewport.width === 390) {
      await capture(page, card, "after-about-principle-390.png");
    }
  });
}

test("answer diagram stays stable in every mode and visual preference", async ({
  page,
}) => {
  await page.setViewportSize({ height: 568, width: 320 });
  await page.goto("/");

  const heights: number[] = [];
  for (const mode of answerModes) {
    await page.getByTestId(`hero-mode-${mode}`).click();
    heights.push(await expectStableAnswerDiagram(page));
  }

  expect(Math.max(...heights) - Math.min(...heights)).toBeLessThanOrEqual(1);

  const preferences = page.getByRole("button", {
    name: "Open visual preferences",
  });
  await preferences.click();

  for (const option of [
    "Dark",
    "Protan support",
    "Deutan support",
    "Tritan support",
    "Monochrome",
    "High contrast",
  ]) {
    await page.getByRole("radio", { name: option }).check();
    await expectStableAnswerDiagram(page);
  }

  await page.getByRole("button", { name: "Close visual preferences" }).click();
  await capture(
    page,
    page.getByTestId("hero-answer-field"),
    "after-answer-diagram-320.png",
  );
});

test("footer ends the document and floating controls stay separate", async ({
  page,
}) => {
  await page.setViewportSize({ height: 568, width: 320 });
  await page.goto("/services");
  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  );
  await expect(
    page.getByRole("button", { name: "Scroll to top" }),
  ).toHaveAttribute("aria-hidden", "false");
  await page.waitForTimeout(250);

  const geometry = await page.evaluate(() => {
    const footer = document.querySelector("footer");
    const preferences = document.querySelector(
      'button[aria-label="Open visual preferences"]',
    );
    const scrollTop = document.querySelector(
      'button[aria-label="Scroll to top"]',
    );
    const toRect = (element: Element | null) => {
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return {
        bottom: rect.bottom,
        height: rect.height,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        width: rect.width,
      };
    };
    const footerRect = footer?.getBoundingClientRect();

    return {
      afterFooter: footerRect
        ? Math.round(
            document.documentElement.scrollHeight -
              (footerRect.bottom + window.scrollY),
          )
        : null,
      preferences: toRect(preferences),
      scrollTop: toRect(scrollTop),
    };
  });

  expect(geometry.afterFooter).toBe(0);
  expect(geometry.preferences).not.toBeNull();
  expect(geometry.scrollTop).not.toBeNull();

  if (geometry.preferences && geometry.scrollTop) {
    expect(geometry.preferences.height).toBeGreaterThanOrEqual(44);
    expect(geometry.preferences.width).toBeGreaterThanOrEqual(44);
    expect(geometry.scrollTop.height).toBeGreaterThanOrEqual(44);
    expect(geometry.scrollTop.width).toBeGreaterThanOrEqual(44);
    expect(rectanglesOverlap(geometry.preferences, geometry.scrollTop)).toBe(
      false,
    );
  }

  await capture(page, page.getByTestId("site-footer"), "after-footer-320.png");
});

test("mobile changes introduce no serious accessibility violations", async ({
  page,
}) => {
  await page.setViewportSize({ height: 844, width: 390 });

  for (const route of ["/", "/about", "/approach"]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .include("main")
      .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
      .analyze();
    const seriousViolations = results.violations.filter(
      ({ impact }) => impact === "serious" || impact === "critical",
    );

    expect(
      seriousViolations,
      `${route} should pass targeted axe checks`,
    ).toEqual([]);
  }
});

test("320px reflow remains stable at a 200 percent text scale", async ({
  page,
}) => {
  await page.setViewportSize({ height: 568, width: 320 });
  await page.goto("/about");
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });

  await expectNoDocumentOverflow(page, "/about at 200% text scale");
});
