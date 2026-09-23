# Database operations

The website has a server-only PostgreSQL foundation for Insights data. The
versioned migrations define the content model, and the one-time content seed
provides the approved launch records without embedding credentials in the
repository.

## Environment separation

Use a separate Render PostgreSQL database for staging and production. Keep each
database in the same Render region as its Web Service and use the private or
internal connection URL.

Configure these server-only variables on each Web Service:

- `DATABASE_URL`: the least-privilege application connection.
- `DATABASE_MIGRATION_URL`: an optional DDL-capable connection used only by the
  migration command. If omitted, migrations use `DATABASE_URL`.
- `DATABASE_POOL_MAX`: maximum connections per application instance. The
  default is `5`.
- `DATABASE_CONNECTION_TIMEOUT_MS`: connection timeout. The default is `5000`.
- `DATABASE_IDLE_TIMEOUT_MS`: idle client timeout. The default is `30000`.

Do not prefix database variables with `NEXT_PUBLIC_`. Do not copy production
credentials into staging, local files, logs, tests, or Git.

`DATABASE_TEST_MODE=pg-mem` is restricted to explicit local test and development
runs. Render staging and production fail closed if this test mode is configured,
and the application never falls back to in-memory data.

## Migrations

Versioned SQL files live in `database/migrations/`. Applied versions and SHA-256
checksums are recorded in `_schema_migrations`. Never edit an applied migration;
add the next numbered file instead.

Run locally against an explicitly configured PostgreSQL database:

```bash
npm run db:migrate
```

After migrations, apply the idempotent initial Insights seed with:

```bash
npm run db:seed
```

The runner uses a PostgreSQL advisory lock, applies each pending file in its own
transaction, rejects missing or changed applied files, and does not print
connection strings. Migrations do not run from `npm start` or from a request.

The seed is recorded in `_content_seeds` with a checksum. It runs once per
database and is then skipped, so later editorial changes in PostgreSQL are not
overwritten by a deployment. A changed applied seed is rejected; add another
numbered seed for future controlled data changes. Run migrations and the seed
together when provisioning a new database with:

```bash
npm run db:prepare
```

On Render, set the Web Service pre-deploy command to `npm run db:prepare`. Free
Web Services do not provide pre-deploy commands, so include it in the build
command instead: `npm ci && npm run db:prepare && npm run build`. Applied
content seeds are skipped by the ledger, so this does not overwrite later
editorial changes.

Before a destructive migration, confirm a recent recoverable backup. Prefer
expand-and-contract changes: add and backfill compatible columns first, deploy
compatible application code, and remove obsolete structures in a later release.

## Schema

The initial schema contains:

- `authors`
- `insight_categories`
- `articles`
- `article_sources`
- `article_services`
- `article_relations`

Authors, categories, and articles use `draft`, `published`, or `archived`
statuses. Articles also retain explicit placeholder and publication-date gates.
Every public query must require a published, non-placeholder article whose
`published_at` is not in the future, together with published author and category
records. Ordered content and relationships use explicit `display_order` or
`sort_order` columns.

## Pooling and shutdown

`src/lib/database/pool.ts` creates one lazy pool per Node.js process. Keep the
pool size low enough that the sum across all Render instances remains below the
database plan's connection limit. The helper exposes parameterised queries,
checked-out clients for transactions, and an explicit close operation for
scripts and tests.

Application code must never interpolate visitor-controlled values into SQL.
Use query parameters and a transaction for multi-table publication changes.

## Publishing and maintaining Insights

There is intentionally no CMS in this phase. Connect to the correct Render
PostgreSQL database with Render's provided connection command, confirm whether
you are in staging or production, and make editorial changes in a transaction.
Test every change in staging first.

Create an article by inserting its content and resolving its author and category
by slug. Keep new work in `draft` until it is ready:

```sql
BEGIN;

INSERT INTO articles (
  slug, title, summary, quick_answer, body_markdown, author_id, category_id,
  image_path, image_alt, og_image_path, reading_time_minutes, seo_title,
  seo_description, featured, is_placeholder, status, published_at,
  sources_reviewed_at, display_order
)
VALUES (
  'article-slug',
  'Article title',
  'Article summary',
  'Concise answer',
  '## First section',
  (SELECT id FROM authors WHERE slug = 'emma-black'),
  (SELECT id FROM insight_categories WHERE slug = 'crm-data-revops'),
  '/images/insights/example.webp',
  'Factual image description',
  '/images/insights/example.webp',
  6,
  'SEO title',
  'SEO description',
  FALSE,
  FALSE,
  'draft',
  NULL,
  CURRENT_DATE,
  100
);

COMMIT;
```

Add ordered sources, related services, and related articles through
`article_sources`, `article_services`, and `article_relations`. Use the article
ID selected by slug and start `sort_order` at `0`.

Edit article fields with a parameterised `UPDATE`, and always advance
`updated_at`:

```sql
UPDATE articles
SET summary = 'Revised summary', updated_at = CURRENT_TIMESTAMP
WHERE slug = 'article-slug';
```

Publish only after the author and category are also published:

```sql
UPDATE articles
SET status = 'published', published_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'article-slug' AND is_placeholder = FALSE;
```

Remove an article from the public site without deleting its history by setting
`status` to `draft` or `archived`. The same dynamic route then returns 404:

```sql
UPDATE articles
SET status = 'archived', updated_at = CURRENT_TIMESTAMP
WHERE slug = 'article-slug';
```

Published changes become visible after the five-minute application cache
expires. No frontend page or application deployment is required.

## Verification

The database check creates an isolated in-memory PostgreSQL-compatible database,
applies the migrations and seed twice to prove idempotence, verifies the expected
launch counts and schema, exercises its core relationships, and checks the
publication safeguards:

```bash
npm run db:test
```

The in-memory mode is for automated checks only. Release verification still
requires applying the same migrations and seed to the staging Render PostgreSQL
database before approving a database-backed staging release.
