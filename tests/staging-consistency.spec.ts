import { expect, test } from "@playwright/test";

import siteContentData from "../src/content/site-content.json";

const unpublishedRoutes = ["/industries", "/audience", "/work"] as const;
const forbiddenNavigationLabels = [
  "Industries",
  "Work",
  "Who 42 helps",
  "Audience",
] as const;
const approvalLabels = [
  "Development portrait",
  "Approval required",
  "Development portrait / approval required",
  "Draft portrait",
  "Placeholder portrait",
  "Owner review required",
] as const;

const publishedServices = siteContentData.services.filter(
  (service) => service.isPublished,
);
const publishedInsights = siteContentData.insights.filter(
  (insight) => insight.isPublished && !insight.isPlaceholder,
);
const publishedCategories = siteContentData.insightCategories.filter(
  (category) =>
    category.isPublished &&
    publishedInsights.some((insight) => insight.categorySlug === category.slug),
);
const publishedAuthors = siteContentData.authors.filter(
  (author) =>
    author.isPublished &&
    publishedInsights.some((insight) => insight.authorSlug === author.slug),
);
const publicRoutes = [
  "/",
  "/services",
  ...publishedServices.map((service) => `/services/${service.slug}`),
  "/approach",
  "/about",
  "/insights",
  ...publishedInsights.map((insight) => `/insights/${insight.slug}`),
  ...publishedCategories.map(
    (category) => `/insights/category/${category.slug}`,
  ),
  ...publishedAuthors.map((author) => `/insights/author/${author.slug}`),
  "/hubspot-review",
  "/contact",
  "/privacy",
  "/terms",
  "/accessibility",
];

test("every public route renders the current shared shell", async ({
  request,
}) => {
  for (const route of publicRoutes) {
    const response = await request.get(route);
    expect(response.status(), `${route} should load`).toBe(200);

    const html = await response.text();
    expect(html, `${route} should render the shared header`).toContain(
      'data-testid="site-header"',
    );
    expect(html, `${route} should render the shared footer`).toContain(
      'data-testid="site-footer"',
    );
    expect(html, `${route} should use the approved tagline`).toContain(
      "Your HubSpot Answer",
    );
    expect(html, `${route} should not use the old tagline`).not.toContain(
      "Your HubSpot answer.",
    );

    for (const unpublishedRoute of unpublishedRoutes) {
      expect(
        html,
        `${route} should not link to ${unpublishedRoute}`,
      ).not.toContain(`href="${unpublishedRoute}"`);
    }
  }
});

test("header and footer expose only the approved navigation", async ({
  page,
}) => {
  await page.goto("/services/hubspot-strategy-consulting");

  const header = page.getByTestId("site-header");
  const primaryNavigation = header.getByRole("navigation", {
    name: "Primary navigation",
  });
  const footer = page.getByTestId("site-footer");

  for (const [label, href] of [
    ["Home", "/"],
    ["Approach", "/approach"],
    ["About", "/about"],
    ["Insights", "/insights"],
  ] as const) {
    await expect(
      primaryNavigation.getByRole("link", { exact: true, name: label }),
    ).toHaveAttribute("href", href);
  }

  await expect(primaryNavigation.locator("summary")).toContainText("Services");
  await expect(
    header.getByRole("link", {
      exact: true,
      name: "Book a consultation",
    }),
  ).toHaveAttribute("href", "/contact");

  for (const label of forbiddenNavigationLabels) {
    await expect(
      header.getByRole("link", { exact: true, name: label }),
    ).toHaveCount(0);
    await expect(
      footer.getByRole("link", { exact: true, name: label }),
    ).toHaveCount(0);
  }

  for (const [label, href] of [
    ["HubSpot review", "/hubspot-review"],
    ["Privacy", "/privacy"],
    ["Terms", "/terms"],
    ["Accessibility", "/accessibility"],
    ["Email", "mailto:hello@company42.co"],
  ] as const) {
    await expect(
      footer.getByRole("link", { exact: true, name: label }),
    ).toHaveAttribute("href", href);
  }

  await expect(
    footer.getByText("Your HubSpot Answer", { exact: true }),
  ).toHaveCount(1);
});

