# 42: Your HubSpot Answer

Production foundation for the public website of **42**, the public-facing brand of Company42. The application uses Next.js App Router, React, strict TypeScript, Tailwind CSS, Motion for React, and a bespoke component system.

42 is positioned as a senior-led HubSpot consultancy for mid-market organisations across North America and EMEA.

## Public routes

- `/`: homepage
- `/services` and `/services/[slug]`: overview and eight published service lines
- `/about`: positioning, team identities, audience, and principles
- `/approach`: the Understand, Architect, Build, Enable process
- `/insights`: editorial index
- `/insights/category/[slug]`: four populated launch categories
- `/insights/[slug]`: thirteen published, sourced articles
- `/hubspot-review`: genuine portal-review service and conversion page
- `/contact`: environment-aware HubSpot form and email fallback
- `/privacy` and `/terms`: published legal information using the confirmed operator identity

`/audience`, `/industries`, `/work`, and `/work/[slug]` remain in source but are unpublished for Version 1. They are omitted from public navigation and sitemap output and return 404 while their feature flags are disabled.

`/insights/author/[slug]` is database-backed. Thierry-Luc Denichaud and Emma Black have reusable published author records and public author pages.

## Source of truth

Read these files before broad design, content, navigation, or architecture changes:

1. `AGENTS.md`
2. `docs/42-Website-Product-Requirements-Document-v1.0.md`
3. `docs/42_WEBSITE_MASTER_BRIEF.md`
4. `docs/WORKFLOW_FIGMA_CODEX_GITHUB_DEPLOYMENT.md`
5. `src/content/site-content.json`

The PRD is the product source of truth. Structured JSON remains canonical for shared website content; `src/content/site-content.ts` validates it and exposes publication-safe projections. PostgreSQL is the sole runtime source for Insights articles, categories, authors, sources, and relationships.

## Requirements and local setup

- Node.js 20.9 or newer
- npm 10 or newer

```bash
npm install
copy .env.example .env.local
npm run db:prepare
npm run dev
```

Set `DATABASE_URL` in `.env.local` before running `db:prepare`; Insights routes
fail closed when no database is configured. Open `http://localhost:3000`. In
development only, `/dev/design-system` provides component specimens.

For a disposable seeded local database, set `SITE_ENVIRONMENT=development` and
`DATABASE_TEST_MODE=pg-mem`, leave `DATABASE_URL` empty, skip `db:prepare`, and
run `npm run dev`. This in-memory mode is rejected by Render staging and
production.

## Scripts

| Command                           | Purpose                                              |
| --------------------------------- | ---------------------------------------------------- |
| `npm run dev`                     | Start the local development server                   |
| `npm run build`                   | Create the optimized production build                |
| `npm run start`                   | Serve a completed production build                   |
| `npm run lint`                    | Run ESLint with zero warnings allowed                |
| `npm run typecheck`               | Run strict TypeScript checks without emitting files  |
| `npm run db:migrate`              | Apply pending PostgreSQL schema migrations           |
| `npm run db:seed`                 | Apply the idempotent approved Insights seed          |
| `npm run db:prepare`              | Run migrations and then seed data                    |
| `npm run db:test`                 | Verify migrations, seed data, and publication gates  |
| `npm run format`                  | Format source and configuration files                |
| `npm run format:check`            | Verify formatting without changing files             |
| `npm run test:install`            | Install Chromium for smoke tests                     |
| `npm test`                        | Run desktop and mobile Playwright smoke tests        |
| `npm run test:cross-browser`      | Run Batch 4 checks in WebKit                         |
| `npm run test:firefox`            | Run Batch 4 checks in Firefox                        |
| `npm run test:lighthouse`         | Run the throttled mobile Lighthouse baseline         |
| `npm run test:lighthouse:desktop` | Enforce the Lighthouse release thresholds on desktop |
| `npm run test:staging`            | Run the approved staging-form integration checks     |
| `npm run test:ui`                 | Open Playwright's interactive runner                 |

## Project structure

```text
src/
├── app/                  App Router pages, metadata, sitemap, robots, and 404
├── components/
│   ├── diagrams/         System-diagram nodes
│   ├── forms/            HubSpot embed and accessible form controls
│   ├── layout/           Header, footer, containers, sections, and logo
│   ├── motion/           Reduced-motion-aware interaction utilities
│   ├── sections/         Shared page-level compositions
│   └── ui/               Type, actions, cards, tags, panels, and accordion
├── content/              Canonical shared-site JSON, validation, and route copy
├── lib/                  Database, Insights queries, metadata, proof, and utilities
└── styles/               Global styles and semantic design tokens
public/
├── icons/                Approved icon asset location
└── images/
    ├── editorial/        Page-level illustrations
    ├── insights/         Insight images
    ├── services/         Service images
    ├── team/             Stable portrait replacement paths
    └── work/             Unpublished case-study visuals
scripts/                  Asset and Playwright helpers
database/                 Versioned PostgreSQL migrations and idempotent seeds
tests/                    Critical route and interaction smoke tests
```

