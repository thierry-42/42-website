import { expect, test } from "@playwright/test";

const operatorStatement =
  "42 is the public-facing brand of Company42, a trading name of Madeyoulookagency LLC, a limited liability company registered in California, United States of America.";

const removedPublicPhrases = [
  "Approval required",
  "Owner and legal review is required before production publication.",
  "Draft for owner and legal review",
  "Owner/legal review:",
  "The production HubSpot form has not been created.",
  "The final production hosting provider and its log configuration are not yet confirmed.",
  "Final legal-basis wording",
  "Render is staging only.",
  "Repeat this inspection on the final production deployment",
  "The final list of service providers",
  "The applicable transfer locations",
  "The owner must document and approve an operational retention and deletion procedure",
  "The final policy must confirm the rights",
  "Confirm the chain of title",
  "A lawyer must approve",
  "The court, venue, dispute-resolution process",
];

for (const route of ["/privacy", "/terms"]) {
  test(`${route} renders launch copy without internal review warnings`, async ({
    page,
  }) => {
    const response = await page.goto(route);
    expect(response?.ok()).toBeTruthy();

    await expect(page.getByText(operatorStatement)).toBeVisible();
    expect(
      await page.locator('a[href="mailto:hello@company42.co"]').count(),
    ).toBeGreaterThan(0);
    await expect(page.locator('[role="note"]')).toHaveCount(0);

    const renderedCopy = await page.evaluate(() => {
      const description =
        document
          .querySelector('meta[name="description"]')
          ?.getAttribute("content") ?? "";
      const headings = Array.from(
        document.querySelectorAll("h1, h2, h3"),
        (heading) => heading.textContent ?? "",
      );

      return [document.title, description, ...headings, document.body.innerText]
        .join("\n")
        .toLowerCase();
    });

    for (const phrase of removedPublicPhrases) {
      expect(renderedCopy).not.toContain(phrase.toLowerCase());
    }

    expect(renderedCopy).not.toContain("draft");
    expect(renderedCopy).not.toContain("owner and legal review");
  });
}

test("legal pages preserve confirmed disclosures", async ({ page }) => {
  await page.goto("/privacy");
  await expect(
    page.getByRole("heading", { name: "HubSpot form processing" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Cookies and browser storage" }),
  ).toBeVisible();
  await expect(page.getByText(/__cf_bm/)).toBeVisible();
  await expect(page.getByText(/localStorage or sessionStorage/)).toBeVisible();

  await page.goto("/terms");
  await expect(
    page.getByRole("heading", { name: "Intellectual property" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Liability for website use" }),
  ).toBeVisible();
  await expect(
    page.getByText("Laws of the State of California."),
  ).toBeVisible();
});
