import path from "node:path";

process.env.PLAYWRIGHT_BROWSERS_PATH ??= path.resolve(".playwright");

await import("../node_modules/@playwright/test/cli.js");
