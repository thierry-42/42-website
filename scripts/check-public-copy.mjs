import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const roots = ["src/app", "src/components", "src/content", "src/lib", "public"];
const textExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mdx",
  ".mjs",
  ".svg",
  ".ts",
  ".tsx",
  ".txt",
]);
const prohibitedTokens = [
  String.fromCodePoint(0x2014),
  "&" + "mdash;",
  "&#" + "8212;",
  "&#x" + "2014;",
  "\\" + "u2014",
];

async function collectTextFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory())
      files.push(...(await collectTextFiles(absolutePath)));
    else if (textExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(absolutePath);
    }
  }

  return files;
}

const files = (
  await Promise.all(
    roots.map((root) => collectTextFiles(path.join(projectRoot, root))),
  )
).flat();
const failures = [];

for (const file of files) {
  const source = await readFile(file, "utf8");
  const sourceLower = source.toLowerCase();

  for (const token of prohibitedTokens) {
    const comparableToken = token.toLowerCase();
    let index = sourceLower.indexOf(comparableToken);

    while (index !== -1) {
      const line = source.slice(0, index).split(/\r?\n/u).length;
      failures.push(`${path.relative(projectRoot, file)}:${line}`);
      index = sourceLower.indexOf(comparableToken, index + token.length);
    }
  }
}

if (failures.length > 0) {
  console.error(
    `Public copy contains prohibited em-dash forms:\n${failures
      .sort()
      .map((failure) => `- ${failure}`)
      .join("\n")}`,
  );
  process.exit(1);
}

console.log(`Public copy check passed across ${files.length} source files.`);
