import { expect, test, type Page } from "@playwright/test";

const storageKey = "company42.visualPreferences.v1";

async function openPreferences(page: Page) {
  const trigger = page.getByRole("button", {
    name: "Open visual preferences",
  });
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByRole("heading", { name: "Visual preferences" }),
  ).toBeVisible();
  return trigger;
}

test("panel supports keyboard opening, Escape and focus restoration", async ({
  page,
}) => {
  await page.goto("/");

  const trigger = page.getByRole("button", {
    name: "Open visual preferences",
  });
  await trigger.focus();
  await page.keyboard.press("Enter");

  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByRole("button", { name: "Close visual preferences" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("radio", { name: "Light" })).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
});

test("mode selections persist across reload and reset to defaults", async ({
  page,
}) => {
  await page.goto("/");
  await openPreferences(page);

  await page.getByRole("radio", { name: "Dark" }).check();
  await page.getByRole("radio", { name: "Deutan support" }).check();
  await page.getByRole("radio", { name: "High contrast" }).check();

  await expect(page.locator("html")).toHaveAttribute("data-appearance", "dark");
  await expect(page.locator("html")).toHaveAttribute(
    "data-vision-mode",
    "deutan",
  );
  await expect(page.locator("html")).toHaveAttribute(
    "data-contrast-mode",
    "high",
  );

  expect(
    await page.evaluate((key) => window.localStorage.getItem(key), storageKey),
  ).toBe(
    JSON.stringify({
      appearance: "dark",
      visionMode: "deutan",
      contrastMode: "high",
    }),
  );

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

  await openPreferences(page);
  await page.getByRole("button", { name: "Reset visual preferences" }).click();

  await expect(page.locator("html")).toHaveAttribute(
    "data-appearance",
    "light",
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
    await page.evaluate((key) => window.localStorage.getItem(key), storageKey),
  ).toBeNull();
});

test("malformed or unavailable storage does not break the controls", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.addInitScript((key) => {
    window.localStorage.setItem(key, "{not-valid-json");
  }, storageKey);
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute(
    "data-appearance",
    "light",
  );
  await expect(page.locator("html")).toHaveAttribute(
    "data-vision-mode",
    "standard",
  );
  expect(consoleErrors).toEqual([]);

  await page.addInitScript(() => {
    Object.defineProperty(Storage.prototype, "setItem", {
      configurable: true,
      value() {
        throw new DOMException("Storage unavailable", "SecurityError");
      },
    });
    Object.defineProperty(Storage.prototype, "removeItem", {
      configurable: true,
      value() {
        throw new DOMException("Storage unavailable", "SecurityError");
      },
    });
  });
  await page.reload();
  await openPreferences(page);
  await page.getByRole("radio", { name: "Tritan support" }).check();

  await expect(page.locator("html")).toHaveAttribute(
    "data-vision-mode",
    "tritan",
  );
  expect(consoleErrors).toEqual([]);
});

for (const legacyBrandTheme of ["current", "brand-kit"]) {
  test(`migrates the legacy ${legacyBrandTheme} preference to light appearance`, async ({
    page,
  }) => {
    await page.addInitScript(
      ({ key, brandTheme }) => {
        window.localStorage.setItem(
          key,
          JSON.stringify({
            brandTheme,
            visionMode: "tritan",
            contrastMode: "high",
          }),
        );
      },
      { brandTheme: legacyBrandTheme, key: storageKey },
    );

    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute(
      "data-appearance",
      "light",
    );
    await expect(page.locator("html")).not.toHaveAttribute(
      "data-brand-theme",
      /.+/,
    );
    expect(
      await page.evaluate(
        (key) => window.localStorage.getItem(key),
        storageKey,
      ),
    ).toBe(
      JSON.stringify({
        appearance: "light",
        visionMode: "tritan",
        contrastMode: "high",
      }),
    );
  });
}

test("preference changes make no request and do not recolour photographs", async ({
  page,
}) => {
  await page.goto("/about");
  await page.waitForLoadState("networkidle");

  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));

  await openPreferences(page);
  await page.getByRole("radio", { name: "Dark" }).check();
  await page.getByRole("radio", { name: "Monochrome" }).check();
  await page.getByRole("radio", { name: "High contrast" }).check();
  await page.waitForTimeout(100);

  expect(requests).toEqual([]);
  await expect(
    page.getByAltText("Thierry-Luc Denichaud, founder of 42"),
  ).toHaveCSS("filter", "none");
});

test("dark appearance applies semantic surfaces without image or page filters", async ({
  page,
}) => {
  await page.goto("/about");
  await openPreferences(page);
  await page.getByRole("radio", { name: "Dark" }).check();

  const theme = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    return {
      canvas: root.getPropertyValue("--colour-canvas").trim(),
      surface: root.getPropertyValue("--colour-surface").trim(),
      text: root.getPropertyValue("--colour-text").trim(),
      documentFilter: getComputedStyle(document.documentElement).filter,
      bodyFilter: getComputedStyle(document.body).filter,
    };
  });

  expect(theme).toEqual({
    canvas: "#090b10",
    surface: "#11141b",
    text: "#f7f5ef",
    documentFilter: "none",
    bodyFilter: "none",
  });
  await expect(
    page.getByAltText("Thierry-Luc Denichaud, founder of 42"),
  ).toHaveCSS("filter", "none");
});

test("staging keeps unpublished routes closed and the accessibility page available", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "Accessibility" }),
  ).toHaveAttribute("href", "/accessibility");

  const accessibilityResponse = await page.goto("/accessibility");
  expect(accessibilityResponse?.status()).toBe(200);
  await expect(
    page.getByRole("heading", { level: 1, name: "Accessibility at 42" }),
  ).toBeVisible();

  for (const route of ["/work", "/industries", "/audience"]) {
    const response = await page.goto(route);
    expect(response?.status(), `${route} should remain unpublished`).toBe(404);
  }
});

test("HubSpot form boundary and adaptive cursor remain operational", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Fine pointer only");

  await page.route("https://js-eu1.hsforms.net/**", async (route) => {
    await route.fulfill({
      body: `
        document.querySelectorAll(".hs-form-frame").forEach(function (frame) {
          var iframe = document.createElement("iframe");
          iframe.title = "HubSpot enquiry form";
          frame.appendChild(iframe);
        });
        window.dispatchEvent(new CustomEvent("hs-form-event:on-ready", {
          detail: { formId: "da5e2637-3fc8-4ab0-96b1-4764ecd0f16e" }
        }));
      `,
      contentType: "application/javascript",
      status: 200,
    });
  });

  await page.goto("/contact");
  await expect(page.getByTestId("hubspot-form-shell")).toBeVisible();
  await expect(page.getByTitle("HubSpot enquiry form")).toBeVisible();

  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute(
    "data-custom-cursor",
    "active",
  );
  await page.mouse.move(160, 180);
  await expect(page.getByTestId("custom-cursor-dot")).toHaveCSS("opacity", "1");
});
