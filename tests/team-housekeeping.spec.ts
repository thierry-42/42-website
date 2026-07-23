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
