import { expect, test } from "@playwright/test";

const portraitApprovalLabels = [
  "Development portrait / approval required",
  "Development portrait",
  "Draft portrait",
  "Placeholder portrait",
];

test("About renders the current public team without internal portrait labels", async ({
  page,
}) => {
  await page.goto("/about");

  const teamSection = page.locator("section").filter({
    has: page.getByRole("heading", {
      name: "Senior expertise, without the agency maze.",
    }),
  });

  await expect(teamSection).toBeVisible();
  await expect(teamSection.locator("article")).toHaveCount(3);

  for (const name of ["Thierry-Luc Denichaud", "Zane Smith", "Emma Black"]) {
    await expect(
      teamSection.getByRole("heading", { name, exact: true }),
    ).toBeVisible();
  }

  const approvedPortraits = [
    "Thierry-Luc Denichaud, founder of 42",
    "Zane, member of the 42 team",
    "Emma, member of the 42 team",
  ];

  for (const altText of approvedPortraits) {
    const portrait = teamSection.getByRole("img", { name: altText });
    await expect(portrait).toBeVisible();
    await expect(portrait).toHaveAttribute("width", "1024");
    await expect(portrait).toHaveAttribute("height", "1280");
  }

  for (const biography of [
    "Thierry-Luc leads 42's work across HubSpot strategy, CRM architecture, digital delivery, and hands-on problem solving, keeping complex programmes clear from first question to working system.",
    "Zane works across PHP development, APIs, data flows, and custom integrations, connecting HubSpot to the operational systems around it.",
    "Emma connects marketing strategy with practical HubSpot onboarding, helping teams establish clear journeys, campaigns, content processes, and day-to-day ways of working.",
  ]) {
    await expect(
      teamSection.getByText(biography, { exact: true }),
    ).toBeVisible();
  }

  for (const specialism of [
    "HubSpot strategy",
    "CRM architecture",
    "Digital delivery",
    "Solution design",
    "PHP development",
    "APIs",
    "Custom integrations",
    "Marketing strategy",
    "HubSpot onboarding",
    "Customer journeys",
  ]) {
    await expect(
      teamSection.getByText(specialism, { exact: true }),
    ).toBeVisible();
  }

  await expect(teamSection.getByText("Luca Codevilla")).toHaveCount(0);

  for (const label of portraitApprovalLabels) {
    await expect(teamSection.getByText(label, { exact: true })).toHaveCount(0);
  }
});

test("published routes do not expose Luca or portrait approval labels", async ({
  request,
}) => {
  const sitemapResponse = await request.get("/sitemap.xml");
  expect(sitemapResponse.ok()).toBeTruthy();

  const sitemap = await sitemapResponse.text();
  const routes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
    ([, location]) => new URL(location).pathname,
  );

  expect(routes.length).toBeGreaterThan(0);

  for (const route of routes) {
    const response = await request.get(route);
    expect(response.ok(), `${route} should load`).toBeTruthy();

    const html = await response.text();
    expect(html, `${route} should not expose Luca`).not.toContain(
      "Luca Codevilla",
    );

    for (const label of portraitApprovalLabels) {
      expect(html, `${route} should not expose "${label}"`).not.toContain(
        label,
      );
    }
  }
});
