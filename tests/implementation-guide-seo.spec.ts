import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const articlePath = "/insights/prepare-for-hubspot-crm-implementation";
const articleUrl = `https://company42.co${articlePath}`;
const articleTitle = "How to Prepare for a HubSpot CRM Implementation";
const seoTitle =
  "HubSpot CRM Implementation Guide: Checklist, Plan & Timeline | 42";
const seoDescription =
  "Plan your HubSpot CRM implementation with a practical checklist for CRM architecture, data migration, integrations, testing, training and go-live.";

async function structuredData(page: Page) {
  return (
    await page.locator('script[type="application/ld+json"]').allTextContents()
  ).flatMap((value) => {
    const parsed = JSON.parse(value) as
      Record<string, unknown> | Array<Record<string, unknown>>;
    return Array.isArray(parsed) ? parsed : [parsed];
  });
}

test.describe("HubSpot CRM implementation guide SEO", () => {
  test("publishes a practical guide with focused metadata and internal links", async ({
    page,
  }) => {
    const response = await page.goto(articlePath);

    expect(response?.status()).toBe(200);
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(
      page.getByRole("heading", { level: 1, name: articleTitle }),
    ).toBeVisible();
    await expect(page).toHaveTitle(seoTitle);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      seoDescription,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      articleUrl,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      "HubSpot CRM Implementation Guide: Checklist, Plan & Timeline",
    );
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
      "content",
      "HubSpot CRM Implementation Guide: Checklist, Plan & Timeline",
    );

    for (const heading of [
      "What a HubSpot CRM implementation actually involves",
      "HubSpot CRM implementation checklist",
      "How to structure a HubSpot implementation plan",
      "Prepare the data migration before configuration is finished",
      "Design CRM architecture and governance together",
      "Plan integrations, automation, and reporting as one system",
      "Test the system and prepare people before go-live",
      "What shapes a HubSpot implementation timeline",
      "Common HubSpot implementation mistakes",
      "When external HubSpot implementation support makes sense",
    ]) {
      await expect(
        page.getByRole("heading", { level: 2, name: heading }),
      ).toBeVisible();
    }

    const expectedLinks = [
      "/services/implementation-onboarding",
      "/services/hubspot-strategy-consulting",
      "/services/crm-revops",
      "/services/integrations-custom-development",
      "/services/automation-operations",
      "/contact",
    ];

    for (const href of expectedLinks) {
      await expect(page.locator(`article a[href="${href}"]`)).toHaveCount(1);
    }

    await expect(
      page.getByRole("link", { name: "By Thierry-Luc Denichaud" }),
    ).toHaveAttribute("href", "/insights/author/thierry-luc-denichaud");
    await expect(
      page.getByText("Planning a HubSpot implementation?", { exact: false }),
    ).toBeVisible();
  });

  test("retains accurate Article and Breadcrumb structured data", async ({
    page,
  }) => {
    test.skip(
      (process.env.SITE_ENVIRONMENT ?? "production") !== "production",
      "Production structured-data environment required",
    );

    await page.goto(articlePath);
    const records = await structuredData(page);
    const article = records.find((record) => record["@type"] === "Article");
    const breadcrumb = records.find(
      (record) => record["@type"] === "BreadcrumbList",
    );

    expect(article).toMatchObject({
      author: {
        "@type": "Person",
        name: "Thierry-Luc Denichaud",
        url: "https://company42.co/insights/author/thierry-luc-denichaud",
      },
      dateModified: "2026-10-19T00:00:00.000Z",
      datePublished: "2026-07-22T00:00:00.000Z",
      headline: articleTitle,
      mainEntityOfPage: articleUrl,
      url: articleUrl,
    });
    expect(breadcrumb).toBeDefined();

    const breadcrumbItems = breadcrumb?.itemListElement as
      Array<Record<string, unknown>> | undefined;
    expect(breadcrumbItems?.at(-1)).toMatchObject({
      item: articleUrl,
      name: articleTitle,
    });
  });

  test("remains accessible and reflows without horizontal overflow", async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(articlePath);

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
