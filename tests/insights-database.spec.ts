import { expect, test, type Page } from "@playwright/test";

const emma = {
  biography:
    "Emma connects marketing strategy with practical HubSpot onboarding, helping teams establish clear journeys, campaigns, content processes, and day-to-day ways of working.",
  image: "https://company42.co/images/team/emma-black.webp",
  name: "Emma Black",
  path: "/insights/author/emma-black",
  role: "Marketing Consultant / HubSpot Onboarding Specialist",
} as const;

const seededArticles = [
  {
    slug: "signs-your-hubspot-portal-needs-an-audit",
    title: "Signs Your HubSpot Portal Needs an Audit",
  },
  {
    slug: "prepare-for-hubspot-crm-implementation",
    title: "How to prepare for a HubSpot CRM implementation",
  },
  {
    slug: "before-connecting-your-website-to-hubspot",
    title: "What to check before connecting your website to HubSpot",
  },
  {
    slug: "why-your-crm-reports-are-not-reliable",
    title: "Why your CRM reports are not reliable",
  },
  {
    slug: "what-to-include-in-a-custom-integration-brief",
    title: "What to include in a custom integration brief",
  },
  {
    slug: "plan-a-website-redesign-around-crm-and-lead-capture",
    title: "How to plan a website redesign around CRM and lead capture",
  },
  {
    slug: "basic-website-accessibility-checks",
    title: "Basic website accessibility checks every business should do",
  },
  {
    slug: "what-managed-hubspot-support-should-include",
    title: "What managed HubSpot support should include",
  },
  {
    slug: "clean-up-duplicate-crm-properties",
    title: "How to clean up duplicate CRM properties",
  },
  {
    slug: "hubspot-pricing-and-ai-credits-explained",
    title: "HubSpot pricing and AI credits, made simple",
  },
  {
    slug: "what-to-decide-before-hubspot-configuration",
    title: "What to Decide Before You Touch HubSpot Configuration",
  },
  {
    slug: "the-pre-launch-checklist-your-website-team-is-probably-skipping",
    title: "The Pre-Launch Checklist Your Website Team Is Probably Skipping",
  },
  {
    slug: "when-hubspot-native-integrations-stop-being-enough",
    title: "When HubSpot's Native Integrations Stop Being Enough",
  },
] as const;

const emmaArticles = [
  seededArticles[0],
  seededArticles[10],
  seededArticles[11],
  seededArticles[12],
] as const;

const categories = [
  {
    articles: [
      seededArticles[1],
      seededArticles[7],
      seededArticles[9],
      seededArticles[10],
    ],
    name: "HubSpot Strategy & Implementation",
    slug: "hubspot-strategy-implementation",
  },
  {
    articles: [seededArticles[0], seededArticles[3], seededArticles[8]],
    name: "CRM, Data & RevOps",
    slug: "crm-data-revops",
  },
  {
    articles: [seededArticles[4], seededArticles[12]],
    name: "Integrations & Development",
    slug: "integrations-development",
  },
  {
    articles: [
      seededArticles[2],
      seededArticles[5],
      seededArticles[6],
      seededArticles[11],
    ],
    name: "Websites, Content Hub & Accessibility",
    slug: "websites-content-hub-accessibility",
  },
] as const;

const forbiddenStatusCopy = [
  "Approval required",
  "Owner review required",
  "Development portrait",
  "Development preview",
  "Draft portrait",
  "Placeholder portrait",
] as const;

async function structuredData(page: Page) {
  return (
    await page.locator('script[type="application/ld+json"]').allTextContents()
  ).flatMap((value) => {
    const parsed = JSON.parse(value) as
      Record<string, unknown> | Array<Record<string, unknown>>;
    return Array.isArray(parsed) ? parsed : [parsed];
  });
}

test("Insights index lists every seeded database article and links all populated categories", async ({
  page,
}) => {
  const response = await page.goto("/insights");

  expect(response?.status()).toBe(200);
  for (const article of seededArticles) {
    const link = page.locator(`a[href="/insights/${article.slug}"]`).first();
    await expect(link).toBeVisible();
    await expect(
      page.getByRole("heading", { exact: true, name: article.title }).first(),
    ).toBeVisible();
  }

  for (const category of categories) {
    await expect(
      page.getByRole("link", { exact: true, name: category.name }),
    ).toHaveAttribute("href", `/insights/category/${category.slug}`);
  }
});