test("mobile navigation exposes the same approved public links", async ({
  page,
}) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();

  const mobileNavigation = page.locator("#mobile-navigation");

  for (const [label, href] of [
    ["Home", "/"],
    ["Services", "/services"],
    ["Approach", "/approach"],
    ["About", "/about"],
    ["Insights", "/insights"],
    ["Book a consultation", "/contact"],
  ] as const) {
    const link = mobileNavigation.locator(`a[href="${href}"]`);
    await expect(link).toContainText(label);
    await expect(link).toHaveAttribute("href", href);
  }

  for (const label of forbiddenNavigationLabels) {
    await expect(
      mobileNavigation.getByRole("link", { exact: true, name: label }),
    ).toHaveCount(0);
  }
});

test("About renders every approved principle once and only the approved team", async ({
  page,
}) => {
  await page.goto("/about");

  await expect(page.getByTestId("principle-spotlight")).toHaveCount(
    siteContentData.brand.principles.length,
  );
  for (const principle of siteContentData.brand.principles) {
    await expect(
      page.getByTestId("principle-spotlight").filter({ hasText: principle }),
    ).toHaveCount(1);
  }

  const teamSection = page.locator("section").filter({
    has: page.getByRole("heading", {
      exact: true,
      name: "Senior expertise, without the agency maze.",
    }),
  });
  const approvedTeam = siteContentData.team.filter(
    (member) => member.isPublished && !member.isPlaceholder,
  );

  await expect(teamSection.locator("article")).toHaveCount(3);
  expect(approvedTeam).toHaveLength(3);

  for (const member of approvedTeam) {
    await expect(
      teamSection.getByRole("heading", { exact: true, name: member.name }),
    ).toBeVisible();
    await expect(
      teamSection.getByText(member.role, { exact: true }),
    ).toBeVisible();
    await expect(
      teamSection.getByText(member.bio, { exact: true }),
    ).toBeVisible();
    await expect(
      teamSection.getByRole("img", { exact: true, name: member.imageAlt }),
    ).toBeVisible();

    for (const specialism of member.specialisms) {
      await expect(
        teamSection.getByText(specialism, { exact: true }),
      ).toBeVisible();
    }
  }

  await expect(page.getByText("Luca Codevilla")).toHaveCount(0);
  for (const label of approvalLabels) {
    await expect(page.getByText(label, { exact: true })).toHaveCount(0);
  }
});

test("unpublished route families return genuine 404 responses", async ({
  page,
  request,
}) => {
  for (const route of [...unpublishedRoutes, "/work/unpublished-case-study"]) {
    const response = await page.goto(route);
    expect(response?.status(), `${route} should return 404`).toBe(404);
    await expect(
      page.getByRole("heading", {
        exact: true,
        name: "This page may be lost somewhere in the digital universe.",
      }),
    ).toBeVisible();
  }

  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const route of unpublishedRoutes) {
    expect(sitemap).not.toContain(route);
  }
});

test("Contact retains its useful content without a closing self-link", async ({
  page,
}) => {
  await page.goto("/contact");

  const main = page.getByRole("main");
  await expect(main.locator('a[href="/contact"]')).toHaveCount(0);
  await expect(
    main.getByRole("link", {
      exact: true,
      name: "hello@company42.co",
    }),
  ).toHaveAttribute("href", "mailto:hello@company42.co");
  await expect(
    main.getByRole("heading", {
      exact: true,
      name: "A clear first step, without the sales theatre.",
    }),
  ).toBeVisible();
  await expect(page.getByTestId("hubspot-form-shell")).toBeVisible();
});

for (const service of publishedServices) {
  test(`${service.slug} renders its assigned related Insights`, async ({
    page,
  }) => {
    const assignedInsights = publishedInsights
      .filter((insight) => insight.serviceSlugs.includes(service.slug))
      .slice(0, 3);

    expect(assignedInsights.length).toBeGreaterThan(0);
    await page.goto(`/services/${service.slug}`);

    await expect(page.getByTestId("site-header")).toBeVisible();
    await expect(page.getByTestId("site-footer")).toBeVisible();

    for (const insight of assignedInsights) {
      await expect(
        page.locator(`a[href="/insights/${insight.slug}"]`),
      ).not.toHaveCount(0);
    }
  });
}
