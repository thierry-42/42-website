import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";

import { newDb } from "pg-mem";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = process.cwd();

async function loadTypeScriptModule(relativePath, mocks = {}) {
  const filename = path.join(root, relativePath);
  const source = await fs.readFile(filename, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: filename,
  }).outputText;
  const loadedModule = { exports: {} };
  const localRequire = (specifier) =>
    Object.hasOwn(mocks, specifier) ? mocks[specifier] : require(specifier);

  vm.runInNewContext(compiled, {
    console,
    exports: loadedModule.exports,
    module: loadedModule,
    process,
    require: localRequire,
  });

  return loadedModule.exports;
}

const database = newDb({ autoCreateForeignKeyIndices: true });
const adapter = database.adapters.createPg();
const pool = new adapter.Pool();

try {
  const migration = await fs.readFile(
    path.join(root, "database/migrations/0001_create_insights_schema.sql"),
    "utf8",
  );
  const seed = await fs.readFile(
    path.join(root, "database/seeds/001_initial_insights.sql"),
    "utf8",
  );
  await pool.query(migration);
  await pool.query(seed);

  const models = await loadTypeScriptModule("src/lib/insights/models.ts");
  const repository = await loadTypeScriptModule(
    "src/lib/insights/repository.ts",
    {
      "server-only": {},
      "next/cache": { unstable_cache: (operation) => operation },
      "@/lib/database/pool": {
        queryDatabase: (text, values = []) => pool.query(text, values),
      },
      "@/lib/insights/models": models,
    },
  );

  const initialInsights = await repository.listPublishedInsights();
  assert.equal(initialInsights.length, 13);
  assert.ok(initialInsights.every((insight) => insight.isPublished));
  assert.ok(initialInsights.every((insight) => !insight.isPlaceholder));

  const article = await repository.getPublishedInsight(initialInsights[0].slug);
  assert.ok(article);
  assert.ok(article.bodyMarkdown.length > 100);
  assert.ok(article.sources.length > 0);

  const categories = await repository.listPublishedInsightCategories();
  assert.equal(categories.length, 4);
  assert.ok(categories.every((category) => category.articleCount > 0));

  const authors = await repository.listPublishedInsightAuthors();
  assert.equal(authors.length, 2);
  assert.ok(authors.every((author) => author.articleCount > 0));

  const serviceInsights = await repository.listPublishedInsightsByService(
    "hubspot-strategy-consulting",
  );
  assert.ok(serviceInsights.length > 0);
  assert.ok(
    serviceInsights.every((insight) =>
      insight.serviceSlugs.includes("hubspot-strategy-consulting"),
    ),
  );
  assert.equal(
    await repository.getPublishedInsight("missing-article"),
    undefined,
  );
  assert.equal(
    await repository.getPublishedInsightCategory("missing-category"),
    undefined,
  );
  assert.equal(
    await repository.getPublishedInsightAuthor("missing-author"),
    undefined,
  );
  assert.deepEqual(
    await repository.listPublishedInsightsByService("missing-service"),
    [],
  );

  await pool.query(`
    INSERT INTO articles (
      slug, title, summary, quick_answer, body_markdown, author_id,
      category_id, image_path, image_alt, reading_time_minutes, status,
      is_placeholder, published_at
    )
    VALUES (
      'scheduled-test-article', 'Scheduled test article', 'Not public yet.',
      'Not public yet.', '## Test\n\nNot public yet.',
      (SELECT id FROM authors ORDER BY id LIMIT 1),
      (SELECT id FROM insight_categories ORDER BY id LIMIT 1),
      '/images/insights/portal-audit.webp', '', 1, 'published', FALSE,
      '2099-01-01T00:00:00Z'
    )
  `);

  const afterScheduledInsert = await repository.listPublishedInsights();
  assert.equal(afterScheduledInsert.length, 13);
  assert.equal(
    await repository.getPublishedInsight("scheduled-test-article"),
    undefined,
  );

  console.log("Insights repository checks passed.");
} finally {
  await pool.end();
}
