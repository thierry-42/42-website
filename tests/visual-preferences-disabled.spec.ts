import { expect, test } from "@playwright/test";

test("production keeps the visual-preferences trial disabled", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("button", { name: "Open visual preferences" }),
  ).toHaveCount(0);
  await expect(page.locator("html")).toHaveAttribute(
    "data-appearance",
    "light",
  );
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-brand-theme",
    /.+/,
  );
  await expect(page.locator("html")).toHaveAttribute(
    "data-vision-mode",
    "standard",
  );
  await expect(page.locator("html")).toHaveAttribute(
    "data-contrast-mode",
    "standard",
  );

  expect(
    await page.evaluate(() =>
      window.localStorage.getItem("company42.visualPreferences.v1"),
    ),
  ).toBeNull();

  const accessibilityResponse = await page.goto("/accessibility");
  expect(accessibilityResponse?.status()).toBe(404);
});
