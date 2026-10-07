import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("HubSpot review landing page", () => {
  test("is linked from the homepage diagnostic pathway", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("link", { name: "Explore the HubSpot review" }),
    ).toHaveAttribute("href", "/hubspot-review");
  });

  test("presents a focused, factual review path", async ({ page }) => {
    const response = await page.goto("/hubspot-review");

    expect(response?.ok()).toBeTruthy();
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Find out what is holding your HubSpot portal back.",
    );
    await expect(page).toHaveTitle("HubSpot CRM audit and portal review | 42");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /United States and New Zealand/,
    );
    await expect(
      page.getByRole("link", { name: "Request a HubSpot review" }),
    ).toHaveCount(2);
    await expect(
      page.getByRole("link", { name: "Request a HubSpot review" }).first(),
    ).toHaveAttribute("href", "/contact");
    const relatedInsightLinks = page.locator(
      'a[href="/insights/signs-your-hubspot-portal-needs-an-audit"]',
    );
    await expect(relatedInsightLinks).toHaveCount(2);
    await expect(relatedInsightLinks.last()).toHaveAttribute(
      "href",
      "/insights/signs-your-hubspot-portal-needs-an-audit",
    );
    await expect(
      page.getByRole("heading", {
        name: "Signs Your HubSpot Portal Needs an Audit",
      }),
    ).toBeVisible();

    const visibleCopy = await page.locator("main").innerText();
    expect(visibleCopy).toContain("HubSpot audit");
    expect(visibleCopy).not.toMatch(
      /partner tier|certified partner|guaranteed result|fixed price|office in/i,
    );
  });

  test("publishes accurate review service schema in production", async ({
    page,
  }) => {
    test.skip(
      (process.env.SITE_ENVIRONMENT ?? "production") !== "production",
      "Production structured-data environment required",
    );

    await page.goto("/hubspot-review");
    const records = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).flatMap((value) => {
      const parsed = JSON.parse(value) as
        Record<string, unknown> | Array<Record<string, unknown>>;
      return Array.isArray(parsed) ? parsed : [parsed];
    });
    const service = records.find((record) => record["@type"] === "Service");

    expect(service).toMatchObject({
      areaServed: [
        { "@type": "Country", name: "United States" },
        { "@type": "Country", name: "New Zealand" },
      ],
      name: "HubSpot audit and portal review",
      serviceType: "HubSpot audit and portal review",
      url: "https://company42.co/hubspot-review",
    });
  });

  test("remains accessible and reflows on mobile", async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/hubspot-review");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);

    if (testInfo.project.name.includes("mobile")) {
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);
    }
  });
});
