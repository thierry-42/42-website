import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const representativeRoutes = [
  "/",
  "/services",
  "/services/hubspot-strategy-consulting",
  "/about",
  "/insights",
  "/insights/signs-your-hubspot-portal-needs-an-audit",
  "/contact",
  "/privacy",
  "/terms",
  "/accessibility",
];

async function openPreferences(page: Page) {
  await page.getByRole("button", { name: "Open visual preferences" }).click();
  await expect(
    page.getByRole("heading", { name: "Visual preferences" }),
  ).toBeVisible();
}

test("representative pages and the open panel have no serious WCAG violations", async ({
  page,
}) => {
  await page.route("https://js-*.hsforms.net/**", async (route) => {
    await route.fulfill({
      body: "",
      contentType: "application/javascript",
      status: 200,
    });
  });

  for (const route of representativeRoutes) {
    const response = await page.goto(route);
    expect(response?.ok(), `${route} should load`).toBeTruthy();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations, `${route} should pass Axe`).toEqual([]);
  }

  await page.goto("/");
  await openPreferences(page);
  const panelResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(panelResults.violations).toEqual([]);
});

test("panel reflows at 320 CSS pixels and at a 200 percent zoom proxy", async ({
  page,
}) => {
  for (const viewport of [
    { width: 320, height: 800 },
    { width: 640, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await openPreferences(page);

    const panel = page.locator("#visual-preferences-panel");
    const box = await panel.boundingBox();
    expect(box).not.toBeNull();
    expect(box?.x ?? -1).toBeGreaterThanOrEqual(0);
    expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(
      viewport.width,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBeTruthy();

    await page
      .getByRole("button", { name: "Close visual preferences" })
      .click();
  }
});

test("all brand, vision and contrast combinations meet token contrast thresholds", async ({
  page,
}) => {
  await page.goto("/");

  const results = await page.evaluate(() => {
    const brandThemes = ["current", "brand-kit"] as const;
    const visionModes = [
      "standard",
      "protan",
      "deutan",
      "tritan",
      "monochrome",
    ] as const;
    const contrastModes = ["standard", "high"] as const;
    const probe = document.createElement("span");
    probe.hidden = true;
    document.body.appendChild(probe);

    type Colour = { red: number; green: number; blue: number; alpha: number };

    const parseColour = (value: string): Colour => {
      const values = value.match(/[\d.]+/g)?.map(Number) ?? [];
      return {
        red: values[0] ?? 0,
        green: values[1] ?? 0,
        blue: values[2] ?? 0,
        alpha: values[3] ?? 1,
      };
    };
    const resolve = (token: string) => {
      probe.style.color = `var(${token})`;
      return parseColour(getComputedStyle(probe).color);
    };
    const composite = (foreground: Colour, background: Colour): Colour => ({
      red:
        foreground.red * foreground.alpha +
        background.red * (1 - foreground.alpha),
      green:
        foreground.green * foreground.alpha +
        background.green * (1 - foreground.alpha),
      blue:
        foreground.blue * foreground.alpha +
        background.blue * (1 - foreground.alpha),
      alpha: 1,
    });
    const luminance = (colour: Colour) => {
      const channel = (value: number) => {
        const normalised = value / 255;
        return normalised <= 0.04045
          ? normalised / 12.92
          : ((normalised + 0.055) / 1.055) ** 2.4;
      };
      return (
        channel(colour.red) * 0.2126 +
        channel(colour.green) * 0.7152 +
        channel(colour.blue) * 0.0722
      );
    };
    const ratio = (foregroundToken: string, backgroundToken: string) => {
      const white = { red: 255, green: 255, blue: 255, alpha: 1 };
      const background = composite(resolve(backgroundToken), white);
      const foreground = composite(resolve(foregroundToken), background);
      const first = luminance(foreground);
      const second = luminance(background);
      return (
        (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05)
      );
    };

    const checks = [
      ["body-canvas", "--colour-text", "--colour-canvas", 4.5],
      ["body-surface", "--colour-text", "--colour-surface", 4.5],
      ["muted-canvas", "--colour-text-muted", "--colour-canvas", 4.5],
      ["heading-canvas", "--colour-heading", "--colour-canvas", 4.5],
      [
        "inverse-text",
        "--colour-text-inverse",
        "--colour-surface-inverse",
        4.5,
      ],
      [
        "inverse-muted",
        "--colour-text-inverse-muted",
        "--colour-surface-inverse",
        4.5,
      ],
      ["primary-action", "--colour-action-text", "--colour-action", 4.5],
      [
        "secondary-action",
        "--colour-action-secondary-text",
        "--colour-action-secondary",
        4.5,
      ],
      ["link", "--colour-link", "--colour-canvas", 4.5],
      ["visited-link", "--colour-link-visited", "--colour-canvas", 4.5],
      ["focus", "--colour-focus", "--colour-canvas", 3],
      [
        "inverse-focus",
        "--colour-focus-inverse",
        "--colour-surface-inverse",
        3,
      ],
      ["control-border", "--colour-border-strong", "--colour-surface", 3],
      ["info-text", "--colour-info-text", "--colour-info-bg", 4.5],
      ["info-border", "--colour-info-border", "--colour-info-bg", 3],
      ["success-text", "--colour-success-text", "--colour-success-bg", 4.5],
      ["success-border", "--colour-success-border", "--colour-success-bg", 3],
      ["warning-text", "--colour-warning-text", "--colour-warning-bg", 4.5],
      ["warning-border", "--colour-warning-border", "--colour-warning-bg", 3],
      ["error-text", "--colour-error-text", "--colour-error-bg", 4.5],
      ["error-border", "--colour-error-border", "--colour-error-bg", 3],
    ] as const;

    const matrix = [];
    for (const brandTheme of brandThemes) {
      for (const visionMode of visionModes) {
        for (const contrastMode of contrastModes) {
          document.documentElement.dataset.brandTheme = brandTheme;
          document.documentElement.dataset.visionMode = visionMode;
          document.documentElement.dataset.contrastMode = contrastMode;
          matrix.push({
            mode: `${brandTheme}/${visionMode}/${contrastMode}`,
            checks: checks.map(([name, foreground, background, threshold]) => ({
              name,
              ratio: ratio(foreground, background),
              threshold,
            })),
          });
        }
      }
    }

    probe.remove();
    return matrix;
  });

  for (const mode of results) {
    for (const check of mode.checks) {
      expect(
        check.ratio,
        `${mode.mode}: ${check.name} expected ${check.threshold}:1, received ${check.ratio.toFixed(2)}:1`,
      ).toBeGreaterThanOrEqual(check.threshold);
    }
  }

  const minimum = Math.min(
    ...results.flatMap((mode) => mode.checks.map((check) => check.ratio)),
  );
  console.log(
    `Visual preference minimum validated ratio: ${minimum.toFixed(2)}:1`,
  );
});