## Content and publication governance

Public records pass through the central gate in `src/lib/proof.ts`:

- `isPublished` must be `true` when present;
- `isPlaceholder` must not be `true`;
- `isVerified` must be `true` when present.

Do not bypass this projection for public proof. The published team biographies, roles, specialisms, and portraits for Thierry-Luc, Emma, and Zane are approved. Luca remains absent from public data and rendering.

Every published Insight is read from PostgreSQL and has one governed category, one reusable author, ordered sources, explicit related-Insight links, and one or more related services. Public queries require a published, non-placeholder article with a current publication date plus a published, approved author and category. Empty categories are automatically excluded.

Confirmed legal-operator facts are stored under `legal` in `site-content.json`. The published Privacy Policy and Terms of Use use those facts; internal launch-review notes remain in repository documentation rather than public page copy.

## Portrait and image replacement

The following portraits are approved for public production use:

- `public/images/team/thierry-luc.webp`
- `public/images/team/zane-smith.webp`
- `public/images/team/emma-black.webp`

They render through `next/image` with stable dimensions and approved alt text. Any unapproved future portrait remains subject to the existing production portrait gate. Unused Luca development assets may remain in the repository but are not imported or rendered publicly.

Service and Insight illustrations use stable local paths. Unpublished case-study placeholders remain under `public/images/work/`.

## Environment configuration

Copy `.env.example` to `.env.local` and set only approved values:

| Variable                                 | Use                                                             |
| ---------------------------------------- | --------------------------------------------------------------- |
| `SITE_ENVIRONMENT`                       | `development`, `staging`, or `production`                       |
| `NEXT_PUBLIC_VISUAL_PREFERENCES_ENABLED` | Enables the approved visual-preferences controls                |
| `NEXT_PUBLIC_LINKEDIN_URL`               | Optional approved public profile                                |
| `HUBSPOT_STAGING_REGION`                 | Approved staging/testing form; provide all three staging values |
| `HUBSPOT_STAGING_PORTAL_ID`              | Approved staging/testing form; provide all three staging values |
| `HUBSPOT_STAGING_FORM_ID`                | Approved staging/testing form; provide all three staging values |
| `HUBSPOT_PRODUCTION_REGION`              | Approved production form; provide all three production values   |
| `HUBSPOT_PRODUCTION_PORTAL_ID`           | Approved production form; provide all three production values   |
| `HUBSPOT_PRODUCTION_FORM_ID`             | Approved production form; provide all three production values   |
| `DATABASE_URL`                           | Server-only PostgreSQL application connection                   |
| `DATABASE_MIGRATION_URL`                 | Optional DDL-capable migration and initial seed connection      |
| `DATABASE_POOL_MAX`                      | Maximum pool connections per Web Service instance               |
| `DATABASE_CONNECTION_TIMEOUT_MS`         | PostgreSQL connection timeout                                   |
| `DATABASE_IDLE_TIMEOUT_MS`               | PostgreSQL idle-client timeout                                  |
| `DATABASE_TEST_MODE`                     | Tests only; never configure on staging or production            |

The production canonical is always `https://company42.co`; staging and local hosts are never emitted as canonical URLs. `SITE_ENVIRONMENT=production` is the only indexable mode. Staging and development emit `noindex, nofollow`, disallow crawling in `robots.txt`, return an empty sitemap, and omit canonical, Open Graph, and structured-data output. If `SITE_ENVIRONMENT` is omitted from a non-development build, the safe default is staging.

The visible fallback is `hello@company42.co`, and all consultation links remain on `/contact`.

Visual preferences are enabled when `NEXT_PUBLIC_VISUAL_PREFERENCES_ENABLED=true`. Selections are stored in the browser under `company42.visualPreferences.v1`; they are not transmitted, tracked, or stored in a cookie.

The staging form loads only when all three staging variables are present and `SITE_ENVIRONMENT` is not `production`. Production uses only the three production variables and never falls back to staging values. The visible `hello@company42.co` fallback remains available in every environment.

