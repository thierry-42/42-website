# 42 Website — Figma, Codex, GitHub, and Deployment Workflow

This guide describes a practical workflow for moving between strategy, Figma, code, GitHub, and a preview deployment.

---

## 1. Recommended order

1. Create the GitHub repository.
2. Add the starter-kit files.
3. Connect the repository to Codex.
4. Initialise the website codebase.
5. Create the Figma file and design foundations.
6. Connect Figma to Codex.
7. Design and build the homepage in controlled sections.
8. Extend the design system to inner pages.
9. Push changes through GitHub.
10. Deploy a compliant preview environment.
11. Add Code Connect after component names and paths stabilise.

This can also be done code-first, but the design system and content hierarchy must remain deliberate.

---

## 2. GitHub setup

Create a repository such as:

`42-website`

Recommended initial files:

```text
AGENTS.md
docs/42_WEBSITE_MASTER_BRIEF.md
docs/WORKFLOW_FIGMA_CODEX_GITHUB_DEPLOYMENT.md
src/content/site-content.json
README.md
```

Use a private repository while the site contains draft material, unless your chosen free host requires a public repository.

Recommended branches:

- `main` — production-ready code
- `develop` — optional shared integration branch
- feature branches such as `feature/homepage`, `feature/services`, or Codex-generated branches

Protect `main` once a production domain is connected.

---

## 3. Connect GitHub to Codex

In Codex:

1. Sign in with the ChatGPT account that will do the build.
2. Connect the relevant GitHub account.
3. Grant access only to the repository or repositories required.
4. Create a Codex environment for the repository.
5. Configure dependencies, setup commands, and any required environment variables.
6. Start with a small verification task:
   - list the repository;
   - read `AGENTS.md`;
   - read the master brief;
   - run the existing build.
7. Ask Codex to implement work on a branch and review the diff before merging.

Codex can work through long tasks, but quality is generally better when the work is split into coherent phases with clear acceptance criteria.

---

## 4. Create the Figma file

Create a Figma Design file called:

`42 Website — Design System and Pages`

Add these pages:

- 00 — Cover & README
- 01 — Strategy & Sitemap
- 02 — Foundations
- 03 — Components
- 04 — Home
- 05 — Services
- 06 — Service Template
- 07 — Work
- 08 — Case Study Template
- 09 — About
- 10 — Insights
- 11 — Article Template
- 12 — HubSpot Review
- 13 — Contact
- 14 — Legal & Utility
- 15 — Responsive & States
- 16 — Prototype & Motion
- 99 — Archive

Paste the sitemap and key content into the Strategy page so Figma is not merely visual—it contains the page and content context.

---

## 5. Structure Figma for reliable code generation

Use:

- auto layout;
- variables;
- reusable components;
- variants;
- semantic layer names;
- separate top-level section frames;
- desktop and mobile frames;
- real copy;
- consistent image aspect ratios;
- annotations for sticky, responsive, and animated behaviour.

Avoid:

- one enormous frame containing the entire project;
- anonymous `Frame 123` naming;
- deeply nested groups;
- detached components;
- manually positioned content that should use auto layout;
- lorem ipsum;
- effects that cannot be reproduced accessibly on the web.

---

## 6. Connect Figma to Codex

The preferred route is the Figma plugin/MCP connection available inside Codex.

Typical setup:

1. Open the Codex app.
2. Open **Plugins**.
3. Find Figma and install/connect it.
4. Authenticate the correct Figma account.
5. Confirm the connected account can access the design file.
6. Give Codex a node-specific Figma Design URL.

A node-specific link looks conceptually like:

```text
https://www.figma.com/design/FILE_KEY/FILE_NAME?node-id=123-456
```

Do not provide only the file homepage when you need a particular frame. Select the frame or component in Figma, copy its link, and ensure the URL contains `node-id`.

The remote Figma connection is generally the simplest option. A local desktop MCP server is an alternative for specific workflows.

---

## 7. How Codex should read Figma

For each page or section, ask Codex to:

1. retrieve basic metadata;
2. retrieve the screenshot;
3. retrieve design context;
4. retrieve variables/tokens;
5. identify existing code components;
6. implement or update the section;
7. compare the local result to desktop and mobile frames;
8. fix visual and behavioural differences.

Use prompts such as:

> Inspect this node-specific Figma frame. Retrieve its screenshot, metadata, variables, and design context. Implement it in the existing Next.js project using the current tokens and components. Preserve the approved copy, semantic HTML, accessibility, and responsive behaviour. Do not paste generated reference code without adapting it to the repository.

For a visual QA pass:

> Compare the local homepage at `http://localhost:3000` against these Figma desktop and mobile frames. Identify and fix differences in type, spacing, sizing, grid, imagery, states, and motion. Do not alter approved content.

---

## 8. Figma content strategy

Figma should contain:

- final or near-final headings;
- body copy;
- CTA labels;
- service names;
- team placeholders;
- case-study placeholders;
- form labels;
- FAQ copy;
- responsive variants;
- component states.

The canonical structured content still lives in the repository. Figma is the design and review surface; the content file is the build source of truth.

