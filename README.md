# 42 — Your HubSpot answer

Production foundation for the public website of **42**, a senior-led HubSpot consultancy. The application uses Next.js App Router, React, strict TypeScript, Tailwind CSS, Motion for React, and a bespoke component system.

The repository now includes the complete responsive homepage, service overview, eight data-driven service pages, About, Approach, Industries, Audience, Work, Insights, HubSpot Review, Contact, Privacy, Terms, publication-safe detail templates, and the shared design system behind them.

## Public routes

- `/` — homepage
- `/services` and `/services/[slug]` — service overview and eight published service lines
- `/about` — positioning, interactive principles, team, audience, and working model
- `/approach` — the detailed Understand, Architect, Build, Enable process
- `/industries` — six master-brief industry contexts with relevant service paths
- `/audience` — approved audience and industry-context page
- `/work` and `/work/[slug]` — proof-gated work index and case-study template
- `/insights` and `/insights/[slug]` — publication-gated editorial index and article template
- `/hubspot-review` — portal-review conversion page
- `/contact` — enquiry form and next-step guidance
- `/privacy` and `/terms` — legal-review foundations awaiting approved copy

## Source of truth

Read these files before broad design, content, navigation, or architecture changes:

- `AGENTS.md`
- `docs/42_WEBSITE_MASTER_BRIEF.md`
- `docs/WORKFLOW_FIGMA_CODEX_GITHUB_DEPLOYMENT.md`
- `src/content/site-content.json`

The structured JSON remains the canonical reusable content source. `src/content/site-content.ts` validates it and exposes a proof-safe public projection.

## Requirements and setup

- Node.js 20.9 or newer
- npm 10 or newer

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. In development only, `/dev/design-system` provides a component specimen page. It resolves as not found in production.

## Scripts

| Command                | Purpose                                             |
| ---------------------- | --------------------------------------------------- |
| `npm run dev`          | Start the local Next.js development server          |
| `npm run build`        | Create the optimized production build               |
| `npm run start`        | Serve a completed production build                  |
| `npm run lint`         | Run ESLint with zero warnings allowed               |
| `npm run typecheck`    | Run strict TypeScript checks without emitting files |
| `npm run format`       | Format source and configuration files               |
| `npm run format:check` | Verify formatting without changing files            |
| `npm run test:install` | Install the Chromium browser used by smoke tests    |
| `npm test`             | Run desktop and mobile Playwright smoke tests       |
| `npm run test:ui`      | Open Playwright's interactive runner                |

## Project structure

```text
src/
├── app/                 App Router pages, metadata, sitemap, robots, 404
├── components/
│   ├── diagrams/        Reusable system-diagram nodes
│   ├── forms/           Accessible controls and enquiry-form foundation
│   ├── layout/          Container, section, header, footer, logo
│   ├── motion/          Reduced-motion-aware reveal utilities
│   ├── sections/        Shared page-level compositions
│   └── ui/              Typography, actions, cards, tags, panels, accordion
├── content/             Canonical JSON, validation, typed route copy
├── lib/                 Configuration, metadata, proof and class utilities
├── styles/              Global styles and semantic design tokens
└── types/               Shared TypeScript types
public/
├── icons/               Stable location for approved icon assets
└── images/
    ├── diagrams/        System-diagram image assets
    ├── insights/        Insight image replacements
    ├── placeholders/    Neutral development visuals
    ├── team/            Stable approved and placeholder portrait paths
    └── work/            Case-study visual paths
scripts/                 Local asset and Playwright helpers
tests/                   Critical route and navigation smoke tests
```

## Content and proof governance

`src/content/site-content.ts` validates the source JSON with Zod at build time. Public record lists pass through a single gate in `src/lib/proof.ts`:

- `isPublished` must be `true` when present;
- `isPlaceholder` must not be `true`;
- `isVerified` must be `true` when present.

Unapproved team profiles, case studies, metrics, and articles are therefore excluded before they reach card components. Do not bypass this projection for public proof. Published services, approved team names and role copy, and published insights currently pass this gate. Team working relationships remain stored in content data and are not presented publicly.

Repeated navigation, service, CTA, FAQ, and brand content must remain data-driven. Approved new content should be added to the structured source rather than embedded in presentational components.

## Design system

The design tokens live in `src/styles/tokens.css` and include:

