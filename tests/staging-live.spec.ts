import { expect, test } from "@playwright/test";

const auditUrl = process.env.LIVE_STAGING_AUDIT_URL;
const submitTestEnquiry = process.env.LIVE_STAGING_SUBMIT === "1";

test("live staging HubSpot form audit", async ({ context, page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop audit only");
  test.skip(!auditUrl, "Live staging audit URL not configured");

  const requestHosts = new Set<string>();
  const submissionFieldNames = new Set<string>();
  let submissionEndpoint = "";

  page.on("request", (request) => {
    const requestUrl = new URL(request.url());
    requestHosts.add(requestUrl.hostname);

    if (!requestUrl.pathname.includes("/submissions/")) return;
    submissionEndpoint = `${requestUrl.origin}${requestUrl.pathname}`;
    const postData = request.postData() ?? "";
    for (const match of postData.matchAll(/name="([^"]+)"/gu)) {
      submissionFieldNames.add(match[1]);
    }
  });

  const response = await page.goto(new URL("/contact", auditUrl).toString());
  expect(response?.ok()).toBeTruthy();
  await expect(
    page.getByRole("link", { name: "hello@company42.co" }).first(),
  ).toHaveAttribute("href", "mailto:hello@company42.co");

  const formShell = page.getByTestId("hubspot-form-shell");
  await expect(formShell).toHaveAttribute("data-native-cursor", "true");
  const iframe = formShell.locator(".hs-form-frame iframe");
  await expect(iframe).toBeVisible({ timeout: 20_000 });

  const formFrame = page
    .frames()
    .find((candidate) => candidate.url().includes("frame.html"));
  expect(formFrame, "HubSpot form frame should be available").toBeDefined();
  if (!formFrame) return;

  const fields = await formFrame
    .locator(
      "input:not([type='hidden']), textarea, select, button[role='combobox']",
    )
    .evaluateAll((elements) =>
      elements.map((element) => {
        const control = element as
          | HTMLButtonElement
          | HTMLInputElement
          | HTMLSelectElement
          | HTMLTextAreaElement;
        const explicitLabel = control.id
          ? document.querySelector(`label[for="${CSS.escape(control.id)}"]`)
              ?.textContent
          : null;

        return {
          ariaLabel: control.getAttribute("aria-label"),
          label: explicitLabel?.replace(/\s+/gu, " ").trim() ?? null,
          name: control.getAttribute("name"),
          required:
            control.hasAttribute("required") ||
            control.getAttribute("aria-required") === "true",
          role: control.getAttribute("role"),
          type:
            control instanceof HTMLInputElement
              ? control.type
              : control.tagName,
        };
      }),
    );

  const firstName = formFrame.getByRole("textbox", { name: "First Name" });
  const lastName = formFrame.getByRole("textbox", { name: "Last Name" });
  const email = formFrame.getByRole("textbox", { name: /Email/ });
  const company = formFrame.getByRole("textbox", { name: /Company name/ });
  const employmentRole = formFrame.getByRole("combobox", {
    name: "Employment Role",
  });
  const websiteUrl = formFrame.getByRole("textbox", { name: "Website URL" });
  const hubspotStatus = formFrame.getByRole("combobox", {
    name: "HubSpot Status",
  });
  const primaryChallenge = formFrame.getByRole("combobox", {
    name: "Primary challenge",
  });
  const projectTiming = formFrame.getByRole("textbox", {
    name: "Project timing",
  });
  const submitButton = formFrame.getByRole("button", {
    exact: true,
    name: "Submit",
  });

  await expect(firstName).toBeVisible();
  await expect(lastName).toBeVisible();
  await expect(email).toBeVisible();
  await expect(company).toBeVisible();
  await expect(submitButton).toBeVisible();

  await firstName.focus();
  await page.keyboard.press("Tab");
  await expect(lastName).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(email).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(company).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(employmentRole).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(websiteUrl).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(hubspotStatus).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(primaryChallenge).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(projectTiming).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(submitButton).toBeFocused();

  const focusOrder = [
    "First Name",
    "Last Name",
    "Email",
    "Company name",
    "Employment Role",
    "Website URL",
    "HubSpot Status",
    "Primary challenge",
    "Project timing",
    "Submit",
  ];

  await submitButton.click();
  const validationMessages = formFrame.getByText(
    "Please complete this required field.",
  );
  await expect(validationMessages.first()).toBeVisible();
  const validationDetails = await validationMessages.evaluateAll((elements) =>
    elements.map((element) => ({
      ariaLive: element.getAttribute("aria-live"),
      id: element.id || null,
      parentRole: element.parentElement?.getAttribute("role") ?? null,
      role: element.getAttribute("role"),
      tag: element.tagName,
      text: element.textContent?.replace(/\s+/gu, " ").trim() ?? "",
    })),
  );

  const consentNotice =
    "When you submit this form, 42 and HubSpot process the information you provide so that 42 can review and respond to your enquiry. Read the Privacy Policy.";
  await expect(page.getByText(consentNotice)).toBeVisible();
  await expect(
    formFrame.getByText(/privacy|consent/iu),
    "The embedded form does not contain separate consent wording",
  ).toHaveCount(0);

  const storageBeforeSubmit = {
    frame: await formFrame.evaluate(() => ({
      localStorage: Object.keys(window.localStorage),
      sessionStorage: Object.keys(window.sessionStorage),
    })),
    page: await page.evaluate(() => ({
      localStorage: Object.keys(window.localStorage),
      sessionStorage: Object.keys(window.sessionStorage),
    })),
  };
  const hubspotContextValue = await formFrame
    .locator('input[name="hs_context"]')
    .inputValue();
  const hubspotContext = JSON.parse(hubspotContextValue) as Record<
    string,
    unknown
  >;
  const technicalContext = {
    keys: Object.keys(hubspotContext).sort(),
    locale: hubspotContext.locale ?? null,
    pageTitle: hubspotContext.pageTitle ?? null,
    pageUrl: hubspotContext.pageUrl ?? null,
    referrer: hubspotContext.referrer ?? null,
    urlParams: hubspotContext.urlParams ?? null,
    userAgent: hubspotContext.userAgent ?? null,
  };

  let successState = "not submitted";
  if (submitTestEnquiry) {
    await firstName.fill("Codex");
    await lastName.fill("Staging verification");
    await email.fill("hello+codex-stage-verification@company42.co");
    await company.fill("42 staging form verification (delete)");
    await submitButton.click();

    await expect(page.getByTestId("hubspot-form-success")).toContainText(
      "submitted to 42",
      { timeout: 20_000 },
    );
    await expect(
      formFrame.getByText(/Thank you, we'll be in touch soon/iu),
    ).toBeVisible();
    successState = "submitted successfully";
  }

  const storageAfterSubmit = {
    frame: await formFrame.evaluate(() => ({
      localStorage: Object.keys(window.localStorage),
      sessionStorage: Object.keys(window.sessionStorage),
    })),
    page: await page.evaluate(() => ({
      localStorage: Object.keys(window.localStorage),
      sessionStorage: Object.keys(window.sessionStorage),
    })),
  };
  const cookies = (await context.cookies()).map((cookie) => ({
    domain: cookie.domain,
    httpOnly: cookie.httpOnly,
    name: cookie.name,
    sameSite: cookie.sameSite,
    secure: cookie.secure,
  }));
  const hosts = Array.from(requestHosts).sort();

  for (const blockedHost of [
    "google-analytics.com",
    "googletagmanager.com",
    "clarity.ms",
    "connect.facebook.net",
    "snap.licdn.com",
  ]) {
    expect(hosts.some((host) => host.includes(blockedHost))).toBeFalsy();
  }

  const report = {
    consentNotice,
    cookies,
    fields,
    focusOrder,
    hosts,
    storageAfterSubmit,
    storageBeforeSubmit,
    submissionEndpoint,
    submissionFieldNames: Array.from(submissionFieldNames).sort(),
    successState,
    technicalContext,
    validationDetails,
  };
  const reportJson = JSON.stringify(report, null, 2);
  console.log(`LIVE_STAGING_AUDIT\n${reportJson}`);
  await testInfo.attach("live-staging-audit.json", {
    body: reportJson,
    contentType: "application/json",
  });
});
