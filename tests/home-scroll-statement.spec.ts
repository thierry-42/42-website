import { expect, test } from "@playwright/test";

test("homepage statement words brighten progressively while scrolling", async ({
  page,
}) => {
  await page.goto("/");

  const statement = page.locator(".scroll-statement");
  const words = statement.locator(".scroll-statement-word");

  await expect(statement).toBeVisible();
  expect(await words.count()).toBeGreaterThan(1);

  const opacitySamples = await statement.evaluate(async (element) => {
    const words = [...element.querySelectorAll(".scroll-statement-word")];
    const bounds = element.getBoundingClientRect();
    const top = bounds.top + window.scrollY;
    const root = document.documentElement;
    const originalScrollBehavior = root.style.scrollBehavior;

    root.style.scrollBehavior = "auto";

    const sampleAt = async (scrollTop: number) => {
      window.scrollTo(0, Math.max(0, scrollTop));
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );

      return {
        opacities: words.map((word) =>
          Number.parseFloat(getComputedStyle(word).opacity),
        ),
        scrollY: window.scrollY,
      };
    };

    const before = await sampleAt(top - window.innerHeight + 1);
    const middle = await sampleAt(
      top - window.innerHeight / 2 + bounds.height / 2,
    );
    const after = await sampleAt(top + bounds.height - 1);

    root.style.scrollBehavior = originalScrollBehavior;

    return { after, before, middle };
  });

  expect(opacitySamples.after.scrollY).toBeGreaterThan(
    opacitySamples.before.scrollY,
  );
  expect(opacitySamples.before.opacities[0]).toBeLessThan(
    opacitySamples.after.opacities[0] ?? Number.POSITIVE_INFINITY,
  );
  expect(opacitySamples.before.opacities.at(-1)).toBeLessThan(
    opacitySamples.after.opacities.at(-1) ?? Number.POSITIVE_INFINITY,
  );
  expect(opacitySamples.middle.opacities[0]).toBeGreaterThan(
    opacitySamples.middle.opacities.at(-1) ?? Number.NEGATIVE_INFINITY,
  );
});

test("homepage statement remains fully visible with reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const opacities = await page
    .locator(".scroll-statement-word")
    .evaluateAll((elements) =>
      elements.map((element) => getComputedStyle(element).opacity),
    );

  expect(new Set(opacities)).toEqual(new Set(["1"]));
});