The form embed has resilient loading, success, validation, and script-failure states. The fallback email remains outside the cross-origin form frame and is usable even if HubSpot or JavaScript is unavailable. No analytics, HubSpot website tracking code, marketing pixel, or newsletter tracking integration is active.

Staging and production use separate PostgreSQL databases and credentials. Database connections are server-only, migrations and the one-time launch seed are versioned, and the in-memory test adapter is rejected outside an explicit development test process. See [Database operations](docs/DATABASE_OPERATIONS.md) for setup, migration, seed, pooling, and release guidance.

## Figma workflow

Repository content remains canonical and Figma remains the design-review surface:

1. Work from node-specific desktop and mobile frame links.
2. Inspect variables, metadata, screenshots, and design context section by section.
3. Adapt the design to existing tokens and components.
4. Compare at 1440, 834, and 390 pixel widths.
5. Update structured content and Figma together when approved wording changes.

## Testing

Install the supported Playwright browsers once, then run:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run db:test
npm run test:install
npm test
npm run test:cross-browser
npm run test:staging
npm run test:lighthouse
npm run test:lighthouse:desktop
npm run build
```

Playwright builds and serves the app with `SITE_ENVIRONMENT=production`. Tests cover the complete public route graph, broken and orphan links, metadata, sitemap and robots behavior, structured data, public and unpublished routes, the category taxonomy, service requirements, production portrait safeguards, production form isolation, visible email fallback, legal draft safeguards, navigation and focus containment, adaptive cursor boundaries, 200% reflow, console errors, security headers, and automated WCAG checks.

`npm run test:staging` builds the application with the approved staging form variables and runs the HubSpot embed, success-state, failure-state, Privacy-link, email fallback, and non-indexing checks without submitting a real form.

Both Lighthouse commands write ignored JSON reports to `.lighthouse/`. They apply the same release thresholds of 95 Performance and 100 Accessibility, Best Practices, and SEO to the homepage, Services index, one service detail, About, Insights index, one Insight article, and Contact. The desktop command is the release baseline. The throttled mobile command intentionally exits non-zero when any route misses a target so a regression cannot be overlooked; its measured result and any gap must be reported rather than hidden. Manual review still covers representative real-device behavior and visual quality at the viewport list in the master brief.

## Security headers

Every route receives a restrictive Content Security Policy, `DENY` framing protection, MIME sniffing protection, strict-origin referrer handling, a limited permissions policy, and HSTS. HTTPS redirection remains the responsibility of the deployment platform so local HTTP development stays functional across browsers. The CSP permits the application's own assets plus the HubSpot form hosts required for scripts, frames, submissions, images, and form requests:

- `*.hsforms.net`
- `*.hsforms.com`
- `*.hubspot.com`
- `*.hsappstatic.net`

The HubSpot allowances are intentionally limited to the Contact form. No analytics, advertising, session-replay, social-pixel, or generic third-party script origin is permitted.

## Deployment

Render hosts separate staging and production Web Services. The staging service uses `SITE_ENVIRONMENT=staging`; the production service uses `SITE_ENVIRONMENT=production`. Render subdomains are not emitted as canonical origins.

- Project root: repository root
- Node.js: 20.9 or newer
- Build command on a free Render Web Service: `npm ci && npm run db:prepare && npm run build`
- Build command when pre-deploy commands are available: `npm ci && npm run build`
- Pre-deploy command when available: `npm run db:prepare`
- Next.js service start command: `npm run start`
- Environment variables: configure in the hosting platform, never in Git

Attach a separate Render PostgreSQL database to each Web Service and set that environment's private/internal connection URL as `DATABASE_URL`. Do not share staging and production databases. `npm run db:prepare` applies pending schema migrations and any unapplied numbered content seeds. The content-seed ledger makes later runs no-ops, preserving editorial changes made directly in PostgreSQL.

On the Render staging Web Service, configure:

```text
SITE_ENVIRONMENT=staging
NEXT_PUBLIC_VISUAL_PREFERENCES_ENABLED=true
HUBSPOT_STAGING_REGION=eu1
HUBSPOT_STAGING_PORTAL_ID=148811132
HUBSPOT_STAGING_FORM_ID=da5e2637-3fc8-4ab0-96b1-4764ecd0f16e
```

Do not configure the production form variables on staging. On the production Web Service, set `SITE_ENVIRONMENT=production`, `NEXT_PUBLIC_VISUAL_PREFERENCES_ENABLED=true`, and all three approved `HUBSPOT_PRODUCTION_*` values. Production never falls back to the staging form configuration.
