import { readFileSync, statSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

const animationPath = path.join(
  process.cwd(),
  "public",
  "animations",
  "strategy-architecture",
  "strategy-architecture.lottie",
);
const sourcePath = path.join(
  process.cwd(),
  "src",
  "animations",
  "strategy-architecture",
  "animation.json",
);

test("the editable asset is a compact five-second vector animation", () => {
  const archive = readFileSync(animationPath);
  const animation = JSON.parse(readFileSync(sourcePath, "utf8")) as {
    fr: number;
    ip: number;
    layers: Array<{ nm: string; ty: number }>;
    op: number;
  };

  expect(archive.subarray(0, 2).toString()).toBe("PK");
  expect(statSync(animationPath).size).toBeLessThan(10_000);
  expect((animation.op - animation.ip) / animation.fr).toBe(5);
  expect(animation.layers).toHaveLength(24);
  expect(animation.layers.every((layer) => layer.ty === 4)).toBe(true);
  expect(
    animation.layers.some((layer) => layer.nm === "Central CRM core"),
  ).toBe(true);
});

test("the prototype replaces only the staging Strategy card", async ({
  page,
}) => {
  const response = await page.goto("/services");
  expect(response?.headers()["content-security-policy"]).toContain(
    "'wasm-unsafe-eval'",
  );
  await expect(page.getByTestId("strategy-service-card-prototype")).toHaveCount(
    1,
  );
  await expect(
    page.getByTestId("strategy-service-card-prototype").getByRole("heading", {
      name: "Strategy and consulting",
    }),
  ).toBeVisible();

  await page.goto("/");
  await expect(page.getByTestId("strategy-service-card-prototype")).toHaveCount(
    0,
  );
});

test("the player loads near the viewport without shifting the poster", async ({
  page,
}) => {
  await page.setViewportSize({ height: 320, width: 390 });
  const animationRequests: string[] = [];
  const runtimeRequests: string[] = [];
  const consoleErrors: string[] = [];
  page.on("request", (request) => {
    if (request.url().endsWith("strategy-architecture.lottie")) {
      animationRequests.push(request.url());
    }
    if (request.url().endsWith("dotlottie-player.wasm")) {
      runtimeRequests.push(request.url());
    }
  });
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto("/services");
  const visual = page.getByTestId("strategy-architecture-animation");
  const poster = page.getByTestId("strategy-architecture-poster");
  await expect(visual).toHaveAttribute("data-animation-state", "poster");
  await expect(poster).toHaveAttribute("alt", "");
  expect(animationRequests).toHaveLength(0);

  const before = await visual.boundingBox();
  await visual.scrollIntoViewIfNeeded();
  await expect(visual).toHaveAttribute("data-animation-state", "loaded");
  await expect(page.getByTestId("strategy-architecture-player")).toBeVisible();
  await expect.poll(() => animationRequests.length).toBe(1);
  await expect.poll(() => runtimeRequests.length).toBe(1);
  const after = await visual.boundingBox();

  expect(before).not.toBeNull();
  expect(after).not.toBeNull();
  expect(Math.abs((before?.width ?? 0) - (after?.width ?? 0))).toBeLessThan(1);
  expect(Math.abs((before?.height ?? 0) - (after?.height ?? 0))).toBeLessThan(
    1,
  );

  const canvasCost = await page
    .getByTestId("strategy-architecture-player")
    .evaluate((element) => {
      const canvas = element as HTMLCanvasElement;
      return {
        backingHeight: canvas.height,
        backingWidth: canvas.width,
        clientHeight: canvas.clientHeight,
        clientWidth: canvas.clientWidth,
      };
    });
  expect(canvasCost.backingWidth / canvasCost.clientWidth).toBeLessThanOrEqual(
    1.55,
  );
  expect(
    canvasCost.backingHeight / canvasCost.clientHeight,
  ).toBeLessThanOrEqual(1.55);
  expect(consoleErrors).toEqual([]);
});

test("reduced motion keeps the static poster and skips the player asset", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const animationRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().endsWith("strategy-architecture.lottie")) {
      animationRequests.push(request.url());
    }
  });

  await page.goto("/services");
  const visual = page.getByTestId("strategy-architecture-animation");
  await visual.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  await expect(visual).toHaveAttribute("aria-hidden", "true");
  await expect(visual).toHaveAttribute("data-animation-state", "poster");
  await expect(page.getByTestId("strategy-architecture-poster")).toBeVisible();
  await expect(page.getByTestId("strategy-architecture-player")).toHaveCount(0);
  expect(animationRequests).toHaveLength(0);
});

test("the visual remains available across display preferences", async ({
  page,
}) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/services");
  const visual = page.getByTestId("strategy-architecture-animation");
  await visual.scrollIntoViewIfNeeded();
  await expect(page.getByTestId("strategy-architecture-player")).toBeVisible();

  await page.getByRole("button", { name: "Open visual preferences" }).click();
  for (const option of [
    "Light",
    "Dark",
    "Protan support",
    "Deutan support",
    "Tritan support",
    "Monochrome",
    "High contrast",
  ]) {
    await page.getByRole("radio", { name: option }).check();
    await expect(visual).toBeVisible();
    await expect(
      page.getByTestId("strategy-architecture-player"),
    ).toBeVisible();
  }
});
