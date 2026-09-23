import { expect, test } from "@playwright/test";

import siteContentData from "../src/content/site-content.json";

const productionForm = {
  formId: process.env.HUBSPOT_PRODUCTION_FORM_ID,
  portalId: process.env.HUBSPOT_PRODUCTION_PORTAL_ID,
  region: process.env.HUBSPOT_PRODUCTION_REGION,
};

test("production shell, visual preferences and publication guards are active", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.getByTestId("site-header")).toBeVisible();
  await expect(page.getByTestId("site-footer")).toBeVisible();

  const trigger = page.getByRole("button", {
    name: "Open visual preferences",
  });
  await trigger.click();
  for (const option of [
    "Light",
    "Dark",
    "Protan support",
    "Deutan support",
    "Tritan support",
    "Monochrome",
    "High contrast",
  ]) {
    await expect(page.getByRole("radio", { name: option })).toBeVisible();
  }

  await page.getByRole("radio", { name: "Dark" }).check();
  await page.getByRole("radio", { name: "Deutan support" }).check();
  await page.getByRole("radio", { name: "High contrast" }).check();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-appearance", "dark");
  await expect(page.locator("html")).toHaveAttribute(
    "data-vision-mode",
    "deutan",
  );
  await expect(page.locator("html")).toHaveAttribute(
    "data-contrast-mode",
    "high",
  );
  expect(consoleErrors).toEqual([]);

  for (const route of ["/work", "/industries", "/audience"]) {
    const unpublishedResponse = await page.goto(route);
    expect(
      unpublishedResponse?.status(),
      `${route} should be unpublished`,
    ).toBe(404);
  }
});

test("production About and Accessibility copy use the approved content", async ({
  page,
}) => {
  await page.goto("/about");
  const mainText = await page.getByRole("main").innerText();

  for (const principle of siteContentData.brand.principles) {
    expect(mainText.split(principle).length - 1).toBe(1);
  }
  for (const name of ["Thierry-Luc Denichaud", "Emma Black", "Zane Smith"]) {
    await expect(
      page.getByRole("heading", { exact: true, name }),
    ).toBeVisible();
  }
  for (const alt of [
    "Thierry-Luc Denichaud, founder of 42",
    "Emma, member of the 42 team",
    "Zane, member of the 42 team",
  ]) {
    await expect(page.getByRole("img", { name: alt })).toBeVisible();
  }
  await expect(page.getByText("Luca Codevilla")).toHaveCount(0);
  await expect(page.getByText(/development portrait/i)).toHaveCount(0);
  await expect(page.getByText(/approval required/i)).toHaveCount(0);

  await page.goto("/accessibility");
  await expect(
    page.getByText(
      "Optional visual preferences allow visitors to choose a light or dark appearance, select a colour-vision support palette, and enable high contrast. These support palettes are not diagnostic tools or exact medical simulations.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page.getByText(/On the staging trial/)).toHaveCount(0);

  await page.goto("/privacy");
  await expect(
    page.getByText(/store your selected visual preferences in your browser/),
  ).toBeVisible();
});

test("production Contact uses only the production form configuration", async ({
  page,
}) => {
  expect(productionForm.region).toBeTruthy();
  expect(productionForm.portalId).toBeTruthy();
  expect(productionForm.formId).toBeTruthy();

  await page.route(
    `https://js-${productionForm.region}.hsforms.net/**`,
    async (route) => {
      await route.fulfill({
        body: `
          document.querySelectorAll(".hs-form-frame").forEach(function (frame) {
            var iframe = document.createElement("iframe");
            iframe.title = "HubSpot enquiry form";
            frame.appendChild(iframe);
          });
          window.dispatchEvent(new CustomEvent("hs-form-event:on-ready", {
            detail: { formId: "${productionForm.formId}" }
          }));
        `,
        contentType: "application/javascript",
        status: 200,
      });
    },
  );

  await page.goto("/contact");
  const form = page.locator(".hs-form-frame");
  await expect(form).toHaveAttribute("data-region", productionForm.region!);
  await expect(form).toHaveAttribute(
    "data-portal-id",
    productionForm.portalId!,
  );
  await expect(form).toHaveAttribute("data-form-id", productionForm.formId!);
  await expect(page.getByTitle("HubSpot enquiry form")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "hello@company42.co" }).first(),
  ).toHaveAttribute("href", "mailto:hello@company42.co");
});

test("production discovery output uses only approved canonical routes", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://company42.co",
  );

  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Allow: /");
  expect(robots).toContain("Sitemap: https://company42.co/sitemap.xml");

  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("<loc>https://company42.co/accessibility</loc>");
  for (const route of ["/work", "/industries", "/audience"]) {
    expect(sitemap).not.toContain(`<loc>https://company42.co${route}`);
  }
});
