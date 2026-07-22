import { spawn } from "node:child_process";
import path from "node:path";

const projectRoot = process.cwd();
const testPort = process.env.PLAYWRIGHT_TEST_PORT ?? "3100";
const baseUrl = `http://127.0.0.1:${testPort}`;
const browserPath = path.join(projectRoot, ".playwright");
const nextCli = path.join(
  projectRoot,
  "node_modules",
  "next",
  "dist",
  "bin",
  "next",
);
const playwrightCli = path.join(
  projectRoot,
  "node_modules",
  "@playwright",
  "test",
  "cli.js",
);

process.env.PLAYWRIGHT_BROWSERS_PATH ??= browserPath;
process.env.PLAYWRIGHT_BASE_URL = baseUrl;

async function isServerReady() {
  try {
    const response = await fetch(baseUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(1_500),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForServer(server) {
  const deadline = Date.now() + 120_000;

  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(
        `The Next.js test server exited with code ${server.exitCode}.`,
      );
    }
    if (await isServerReady()) return;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(
    "The Next.js test server did not become ready within 120 seconds.",
  );
}

function runProcess(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, options);
    child.once("error", reject);
    child.once("exit", (code) => resolve(code ?? 1));
  });
}

async function stopServer(server) {
  if (server.exitCode !== null || !server.pid) return;

  server.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => server.once("exit", resolve)),
    new Promise((resolve) => setTimeout(resolve, 3_000)),
  ]);
  server.unref();
}

let server;
let testExitCode = 1;

try {
  if (await isServerReady()) {
    throw new Error(
      `The isolated Playwright port ${testPort} is already in use.`,
    );
  }

  const buildExitCode = await runProcess(process.execPath, [nextCli, "build"], {
    cwd: projectRoot,
    env: process.env,
    stdio: "inherit",
    windowsHide: true,
  });

  if (buildExitCode !== 0) {
    throw new Error(
      `The production test build exited with code ${buildExitCode}.`,
    );
  }

  server = spawn(
    process.execPath,
    [nextCli, "start", "--hostname", "127.0.0.1", "--port", testPort],
    {
      cwd: projectRoot,
      env: process.env,
      stdio: "inherit",
      windowsHide: true,
    },
  );
  await waitForServer(server);

  testExitCode = await runProcess(
    process.execPath,
    [playwrightCli, "test", ...process.argv.slice(2)],
    {
      cwd: projectRoot,
      env: process.env,
      stdio: "inherit",
      windowsHide: true,
    },
  );
} finally {
  if (server) await stopServer(server);
}

process.exit(testExitCode);