- ink, paper, signal green, supporting orbit blue, and HubSpot-context coral;
- locally hosted Overused Grotesk for primary display and interface typography,
  Inter for secondary reading text, and Geist Mono for technical notation;
- fluid type and section scales;
- container widths, breakpoints, spacing, radii, and shadows;
- light and dark semantic surfaces;
- focus and reduced-motion behaviour.

The system avoids a third-party component framework. Components are semantic, responsive, keyboard accessible, and designed for light or dark contexts.

## Image assets and replacements

The service and page-level editorial images are original conceptual system illustrations. Their production paths and prompt direction are documented in `docs/IMAGE_GENERATION_ART_DIRECTION.md`; the visual benchmark decisions are recorded in `docs/COMPETITIVE_VISUAL_RESEARCH.md`. They deliberately avoid client identities, copied software interfaces, people, logos, and unverified proof.

The following development placeholders still need approved source material. Replace files in place to preserve all layout references:

- `public/images/team/thierry-luc-placeholder.webp`
- `public/images/team/luca-codevilla-placeholder.webp`
- `public/images/team/zane-smith-placeholder.webp`
- `public/images/team/emma-black-placeholder.webp`
- `public/images/work/case-study-placeholder-01.webp` through `-03.webp`
- `public/images/diagrams/system-overview.webp`

The four current team portraits are AI-generated visual placeholders, explicitly labelled in the interface, and are not likenesses of the named people. Keep the 4:5 aspect ratio when replacing them, export modern formats, set `imageIsPlaceholder` to `false`, and update approved alt text in structured content. `scripts/generate-placeholders.mjs` can recreate the neutral development set. The bespoke card icons remain code-native in `src/components/ui/system-icons.tsx` so their stroke, accent, dark-context, and motion states stay consistent.

## Environment variables

Copy `.env.example` to `.env.local` and set only approved values:

| Variable                            | Use                                                             |
| ----------------------------------- | --------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`              | Canonical production origin and sitemap host                    |
| `NEXT_PUBLIC_BOOKING_URL`           | Approved external booking destination; falls back to `/contact` |
| `NEXT_PUBLIC_CONTACT_EMAIL`         | Approved public contact email                                   |
| `NEXT_PUBLIC_LINKEDIN_URL`          | Approved external profile                                       |
| `NEXT_PUBLIC_CONTACT_FORM_ENDPOINT` | Approved enquiry-form endpoint                                  |
| `NEXT_PUBLIC_HUBSPOT_PORTAL_ID`     | Optional HubSpot integration identifier                         |
| `NEXT_PUBLIC_HUBSPOT_FORM_ID`       | Optional HubSpot form identifier                                |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`     | Optional analytics identifier                                   |

No integration loads and no external destination is invented when its value is empty. Never commit `.env.local` or secrets.

## Figma workflow

The current implementation follows the code-first route in the workflow document:

1. Keep repository content canonical.
2. Create or connect the named Figma design-system file.
3. Work from node-specific desktop and mobile frame links.
4. Inspect variables, metadata, screenshots, and design context for one section at a time.
5. Adapt design context to existing tokens and components instead of pasting generated code.
6. Compare implementation and Figma at 1440, 834, and 390 pixel widths.
7. Add Code Connect only after component names and paths stabilize.

When copy changes, update the structured repository content first or in the same change, then sync the visible design.

## Testing and quality checks

Install Chromium once, then run the complete check sequence:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test:install
npm test
npm run build
```

Playwright checks every primary route at desktop and mobile sizes, visible headings and landmarks, browser console errors, the desktop Services treatment and outside-click dismissal, animated FAQ disclosure semantics, scroll-to-top behaviour, keyboard skip navigation, mobile menu operation, and automated WCAG checks. Manual review should still cover keyboard navigation, 200% zoom, reduced motion, and the target viewport list in the master brief.

## Deployment notes

The project is a standard Next.js application and does not currently contain a Sites hosting manifest. Choose a deployment target only after the production domain, legal copy, contact destination, booking URL, and analytics choices are approved.

- Configure the project root as this repository root.
- Use Node.js 20.9 or newer.
- Run `npm run build` as the build command.
- Add approved environment variables in the hosting platform, not in Git.
- Use a commercial-plan host appropriate for a consultancy website.
- Keep preview deployments private while draft material remains in the repository.
- Confirm the chosen Next.js adapter supports image optimization and any future server actions or form handling.

Do not connect the production domain until content proof, privacy, terms, consent, analytics, and forms have received the required approvals.
