import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";

const projectRoot = process.cwd();
const port = Number(process.env.LIGHTHOUSE_PORT ?? 3200);
const baseUrl = `http://127.0.0.1:${port}`;
const nextCli = path.join(
  projectRoot,
  "node_modules",
  "next",
  "dist",
  "bin",
  "next",
);
const reportDirectory = path.join(projectRoot, ".lighthouse");
const desktopMode = process.argv.includes("--desktop");
const routes = [
  { label: "home", path: "/" },
  { label: "services", path: "/services" },
  {
    label: "service-detail",
    path: "/services/integrations-custom-development",
  },
  { label: "about", path: "/about" },
  { label: "insights", path: "/insights" },
  {
    label: "insight-detail",
    path: "/insights/signs-your-hubspot-portal-needs-an-audit",
  },
  { label: "contact", path: "/contact" },
];
const selectedRouteLabel = process.env.LIGHTHOUSE_ROUTE;
const selectedRoutes = selectedRouteLabel
  ? routes.filter((route) => route.label === selectedRouteLabel)
  : routes;
const thresholds = {
  accessibility: 1,
  "best-practices": 1,
  performance: 0.95,
  seo: 1,
};

process.env.SITE_ENVIRONMENT = "production";

function runProcess(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, options);
    child.once("error", reject);
    child.once("exit", (code) => resolve(code ?? 1));
  });
}

async function waitForServer(server) {
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`The Lighthouse server exited with ${server.exitCode}.`);
    }
    try {
      const response = await fetch(baseUrl, {
        cache: "no-store",
        signal: AbortSignal.timeout(1_500),
      });
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("The Lighthouse server did not become ready.");
}

async function stopProcess(processToStop) {
  if (!processToStop || processToStop.exitCode !== null) return;
  processToStop.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => processToStop.once("exit", resolve)),
    new Promise((resolve) => setTimeout(resolve, 3_000)),
  ]);
  processToStop.unref();
}

let server;
let chrome;

try {
  const buildExitCode = await runProcess(process.execPath, [nextCli, "build"], {
    cwd: projectRoot,
    env: process.env,
    stdio: "inherit",
    windowsHide: true,
  });
  if (buildExitCode !== 0) {
    throw new Error(`The Lighthouse build exited with ${buildExitCode}.`);
  }

  server = spawn(
    process.execPath,
    [nextCli, "start", "--hostname", "127.0.0.1", "--port", String(port)],
    {
      cwd: projectRoot,
      env: process.env,
      stdio: "inherit",
      windowsHide: true,
    },
  );
  await waitForServer(server);
  await fs.mkdir(reportDirectory, { recursive: true });

  chrome = await launch({
    chromeFlags: ["--headless", "--no-sandbox", "--disable-gpu"],
  });

  let failed = false;
  if (selectedRoutes.length === 0) {
    throw new Error(`Unknown Lighthouse route: ${selectedRouteLabel}`);
  }

  for (const route of selectedRoutes) {
    const result = await lighthouse(
      `${baseUrl}${route.path}`,
      {
        logLevel: "error",
        onlyCategories: Object.keys(thresholds),
        output: "json",
        port: chrome.port,
      },
      desktopMode ? desktopConfig : undefined,
    );
    if (!result?.lhr || !result.report) {
      throw new Error(`Lighthouse returned no report for ${route.path}.`);
    }

    await fs.writeFile(
      path.join(
        reportDirectory,
        `${route.label}${desktopMode ? "-desktop" : ""}.json`,
      ),
      result.report,
    );
    const scores = Object.fromEntries(
      Object.entries(thresholds).map(([category, threshold]) => {
        const score = result.lhr.categories[category]?.score ?? 0;
        if (score < threshold) failed = true;
        return [category, Math.round(score * 100)];
      }),
    );
    process.stdout.write(
      `${desktopMode ? "desktop" : "mobile"} ${route.path} ${JSON.stringify(scores)}\n`,
    );
  }

  if (failed) {
    throw new Error(
      "One or more Lighthouse routes did not meet the Batch 4 thresholds.",
    );
  }
} finally {
  if (chrome) {
    try {
      await chrome.kill();
    } catch (error) {
      process.stderr.write(`Chrome cleanup warning: ${String(error)}\n`);
    }
  }
  await stopProcess(server);
}

// chrome-launcher can retain a Windows file watcher after a successful cleanup.
// This script is a one-shot validation command, so end explicitly once complete.
process.exit(0);