When wording changes, update the repository content first or in the same change, then sync the visible design.

---

## 9. Code Connect

Use Code Connect after the following are stable:

- component names;
- source paths;
- variants;
- props;
- design-library components.

Good first mappings:

- Button
- Header
- ServiceCard
- CaseStudyCard
- TeamCard
- Accordion
- CtaPanel
- FormField
- ProcessStep

Code Connect is not required to start. It becomes useful once Figma and code share a real component system.

---

## 10. Suggested Codex task sequence

### Task 1 — Initialise

> Read `AGENTS.md`, the master brief, and the structured content. Initialise the Next.js TypeScript project using the agreed stack. Add linting, formatting, type checking, a production build, and an initial README. Do not implement final visual pages yet.

### Task 2 — Foundations

> Build the design tokens, typography, layout primitives, buttons, links, cards, surfaces, header, footer, placeholder image system, and accessibility foundations. Add a component preview route available only in development.

### Task 3 — Homepage

> Implement the homepage from the structured content and approved Figma frames. Work section by section. Add desktop and mobile layouts, purposeful motion, reduced-motion support, and a final visual comparison pass.

### Task 4 — Services

> Build the services index and reusable service-page template. Populate all service pages from structured data. Add metadata, breadcrumbs, related services, FAQs, and schema.

### Task 5 — Work and About

> Build the work index, case-study template, About page, and six team placeholders. Do not render unverified proof as real content.

### Task 6 — Contact and HubSpot review

> Build the contact and HubSpot review pages with accessible forms, configurable booking URL, validation, success/error states, and no invented endpoint.

### Task 7 — Insights and technical SEO

> Add the insights system, article template, metadata, sitemap, robots, schema, internal linking, and placeholder article records.

### Task 8 — QA

> Run a full production build, lint, type checking, automated tests, keyboard checks, responsive visual review, reduced-motion review, and Lighthouse review. Fix material issues rather than merely listing them.

---

## 11. Local development

Typical workflow:

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
```

Use the commands defined by the generated project if they differ.

Keep secrets in `.env.local`, never in the repository.

Suggested variables:

```env
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_BOOKING_URL=
NEXT_PUBLIC_HUBSPOT_PORTAL_ID=
NEXT_PUBLIC_HUBSPOT_FORM_ID=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

---

## 12. Deployment choices

### Vercel

Vercel is an excellent technical fit for Next.js and GitHub preview deployments.

Important commercial note:

- Vercel Hobby is intended for personal, non-commercial use.
- A consultancy website is commercial.
- Use a Pro plan, an eligible Pro trial, or another host whose free plan permits your intended usage.
- Hobby also has restrictions around private repositories owned by GitHub organisations and collaboration.

Basic Vercel Git flow:

1. Create a Vercel account.
2. Connect GitHub.
3. Import the repository.
4. Set the framework preset.
5. add environment variables;
6. deploy;
7. use preview deployments for branches;
8. merge approved work to `main` for production.

### Cloudflare Pages

Cloudflare Pages is a strong free preview option, especially for a static or edge-compatible build. Static asset requests are free and unlimited on Pages, with plan limits for builds and functions.

Before choosing it:

- confirm the current Next.js deployment adapter and feature compatibility;
- avoid depending on Vercel-specific runtime behaviour;
- test forms, image optimisation, middleware, and dynamic routes;
- consider static export for the first brochure-site version.

### GitHub Pages

Suitable only if the project can be exported as a fully static site. It is less convenient for server actions, dynamic image optimisation, preview deployments, and future HubSpot form handling.

### Practical recommendation

For the design/build test:

1. develop locally;
2. keep the source in GitHub;
3. use a compliant preview option;
4. use Vercel Pro trial or Pro when the commercial site is ready if the Next.js/Vercel workflow is preferred;
5. otherwise deploy a static-compatible build to Cloudflare Pages.

---

## 13. Git and deployment discipline

- Every major phase should produce a reviewable branch or commit.
- Do not merge a failing build.
- Do not commit `.env` files.
- Use preview URLs for review.
- Tag meaningful release points.
- Keep placeholder proof hidden in production.
- Maintain a rollback path.
- Add a custom domain only after content, legal, analytics, forms, and tracking are approved.

---

## 14. What to provide later

To complete the final site, provide:

- final logo files;
- final brand palette approval;
- founder portrait set;
- five additional team portraits;
- names, roles, bios, and LinkedIn links;
- verified HubSpot certifications;
- confirmed partner status wording, if any;
- approved client logos;
- approved testimonials;
- approved case studies and metrics;
- booking link;
- contact email;
- legal entity details;
- privacy and cookie requirements;
- analytics IDs;
- HubSpot portal and form details;
- social links;
- final domain.

---

## 15. Final workflow rule

Treat Figma, repository content, and implementation as one system:

- **Brief:** strategic source of truth
- **Structured content:** factual and reusable copy source
- **Figma:** visual design and review source
- **Code:** functional implementation source
- **GitHub:** version history and collaboration source
- **Deployment platform:** preview and production delivery

Do not allow any one surface to drift silently from the others.
