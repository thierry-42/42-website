BEGIN;

-- Initial launch authors. This seed is idempotent and does not delete future records.
INSERT INTO authors (
  slug, name, role, biography, short_biography, image_path, image_alt,
  bio_approval_status, portrait_approval_status, status, display_order
)
VALUES (
  'thierry-luc-denichaud', 'Thierry-Luc Denichaud', 'Founder & Senior HubSpot Consultant',
  'Thierry-Luc Denichaud is the founder of 42 and a senior HubSpot consultant with more than a decade of experience across CRM, CMS, platform architecture, systems integration and digital delivery. He has led website and engineering teams, designed enterprise-scale digital platforms, and delivered HubSpot programmes spanning CRM architecture, automation, RevOps, Service Hub, websites and custom integrations. His work focuses on turning complex business processes into clear, scalable and maintainable systems that teams can adopt and leaders can trust.', 'Thierry-Luc Denichaud is the founder of 42 and a senior HubSpot consultant specialising in CRM architecture, automation, integrations, websites and enterprise digital platforms.', '/images/team/thierry-luc.webp',
  'Thierry-Luc Denichaud, founder of 42', 'approved',
  'approved',
  'published', 0
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  biography = EXCLUDED.biography,
  short_biography = EXCLUDED.short_biography,
  image_path = EXCLUDED.image_path,
  image_alt = EXCLUDED.image_alt,
  bio_approval_status = EXCLUDED.bio_approval_status,
  portrait_approval_status = EXCLUDED.portrait_approval_status,
  status = EXCLUDED.status,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

INSERT INTO authors (
  slug, name, role, biography, short_biography, image_path, image_alt,
  bio_approval_status, portrait_approval_status, status, display_order
)
VALUES (
  'emma-black', 'Emma Black', 'Marketing Consultant / HubSpot Onboarding Specialist',
  'Emma connects marketing strategy with practical HubSpot onboarding, helping teams establish clear journeys, campaigns, content processes, and day-to-day ways of working.', 'Emma connects marketing strategy with practical HubSpot onboarding, helping teams establish clear journeys, campaigns, content processes, and day-to-day ways of working.', '/images/team/emma-black.webp',
  'Emma, member of the 42 team', 'approved',
  'approved',
  'published', 1
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  biography = EXCLUDED.biography,
  short_biography = EXCLUDED.short_biography,
  image_path = EXCLUDED.image_path,
  image_alt = EXCLUDED.image_alt,
  bio_approval_status = EXCLUDED.bio_approval_status,
  portrait_approval_status = EXCLUDED.portrait_approval_status,
  status = EXCLUDED.status,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

-- Approved launch categories.
INSERT INTO insight_categories (slug, name, introduction, status, display_order)
VALUES ('hubspot-strategy-implementation', 'HubSpot Strategy & Implementation', 'Make better platform decisions before configuration begins. These guides cover portal planning, implementation readiness, governance, support models, and the commercial choices that shape a maintainable HubSpot system.', 'published', 0)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  introduction = EXCLUDED.introduction,
  status = EXCLUDED.status,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

INSERT INTO insight_categories (slug, name, introduction, status, display_order)
VALUES ('crm-data-revops', 'CRM, Data & RevOps', 'Build a customer and revenue system people can trust. This collection focuses on CRM architecture, data quality, reporting definitions, lifecycle design, ownership, and the operational controls behind dependable decisions.', 'published', 1)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  introduction = EXCLUDED.introduction,
  status = EXCLUDED.status,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

INSERT INTO insight_categories (slug, name, introduction, status, display_order)
VALUES ('integrations-development', 'Integrations & Development', 'Connect HubSpot to the systems that run the business with a clear contract for data, ownership, timing, validation, and failure handling. These guides turn technical requests into testable, maintainable delivery.', 'published', 2)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  introduction = EXCLUDED.introduction,
  status = EXCLUDED.status,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

INSERT INTO insight_categories (slug, name, introduction, status, display_order)
VALUES ('websites-content-hub-accessibility', 'Websites, Content Hub & Accessibility', 'Treat the website as part of the customer system. These guides connect content, lead capture, consent, CRM operations, technical quality, accessibility, and reporting before design or platform decisions become expensive to change.', 'published', 3)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  introduction = EXCLUDED.introduction,
  status = EXCLUDED.status,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

-- Published launch articles.
INSERT INTO articles (
  slug, title, summary, quick_answer, body_markdown, author_id, category_id,
  image_path, image_alt, og_image_path, reading_time_minutes, seo_title,
  seo_description, featured, is_placeholder, status, published_at,
  sources_reviewed_at, display_order, updated_at
)
VALUES (
  'signs-your-hubspot-portal-needs-an-audit', 'Signs Your HubSpot Portal Needs an Audit', 'Most HubSpot problems appear as small, familiar workarounds. These signals show when the portal needs a structured review rather than one more local fix.',
  'Your HubSpot portal probably needs an audit when teams disagree on core definitions, every report needs a caveat, nobody can explain the automation, ownership is unclear, or integrations have become a collection of workarounds.', 'Most HubSpot problems do not show up as one broken workflow or a dashboard that stopped updating. They show up as a hundred small frictions that everyone has quietly learned to work around.

If any of these sound familiar, it is worth stepping back before you add one more workflow on top of the pile.

## Nobody agrees on what a qualified lead actually is

Sales has a definition. Marketing has a different one. The lifecycle stage field says a third thing. None of them are wrong; they were simply never reconciled. Now your reporting reflects three different businesses instead of one.

## Your reports require a caveat before you present them

"This number is close, but ignore the deals from the old pipeline" is a sentence that should never need to exist. If every report needs a footnote, the data is not broken. The process behind it is.

## Automation exists that nobody remembers building

Workflows accumulate. Someone builds a fix for a one-time problem in 2023, and it is still silently running in 2026, touching records it was never meant to touch.

## Ownership is unclear

When a field is wrong, do you know who is responsible for fixing it and who is responsible for making sure it does not happen again? If the answer is "whoever notices first", that is not governance. It is luck.

## Every integration was added separately

Each integration was added by a different person for a different reason. Individually, each decision made sense. Together, they have created a portal that nobody fully understands anymore, including the people who built it.

None of these problems is caused by one missing feature. They are caused by disconnected decisions across data, process, automation and reporting that were never designed to work together in the first place.

## What a portal review should do

A portal audit is not about assigning blame for how things got this way. It is a structured look at data, process, automation, reporting and governance, the five places where HubSpot problems actually originate. The purpose is to show what is fixable, what is foundational and what to prioritise first.

If you are nodding along to more than one of the signs above, that is usually the signal. We start with a portal review: discovery, process mapping, a technical assessment and a prioritised roadmap. The next decision about your system is then based on what is actually happening in it, not on what you assume is happening.',
  (SELECT id FROM authors WHERE slug = 'emma-black'),
  (SELECT id FROM insight_categories WHERE slug = 'crm-data-revops'),
  '/images/insights/portal-audit.webp', 'A precision inspection lens reviewing an interconnected CRM data system', '/images/insights/portal-audit.webp',
  4, 'Signs Your HubSpot Portal Needs an Audit', 'Most HubSpot problems appear as small, familiar workarounds. These signals show when the portal needs a structured review rather than one more local fix.',
  TRUE, FALSE, 'published', '2026-09-23',
  '2026-09-23', 0, '2026-09-23'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  quick_answer = EXCLUDED.quick_answer,
  body_markdown = EXCLUDED.body_markdown,
  author_id = EXCLUDED.author_id,
  category_id = EXCLUDED.category_id,
  image_path = EXCLUDED.image_path,
  image_alt = EXCLUDED.image_alt,
  og_image_path = EXCLUDED.og_image_path,
  reading_time_minutes = EXCLUDED.reading_time_minutes,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  featured = EXCLUDED.featured,
  is_placeholder = EXCLUDED.is_placeholder,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  sources_reviewed_at = EXCLUDED.sources_reviewed_at,
  display_order = EXCLUDED.display_order,
  updated_at = EXCLUDED.updated_at;

INSERT INTO articles (
  slug, title, summary, quick_answer, body_markdown, author_id, category_id,
  image_path, image_alt, og_image_path, reading_time_minutes, seo_title,
  seo_description, featured, is_placeholder, status, published_at,
  sources_reviewed_at, display_order, updated_at
)
VALUES (
  'prepare-for-hubspot-crm-implementation', 'How to prepare for a HubSpot CRM implementation', 'The decisions, data work, process mapping, governance, and rollout planning to complete before configuration begins.',
  'Prepare for a HubSpot CRM implementation by agreeing the business outcomes, mapping the customer and internal processes, defining the data model and ownership rules, cleaning the migration data, designing permissions, and planning adoption before configuration starts. The build should express those decisions rather than be the place where the business first discovers them.', 'Implementation is often described as a software setup. In practice, it is an operating-model project with software at the centre. HubSpot can provide objects, pipelines, lifecycle stages, automation, permissions, and reports; it cannot decide how your teams should qualify demand, hand over work, or govern customer data.

The preparation phase reduces rework because it separates business decisions from button clicks. It also gives the implementation team something testable to build against.

## Define the outcome and the boundary

Start with the decisions and behaviours the CRM must improve. ‘Implement HubSpot’ is not an outcome. ‘Give sales one qualified pipeline, route new enquiries within an agreed window, and report conversion from accepted lead to closed revenue’ is much closer.

Define what the first release includes and what it deliberately postpones. List the teams, regions, products, pipelines, integrations, and historical data in scope. A clear boundary protects the launch from becoming an attempt to solve every process at once.

- Which decisions must become easier after launch?
- Which manual handovers should disappear or become visible?
- Which teams must use the system on day one?
- Which outcomes will prove that the implementation works?

## Map the real process before designing fields

Interview the people doing the work and follow real examples from first interaction to sale, onboarding, support, and renewal. Capture entry criteria, exit criteria, ownership, exceptions, service levels, and the information required at each transition.

Lifecycle stages and pipeline stages solve different problems. Lifecycle stages describe a broad customer relationship; pipeline stages describe progress through a specific process. Agreeing that distinction early prevents reporting and automation from carrying contradictory meanings.

## Design the data model and migration rules

List the records you need, including contacts, companies, deals, tickets, products, activities, and any justified custom objects, then define the associations that make them useful. For each important field, document its purpose, format, allowed values, owner, source, and whether users or automation may update it.

Clean source data before migration. Decide which identifier updates an existing record, which system wins when values conflict, how duplicates are handled, and how historical activity will be treated. HubSpot imports require the appropriate import and object edit permissions, and record IDs or unique-value properties can be used to update and deduplicate supported records.

> **Keep in mind:** Run a representative test migration before the final cutover. Record counts alone are not enough; validate associations, values, ownership, dates, and downstream automation.

## Design seats, teams, permissions, and governance

Create a role matrix before adding users. Define who needs to view, create, edit, delete, import, export, publish, configure automation, and administer the account. Apply least privilege without making routine work impossible.

Name accountable owners for the CRM, data model, integrations, reporting definitions, and change requests. Governance does not need to be bureaucratic; it needs to make the next change understandable and reversible.

## Turn the design into a testable build plan

Translate the process maps into configuration stories with acceptance criteria. A story should describe the trigger, the intended behaviour, the data created or changed, who can see it, and how it will be tested.

### Prototype

Validate the data model, pipeline logic, and key user journeys with a small group before scaling the build.

### Configure

Build in controlled increments with naming standards, documentation, and peer review for high-risk automation.

### Test

Use real scenarios, negative cases, permission checks, integration failures, and reporting reconciliations, not only happy paths.

### Cut over

Freeze source changes where necessary, run the final migration, reconcile totals, and document exceptions.

## Plan adoption as part of the implementation

Training should be role-based and close to launch. Sales needs to know how the CRM supports selling; service needs to know how handovers and tickets work; managers need to understand the definitions behind their dashboards.

Create concise operating guides, office hours, a support route, and a prioritised backlog for post-launch learning. Measure adoption through meaningful behaviours such as timely updates, stage quality, completed required data, and successful handovers, not just login counts.

## Conclusion

A prepared implementation is faster because the difficult decisions have owners. HubSpot then becomes a clear expression of the operating model, rather than a collection of features looking for a process.',
  (SELECT id FROM authors WHERE slug = 'thierry-luc-denichaud'),
  (SELECT id FROM insight_categories WHERE slug = 'hubspot-strategy-implementation'),
  '/images/insights/crm-implementation.webp', 'CRM modules moving from loose parts into a connected operating system', '/images/insights/crm-implementation.webp',
  10, 'How to prepare for a HubSpot CRM implementation', 'The decisions, data work, process mapping, governance, and rollout planning to complete before configuration begins.',
  TRUE, FALSE, 'published', '2026-07-22',
  '2026-07-22', 1, '2026-07-22'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  quick_answer = EXCLUDED.quick_answer,
  body_markdown = EXCLUDED.body_markdown,
  author_id = EXCLUDED.author_id,
  category_id = EXCLUDED.category_id,
  image_path = EXCLUDED.image_path,
  image_alt = EXCLUDED.image_alt,
  og_image_path = EXCLUDED.og_image_path,
  reading_time_minutes = EXCLUDED.reading_time_minutes,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  featured = EXCLUDED.featured,
  is_placeholder = EXCLUDED.is_placeholder,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  sources_reviewed_at = EXCLUDED.sources_reviewed_at,
  display_order = EXCLUDED.display_order,
  updated_at = EXCLUDED.updated_at;

INSERT INTO articles (
  slug, title, summary, quick_answer, body_markdown, author_id, category_id,
  image_path, image_alt, og_image_path, reading_time_minutes, seo_title,
  seo_description, featured, is_placeholder, status, published_at,
  sources_reviewed_at, display_order, updated_at
)
VALUES (
  'before-connecting-your-website-to-hubspot', 'What to check before connecting your website to HubSpot', 'A pre-launch checklist for tracking, forms, consent, domains, data capture, attribution, and testing on an external website.',
  'Before connecting a website to HubSpot, decide exactly what will be tracked and captured, verify the correct account and domains, choose the form approach, map fields and lifecycle behaviour, configure consent with legal input, protect the implementation through a tag manager or controlled deployment, and test end-to-end in a clean browser session.', 'Adding a tracking script is easy. Creating trustworthy website-to-CRM data is not. A connection can affect analytics, contact creation, attribution, forms, chat, consent, automation, and reporting, so the work needs an agreed design and a test plan.

This checklist is for externally hosted websites. HubSpot-hosted pages include the account tracking code automatically, while external pages require deliberate installation.

## Decide what the connection is meant to do

Write down the required outcomes before touching production: traffic analytics, HubSpot forms, non-HubSpot form capture, chat, campaign attribution, behavioural events, consent management, or all of the above. Each outcome has different dependencies.

The HubSpot tracking code associates an external site with an account and enables page and visitor tracking. It does not create forms by itself. If the code is absent, features that depend on it, including overall site tracking and some embedded experiences, will not work on that page.

## Verify the account, domains, and deployment method

Confirm the HubSpot account ID, production domain, subdomains, country or language paths, staging domains, and who controls the website release. Entire domains hosted outside HubSpot should also be added in HubSpot settings as required by the chosen tools.

Install through one controlled route. If the code is hard-coded and also deployed through a tag manager or plugin, the site can fire it twice. Keep a record of where it is installed and exclude non-production environments from production reporting where appropriate.

- Confirm the script uses the intended HubSpot account.
- List every template and subdomain that must include it.
- Decide how single-page application route changes will be tracked.
- Prevent duplicate installation and accidental staging traffic.

## Choose the form and field strategy

An embedded HubSpot form submits directly to HubSpot. A supported non-HubSpot form may be detected when the tracking code and non-HubSpot form capture are enabled, but that approach should be tested against the actual form implementation. A custom experience may need the Forms API or a server-side integration.

Map each visible and hidden field to an intentional CRM property. Define the subscription or lawful-basis fields, campaign context, page context, owner or routing inputs, and the automation that follows. Avoid creating new properties simply because the website uses different labels.

## Design consent and privacy behaviour

Cookie and communication consent are related but not identical. Decide which cookies and scripts may run before consent, what the banner covers, how preferences can be reopened, and what notice appears on each form. Ask legal counsel to confirm the approach for the jurisdictions and data involved.

HubSpot''s consent banner can work on external pages with the tracking code and can block cookies from supported HubSpot integrations. HubSpot explicitly notes that it cannot automatically block arbitrary scripts manually placed on the page. Those scripts need their own consent-aware implementation.

> **Keep in mind:** This is an implementation checklist, not legal advice. Your legal team should approve the privacy notice, consent language, retention rules, and regional behaviour.

## Test the complete journey, not just the script

Use a new incognito session with browser extensions disabled where possible. Test consent choices, page views, a first-time submission, a returning visitor, an existing contact, validation errors, duplicate behaviour, hidden fields, routing, notifications, workflow enrolment, thank-you states, and reporting attribution.

### Browser

Confirm no duplicate network requests, blocked resources, JavaScript errors, layout shifts, or performance regressions.

### CRM

Confirm the correct record is created or updated with expected values, source, consent, associations, and activity.

### Operations

Confirm owners, tasks, notifications, workflows, and service-level timers behave as designed.

### Analytics

Confirm pages and submissions appear in the intended account and reconcile with a controlled test set.

## Document ownership before launch

Name the owner of the website code, HubSpot configuration, consent implementation, forms, and post-launch monitoring. Record the account ID, deployment location, field map, test cases, and rollback process. The connection is infrastructure and should be maintained like infrastructure.

## Conclusion

A successful connection is not one where the tracking code appears in the source. It is one where a real visitor journey produces accurate, consent-aware, actionable CRM data without introducing avoidable risk.',
  (SELECT id FROM authors WHERE slug = 'thierry-luc-denichaud'),
  (SELECT id FROM insight_categories WHERE slug = 'websites-content-hub-accessibility'),
  '/images/insights/website-connection.webp', 'Website and form panels connected through a validated path to a CRM core', '/images/insights/website-connection.webp',
  9, 'What to check before connecting your website to HubSpot', 'A pre-launch checklist for tracking, forms, consent, domains, data capture, attribution, and testing on an external website.',
  TRUE, FALSE, 'published', '2026-07-22',
  '2026-07-22', 2, '2026-07-22'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  quick_answer = EXCLUDED.quick_answer,
  body_markdown = EXCLUDED.body_markdown,
  author_id = EXCLUDED.author_id,
  category_id = EXCLUDED.category_id,
  image_path = EXCLUDED.image_path,
  image_alt = EXCLUDED.image_alt,
  og_image_path = EXCLUDED.og_image_path,
  reading_time_minutes = EXCLUDED.reading_time_minutes,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  featured = EXCLUDED.featured,
  is_placeholder = EXCLUDED.is_placeholder,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  sources_reviewed_at = EXCLUDED.sources_reviewed_at,
  display_order = EXCLUDED.display_order,
  updated_at = EXCLUDED.updated_at;

INSERT INTO articles (
  slug, title, summary, quick_answer, body_markdown, author_id, category_id,
  image_path, image_alt, og_image_path, reading_time_minutes, seo_title,
  seo_description, featured, is_placeholder, status, published_at,
  sources_reviewed_at, display_order, updated_at
)
VALUES (
  'why-your-crm-reports-are-not-reliable', 'Why your CRM reports are not reliable', 'How data definitions, associations, lifecycle rules, date fields, filters, and operational behaviour quietly undermine otherwise polished dashboards.',
  'CRM reports become unreliable when the business definition, underlying data, record associations, date logic, filters, and user behaviour do not agree. Fix reliability by defining the metric first, tracing every field to its source, testing the report against a known record set, and assigning ownership for the process that creates the data.', 'When two dashboards disagree, the natural reaction is to rebuild the chart. The chart is often the least important part. Reporting quality is the visible result of data architecture and operational discipline upstream.

The practical question is not whether HubSpot can draw the report. It is whether the records included, excluded, grouped, and counted genuinely represent the business question.

## The metric has no shared definition

Terms such as lead, qualified, pipeline, conversion, active customer, and revenue sound obvious until teams compare their definitions. A dashboard cannot resolve that disagreement. Document the event, record type, field, date, exclusions, currency treatment, and owner behind each important metric.

A good metric definition can be tested on an individual record. If nobody can explain why a particular deal is included, the aggregate is not ready for executive use.

## The report starts from the wrong data source

In the custom report builder, the primary data source determines the focus of the report and how related sources are joined. With multiple sources, records can be excluded or counted more than once because of their associations and filters.

Choose the grain of the question first: one row per contact, company, deal, ticket, activity, or something else. Then confirm the data-source join matches that grain. Do not add sources merely because they contain an interesting field.

## The required fields are incomplete or unstable

A report based on owner, source, stage, amount, product, or region is only as reliable as the process that sets those properties. Blank values, free-text alternatives, retroactive edits, and automation conflicts quietly change the result.

Use property history and change sources to investigate unexpected updates. HubSpot can show when a value changed and whether the source was a user, import, workflow, integration, or another process. That evidence helps fix the cause instead of patching the report.

## Date logic and filters are answering a different question

Create date, close date, stage-entry date, activity date, and campaign date are not interchangeable. A report about deals created this quarter is different from revenue closed this quarter. Relative dates, fiscal calendars, time zones, and reopened records can add further differences.

Dashboard filters are combined with report-level filters, and they only affect reports using compatible data sources. Review the final filter stack rather than assuming a dashboard control overrides the report beneath it.

## The operating process does not create the data on time

If teams update stages before a forecast meeting, the dashboard is a periodic survey rather than a live operating view. If handovers happen in email, HubSpot cannot report them. Reporting reliability therefore needs process design, required information at the right moment, and managers who use the same system in their routines.

## A practical reliability test

Pick one important report and test it deeply before attempting a dashboard-wide redesign.

### Write the definition

Describe the business question, grain, inclusion rules, exclusions, date, and expected output without referring to the chart.

### Build a known sample

Select a small set of records whose expected inclusion and values can be checked manually.

### Trace each field

Identify its source, format, owner, update paths, completion rate, and historical behaviour.

### Reconcile and monitor

Explain every difference, record the accepted logic, and add a recurring data-quality check.

## Conclusion

Trustworthy reporting is a chain of definitions, data, process, and configuration. Strengthen that chain and the dashboard becomes simpler because it no longer has to disguise uncertainty.',
  (SELECT id FROM authors WHERE slug = 'thierry-luc-denichaud'),
  (SELECT id FROM insight_categories WHERE slug = 'crm-data-revops'),
  '/images/insights/reliable-reporting.webp', 'Misaligned analytical tiles resolving into one coherent reporting system', '/images/insights/reliable-reporting.webp',
  9, 'Why your CRM reports are not reliable', 'How data definitions, associations, lifecycle rules, date fields, filters, and operational behaviour quietly undermine otherwise polished dashboards.',
  TRUE, FALSE, 'published', '2026-07-22',
  '2026-07-22', 3, '2026-07-22'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  quick_answer = EXCLUDED.quick_answer,
  body_markdown = EXCLUDED.body_markdown,
  author_id = EXCLUDED.author_id,
  category_id = EXCLUDED.category_id,
  image_path = EXCLUDED.image_path,
  image_alt = EXCLUDED.image_alt,
  og_image_path = EXCLUDED.og_image_path,
  reading_time_minutes = EXCLUDED.reading_time_minutes,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  featured = EXCLUDED.featured,
  is_placeholder = EXCLUDED.is_placeholder,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  sources_reviewed_at = EXCLUDED.sources_reviewed_at,
  display_order = EXCLUDED.display_order,
  updated_at = EXCLUDED.updated_at;

INSERT INTO articles (
  slug, title, summary, quick_answer, body_markdown, author_id, category_id,
  image_path, image_alt, og_image_path, reading_time_minutes, seo_title,
  seo_description, featured, is_placeholder, status, published_at,
  sources_reviewed_at, display_order, updated_at
)
VALUES (
  'what-to-include-in-a-custom-integration-brief', 'What to include in a custom integration brief', 'A clear integration brief turns a vague request to connect two systems into testable scope, ownership, mappings, controls, and acceptance criteria.',
  'A custom integration brief should define the business outcome, systems and environments, record ownership, field and association mappings, trigger and timing rules, authentication and permissions, volume, error handling, reconciliation, privacy, monitoring, support, acceptance tests, and explicit out-of-scope items.', '‘Connect HubSpot to our other system’ is a request, not a specification. Two teams can hear that sentence and imagine different records, directions, timing, security, and failure behaviour.

The brief does not need to prescribe every technical implementation. It needs to make the intended behaviour and constraints clear enough for an architect to evaluate options, estimate responsibly, and test the finished integration.

## Outcome, users, and scope

Explain the operational problem, the people affected, and the decision or handover the integration should improve. Name both systems, the relevant products or editions, production and test environments, and the objects in scope.

- What should happen without manual re-entry?
- Who needs to see or act on the resulting data?
- What is the required first release?
- What is explicitly excluded?

## System of record and mapping rules

For every object and important field, state which system is authoritative, which direction data travels, how records are matched, and what happens when both sides change. Map associations as deliberately as fields: a contact without the right company or a line item without its deal may be technically synced but operationally useless.

Include allowed values, transformations, required fields, default behaviour, deletion or archive handling, and historical data requirements. Avoid burying business rules inside code when they should be governed openly.

## Triggers, timing, and volume

Define whether the integration is real-time, event-driven, scheduled, or manually initiated. Give realistic current and peak volumes, batch sizes, acceptable delay, backfill size, and expected growth.

HubSpot API limits vary by authentication and distribution model. Webhooks can reduce unnecessary polling, but the receiving service must validate requests, respond promptly, handle out-of-order or repeated events, and tolerate retries. Design for limits and failure from the start.

## Authentication, access, and data protection

Identify the account owner, app owner, required scopes, secret-storage approach, rotation process, installation method, and people allowed to approve access. Use the smallest set of permissions that supports the design.

HubSpot''s current developer platform uses OAuth for apps installed across multiple accounts, while static authentication is intended for a single authorised account. The right model depends on distribution, support responsibility, and lifecycle rather than developer convenience.

## Failure, recovery, and reconciliation

Specify what happens when a record fails validation, a system is unavailable, a request is rate-limited, or the same event arrives twice. Decide whether processing stops, retries, quarantines the record, alerts an owner, or continues with a recorded exception.

- Idempotency and duplicate-event handling
- Retry policy and dead-letter or exception queue
- Human-readable error context and responsible owner
- Daily or periodic reconciliation between systems
- Backfill, replay, and rollback procedure

## Acceptance, monitoring, and support

Turn the brief into testable scenarios: create, update, merge, association change, deletion or archive, invalid input, permission failure, timeout, retry, and recovery. State the expected record and audit evidence in each system.

Define operational measures such as success rate, processing delay, queue depth, unresolved exceptions, and reconciliation variance. Name who supports each side, expected response windows, logging retention, deployment ownership, and the change process after launch.

> **Keep in mind:** A diagram is helpful, but it should complement the mapping and behavioural rules rather than replace them.

## Conclusion

The best integration brief makes ambiguity visible early. That creates space to choose the simplest reliable architecture and gives the business a shared definition of done.',
  (SELECT id FROM authors WHERE slug = 'thierry-luc-denichaud'),
  (SELECT id FROM insight_categories WHERE slug = 'integrations-development'),
  '/images/insights/integration-brief.webp', 'Two technical systems joined by mapped specification cards and connectors', '/images/insights/integration-brief.webp',
  10, 'What to include in a custom integration brief', 'A clear integration brief turns a vague request to connect two systems into testable scope, ownership, mappings, controls, and acceptance criteria.',
  FALSE, FALSE, 'published', '2026-07-22',
  '2026-07-22', 4, '2026-07-22'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  quick_answer = EXCLUDED.quick_answer,
  body_markdown = EXCLUDED.body_markdown,
  author_id = EXCLUDED.author_id,
  category_id = EXCLUDED.category_id,
  image_path = EXCLUDED.image_path,
  image_alt = EXCLUDED.image_alt,
  og_image_path = EXCLUDED.og_image_path,
  reading_time_minutes = EXCLUDED.reading_time_minutes,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  featured = EXCLUDED.featured,
  is_placeholder = EXCLUDED.is_placeholder,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  sources_reviewed_at = EXCLUDED.sources_reviewed_at,
  display_order = EXCLUDED.display_order,
  updated_at = EXCLUDED.updated_at;

INSERT INTO articles (
  slug, title, summary, quick_answer, body_markdown, author_id, category_id,
  image_path, image_alt, og_image_path, reading_time_minutes, seo_title,
  seo_description, featured, is_placeholder, status, published_at,
  sources_reviewed_at, display_order, updated_at
)
VALUES (
  'plan-a-website-redesign-around-crm-and-lead-capture', 'How to plan a website redesign around CRM and lead capture', 'Plan the content model, conversion paths, forms, consent, lifecycle rules, attribution, and handover before visual design locks in the wrong assumptions.',
  'Plan a redesign around the customer journey and the data it must create. Before final visual design, define audiences, conversion paths, content types, forms, CRM properties, consent, lifecycle and routing rules, attribution, integrations, measurement, migration, and post-launch ownership.', 'A website redesign can look successful while making the commercial system worse. Attractive pages do not compensate for broken attribution, duplicated properties, poor form strategy, inaccessible interactions, or leads that arrive without enough context to route and follow up.

The CRM should not dictate every creative choice. It should, however, be part of the architecture from the beginning so that the experience and the operating system support the same journey.

## Start with audiences, questions, and journeys

Define the priority audiences, the decisions they are trying to make, and the evidence they need. Map the routes from entry page to useful next action, including journeys that should not end in a sales form.

Then connect those journeys to the internal response. A consultation request, support question, partner enquiry, application, and content download should not all create the same record state or follow-up process.

## Design the content model before the page inventory

Define reusable content types, required fields, ownership, relationships, metadata, and publishing rules. Services, sectors, case studies, team profiles, resources, and legal content each need different structures and proof controls.

A content model makes future pages consistent without forcing every page into the same visual template. It also creates cleaner inputs for search, structured data, personalisation, and migration.

## Treat forms as part of the operating process

For each form, define its purpose, fields, hidden context, CRM mapping, progressive profiling strategy, consent, error handling, thank-you state, routing, notification, and service-level expectation. Collect only information that changes the next action or is genuinely required.

Decide whether each experience uses an embedded HubSpot form, a captured supported external form, the Forms API, or a custom integration. Test the chosen approach with the real front-end framework rather than assuming all forms behave the same.

## Write the measurement plan before launch

Agree the events, campaign parameters, traffic-source expectations, conversion definitions, lifecycle rules, and dashboards before the build is complete. Ensure the data required for those reports will actually be created by the experience.

Keep an implementation register for tracking code, tag manager, consent controls, analytics, ad platforms, form embeds, chat, and custom events. This reduces duplicate scripts and makes the eventual privacy and performance review practical.

## Plan redirects, migration, and cutover as product work

Inventory current URLs, organic landing pages, downloads, forms, conversion points, scripts, structured data, and inbound links. Define redirect rules and content acceptance criteria. A redesign that discards high-value routes or changes forms without a CRM reconciliation can create invisible loss.

### Before

Capture baselines, crawl the current site, map forms and scripts, and approve redirect and migration rules.

### During

Validate responsive layouts, accessibility, performance, metadata, tracking, consent, and CRM outcomes in staging.

### Launch

Use a cutover checklist with named owners, backups, DNS and cache planning, and a rollback decision point.

### After

Monitor crawl errors, key journeys, form reconciliation, attribution, automation, and performance against the baseline.

## Design for the team that will run the site

Document component rules, content standards, image requirements, form ownership, publishing permissions, QA checks, and the path for requesting changes. A scalable site is not only reusable code; it is a workable publishing and governance model.

## Conclusion

When the website and CRM are planned together, design can stay expressive while lead capture, consent, routing, measurement, and operations become dependable. That is a better redesign than a visual reset followed by months of integration repair.',
  (SELECT id FROM authors WHERE slug = 'thierry-luc-denichaud'),
  (SELECT id FROM insight_categories WHERE slug = 'websites-content-hub-accessibility'),
  '/images/insights/website-redesign.webp', 'Website wireframe panels organised around a lead capture path and CRM', '/images/insights/website-redesign.webp',
  10, 'How to plan a website redesign around CRM and lead capture', 'Plan the content model, conversion paths, forms, consent, lifecycle rules, attribution, and handover before visual design locks in the wrong assumptions.',
  FALSE, FALSE, 'published', '2026-07-22',
  '2026-07-22', 5, '2026-07-22'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  quick_answer = EXCLUDED.quick_answer,
  body_markdown = EXCLUDED.body_markdown,
  author_id = EXCLUDED.author_id,
  category_id = EXCLUDED.category_id,
  image_path = EXCLUDED.image_path,
  image_alt = EXCLUDED.image_alt,
  og_image_path = EXCLUDED.og_image_path,
  reading_time_minutes = EXCLUDED.reading_time_minutes,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  featured = EXCLUDED.featured,
  is_placeholder = EXCLUDED.is_placeholder,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  sources_reviewed_at = EXCLUDED.sources_reviewed_at,
  display_order = EXCLUDED.display_order,
  updated_at = EXCLUDED.updated_at;

INSERT INTO articles (
  slug, title, summary, quick_answer, body_markdown, author_id, category_id,
  image_path, image_alt, og_image_path, reading_time_minutes, seo_title,
  seo_description, featured, is_placeholder, status, published_at,
  sources_reviewed_at, display_order, updated_at
)
VALUES (
  'basic-website-accessibility-checks', 'Basic website accessibility checks every business should do', 'A practical first review covering keyboard access, focus, headings, alternatives, contrast, zoom, forms, motion, and the limits of automated checks.',
  'Every business can check whether a site works by keyboard, shows visible focus, has a sensible heading and reading order, provides useful text alternatives, maintains usable contrast and zoom, labels forms clearly, gives users control of motion, and communicates errors. These checks are a first review, not proof of WCAG conformance.', 'Accessibility quality is experienced in ordinary interactions: finding the main content, understanding a heading, seeing where keyboard focus moved, completing a form, or pausing motion. Many serious barriers can be spotted without specialist software.

The checks below draw on W3C Web Accessibility Initiative guidance and WCAG 2.2. They are useful for triage and ongoing content quality, but a complete evaluation still needs knowledgeable human review and testing with appropriate tools and assistive technologies.

## Use the whole page with a keyboard

Put the mouse aside. Use Tab and Shift+Tab to move through interactive elements, Enter or Space to activate controls, arrow keys where the pattern expects them, and Escape to close overlays. Everything operable by pointer should have a practical keyboard route.

- Focus is always visible and has sufficient contrast.
- Focus order follows the visual and logical reading order.
- Menus, dialogs, accordions, carousels, and forms are operable.
- No component traps focus or leaves it behind hidden content.
- Sticky headers or overlays do not completely obscure the focused item.

## Check page title, language, headings, and landmarks

Each page needs a descriptive title and the document should identify its primary language. There should be one clear main content area, and headings should describe the sections beneath them rather than being chosen for visual size.

Read the headings as an outline. Then imagine the page linearised into one column or read aloud. If the sequence no longer makes sense, the source order or semantic structure needs attention.

## Test alternatives, contrast, zoom, and reflow

Meaningful images need text alternatives that convey their purpose in context; decorative images should be ignored by assistive technology. Do not put essential instructions only inside an image.

Check text and interface contrast, then zoom the browser to 200% and inspect common mobile widths. Content should remain readable without losing controls or requiring two-dimensional scrolling for ordinary text. Do not rely on colour alone to communicate status.

## Complete every form slowly and incorrectly

Every input needs a persistent, programmatically connected label. Required status, format expectations, and errors should be communicated in text and associated with the affected field. Placeholder text is not a reliable replacement for a label.

Submit the form empty, enter invalid data, correct one field, and try again. Confirm focus moves sensibly, existing values remain where appropriate, and the success state is announced and visually clear.

## Give people control of motion and media

Avoid unexpected audio. Provide accurate captions for video with speech and relevant non-speech audio, and consider transcripts and audio description where the content requires them.

Users should be able to pause, stop, or hide auto-starting movement that lasts more than five seconds. Respect reduced-motion preferences and ensure the experience remains understandable when animation is removed.

## Make accessibility part of normal publishing

Automated tools can find some missing names, contrast problems, and structural errors, but no tool alone can determine whether a site is accessible. Combine automated checks with keyboard testing, zoom and reflow checks, screen-reader sampling, content review, and periodic expert evaluation.

### Design

Review contrast, focus, target size, states, content order, and motion before handoff.

### Build

Use semantic HTML and test components with keyboard and assistive technology.

### Publish

Require useful headings, link text, alt text, captions, and form instructions.

### Maintain

Include accessibility in regression testing and review real user feedback.

> **Keep in mind:** Passing these checks does not establish legal compliance or full WCAG conformance. Treat them as a practical baseline and escalate material issues for specialist evaluation.

## Conclusion

The most useful first step is to make accessibility observable in everyday work. Once teams routinely notice focus, structure, labels, alternatives, and motion, fewer barriers survive until the end of a project.',
  (SELECT id FROM authors WHERE slug = 'thierry-luc-denichaud'),
  (SELECT id FROM insight_categories WHERE slug = 'websites-content-hub-accessibility'),
  '/images/insights/accessibility-checks.webp', 'Website controls being evaluated for focus, contrast, hierarchy, and target size', '/images/insights/accessibility-checks.webp',
  9, 'Basic website accessibility checks every business should do', 'A practical first review covering keyboard access, focus, headings, alternatives, contrast, zoom, forms, motion, and the limits of automated checks.',
  FALSE, FALSE, 'published', '2026-07-22',
  '2026-07-22', 6, '2026-07-22'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  quick_answer = EXCLUDED.quick_answer,
  body_markdown = EXCLUDED.body_markdown,
  author_id = EXCLUDED.author_id,
  category_id = EXCLUDED.category_id,
  image_path = EXCLUDED.image_path,
  image_alt = EXCLUDED.image_alt,
  og_image_path = EXCLUDED.og_image_path,
  reading_time_minutes = EXCLUDED.reading_time_minutes,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  featured = EXCLUDED.featured,
  is_placeholder = EXCLUDED.is_placeholder,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  sources_reviewed_at = EXCLUDED.sources_reviewed_at,
  display_order = EXCLUDED.display_order,
  updated_at = EXCLUDED.updated_at;

INSERT INTO articles (
  slug, title, summary, quick_answer, body_markdown, author_id, category_id,
  image_path, image_alt, og_image_path, reading_time_minutes, seo_title,
  seo_description, featured, is_placeholder, status, published_at,
  sources_reviewed_at, display_order, updated_at
)
VALUES (
  'what-managed-hubspot-support-should-include', 'What managed HubSpot support should include', 'A useful managed service combines prioritised delivery with governance, preventative maintenance, documentation, reporting, and accountable senior oversight.',
  'Managed HubSpot support should include a prioritised request process, named senior ownership, administration and troubleshooting, preventative portal maintenance, data and automation governance, reporting improvement, controlled releases, documentation, enablement, transparent service measures, and a roadmap rather than only a bucket of reactive hours.', 'Ongoing support is valuable when HubSpot is an operating system that keeps changing with the business. New products, team structures, campaigns, integrations, fields, reports, and regulatory requirements create a steady stream of decisions.

A managed service should make that change safer and more coherent. If it only closes tickets without maintaining context, the portal can become busier and less dependable over time.

## One clear intake and prioritisation process

Requests need a visible queue with enough context to evaluate impact, urgency, dependencies, and effort. The provider and client should agree who can submit work, who sets priority, what qualifies as an incident, and how competing requests are resolved.

A short discovery step is often necessary. ‘Add a field’ may actually be a reporting definition, integration mapping, or process decision. Managed support should identify that before creating another permanent object in the portal.

## Explicit coverage and boundaries

The service description should state what is included: portal administration, workflows, CRM architecture, reporting, forms, email, integrations, websites, troubleshooting, user changes, and enablement. It should also state what needs separate scoping, such as large migrations, net-new custom applications, or major redesigns.

Clarify support windows, response targets, planned delivery capacity, unused-capacity rules, external vendor responsibilities, and escalation routes. Ambiguity here creates frustration even when the technical work is good.

## Preventative maintenance, not only reactive fixes

A healthy service reviews the system for emerging risk: workflow failures, integration errors, duplicate patterns, unused properties, stale users, unexpected permission changes, reporting drift, form problems, and unresolved data-quality issues.

The review frequency should match the portal''s complexity and rate of change. The output should be a small set of evidence-based actions, not a generic monthly checklist disconnected from business priorities.

## Controlled delivery and documentation

Changes should have an owner, rationale, test evidence, deployment record, and rollback consideration proportional to risk. Naming standards and concise architecture notes make later troubleshooting faster.

High-impact workflows, lifecycle logic, integrations, and reporting definitions deserve peer review or client approval. Managed support should reduce the number of unexplained changes rather than become another source of them.

## Enablement and decision support

Support should help internal teams understand the system they use. That may include role-based training, release notes, quick operating guides, office hours, and guidance on whether a request should be solved through process, configuration, integration, or no change at all.

## Measures that show service health

Ticket count is not enough. A useful service review combines delivery measures with system and business signals.

- Response and resolution against agreed service targets
- Work completed, in progress, blocked, and ageing
- Recurring incidents and their root causes
- Automation, integration, and data-quality health
- Adoption or process measures tied to current priorities
- Roadmap progress, decisions required, and upcoming risk

## Questions to ask a managed support provider

Ask who will actually do the work, how senior oversight is maintained, how the team handles production risk, where documentation lives, how priorities change, and what happens when a request exceeds the service boundary.

The right service is not the one promising unlimited everything. It is the one that creates a dependable operating rhythm, understands the architecture, and is transparent about trade-offs.

## Conclusion

Managed support should leave the portal more understandable each month. That requires delivery capacity, but also governance, continuity, evidence, and senior judgement about what not to change.',
  (SELECT id FROM authors WHERE slug = 'thierry-luc-denichaud'),
  (SELECT id FROM insight_categories WHERE slug = 'hubspot-strategy-implementation'),
  '/images/insights/managed-support.webp', 'A CRM system on a calm, organised maintenance and operations bench', '/images/insights/managed-support.webp',
  8, 'What managed HubSpot support should include', 'A useful managed service combines prioritised delivery with governance, preventative maintenance, documentation, reporting, and accountable senior oversight.',
  FALSE, FALSE, 'published', '2026-07-22',
  '2026-07-22', 7, '2026-07-22'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  quick_answer = EXCLUDED.quick_answer,
  body_markdown = EXCLUDED.body_markdown,
  author_id = EXCLUDED.author_id,
  category_id = EXCLUDED.category_id,
  image_path = EXCLUDED.image_path,
  image_alt = EXCLUDED.image_alt,
  og_image_path = EXCLUDED.og_image_path,
  reading_time_minutes = EXCLUDED.reading_time_minutes,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  featured = EXCLUDED.featured,
  is_placeholder = EXCLUDED.is_placeholder,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  sources_reviewed_at = EXCLUDED.sources_reviewed_at,
  display_order = EXCLUDED.display_order,
  updated_at = EXCLUDED.updated_at;

INSERT INTO articles (
  slug, title, summary, quick_answer, body_markdown, author_id, category_id,
  image_path, image_alt, og_image_path, reading_time_minutes, seo_title,
  seo_description, featured, is_placeholder, status, published_at,
  sources_reviewed_at, display_order, updated_at
)
VALUES (
  'clean-up-duplicate-crm-properties', 'How to clean up duplicate CRM properties', 'A safe sequence for identifying overlapping fields, tracing dependencies, choosing a canonical property, migrating values, and retiring the old schema.',
  'Clean up duplicate CRM properties by freezing new field creation, inventorying similar fields, tracing every dependency, choosing a canonical property, defining value transformations, backing up data, migrating a controlled test set, updating workflows/forms/integrations/reports, validating results, and only then archiving or deleting the old property where the platform allows it.', 'Duplicate properties are different from duplicate records. Duplicate records represent the same person or company more than once. Duplicate properties are multiple fields representing the same or overlapping business concept, such as Industry, Company industry, Sector, and Primary sector.

Deleting the obvious duplicate is risky because fields can be referenced by forms, workflows, segments, reports, integrations, personalisation, imports, or users'' saved views. The cleanup needs a dependency-first sequence.

## Freeze creation and build an inventory

Pause non-essential property creation while the review is active. Export or document the candidate fields with object, label, internal name, type, options, description, creation context, fill rate, last use, and sample values.

Group fields by business meaning, not only similar names. Two fields with different names may duplicate each other; two fields with similar names may serve legitimately different processes.

## Trace dependencies and write paths

Identify everywhere each property is read or written: forms, workflows, calculated fields, segments, reports, lists, integrations, custom code, imports, record views, personalisation, lead scoring, and external data warehouses.

Use property history on representative records to see which sources update the field. A property with low visible use may still be maintained by an integration or workflow and may be the authoritative source for a downstream system.

> **Keep in mind:** Do not treat a low fill rate as proof that a property is safe to remove. It may be required for a small but high-value process.

## Choose the canonical property

Select the field that best supports the current business definition, data type, integrations, reporting, and governance model. The oldest or most populated property is not automatically the right choice.

- One documented meaning and accountable owner
- A suitable field type and controlled options
- An internal name compatible with required integrations
- Clear rules for who or what may update it
- A migration path for every valid value in the duplicates

## Define merge and transformation rules

Map old values to the canonical field. Resolve spelling, casing, retired options, multi-select combinations, blanks, and conflicts. Define precedence when more than one old field is populated and keep an exception list for records that need human review.

Back up the affected records and property definitions before changing values. Preserve stable record identifiers so the migration updates existing records rather than creating new ones.

## Migrate in a controlled sequence

Test the transformation on a representative subset. Validate values and downstream behaviour, then migrate the remainder in manageable batches. Update write paths before old fields are retired so new data does not continue to diverge.

### Protect

Export data, document definitions and dependencies, and agree rollback and exception handling.

### Populate

Transform and write the canonical values without deleting the source fields.

### Redirect

Update forms, workflows, integrations, reports, segments, and user views to the canonical field.

### Observe

Monitor new writes, compare counts and reports, and resolve exceptions during a defined safety period.

### Retire

Rename or archive old fields clearly, restrict use, and delete only after the dependency and retention checks pass.

## Prevent the property set from drifting again

Create a lightweight request and approval process for new properties. Require a purpose, object, type, options, owner, source, reporting need, retention expectation, and a search for existing fields. Maintain a data dictionary that people can actually use.

Review high-growth objects periodically and include property governance in integration and campaign design. Prevention is cheaper than discovering five definitions of the same customer attribute during a migration.

## Conclusion

The goal is not the smallest possible property count. It is a data model where each field has a clear meaning, owner, source, and purpose, while removing one does not break work nobody remembered to map.',
  (SELECT id FROM authors WHERE slug = 'thierry-luc-denichaud'),
  (SELECT id FROM insight_categories WHERE slug = 'crm-data-revops'),
  '/images/insights/duplicate-properties.webp', 'Pairs of duplicate data tokens being consolidated into a governed schema', '/images/insights/duplicate-properties.webp',
  10, 'How to clean up duplicate CRM properties', 'A safe sequence for identifying overlapping fields, tracing dependencies, choosing a canonical property, migrating values, and retiring the old schema.',
  FALSE, FALSE, 'published', '2026-07-22',
  '2026-07-22', 8, '2026-07-22'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  quick_answer = EXCLUDED.quick_answer,
  body_markdown = EXCLUDED.body_markdown,
  author_id = EXCLUDED.author_id,
  category_id = EXCLUDED.category_id,
  image_path = EXCLUDED.image_path,
  image_alt = EXCLUDED.image_alt,
  og_image_path = EXCLUDED.og_image_path,
  reading_time_minutes = EXCLUDED.reading_time_minutes,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  featured = EXCLUDED.featured,
  is_placeholder = EXCLUDED.is_placeholder,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  sources_reviewed_at = EXCLUDED.sources_reviewed_at,
  display_order = EXCLUDED.display_order,
  updated_at = EXCLUDED.updated_at;

INSERT INTO articles (
  slug, title, summary, quick_answer, body_markdown, author_id, category_id,
  image_path, image_alt, og_image_path, reading_time_minutes, seo_title,
  seo_description, featured, is_placeholder, status, published_at,
  sources_reviewed_at, display_order, updated_at
)
VALUES (
  'hubspot-pricing-and-ai-credits-explained', 'HubSpot pricing and AI credits, made simple', 'A plain-English way to separate products, editions, seats, marketing contacts, onboarding, capacity, and usage-based HubSpot Credits before you compare quotes.',
  'Read a HubSpot quote in layers: products, editions, required seat types, marketing-contact capacity, included limits, onboarding, add-ons, HubSpot Credits, implementation services, contract term, and taxes or currency. Credits are usage capacity for specific AI and automation actions; they are not the same as seats, and included credits are generally based on the highest relevant subscription rather than added across every product.', 'HubSpot pricing feels complicated because several different commercial models can appear on the same quote. A product may have an edition, users may need particular seats, Marketing Hub may scale with marketing contacts, some editions require onboarding, and usage-based features consume credits.

This guide explains the structure, not a universal quote. Prices, promotions, included features, rates, and product names can change. The figures and rules below were checked against HubSpot''s official catalog on 22 July 2026; always validate the current catalog and your account or proposal before buying.

## Start with products and editions

HubSpot groups capabilities into products such as Smart CRM, Marketing Hub, Sales Hub, Service Hub, Content Hub, Data Hub, and Revenue Hub. Products are offered in editions, commonly Starter, Professional, and Enterprise, with different features and technical limits.

Choose the edition from required capabilities, governance, scale, and limits rather than from company size alone. Build a short requirements matrix and mark each item must-have, useful, or later. That makes edition trade-offs visible before a quote bundles them together.

## Separate seats from the product subscription

Seats determine what an individual user can do. The current catalog distinguishes Core, Sales, Service, Revenue, View-Only, and eligible Partner Seats. Full advanced Sales Hub, Service Hub, or Revenue Hub functionality requires the corresponding specialist seat; a Core Seat does not automatically grant every specialist capability.

Create a role-to-feature matrix. Count the people who genuinely need advanced seller, service, revenue, administration, editing, or view-only access. Do not buy every person the same seat by default, and do not assume a no-cost view-only user can make changes.

## Add contact capacity, onboarding, and limits

Marketing Hub pricing is also affected by marketing contacts, which are the contacts eligible for marketing email and ads. Non-marketing contacts can be stored without counting toward that paid marketing tier, subject to current platform limits, but cannot be targeted in the same way. Define who genuinely needs marketing status and how that status will be governed.

Some Professional and Enterprise products include required one-time onboarding charges. Also review email sends, pipelines, reports, automation, API calls, calling, file storage, and other limits relevant to your design. A cheaper edition with an important missing limit can become the expensive choice after implementation.

## Understand what HubSpot Credits are

HubSpot Credits are monthly usage capacity for specific AI agents, AI actions, data, and automation features. A feature consumes a stated number of credits per action or recurrence. Credits reset monthly and unused credits do not roll over.

In the official catalog checked on 22 July 2026, many Starter subscriptions include 500 credits, Professional 3,000, and Enterprise 5,000. Data Hub and bundled Customer Platform editions can include different higher allocations. Included credits are not generally additive across products; the applicable highest allocation is used.

The rate sheet gives each action a cost. At the time of review, examples included 10 credits for one Breeze action in a workflow, 50 for a text-channel Customer Agent resolution, 100 for one Prospecting Agent outreach recommendation, and 1,000 for one Content Agent content item. The catalog also states that custom-agent action units begin consuming credits on 23 July 2026. These rates can change, so use the live rate sheet for forecasting.

> **Keep in mind:** Credits do not unlock every feature by themselves. The relevant product edition, seat, permission, and sometimes another service allowance may still be required.

## Plan for additional credit usage

The catalog currently lists additional credits at USD $0.010 per credit through capacity packs or pay-as-you-go. A 1,000-credit capacity pack is listed at USD $10. Capacity packs raise the recurring monthly limit for the commitment term and can auto-upgrade when usage exceeds capacity unless settings are changed. Pay-as-you-go returns to the original limit after the monthly reset.

Forecast with real actions: expected agent resolutions, records enriched, workflow executions, monitored companies, or content runs. Then add a sensible buffer and assign an owner to review usage, feature-level controls, notifications, and overage settings. Do not estimate from the word ‘AI’ alone.

## Turn the quote into a total-cost view

Build a simple schedule covering the full contract term. Separate recurring subscription cost, seat cost, marketing-contact tiers, credits and add-ons, required onboarding, implementation or migration, internal time, and ongoing optimisation.

### Requirements

Map each must-have capability to the product, edition, limit, and user role that needs it.

### Quantity

Count seats, marketing contacts, API volume, credit-consuming actions, and other capacity from operating assumptions.

### Contract

Confirm billing frequency, commitment term, onboarding, renewal treatment, currency, taxes, and downgrade conditions.

### Operate

Budget implementation, data work, training, governance, support, and the people who will own the platform.

## Questions to ask before approving a HubSpot quote

Ask which exact requirement drives each product and edition, which users need which seat, what is included versus promotional, which onboarding is mandatory, how contact tiers can change, which planned actions consume credits, how overages behave, and what happens at renewal.

Request the proposal in a form you can reconcile with the official product catalog. A clear quote should let you explain every line item in operational terms.

## Conclusion

HubSpot pricing becomes manageable when each commercial layer is connected to a real requirement, person, contact, limit, or action. Model the operating design first; then compare the quote with much less ambiguity.',
  (SELECT id FROM authors WHERE slug = 'thierry-luc-denichaud'),
  (SELECT id FROM insight_categories WHERE slug = 'hubspot-strategy-implementation'),
  '/images/insights/hubspot-pricing-credits.webp', 'Tiered software editions, seat tokens, and a finite AI credit ledger', '/images/insights/hubspot-pricing-credits.webp',
  11, 'HubSpot pricing and AI credits, made simple', 'A plain-English way to separate products, editions, seats, marketing contacts, onboarding, capacity, and usage-based HubSpot Credits before you compare quotes.',
  FALSE, FALSE, 'published', '2026-07-22',
  '2026-07-22', 9, '2026-07-22'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  quick_answer = EXCLUDED.quick_answer,
  body_markdown = EXCLUDED.body_markdown,
  author_id = EXCLUDED.author_id,
  category_id = EXCLUDED.category_id,
  image_path = EXCLUDED.image_path,
  image_alt = EXCLUDED.image_alt,
  og_image_path = EXCLUDED.og_image_path,
  reading_time_minutes = EXCLUDED.reading_time_minutes,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  featured = EXCLUDED.featured,
  is_placeholder = EXCLUDED.is_placeholder,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  sources_reviewed_at = EXCLUDED.sources_reviewed_at,
  display_order = EXCLUDED.display_order,
  updated_at = EXCLUDED.updated_at;

INSERT INTO articles (
  slug, title, summary, quick_answer, body_markdown, author_id, category_id,
  image_path, image_alt, og_image_path, reading_time_minutes, seo_title,
  seo_description, featured, is_placeholder, status, published_at,
  sources_reviewed_at, display_order, updated_at
)
VALUES (
  'what-to-decide-before-hubspot-configuration', 'What to Decide Before You Touch HubSpot Configuration', 'The questions about process, data, ownership and success that need clear answers before anyone starts building pipelines and workflows.',
  'Before configuring HubSpot, map the business process, understand the source data, define the CRM model, agree what success looks like and assign long-term ownership. Configuration should implement those decisions, not become the place where they are first discovered.', 'The fastest way to build the wrong HubSpot system is to start configuring before you have answered the questions that should have come first.

We see this constantly: a team opens the portal, starts building pipelines and workflows, and gets a system that technically works until it meets a real business process it was not designed for. Then it is rebuilt. Then rebuilt again. Each round costs more than the discovery work would have.

Here is what actually needs to happen before configuration begins.

## Map the business, not the software

What are the teams, the handovers, the constraints and the commercial goals this system needs to support? HubSpot should be built around how your organisation actually works, not the other way around.

## Get the data story straight

Where does your data live today, what shape is it in and what needs to happen to it before it enters a new architecture? Migration plans built after configuration starts are migration problems waiting to happen.

## Define the CRM model on paper first

Ownership, pipelines, lifecycle stages and custom objects are expensive to reverse once hundreds of workflows depend on them. A defined system design, written down before a single field is built, is the cheapest insurance in the entire project.

## Decide what done looks like

A roadmap without measures of success is just a to-do list. What does adoption look like at 30 days? What reporting needs to exist on day one versus month three?

## Assign responsibility before you assign tasks

Who owns the portal after launch? Who owns data quality? If the answer is undefined at the start, it stays undefined indefinitely.

## Designed implementation, not default setup

This is the difference between an implementation and a default setup. A default setup gets you to "live". A designed implementation gives you a portal architecture, a migration plan and a launch your team can actually use, built around your process rather than a generic template.

We do not treat strategy and implementation as separate engagements handed off between teams. The same people who map the process are the ones who open the portal, write the code and test the workflow, so nothing gets lost in translation between the plan and the build.',
  (SELECT id FROM authors WHERE slug = 'emma-black'),
  (SELECT id FROM insight_categories WHERE slug = 'hubspot-strategy-implementation'),
  '/images/insights/crm-implementation.webp', 'CRM modules moving from loose parts into a connected operating system', '/images/insights/crm-implementation.webp',
  4, 'What to Decide Before You Touch HubSpot Configuration', 'The questions about process, data, ownership and success that need clear answers before anyone starts building pipelines and workflows.',
  TRUE, FALSE, 'published', '2026-09-23',
  '2026-09-23', 10, '2026-09-23'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  quick_answer = EXCLUDED.quick_answer,
  body_markdown = EXCLUDED.body_markdown,
  author_id = EXCLUDED.author_id,
  category_id = EXCLUDED.category_id,
  image_path = EXCLUDED.image_path,
  image_alt = EXCLUDED.image_alt,
  og_image_path = EXCLUDED.og_image_path,
  reading_time_minutes = EXCLUDED.reading_time_minutes,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  featured = EXCLUDED.featured,
  is_placeholder = EXCLUDED.is_placeholder,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  sources_reviewed_at = EXCLUDED.sources_reviewed_at,
  display_order = EXCLUDED.display_order,
  updated_at = EXCLUDED.updated_at;

INSERT INTO articles (
  slug, title, summary, quick_answer, body_markdown, author_id, category_id,
  image_path, image_alt, og_image_path, reading_time_minutes, seo_title,
  seo_description, featured, is_placeholder, status, published_at,
  sources_reviewed_at, display_order, updated_at
)
VALUES (
  'the-pre-launch-checklist-your-website-team-is-probably-skipping', 'The Pre-Launch Checklist Your Website Team Is Probably Skipping', 'A website launch should be judged on whether the site connects to CRM, reporting and the customer journey, not only on how it looks.',
  'Before launch, validate tracking end to end, map forms to usable CRM properties, design consent as a requirement, plan domains and redirects with attribution in mind, check accessibility and test the real production environment.', 'A website launch usually gets judged on how it looks. It should be judged on whether it connects.

A fast, well-designed site that is not wired into your CRM, reporting and customer journey is a brochure with a domain name. Here is what tends to get missed before go-live, quietly and expensively.

## Tracking that was never validated end to end

It is not enough for a pixel to fire. Someone needs to confirm the data lands correctly in HubSpot and is attributed to the right source before launch, not three weeks later when the first monthly report does not reconcile.

## Forms that collect data your CRM cannot use

A form that captures a lead is only half the job. If the fields do not map cleanly to CRM properties, or the submission does not trigger the right workflow, you have built a data-entry problem rather than a lead-capture system.

## Consent and data capture bolted on at the end

Consent management affects what you are allowed to do with the data you collect. Treating it as a launch-week checkbox instead of a design requirement is how companies end up rebuilding their data practices under pressure later. The exact approach should be reviewed for the jurisdictions and technology involved.

## Domain and redirect decisions made without attribution in mind

Domain migrations can quietly break historical tracking and inbound attribution when they are not planned alongside the CRM, rather than treated only as a DNS task.

## Accessibility treated as a final pass

Retrofitting accessibility after launch is harder and more expensive than designing for it from the start. Accessibility belongs in the structure, components, content and testing plan.

## No testing plan for the live environment

Staging environments can give false confidence. Forms, tracking and integrations need to be verified on the actual external site under real conditions before you call the work done.

## The website and CRM are one system

A website is one of the few places where content, conversion, CRM data, reporting and the customer journey all have to work together at the same time. When one piece is treated as a separate workstream, the gap often appears after launch as a reporting hole, a broken attribution chain or a form that quietly stopped syncing.

We build websites as part of the same system as the CRM behind them, not as a separate project that gets connected afterwards.',
  (SELECT id FROM authors WHERE slug = 'emma-black'),
  (SELECT id FROM insight_categories WHERE slug = 'websites-content-hub-accessibility'),
  '/images/insights/website-connection.webp', 'Website and form panels connected through a validated path to a CRM core', '/images/insights/website-connection.webp',
  4, 'The Pre-Launch Checklist Your Website Team Is Probably Skipping', 'A website launch should be judged on whether the site connects to CRM, reporting and the customer journey, not only on how it looks.',
  TRUE, FALSE, 'published', '2026-09-23',
  '2026-09-23', 11, '2026-09-23'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  quick_answer = EXCLUDED.quick_answer,
  body_markdown = EXCLUDED.body_markdown,
  author_id = EXCLUDED.author_id,
  category_id = EXCLUDED.category_id,
  image_path = EXCLUDED.image_path,
  image_alt = EXCLUDED.image_alt,
  og_image_path = EXCLUDED.og_image_path,
  reading_time_minutes = EXCLUDED.reading_time_minutes,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  featured = EXCLUDED.featured,
  is_placeholder = EXCLUDED.is_placeholder,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  sources_reviewed_at = EXCLUDED.sources_reviewed_at,
  display_order = EXCLUDED.display_order,
  updated_at = EXCLUDED.updated_at;

INSERT INTO articles (
  slug, title, summary, quick_answer, body_markdown, author_id, category_id,
  image_path, image_alt, og_image_path, reading_time_minutes, seo_title,
  seo_description, featured, is_placeholder, status, published_at,
  sources_reviewed_at, display_order, updated_at
)
VALUES (
  'when-hubspot-native-integrations-stop-being-enough', 'When HubSpot''s Native Integrations Stop Being Enough', 'Native connectors are useful until the process needs business rules, validation and ownership that a standard synchronisation cannot express.',
  'A native integration has stopped being enough when business rules depend on workarounds, systems disagree on definitions, failures are not governed, or only one person understands how data moves. That is the point where the integration layer needs to be designed, not simply connected.', 'Native integrations are genuinely useful until your process becomes specific enough that they are not.

Most teams start there, and they should. A native connector is faster to set up, easier to maintain and perfectly adequate for many standard use cases. The problem is not the tool. It is not knowing when you have outgrown it.

## The pattern behind the workarounds

A native integration synchronises the obvious fields, such as contact, company and deal amount, because that is what it was built to do. It does not know that your finance system calculates a value differently from HubSpot, that your quoting tool has a business rule the CRM has never heard of, or that "customer" means something different in your ERP than it does in your pipeline.

Someone builds a workaround. Then another. Eventually the portal is held together by a collection of manual fixes that only one person fully understands, and that person''s holiday becomes a business risk.

That is usually the signal that the integration layer needs to be designed, not just connected.

## Define a data flow, not only a data sync

Name the source system, HubSpot, the validation step and the destination. Add rules for what happens when the data does not match cleanly. The goal is one governed customer system rather than three partially synchronised ones.

## Use middleware when the native option cannot hold the logic

REST APIs, webhooks and middleware exist for business rules that a checkbox integration was never built to handle. Their use should be justified by the process, documented and supported, not added as another invisible layer.

## Use custom objects when the default model does not fit

If the business runs on entities HubSpot does not natively represent, such as projects, locations or equipment, forcing that data into contacts and deals creates more problems than it solves. Model the real entity and its relationships deliberately.

## Document the architecture

The system needs to survive beyond the person who built it. An integration that only one person understands is not infrastructure. It is a liability with a login.

## Make the design decision explicit

Connecting HubSpot to finance, operations, service delivery or scheduling systems is not only a technical task. It is a design decision about how the business''s data should flow. Get that design right and the integration disappears into the background, doing its job quietly. Get it wrong and it becomes the thing the team routes around instead of relying on.',
  (SELECT id FROM authors WHERE slug = 'emma-black'),
  (SELECT id FROM insight_categories WHERE slug = 'integrations-development'),
  '/images/insights/integration-brief.webp', 'Two technical systems joined by mapped specification cards and connectors', '/images/insights/integration-brief.webp',
  4, 'When HubSpot''s Native Integrations Stop Being Enough', 'Native connectors are useful until the process needs business rules, validation and ownership that a standard synchronisation cannot express.',
  TRUE, FALSE, 'published', '2026-09-23',
  '2026-09-23', 12, '2026-09-23'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  quick_answer = EXCLUDED.quick_answer,
  body_markdown = EXCLUDED.body_markdown,
  author_id = EXCLUDED.author_id,
  category_id = EXCLUDED.category_id,
  image_path = EXCLUDED.image_path,
  image_alt = EXCLUDED.image_alt,
  og_image_path = EXCLUDED.og_image_path,
  reading_time_minutes = EXCLUDED.reading_time_minutes,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  featured = EXCLUDED.featured,
  is_placeholder = EXCLUDED.is_placeholder,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  sources_reviewed_at = EXCLUDED.sources_reviewed_at,
  display_order = EXCLUDED.display_order,
  updated_at = EXCLUDED.updated_at;

DELETE FROM article_sources
WHERE article_id IN (SELECT id FROM articles WHERE slug IN ('signs-your-hubspot-portal-needs-an-audit', 'prepare-for-hubspot-crm-implementation', 'before-connecting-your-website-to-hubspot', 'why-your-crm-reports-are-not-reliable', 'what-to-include-in-a-custom-integration-brief', 'plan-a-website-redesign-around-crm-and-lead-capture', 'basic-website-accessibility-checks', 'what-managed-hubspot-support-should-include', 'clean-up-duplicate-crm-properties', 'hubspot-pricing-and-ai-credits-explained', 'what-to-decide-before-hubspot-configuration', 'the-pre-launch-checklist-your-website-team-is-probably-skipping', 'when-hubspot-native-integrations-stop-being-enough'));
DELETE FROM article_services
WHERE article_id IN (SELECT id FROM articles WHERE slug IN ('signs-your-hubspot-portal-needs-an-audit', 'prepare-for-hubspot-crm-implementation', 'before-connecting-your-website-to-hubspot', 'why-your-crm-reports-are-not-reliable', 'what-to-include-in-a-custom-integration-brief', 'plan-a-website-redesign-around-crm-and-lead-capture', 'basic-website-accessibility-checks', 'what-managed-hubspot-support-should-include', 'clean-up-duplicate-crm-properties', 'hubspot-pricing-and-ai-credits-explained', 'what-to-decide-before-hubspot-configuration', 'the-pre-launch-checklist-your-website-team-is-probably-skipping', 'when-hubspot-native-integrations-stop-being-enough'));
DELETE FROM article_relations
WHERE article_id IN (SELECT id FROM articles WHERE slug IN ('signs-your-hubspot-portal-needs-an-audit', 'prepare-for-hubspot-crm-implementation', 'before-connecting-your-website-to-hubspot', 'why-your-crm-reports-are-not-reliable', 'what-to-include-in-a-custom-integration-brief', 'plan-a-website-redesign-around-crm-and-lead-capture', 'basic-website-accessibility-checks', 'what-managed-hubspot-support-should-include', 'clean-up-duplicate-crm-properties', 'hubspot-pricing-and-ai-credits-explained', 'what-to-decide-before-hubspot-configuration', 'the-pre-launch-checklist-your-website-team-is-probably-skipping', 'when-hubspot-native-integrations-stop-being-enough'));

INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'signs-your-hubspot-portal-needs-an-audit'), 'HubSpot', 'Review and manage duplicate records', 'https://knowledge.hubspot.com/records/manage-duplicate-records', 0);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'signs-your-hubspot-portal-needs-an-audit'), 'HubSpot', 'View a record''s property history', 'https://knowledge.hubspot.com/records/view-record-property-history', 1);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'signs-your-hubspot-portal-needs-an-audit'), 'HubSpot', 'HubSpot user permissions guide', 'https://knowledge.hubspot.com/user-management/hubspot-user-permissions-guide', 2);
INSERT INTO article_services (article_id, service_slug, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'signs-your-hubspot-portal-needs-an-audit'), 'hubspot-strategy-consulting', 0);
INSERT INTO article_services (article_id, service_slug, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'signs-your-hubspot-portal-needs-an-audit'), 'crm-revops', 1);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'prepare-for-hubspot-crm-implementation'), 'HubSpot', 'Import records for a single object', 'https://knowledge.hubspot.com/import-and-export/import-records-for-a-single-object', 0);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'prepare-for-hubspot-crm-implementation'), 'HubSpot', 'Deduplicate records in HubSpot', 'https://knowledge.hubspot.com/records/deduplication-of-records', 1);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'prepare-for-hubspot-crm-implementation'), 'HubSpot', 'Use lifecycle stages', 'https://knowledge.hubspot.com/records/use-lifecycle-stages', 2);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'prepare-for-hubspot-crm-implementation'), 'HubSpot', 'HubSpot user permissions guide', 'https://knowledge.hubspot.com/user-management/hubspot-user-permissions-guide', 3);
INSERT INTO article_services (article_id, service_slug, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'prepare-for-hubspot-crm-implementation'), 'implementation-onboarding', 0);
INSERT INTO article_services (article_id, service_slug, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'prepare-for-hubspot-crm-implementation'), 'hubspot-strategy-consulting', 1);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'before-connecting-your-website-to-hubspot'), 'HubSpot', 'Install the HubSpot tracking code', 'https://knowledge.hubspot.com/reports/install-the-hubspot-tracking-code', 0);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'before-connecting-your-website-to-hubspot'), 'HubSpot', 'Style and embed HubSpot forms on an external site', 'https://knowledge.hubspot.com/forms/set-up-and-style-your-form-on-an-external-site', 1);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'before-connecting-your-website-to-hubspot'), 'HubSpot', 'Set up cookie tracking settings and consent banners', 'https://knowledge.hubspot.com/privacy-and-consent/set-up-a-consent-banner-with-the-new-editor', 2);
INSERT INTO article_services (article_id, service_slug, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'before-connecting-your-website-to-hubspot'), 'websites-content-hub', 0);
INSERT INTO article_services (article_id, service_slug, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'before-connecting-your-website-to-hubspot'), 'integrations-custom-development', 1);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'why-your-crm-reports-are-not-reliable'), 'HubSpot', 'Understand the custom report builder', 'https://knowledge.hubspot.com/reports/understand-the-custom-report-builder', 0);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'why-your-crm-reports-are-not-reliable'), 'HubSpot', 'Create reports with the custom report builder', 'https://knowledge.hubspot.com/reports/create-reports-with-the-custom-report-builder', 1);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'why-your-crm-reports-are-not-reliable'), 'HubSpot', 'Use dashboard filters', 'https://knowledge.hubspot.com/dashboards/use-dashboard-filters', 2);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'why-your-crm-reports-are-not-reliable'), 'HubSpot', 'View a record''s property history', 'https://knowledge.hubspot.com/records/view-record-property-history', 3);
INSERT INTO article_services (article_id, service_slug, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'why-your-crm-reports-are-not-reliable'), 'crm-revops', 0);
INSERT INTO article_services (article_id, service_slug, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'why-your-crm-reports-are-not-reliable'), 'hubspot-strategy-consulting', 1);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'what-to-include-in-a-custom-integration-brief'), 'HubSpot', 'Authentication overview', 'https://developers.hubspot.com/docs/apps/developer-platform/build-apps/authentication/overview', 0);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'what-to-include-in-a-custom-integration-brief'), 'HubSpot', 'API usage guidelines and limits', 'https://developers.hubspot.com/docs/developer-tooling/platform/usage-guidelines', 1);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'what-to-include-in-a-custom-integration-brief'), 'HubSpot', 'Webhooks API guide', 'https://developers.hubspot.com/docs/api-reference/latest/webhooks/guide', 2);
INSERT INTO article_services (article_id, service_slug, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'what-to-include-in-a-custom-integration-brief'), 'integrations-custom-development', 0);
INSERT INTO article_services (article_id, service_slug, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'what-to-include-in-a-custom-integration-brief'), 'hubspot-strategy-consulting', 1);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'plan-a-website-redesign-around-crm-and-lead-capture'), 'HubSpot', 'Install the HubSpot tracking code', 'https://knowledge.hubspot.com/reports/install-the-hubspot-tracking-code', 0);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'plan-a-website-redesign-around-crm-and-lead-capture'), 'HubSpot', 'Style and embed HubSpot forms on an external site', 'https://knowledge.hubspot.com/forms/set-up-and-style-your-form-on-an-external-site', 1);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'plan-a-website-redesign-around-crm-and-lead-capture'), 'W3C', 'Evaluating Web Accessibility Overview', 'https://www.w3.org/WAI/test-evaluate/', 2);
INSERT INTO article_services (article_id, service_slug, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'plan-a-website-redesign-around-crm-and-lead-capture'), 'websites-content-hub', 0);
INSERT INTO article_services (article_id, service_slug, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'plan-a-website-redesign-around-crm-and-lead-capture'), 'crm-revops', 1);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'basic-website-accessibility-checks'), 'W3C', 'Easy Checks – A First Review of Web Accessibility', 'https://www.w3.org/WAI/test-evaluate/preliminary/', 0);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'basic-website-accessibility-checks'), 'W3C', 'Web Content Accessibility Guidelines (WCAG) 2.2', 'https://www.w3.org/TR/WCAG22/', 1);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'basic-website-accessibility-checks'), 'W3C', 'Evaluating Web Accessibility Overview', 'https://www.w3.org/WAI/test-evaluate/', 2);
INSERT INTO article_services (article_id, service_slug, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'basic-website-accessibility-checks'), 'websites-content-hub', 0);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'what-managed-hubspot-support-should-include'), 'HubSpot', 'HubSpot user permissions guide', 'https://knowledge.hubspot.com/user-management/hubspot-user-permissions-guide', 0);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'what-managed-hubspot-support-should-include'), 'HubSpot', 'View a record''s property history', 'https://knowledge.hubspot.com/records/view-record-property-history', 1);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'what-managed-hubspot-support-should-include'), 'HubSpot', 'HubSpot''s change sources', 'https://knowledge.hubspot.com/properties/hubspots-change-sources', 2);
INSERT INTO article_services (article_id, service_slug, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'what-managed-hubspot-support-should-include'), 'managed-hubspot-support', 0);
INSERT INTO article_services (article_id, service_slug, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'what-managed-hubspot-support-should-include'), 'automation-operations', 1);
INSERT INTO article_services (article_id, service_slug, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'what-managed-hubspot-support-should-include'), 'service-hub-customer-experience', 2);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'clean-up-duplicate-crm-properties'), 'HubSpot', 'View a record''s property history', 'https://knowledge.hubspot.com/records/view-record-property-history', 0);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'clean-up-duplicate-crm-properties'), 'HubSpot', 'Deduplicate records in HubSpot', 'https://knowledge.hubspot.com/records/deduplication-of-records', 1);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'clean-up-duplicate-crm-properties'), 'HubSpot', 'HubSpot''s change sources', 'https://knowledge.hubspot.com/properties/hubspots-change-sources', 2);
INSERT INTO article_services (article_id, service_slug, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'clean-up-duplicate-crm-properties'), 'crm-revops', 0);
INSERT INTO article_services (article_id, service_slug, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'clean-up-duplicate-crm-properties'), 'managed-hubspot-support', 1);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'hubspot-pricing-and-ai-credits-explained'), 'HubSpot', 'HubSpot Product & Services Catalog', 'https://legal.hubspot.com/hubspot-product-and-services-catalog', 0);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'hubspot-pricing-and-ai-credits-explained'), 'HubSpot', 'Manage HubSpot Credits', 'https://knowledge.hubspot.com/account-management/understand-hubspot-credits-and-billing', 1);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'hubspot-pricing-and-ai-credits-explained'), 'HubSpot', 'Marketing Software Pricing', 'https://www.hubspot.com/pricing/marketing', 2);
INSERT INTO article_services (article_id, service_slug, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'hubspot-pricing-and-ai-credits-explained'), 'hubspot-strategy-consulting', 0);
INSERT INTO article_services (article_id, service_slug, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'hubspot-pricing-and-ai-credits-explained'), 'managed-hubspot-support', 1);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'what-to-decide-before-hubspot-configuration'), 'HubSpot', 'Import records for a single object', 'https://knowledge.hubspot.com/import-and-export/import-records-for-a-single-object', 0);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'what-to-decide-before-hubspot-configuration'), 'HubSpot', 'Deduplicate records in HubSpot', 'https://knowledge.hubspot.com/records/deduplication-of-records', 1);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'what-to-decide-before-hubspot-configuration'), 'HubSpot', 'Use lifecycle stages', 'https://knowledge.hubspot.com/records/use-lifecycle-stages', 2);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'what-to-decide-before-hubspot-configuration'), 'HubSpot', 'HubSpot user permissions guide', 'https://knowledge.hubspot.com/user-management/hubspot-user-permissions-guide', 3);
INSERT INTO article_services (article_id, service_slug, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'what-to-decide-before-hubspot-configuration'), 'hubspot-strategy-consulting', 0);
INSERT INTO article_services (article_id, service_slug, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'what-to-decide-before-hubspot-configuration'), 'implementation-onboarding', 1);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'the-pre-launch-checklist-your-website-team-is-probably-skipping'), 'HubSpot', 'Install the HubSpot tracking code', 'https://knowledge.hubspot.com/reports/install-the-hubspot-tracking-code', 0);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'the-pre-launch-checklist-your-website-team-is-probably-skipping'), 'HubSpot', 'Style and embed HubSpot forms on an external site', 'https://knowledge.hubspot.com/forms/set-up-and-style-your-form-on-an-external-site', 1);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'the-pre-launch-checklist-your-website-team-is-probably-skipping'), 'HubSpot', 'Set up cookie tracking settings and consent banners', 'https://knowledge.hubspot.com/privacy-and-consent/set-up-a-consent-banner-with-the-new-editor', 2);
INSERT INTO article_services (article_id, service_slug, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'the-pre-launch-checklist-your-website-team-is-probably-skipping'), 'websites-content-hub', 0);
INSERT INTO article_services (article_id, service_slug, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'the-pre-launch-checklist-your-website-team-is-probably-skipping'), 'integrations-custom-development', 1);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'when-hubspot-native-integrations-stop-being-enough'), 'HubSpot', 'Authentication overview', 'https://developers.hubspot.com/docs/apps/developer-platform/build-apps/authentication/overview', 0);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'when-hubspot-native-integrations-stop-being-enough'), 'HubSpot', 'API usage guidelines and limits', 'https://developers.hubspot.com/docs/developer-tooling/platform/usage-guidelines', 1);
INSERT INTO article_sources (article_id, publisher, title, url, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'when-hubspot-native-integrations-stop-being-enough'), 'HubSpot', 'Webhooks API guide', 'https://developers.hubspot.com/docs/api-reference/latest/webhooks/guide', 2);
INSERT INTO article_services (article_id, service_slug, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'when-hubspot-native-integrations-stop-being-enough'), 'integrations-custom-development', 0);
INSERT INTO article_services (article_id, service_slug, sort_order)
VALUES ((SELECT id FROM articles WHERE slug = 'when-hubspot-native-integrations-stop-being-enough'), 'crm-revops', 1);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'signs-your-hubspot-portal-needs-an-audit'),
  (SELECT id FROM articles WHERE slug = 'clean-up-duplicate-crm-properties'),
  0
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'signs-your-hubspot-portal-needs-an-audit'),
  (SELECT id FROM articles WHERE slug = 'why-your-crm-reports-are-not-reliable'),
  1
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'signs-your-hubspot-portal-needs-an-audit'),
  (SELECT id FROM articles WHERE slug = 'what-managed-hubspot-support-should-include'),
  2
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'prepare-for-hubspot-crm-implementation'),
  (SELECT id FROM articles WHERE slug = 'signs-your-hubspot-portal-needs-an-audit'),
  0
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'prepare-for-hubspot-crm-implementation'),
  (SELECT id FROM articles WHERE slug = 'plan-a-website-redesign-around-crm-and-lead-capture'),
  1
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'prepare-for-hubspot-crm-implementation'),
  (SELECT id FROM articles WHERE slug = 'what-managed-hubspot-support-should-include'),
  2
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'before-connecting-your-website-to-hubspot'),
  (SELECT id FROM articles WHERE slug = 'plan-a-website-redesign-around-crm-and-lead-capture'),
  0
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'before-connecting-your-website-to-hubspot'),
  (SELECT id FROM articles WHERE slug = 'basic-website-accessibility-checks'),
  1
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'before-connecting-your-website-to-hubspot'),
  (SELECT id FROM articles WHERE slug = 'what-to-include-in-a-custom-integration-brief'),
  2
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'why-your-crm-reports-are-not-reliable'),
  (SELECT id FROM articles WHERE slug = 'clean-up-duplicate-crm-properties'),
  0
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'why-your-crm-reports-are-not-reliable'),
  (SELECT id FROM articles WHERE slug = 'signs-your-hubspot-portal-needs-an-audit'),
  1
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'why-your-crm-reports-are-not-reliable'),
  (SELECT id FROM articles WHERE slug = 'prepare-for-hubspot-crm-implementation'),
  2
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'what-to-include-in-a-custom-integration-brief'),
  (SELECT id FROM articles WHERE slug = 'before-connecting-your-website-to-hubspot'),
  0
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'what-to-include-in-a-custom-integration-brief'),
  (SELECT id FROM articles WHERE slug = 'prepare-for-hubspot-crm-implementation'),
  1
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'what-to-include-in-a-custom-integration-brief'),
  (SELECT id FROM articles WHERE slug = 'why-your-crm-reports-are-not-reliable'),
  2
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'plan-a-website-redesign-around-crm-and-lead-capture'),
  (SELECT id FROM articles WHERE slug = 'before-connecting-your-website-to-hubspot'),
  0
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'plan-a-website-redesign-around-crm-and-lead-capture'),
  (SELECT id FROM articles WHERE slug = 'basic-website-accessibility-checks'),
  1
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'plan-a-website-redesign-around-crm-and-lead-capture'),
  (SELECT id FROM articles WHERE slug = 'prepare-for-hubspot-crm-implementation'),
  2
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'basic-website-accessibility-checks'),
  (SELECT id FROM articles WHERE slug = 'plan-a-website-redesign-around-crm-and-lead-capture'),
  0
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'basic-website-accessibility-checks'),
  (SELECT id FROM articles WHERE slug = 'before-connecting-your-website-to-hubspot'),
  1
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'basic-website-accessibility-checks'),
  (SELECT id FROM articles WHERE slug = 'what-managed-hubspot-support-should-include'),
  2
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'what-managed-hubspot-support-should-include'),
  (SELECT id FROM articles WHERE slug = 'signs-your-hubspot-portal-needs-an-audit'),
  0
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'what-managed-hubspot-support-should-include'),
  (SELECT id FROM articles WHERE slug = 'clean-up-duplicate-crm-properties'),
  1
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'what-managed-hubspot-support-should-include'),
  (SELECT id FROM articles WHERE slug = 'prepare-for-hubspot-crm-implementation'),
  2
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'clean-up-duplicate-crm-properties'),
  (SELECT id FROM articles WHERE slug = 'why-your-crm-reports-are-not-reliable'),
  0
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'clean-up-duplicate-crm-properties'),
  (SELECT id FROM articles WHERE slug = 'signs-your-hubspot-portal-needs-an-audit'),
  1
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'clean-up-duplicate-crm-properties'),
  (SELECT id FROM articles WHERE slug = 'what-managed-hubspot-support-should-include'),
  2
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'hubspot-pricing-and-ai-credits-explained'),
  (SELECT id FROM articles WHERE slug = 'prepare-for-hubspot-crm-implementation'),
  0
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'hubspot-pricing-and-ai-credits-explained'),
  (SELECT id FROM articles WHERE slug = 'signs-your-hubspot-portal-needs-an-audit'),
  1
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'hubspot-pricing-and-ai-credits-explained'),
  (SELECT id FROM articles WHERE slug = 'what-managed-hubspot-support-should-include'),
  2
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'what-to-decide-before-hubspot-configuration'),
  (SELECT id FROM articles WHERE slug = 'prepare-for-hubspot-crm-implementation'),
  0
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'what-to-decide-before-hubspot-configuration'),
  (SELECT id FROM articles WHERE slug = 'signs-your-hubspot-portal-needs-an-audit'),
  1
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'what-to-decide-before-hubspot-configuration'),
  (SELECT id FROM articles WHERE slug = 'when-hubspot-native-integrations-stop-being-enough'),
  2
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'the-pre-launch-checklist-your-website-team-is-probably-skipping'),
  (SELECT id FROM articles WHERE slug = 'before-connecting-your-website-to-hubspot'),
  0
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'the-pre-launch-checklist-your-website-team-is-probably-skipping'),
  (SELECT id FROM articles WHERE slug = 'plan-a-website-redesign-around-crm-and-lead-capture'),
  1
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'the-pre-launch-checklist-your-website-team-is-probably-skipping'),
  (SELECT id FROM articles WHERE slug = 'basic-website-accessibility-checks'),
  2
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'when-hubspot-native-integrations-stop-being-enough'),
  (SELECT id FROM articles WHERE slug = 'what-to-include-in-a-custom-integration-brief'),
  0
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'when-hubspot-native-integrations-stop-being-enough'),
  (SELECT id FROM articles WHERE slug = 'why-your-crm-reports-are-not-reliable'),
  1
);
INSERT INTO article_relations (article_id, related_article_id, sort_order)
VALUES (
  (SELECT id FROM articles WHERE slug = 'when-hubspot-native-integrations-stop-being-enough'),
  (SELECT id FROM articles WHERE slug = 'what-to-decide-before-hubspot-configuration'),
  2
);

COMMIT;
