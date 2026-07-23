# 42 — Your HubSpot Answer

Production foundation for the public website of **42**, the public-facing brand of Company42. The application uses Next.js App Router, React, strict TypeScript, Tailwind CSS, Motion for React, and a bespoke component system.

42 is positioned as a senior-led HubSpot consultancy for mid-market organisations across North America and EMEA.

## Public routes

- `/` — homepage
- `/services` and `/services/[slug]` — overview and eight published service lines
- `/about` — positioning, team identities, audience, and principles
- `/approach` — the Understand, Architect, Build, Enable process
- `/insights` — editorial index
- `/insights/category/[slug]` — four populated launch categories
- `/insights/[slug]` — ten published, sourced articles
- `/hubspot-review` — genuine portal-review service and conversion page
- `/contact` — environment-aware HubSpot form and email fallback
- `/privacy` and `/terms` — existing legal-review foundations awaiting Batch 3

`/audience`, `/industries`, `/work`, and `/work/[slug]` remain in source but are unpublished for Version 1. They are omitted from public navigation and sitemap output and return 404 while their feature flags are disabled.

`/insights/author/[slug]` is implemented as author-page architecture. The draft Thierry-Luc record remains unlinked, is excluded from the sitemap, and returns 404 in production until its biography and portrait are approved.

## Source of truth

Read these files before broad design, content, navigation, or architecture changes:

1. `AGENTS.md`
2. `docs/42-Website-Product-Requirements-Document-v1.0.md`
3. `docs/42_WEBSITE_MASTER_BRIEF.md`
4. `docs/WORKFLOW_FIGMA_CODEX_GITHUB_DEPLOYMENT.md`
5. `src/content/site-content.json`

The PRD is the product source of truth. Structured JSON is the canonical reusable content source; `src/content/site-content.ts` validates it and exposes publication-safe projections.

## Requirements and local setup

- Node.js 20.9 or newer
- npm 10 or newer

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. In development only, `/dev/design-system` provides component specimens.

## Scripts

| Command                | Purpose                                             |
| ---------------------- | --------------------------------------------------- |
| `npm run dev`          | Start the local development server                  |
| `npm run build`        | Create the optimized production build               |
| `npm run start`        | Serve a completed production build                  |
| `npm run lint`         | Run ESLint with zero warnings allowed               |
| `npm run typecheck`    | Run strict TypeScript checks without emitting files |
| `npm run format`       | Format source and configuration files               |
| `npm run format:check` | Verify formatting without changing files            |
| `npm run test:install` | Install Chromium for smoke tests                    |
| `npm test`             | Run desktop and mobile Playwright smoke tests       |
| `npm run test:ui`      | Open Playwright's interactive runner                |

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
├── content/              Canonical JSON, validation, articles, and route copy
├── lib/                  Environment, metadata, proof, and class utilities
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
tests/                    Critical route and interaction smoke tests
```

## Content and publication governance

Public records pass through the central gate in `src/lib/proof.ts`:

- `isPublished` must be `true` when present;
- `isPlaceholder` must not be `true`;
- `isVerified` must be `true` when present.

Do not bypass this projection for public proof. Team names and roles are approved, while biographies and specialism wording remain marked `owner-review-required`.

Every published Insight has one governed `categorySlug`, one `authorSlug`, explicit related-Insight links, and one or more related services. The four category records include original introductions. Empty categories are automatically excluded.

Confirmed legal-operator facts are stored under `legal` in `site-content.json` for Batch 3. This does not make the current Privacy or Terms routes final legal wording.

## Portrait and image replacement

The current team portraits are AI-assisted development assets:

- `public/images/team/thierry-luc.webp`
- `public/images/team/luca-codevilla.webp`
- `public/images/team/zane-smith.webp`
- `public/images/team/emma-black.webp`

They are labelled in development/staging and are not rendered when `SITE_ENVIRONMENT=production`. Replace files in place using the existing 4:5 aspect ratio, then update approved alt text and set `portraitApprovalStatus` to `approved` and `imageIsPlaceholder` to `false`.

Service and Insight illustrations use stable local paths. Unpublished case-study placeholders remain under `public/images/work/`.

## Environment configuration

Copy `.env.example` to `.env.local` and set only approved values:

| Variable                        | Use                                                            |
| ------------------------------- | -------------------------------------------------------------- |
| `SITE_ENVIRONMENT`              | `development`, `staging`, or `production`                      |
| `NEXT_PUBLIC_LINKEDIN_URL`      | Optional approved public profile                               |
| `NEXT_PUBLIC_HUBSPOT_REGION`    | Optional production-form override                              |
| `NEXT_PUBLIC_HUBSPOT_PORTAL_ID` | Optional production-form override                              |
| `NEXT_PUBLIC_HUBSPOT_FORM_ID`   | Optional production-form override                              |
| `HUBSPOT_STAGING_REGION`        | Separate non-production form; provide all three staging values |
| `HUBSPOT_STAGING_PORTAL_ID`     | Separate non-production form; provide all three staging values |
| `HUBSPOT_STAGING_FORM_ID`       | Separate non-production form; provide all three staging values |

The production canonical is `https://company42.co`, the visible fallback is `hello@company42.co`, and all consultation links remain on `/contact`.

The approved live HubSpot form loads only when `SITE_ENVIRONMENT=production`. Development and staging display the email fallback unless all three separate staging-form values are supplied. This prevents test enquiries entering the live process. No analytics or tracking integration is active.

## Figma workflow

Repository content remains canonical and Figma remains the design-review surface:

1. Work from node-specific desktop and mobile frame links.
2. Inspect variables, metadata, screenshots, and design context section by section.
3. Adapt the design to existing tokens and components.
4. Compare at 1440, 834, and 390 pixel widths.
5. Update structured content and Figma together when approved wording changes.

## Testing

Install Chromium once, then run:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test:install
npm test
npm run build
```

Playwright builds and serves the app with `SITE_ENVIRONMENT=production`. Tests cover public and unpublished routes, the category taxonomy, service requirements, production portrait safeguards, live-form configuration, visible email fallback, navigation, menu interactions, scroll-to-top, keyboard skip navigation, mobile navigation, console errors, and automated WCAG checks.

Manual review should still cover keyboard navigation, 200% zoom, reduced motion, and the viewport list in the master brief.

## Deployment

Render is staging/testing only. Set `SITE_ENVIRONMENT=staging` there and do not use its URL as the canonical origin.

- Project root: repository root
- Node.js: 20.9 or newer
- Build command: `npm run build`
- Next.js service start command: `npm run start`
- Environment variables: configure in the hosting platform, never in Git

Production hosting is still to be confirmed. Privacy and Terms belong to Batch 3 and must reflect the deployed technology, HubSpot form behaviour, consent, third-party processing, and cookies actually present. Search-engine environment policy and final canonical/sitemap/robots work belong to Batch 4.
