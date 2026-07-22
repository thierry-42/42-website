# AGENTS.md — 42 Website

## Mission

Build and maintain the public website for **42**, a senior-led HubSpot consultancy.

The strategic source of truth is:

- `docs/42_WEBSITE_MASTER_BRIEF.md`
- `src/content/site-content.json`
- `docs/WORKFLOW_FIGMA_CODEX_GITHUB_DEPLOYMENT.md`

Read these before making broad design, architecture, navigation, or content changes.

## Brand

- Brand name: `42`
- Category: HubSpot consultancy
- Primary line: `Your HubSpot answer.`
- Positioning: senior-led HubSpot strategy plus hands-on technical implementation.
- The website must feel premium, editorial, clear, technically credible, and original.
- Subtle references to 42 as “the answer” are allowed.
- Do not create a science-fiction fan aesthetic.
- Do not copy Hitchhiker’s Guide artwork, cover design, characters, distinctive symbols, or long quotations.
- Do not clone competitor or Webflow reference sites.

## Truth and proof

Never invent or imply:

- HubSpot partner tier or status;
- awards;
- client names or logos;
- testimonials;
- review counts;
- certifications;
- revenue or conversion outcomes;
- employee relationships;
- office locations;
- pricing;
- booking URLs.

Content with `isPlaceholder: true` or `isVerified: false` must not be rendered as production proof.

## Implementation

Use the latest stable, mutually compatible versions at implementation time.

Preferred stack:

- Next.js App Router
- React
- TypeScript strict mode
- Tailwind CSS
- Motion for React
- MDX or typed content for insights
- Playwright for critical smoke tests
- ESLint and Prettier

Do not add a heavy component framework unless the existing codebase already depends on it.

## Architecture

- Centralise repeated content in typed data or content files.
- Keep components small, reusable, semantic, and composable.
- Prefer server components for static content.
- Use client components only where interaction or animation requires them.
- Keep design tokens centralised.
- Keep service pages data-driven.
- Keep asset paths stable so placeholder portraits can be replaced without layout changes.
- Use explicit types.
- Avoid broad error swallowing.
- Avoid unnecessary abstractions and dependencies.

## Figma workflow

When a Figma file is connected:

1. Work from a node-specific Figma URL.
2. Inspect metadata, screenshot, variables, and design context.
3. Reuse existing code components.
4. Adapt Figma-generated reference code to this repository.
5. Compare desktop and mobile.
6. Preserve semantic HTML and accessibility.
7. Add Code Connect only after component paths and names stabilise.
8. Never attempt to ingest the full design file when a page or section link will do.

## Design quality

- Use generous whitespace and strong hierarchy.
- Combine editorial imagery with technical diagrams.
- Avoid generic gradient blobs, cheap 3D icons, excessive glassmorphism, and stock dashboard scenes.
- Do not overuse HubSpot orange.
- Motion must be purposeful and restrained.
- Respect `prefers-reduced-motion`.
- No scroll hijacking.
- No long intro loader.
- Ensure the mobile design is intentional, not a collapsed desktop layout.

## Accessibility

Target WCAG 2.2 AA.

Required:

- semantic landmarks;
- logical headings;
- keyboard support;
- visible focus;
- skip link;
- adequate contrast;
- labelled form controls;
- accessible menus, accordions, tabs, and dialogs;
- no hover-only information;
- reduced-motion support;
- sensible touch targets.

## Performance

- Optimise images and fonts.
- Avoid unnecessary client JavaScript.
- Prevent layout shift.
- Lazy-load non-critical assets.
- Run production builds.
- Investigate bundle or performance regressions.
- Aim for Lighthouse 90+ performance and 95+ accessibility, best practices, and SEO on major pages.

## Testing

Before considering a task complete:

- run lint;
- run type checking;
- run relevant tests;
- run a production build;
- inspect for console and hydration errors;
- test critical routes;
- test at desktop and mobile widths;
- verify keyboard interactions for changed components.

Add or update tests when behaviour changes.

## Autonomy

Work through discovery, implementation, verification, and refinement without stopping at a plan. Make reasonable assumptions where the brief permits them. Ask only when a missing fact would create a false public claim, an irreversible architectural choice, or a security/privacy risk.

## Completion notes

At the end of a substantial task, report:

- what changed;
- important design or technical decisions;
- tests run and results;
- remaining placeholders;
- any factual content that still requires approval.
