import { expect, test } from "@playwright/test";

const positioningRoutes = [
  "/",
  "/services",
  "/about",
  "/hubspot-review",
  "/contact",
  "/privacy",
];

test("public positioning names only the approved service areas", async ({
  page,
}) => {
  for (const route of positioningRoutes) {
    const response = await page.goto(route);

    expect(response?.ok(), `${route} should load`).toBeTruthy();

    const copy = await page.locator("body").innerText();
    expect(copy, `${route} should name the approved service areas`).toContain(
      "United States and New Zealand",
    );
    expect(
      copy,
      `${route} should not contain retired service areas`,
    ).not.toMatch(/North America|EMEA/);
  }
});

test("homepage metadata uses the approved service areas", async ({ page }) => {
  await page.goto("/");

  const description = await page
    .locator('meta[name="description"]')
    .getAttribute("content");

  expect(description).toContain("United States and New Zealand");
  expect(description).not.toMatch(/North America|EMEA/);
});
