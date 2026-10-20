import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const articlePath = "/insights/signs-your-hubspot-portal-needs-an-audit";
const articleUrl = `https://company42.co${articlePath}`;
const articleTitle = "Signs Your HubSpot Portal Needs an Audit";
const storedSeoTitle = "HubSpot Audit Guide: CRM, Portal & Data Checklist";
const seoTitle = `${storedSeoTitle} | 42`;
const seoDescription =
  "Learn what a HubSpot audit should cover across CRM architecture, data, workflows, reporting, integrations and governance, with a practical checklist.";
const articleSummary =
  "Recognise when your HubSpot portal needs an audit, understand what to examine, and turn findings across CRM, data, automation, reporting, integrations, and governance into a prioritised remediation roadmap.";

async function structuredData(page: Page) {
  return (
    await page.locator('script[type="application/ld+json"]').allTextContents()
  ).flatMap((value) => {
    const parsed = JSON.parse(value) as
      Record<string, unknown> | Array<Record<string, unknown>>;
    return Array.isArray(parsed) ? parsed : [parsed];
  });
}

test.describe("HubSpot audit guide SEO", () => {
  test("publishes a practical audit guide with focused metadata and links", async ({
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
      storedSeoTitle,
    );
    await expect(
      page.locator('meta[property="og:description"]'),
    ).toHaveAttribute("content", seoDescription);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
      "content",
      storedSeoTitle,
    );
    await expect(
      page.locator('meta[name="twitter:description"]'),
    ).toHaveAttribute("content", seoDescription);

    for (const heading of [
      "What is a HubSpot audit?",
      "Signs your HubSpot portal needs an audit",
      "What a complete HubSpot audit should examine",
      "HubSpot audit checklist",
      "What should a HubSpot audit deliver?",
      "What should happen after the audit?",
      "When external HubSpot audit support makes sense",
    ]) {
      await expect(
        page.getByRole("heading", { level: 2, name: heading }),
      ).toBeVisible();
    }

    for (const heading of [
      "HubSpot CRM audit: architecture and process",
      "HubSpot data audit: quality, ownership, and associations",
      "HubSpot automation audit: logic, dependencies, and risk",
      "HubSpot reporting audit: trace unreliable numbers upstream",
      "HubSpot integration audit: map every data movement",
      "Permissions and governance audit",
      "Marketing and content audit",
    ]) {
      await expect(
        page.getByRole("heading", { level: 3, name: heading }),
      ).toBeVisible();
    }

    const expectedLinks = [
      "/hubspot-review",
      "/services/hubspot-strategy-consulting",
      "/services/crm-revops",
      "/services/automation-operations",
      "/services/integrations-custom-development",
      "/services/managed-hubspot-support",
      "/contact",
    ];

    for (const href of expectedLinks) {
      await expect(page.locator(`article a[href="${href}"]`)).toHaveCount(1);
    }

    await expect(
      page.getByRole("link", { name: "By Emma Black" }),
    ).toHaveAttribute("href", "/insights/author/emma-black");
    await expect(
      page.getByText("Not sure what is happening inside your HubSpot portal?", {
        exact: false,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Request a HubSpot review" }),
    ).toHaveAttribute("href", "/contact");
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
        name: "Emma Black",
        url: "https://company42.co/insights/author/emma-black",
      },
      dateModified: "2026-10-20T00:00:00.000Z",
      datePublished: "2026-09-23T00:00:00.000Z",
      description: articleSummary,
      headline: articleTitle,
      mainEntityOfPage: articleUrl,
      url: articleUrl,
    });
    expect(breadcrumb).toBeDefined();
    expect(records.some((record) => record["@type"] === "FAQPage")).toBe(false);

    const breadcrumbItems = breadcrumb?.itemListElement as
      Array<Record<string, unknown>> | undefined;
    expect(breadcrumbItems?.at(-1)).toMatchObject({
      item: articleUrl,
      name: articleTitle,
      position: 4,
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
