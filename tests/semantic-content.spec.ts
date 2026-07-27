import { expect, test } from "@playwright/test";

import { getAccessibilityStatement } from "../src/content/accessibility-content";
import siteContentData from "../src/content/site-content.json";

const productionPreferencesCopy =
  "Optional visual preferences allow visitors to choose a light or dark appearance, select a colour-vision support palette, and enable high contrast. These support palettes are not diagnostic tools or exact medical simulations.";

test("About renders each principle once in the semantic document", async ({
  page,
}) => {
  await page.goto("/about");

  const main = page.getByRole("main");
  const renderedText = await main.innerText();

  for (const principle of siteContentData.brand.principles) {
    await expect(main.getByText(principle, { exact: true })).toHaveCount(1);
    expect(
      renderedText.split(principle).length - 1,
      `${principle} should occur once in crawled page text`,
    ).toBe(1);
  }
});

test("Accessibility copy is appropriate for staging and production", async ({
  page,
}) => {
  const productionStatement = getAccessibilityStatement("production");
  const productionCopy = productionStatement.sections
    .flatMap((section) => section.paragraphs)
    .join(" ");

  expect(productionCopy).toContain(productionPreferencesCopy);
  expect(productionCopy).not.toContain("On the staging trial");

  await page.goto("/accessibility");
  await expect(
    page.getByText(
      `On the staging trial, ${productionPreferencesCopy.charAt(0).toLowerCase()}${productionPreferencesCopy.slice(1)}`,
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    page.getByText(productionPreferencesCopy, { exact: true }),
  ).toHaveCount(0);
});
