import assert from "node:assert/strict";

process.env.NODE_ENV = "test";
process.env.SITE_ENVIRONMENT = "development";
process.env.DATABASE_TEST_MODE = "pg-mem";
delete process.env.DATABASE_URL;
delete process.env.DATABASE_MIGRATION_URL;

const { createConfiguredMigrationPool, runMigrations } =
  await import("./migrate.mjs");
const { runInitialInsightsSeed } = await import("./seed.mjs");

const { isTestDatabase, pool } = await createConfiguredMigrationPool();

try {
  assert.equal(isTestDatabase, true);

  const firstRun = await runMigrations({ isTestDatabase, pool });
  assert.deepEqual(firstRun.appliedVersions, ["0001", "0002"]);

  const secondRun = await runMigrations({ isTestDatabase, pool });
  assert.deepEqual(secondRun.appliedVersions, []);

  const tables = await pool.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `);
  const tableNames = tables.rows.map((row) => row.table_name);

  for (const tableName of [
    "_content_seeds",
    "_schema_migrations",
    "article_relations",
    "article_services",
    "article_sources",
    "articles",
    "authors",
    "insight_categories",
  ]) {
    assert.ok(tableNames.includes(tableName), `${tableName} should exist`);
  }

  const readSeedCounts = async () => {
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*)::INTEGER FROM authors) AS authors,
        (SELECT COUNT(*)::INTEGER FROM insight_categories) AS categories,
        (SELECT COUNT(*)::INTEGER FROM articles WHERE status = 'published') AS published_articles,
        (
          SELECT COUNT(*)::INTEGER
          FROM articles
          INNER JOIN authors ON authors.id = articles.author_id
          WHERE articles.status = 'published' AND authors.slug = 'emma-black'
        ) AS emma_articles,
        (SELECT COUNT(*)::INTEGER FROM article_relations) AS relations
    `);
    const normaliseCount = (value) =>
      Number(Array.isArray(value) ? value[0] : value);

    return Object.fromEntries(
      Object.entries(result.rows[0]).map(([key, value]) => [
        key,
        normaliseCount(value),
      ]),
    );
  };

  const firstSeed = await runInitialInsightsSeed({ isTestDatabase, pool });
  assert.equal(firstSeed.applied, true);
  const firstSeedCounts = await readSeedCounts();
  assert.equal(firstSeedCounts.authors, 2);
  assert.equal(firstSeedCounts.categories, 4);
  assert.equal(firstSeedCounts.published_articles, 13);
  assert.equal(firstSeedCounts.emma_articles, 4);
  assert.ok(firstSeedCounts.relations > 0, "article relations should exist");

  await pool.query(
    `UPDATE articles
     SET title = 'Editorial change preserved', status = 'archived'
     WHERE slug = 'signs-your-hubspot-portal-needs-an-audit'`,
  );

  const secondSeed = await runInitialInsightsSeed({ isTestDatabase, pool });
  assert.equal(secondSeed.applied, false);
  const preservedArticle = await pool.query(
    `SELECT title, status
     FROM articles
     WHERE slug = 'signs-your-hubspot-portal-needs-an-audit'`,
  );
  assert.deepEqual(preservedArticle.rows[0], {
    status: "archived",
    title: "Editorial change preserved",
  });
  await pool.query(
    `UPDATE articles
     SET title = 'Signs Your HubSpot Portal Needs an Audit', status = 'published'
     WHERE slug = 'signs-your-hubspot-portal-needs-an-audit'`,
  );
  assert.deepEqual(await readSeedCounts(), firstSeedCounts);

  const author = await pool.query(
    `INSERT INTO authors (
       slug, name, role, biography, short_biography, image_path, image_alt,
       bio_approval_status, portrait_approval_status, status, display_order
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'approved', 'approved', 'published', 0)
     RETURNING id`,
    [
      "test-author",
      "Test Author",
      "Test role",
      "Test biography",
      "Test short biography",
      "/test-author.webp",
      "Test author",
    ],
  );
  const category = await pool.query(
    `INSERT INTO insight_categories (
       slug, name, introduction, status, display_order
     ) VALUES ($1, $2, $3, 'published', 0)
     RETURNING id`,
    ["test-category", "Test category", "Test introduction"],
  );
  const article = await pool.query(
    `INSERT INTO articles (
       slug, title, summary, quick_answer, body_markdown, author_id,
       category_id, image_path, image_alt, reading_time_minutes, status,
       published_at, display_order
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 1, 'published', CURRENT_TIMESTAMP, 0)
     RETURNING id`,
    [
      "test-article",
      "Test article",
      "Test summary",
      "Test answer",
      "Test body",
      author.rows[0].id,
      category.rows[0].id,
      "/test-article.webp",
      "Test article",
    ],
  );

  await pool.query(
    `INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
     VALUES ($1, 'Test publisher', 'Test source', 'https://example.com/source', 0)`,
    [article.rows[0].id],
  );
  await pool.query(
    `INSERT INTO article_services (article_id, service_slug, sort_order)
     VALUES ($1, 'test-service', 0)`,
    [article.rows[0].id],
  );

  const persisted = await pool.query(
    "SELECT slug, status FROM articles WHERE id = $1",
    [article.rows[0].id],
  );
  assert.deepEqual(persisted.rows[0], {
    slug: "test-article",
    status: "published",
  });

  await assert.rejects(
    pool.query(
      `INSERT INTO articles (
         slug, title, summary, quick_answer, body_markdown, author_id,
         category_id, image_path, image_alt, reading_time_minutes, status
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 1, 'published')`,
      [
        "published-without-date",
        "Invalid article",
        "Test summary",
        "Test answer",
        "Test body",
        author.rows[0].id,
        category.rows[0].id,
        "/invalid.webp",
        "Invalid article",
      ],
    ),
  );

  await assert.rejects(
    pool.query(
      `INSERT INTO articles (
         slug, title, summary, quick_answer, body_markdown, author_id,
         category_id, image_path, image_alt, reading_time_minutes, status,
         published_at, is_placeholder
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 1, 'published', CURRENT_TIMESTAMP, TRUE)`,
      [
        "published-placeholder",
        "Invalid placeholder",
        "Test summary",
        "Test answer",
        "Test body",
        author.rows[0].id,
        category.rows[0].id,
        "/invalid.webp",
        "Invalid placeholder",
      ],
    ),
  );
} finally {
  await pool.end();
}

for (const deployedEnvironment of ["staging", "production"]) {
  process.env.SITE_ENVIRONMENT = deployedEnvironment;
  await assert.rejects(
    createConfiguredMigrationPool(),
    /permitted only when NODE_ENV=test and SITE_ENVIRONMENT=development/,
  );
}

console.log("Database migration checks passed.");