for (const article of emmaArticles) {
  test(`${article.slug} renders as an Emma Black article`, async ({ page }) => {
    const response = await page.goto(`/insights/${article.slug}`);

    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { level: 1, name: article.title }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { exact: true, name: `By ${emma.name}` }),
    ).toHaveAttribute("href", emma.path);
    await expect(
      page.getByRole("heading", { level: 2, name: emma.name }),
    ).toBeVisible();
    await expect(page.getByText(emma.role, { exact: true })).toBeVisible();
    await expect(page.getByText(emma.biography, { exact: true })).toBeVisible();

    for (const label of forbiddenStatusCopy) {
      await expect(page.getByText(label, { exact: false })).toHaveCount(0);
    }
  });
}

test("Emma author page publishes the approved author record and exactly four articles", async ({
  page,
}) => {
  const response = await page.goto(emma.path);

  expect(response?.status()).toBe(200);
  await expect(
    page.getByRole("heading", { level: 1, name: emma.name }),
  ).toBeVisible();
  await expect(page.getByText(emma.role, { exact: true })).toBeVisible();
  await expect(page.getByText(emma.biography, { exact: true })).toHaveCount(2);

  const collection = page.locator("section").filter({
    has: page.getByRole("heading", {
      exact: true,
      name: `Guides by ${emma.name}.`,
    }),
  });
  await expect(collection.locator("article")).toHaveCount(4);
  for (const article of emmaArticles) {
    await expect(
      collection.locator(`a[href="/insights/${article.slug}"]`).first(),
    ).toBeVisible();
  }

  for (const label of forbiddenStatusCopy) {
    await expect(page.getByText(label, { exact: false })).toHaveCount(0);
  }
});

for (const category of categories) {
  test(`${category.slug} loads its database-backed collection`, async ({
    page,
  }) => {
    const response = await page.goto(`/insights/category/${category.slug}`);

    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { level: 1, name: category.name }),
    ).toBeVisible();
    for (const article of category.articles) {
      await expect(
        page.locator(`a[href="/insights/${article.slug}"]`).first(),
      ).toBeVisible();
    }
  });
}

test("article service and related-Insight relations render as functional links", async ({
  page,
}) => {
  await page.goto(
    "/insights/when-hubspot-native-integrations-stop-being-enough",
  );

  await expect(
    page.getByRole("heading", {
      exact: true,
      name: "Turn the thinking into a working system.",
    }),
  ).toBeVisible();
  await expect(
    page.locator('a[href="/services/integrations-custom-development"]'),
  ).not.toHaveCount(0);
  await expect(page.locator('a[href="/services/crm-revops"]')).not.toHaveCount(
    0,
  );

  await expect(
    page.getByRole("heading", {
      exact: true,
      name: "Related practical guides.",
    }),
  ).toBeVisible();
  for (const slug of [
    "what-to-include-in-a-custom-integration-brief",
    "why-your-crm-reports-are-not-reliable",
    "what-to-decide-before-hubspot-configuration",
  ]) {
    await expect(
      page.locator(`a[href="/insights/${slug}"]`).first(),
    ).toBeVisible();
  }
});

test("unknown database article, category, and author slugs return genuine 404 responses", async ({
  page,
}) => {
  for (const route of [
    "/insights/not-a-published-article",
    "/insights/category/not-a-published-category",
    "/insights/author/not-a-published-author",
  ]) {
    const response = await page.goto(route);
    expect(response?.status(), `${route} should return HTTP 404`).toBe(404);
    await expect(page.getByText("Error 404")).toBeVisible();
  }
});

test("production article and author metadata use the published database records", async ({
  page,
}) => {
  test.skip(
    process.env.SITE_ENVIRONMENT !== "production",
    "Production metadata semantics",
  );

  const article = emmaArticles[0];
  const articlePath = `/insights/${article.slug}`;
  await page.goto(articlePath);

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `https://company42.co${articlePath}`,
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "Most HubSpot problems appear as small, familiar workarounds. These signals show when the portal needs a structured review rather than one more local fix.",
  );

  const articleRecords = await structuredData(page);
  const articleRecord = articleRecords.find(
    (record) => record["@type"] === "Article",
  );
  expect(articleRecord).toMatchObject({
    author: {
      "@type": "Person",
      description: emma.biography,
      image: emma.image,
      jobTitle: emma.role,
      name: emma.name,
      url: `https://company42.co${emma.path}`,
    },
    headline: article.title,
    mainEntityOfPage: `https://company42.co${articlePath}`,
    url: `https://company42.co${articlePath}`,
  });

  await page.goto(emma.path);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `https://company42.co${emma.path}`,
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    emma.biography,
  );

  const authorRecords = await structuredData(page);
  const personRecord = authorRecords.find(
    (record) => record["@type"] === "Person",
  );
  expect(personRecord).toMatchObject({
    description: emma.biography,
    image: emma.image,
    jobTitle: emma.role,
    name: emma.name,
    url: `https://company42.co${emma.path}`,
  });
});
