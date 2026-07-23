import { expect, test, type Page } from "@playwright/test";

const authorPath = "/insights/author/thierry-luc-denichaud";
const articlePath = "/insights/signs-your-hubspot-portal-needs-an-audit";
const authorName = "Thierry-Luc Denichaud";
const authorRole = "Founder & Senior HubSpot Consultant";
const fullBiography =
  "Thierry-Luc Denichaud is the founder of 42 and a senior HubSpot consultant with more than a decade of experience across CRM, CMS, platform architecture, systems integration and digital delivery. He has led website and engineering teams, designed enterprise-scale digital platforms, and delivered HubSpot programmes spanning CRM architecture, automation, RevOps, Service Hub, websites and custom integrations. His work focuses on turning complex business processes into clear, scalable and maintainable systems that teams can adopt and leaders can trust.";
const shortBiography =
  "Thierry-Luc Denichaud is the founder of 42 and a senior HubSpot consultant specialising in CRM architecture, automation, integrations, websites and enterprise digital platforms.";
const removedPublicCopy = [
  "Owner review required",
  "Development preview of the author-page structure",
  "Development portrait",
  "Biography and portrait require final owner approval",
  "Author preview / owner review required",
  "Preview author page",
];

async function structuredData(page: Page) {
  return (
    await page.locator('script[type="application/ld+json"]').allTextContents()
  ).flatMap((value) => {
    const parsed = JSON.parse(value) as
      Record<string, unknown> | Array<Record<string, unknown>>;
    return Array.isArray(parsed) ? parsed : [parsed];
  });
}

test("approved author profile publishes the supplied copy and metadata", async ({
  page,
}) => {
  const response = await page.goto(authorPath);

  expect(response?.status()).toBe(200);
  await expect(
    page.getByRole("heading", { level: 1, name: authorName }),
  ).toBeVisible();
  await expect(page.getByText(authorRole, { exact: true })).toBeVisible();
  await expect(page.getByText(shortBiography, { exact: true })).toBeVisible();
  await expect(page.getByText(fullBiography, { exact: true })).toBeVisible();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    shortBiography,
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "https://company42.co/images/team/thierry-luc.webp",
  );
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
    "content",
    "Thierry-Luc Denichaud, founder of 42",
  );

  for (const text of removedPublicCopy) {
    await expect(page.getByText(text, { exact: false })).toHaveCount(0);
  }

  const records = await structuredData(page);
  const person = records.find((record) => record["@type"] === "Person");
  expect(person).toMatchObject({
    description: fullBiography,
    image: "https://company42.co/images/team/thierry-luc.webp",
    jobTitle: authorRole,
    name: authorName,
    url: `https://company42.co${authorPath}`,
  });

  const portrait = page.getByRole("img", {
    name: "Thierry-Luc Denichaud, founder of 42",
  });
  await expect(portrait).toBeVisible();
  await expect(portrait).toHaveAttribute("width", "1024");
  await expect(portrait).toHaveAttribute("height", "1280");

  const sitemap = await (await page.request.get("/sitemap.xml")).text();
  expect(sitemap).toContain(`<loc>https://company42.co${authorPath}</loc>`);
});

test("articles link to the public profile and expose consistent author data", async ({
  page,
}) => {
  await page.goto(articlePath);

  const byline = page.getByRole("link", { name: `By ${authorName}` });
  await expect(byline).toHaveAttribute("href", authorPath);
  await expect(
    page.getByRole("heading", { level: 2, name: authorName }),
  ).toBeVisible();
  await expect(page.getByText(authorRole, { exact: true })).toBeVisible();
  await expect(page.getByText(shortBiography, { exact: true })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "View author profile" }),
  ).toHaveAttribute("href", authorPath);

  for (const text of removedPublicCopy) {
    await expect(page.getByText(text, { exact: false })).toHaveCount(0);
  }

  const records = await structuredData(page);
  const article = records.find((record) => record["@type"] === "Article");
  expect(article?.author).toMatchObject({
    "@type": "Person",
    description: fullBiography,
    image: "https://company42.co/images/team/thierry-luc.webp",
    jobTitle: authorRole,
    name: authorName,
    url: `https://company42.co${authorPath}`,
  });
});
