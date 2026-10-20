import assert from "node:assert/strict";

process.env.NODE_ENV = "test";
process.env.SITE_ENVIRONMENT = "development";
process.env.DATABASE_TEST_MODE = "pg-mem";
delete process.env.DATABASE_URL;
delete process.env.DATABASE_MIGRATION_URL;

const { createConfiguredMigrationPool, runMigrations } =
  await import("./migrate.mjs");
const { runContentSeeds } = await import("./seed.mjs");

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

  const firstSeed = await runContentSeeds({ isTestDatabase, pool });
  assert.deepEqual(firstSeed.appliedVersions, ["001", "002", "003", "004"]);
  const firstSeedCounts = await readSeedCounts();
  assert.equal(firstSeedCounts.authors, 2);
  assert.equal(firstSeedCounts.categories, 4);
  assert.equal(firstSeedCounts.published_articles, 13);
  assert.equal(firstSeedCounts.emma_articles, 4);
  assert.ok(firstSeedCounts.relations > 0, "article relations should exist");

  const contentSeedLedger = await pool.query(
    "SELECT version, name FROM _content_seeds ORDER BY version",
  );
  assert.deepEqual(contentSeedLedger.rows, [
    { name: "initial_insights", version: "001" },
    {
      name: "optimize_hubspot_crm_implementation_guide",
      version: "002",
    },
    {
      name: "update_hubspot_implementation_meta_description",
      version: "003",
    },
    {
      name: "optimize_hubspot_portal_audit_guide",
      version: "004",
    },
  ]);

  const implementationGuide = await pool.query(`
    SELECT
      article.slug,
      article.title,
      article.seo_title,
      article.seo_description,
      article.reading_time_minutes,
      article.published_at,
      article.updated_at,
      article.sources_reviewed_at,
      author.slug AS author_slug,
      category.slug AS category_slug
    FROM articles AS article
    JOIN authors AS author ON author.id = article.author_id
    JOIN insight_categories AS category ON category.id = article.category_id
    WHERE article.slug = 'prepare-for-hubspot-crm-implementation'
  `);
  const implementationGuideSources = await pool.query(`
    SELECT COUNT(*)::INTEGER AS source_count
    FROM article_sources AS source
    JOIN articles AS article ON article.id = source.article_id
    WHERE article.slug = 'prepare-for-hubspot-crm-implementation'
  `);
  assert.deepEqual(
    {
      ...implementationGuide.rows[0],
      published_at: new Date(
        implementationGuide.rows[0].published_at,
      ).toISOString(),
      source_count: Number(implementationGuideSources.rows[0].source_count),
      updated_at: new Date(
        implementationGuide.rows[0].updated_at,
      ).toISOString(),
    },
    {
      author_slug: "thierry-luc-denichaud",
      category_slug: "hubspot-strategy-implementation",
      published_at: "2026-07-22T00:00:00.000Z",
      reading_time_minutes: 15,
      seo_description:
        "Plan your HubSpot CRM implementation with a practical checklist for CRM architecture, data migration, integrations, testing, training and go-live.",
      seo_title: "HubSpot CRM Implementation Guide: Checklist, Plan & Timeline",
      slug: "prepare-for-hubspot-crm-implementation",
      source_count: 6,
      sources_reviewed_at: new Date("2026-10-19T00:00:00.000Z"),
      title: "How to Prepare for a HubSpot CRM Implementation",
      updated_at: "2026-10-19T00:00:00.000Z",
    },
  );

  const portalAuditGuide = await pool.query(`
    SELECT
      article.slug,
      article.title,
      article.seo_title,
      article.seo_description,
      article.reading_time_minutes,
      article.published_at,
      article.updated_at,
      article.sources_reviewed_at,
      author.slug AS author_slug,
      category.slug AS category_slug
    FROM articles AS article
    JOIN authors AS author ON author.id = article.author_id
    JOIN insight_categories AS category ON category.id = article.category_id
    WHERE article.slug = 'signs-your-hubspot-portal-needs-an-audit'
  `);
  const portalAuditGuideSources = await pool.query(`
    SELECT COUNT(*)::INTEGER AS source_count
    FROM article_sources AS source
    JOIN articles AS article ON article.id = source.article_id
    WHERE article.slug = 'signs-your-hubspot-portal-needs-an-audit'
  `);
  const portalAuditGuideServices = await pool.query(`
    SELECT COUNT(*)::INTEGER AS service_count
    FROM article_services AS service
    JOIN articles AS article ON article.id = service.article_id
    WHERE article.slug = 'signs-your-hubspot-portal-needs-an-audit'
  `);
  assert.deepEqual(
    {
      ...portalAuditGuide.rows[0],
      published_at: new Date(
        portalAuditGuide.rows[0].published_at,
      ).toISOString(),
      service_count: Number(portalAuditGuideServices.rows[0].service_count),
      source_count: Number(portalAuditGuideSources.rows[0].source_count),
      updated_at: new Date(portalAuditGuide.rows[0].updated_at).toISOString(),
    },
    {
      author_slug: "emma-black",
      category_slug: "crm-data-revops",
      published_at: "2026-09-23T00:00:00.000Z",
      reading_time_minutes: 15,
      seo_description:
        "Learn what a HubSpot audit should cover across CRM architecture, data, workflows, reporting, integrations and governance, with a practical checklist.",
      seo_title: "HubSpot Audit Guide: CRM, Portal & Data Checklist",
      service_count: 2,
      slug: "signs-your-hubspot-portal-needs-an-audit",
      source_count: 7,
      sources_reviewed_at: new Date("2026-10-20T00:00:00.000Z"),
      title: "Signs Your HubSpot Portal Needs an Audit",
      updated_at: "2026-10-20T00:00:00.000Z",
    },
  );

  await pool.query(
    `UPDATE articles
     SET title = 'Editorial change preserved', status = 'archived'
     WHERE slug = 'signs-your-hubspot-portal-needs-an-audit'`,
  );

  const secondSeed = await runContentSeeds({ isTestDatabase, pool });
  assert.deepEqual(secondSeed.appliedVersions, []);
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
