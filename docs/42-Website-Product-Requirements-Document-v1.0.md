# 42 Website Product Requirements Document (PRD)

**Document version:** 1.0  
**Status:** Approved for Codex implementation, subject to the open legal and identity decisions listed in Section 18  
**Product:** 42 website  
**Production domain:** `https://company42.co`  
**Public brand:** 42  
**Trading name:** Company42  
**Product owner:** Thierry-Luc Denichaud  
**Primary implementation agent:** Codex  
**Initial hosting state:** Next.js application currently deployed to Render for staging and testing  
**Primary audience:** Mid-market organisations across North America and EMEA  
**Language standard:** UK English  
**Last updated:** 23 July 2026  

---

## 0. How Codex must use this document

This document is the product source of truth for the 42 website.

Codex must:

1. Read this PRD before making material changes to information architecture, messaging, page hierarchy, calls to action, content structure, or public-facing functionality.
2. Preserve the product intent even when changing the implementation.
3. Treat requirements marked **SHALL** as mandatory for Version 1 launch.
4. Treat requirements marked **SHOULD** as strongly recommended unless a documented technical constraint prevents implementation.
5. Treat requirements marked **MAY** as optional enhancements.
6. Avoid inventing facts, client outcomes, certifications, awards, team members, office locations, legal claims, testimonials, statistics, partnerships, or credentials.
7. Flag contradictions or missing source information instead of silently guessing.
8. Keep production and staging behaviour separate. The staging Render deployment must not compete with the production domain in search.
9. Make changes in small, reviewable batches and provide a concise change log after each batch.
10. Preserve the ability to add analytics, cookie consent, HubSpot tracking, Microsoft Clarity, and other marketing instrumentation after launch without redesigning the application.

This is a **Product Requirements Document**, not the final engineering specification. It defines what the website must achieve and how it must behave from a user and business perspective. A separate engineering specification will define implementation patterns, testing tools, code standards, deployment mechanics, security headers, and automated quality gates.

---

# 1. Executive summary

## 1.1 Product definition

The 42 website is the digital flagship of a senior-led HubSpot consultancy.

It must position 42 as the consultancy organisations trust when their HubSpot requirements are too important, complex, operationally sensitive, or technically demanding for a basic implementation partner.

The website is not a generic agency brochure. It is a product that must:

- explain what 42 does quickly;
- demonstrate clear strategic and technical capability;
- make complex HubSpot services understandable;
- help mid-market decision-makers identify the right service;
- establish trust without exaggeration;
- convert qualified visitors into conversations;
- create a durable foundation for search visibility, AI discovery, thought leadership, and future growth.

## 1.2 Core positioning statement

> **42 is a senior-led HubSpot consultancy helping mid-market organisations simplify complex CRM challenges through strategy, technical implementation, automation, integrations, website delivery, and continuous optimisation.**

## 1.3 Core brand promise

> **Your HubSpot Answer**

The tagline is intentionally concise and distinctive. It must always be supported by explicit explanatory copy so that visitors and search systems immediately understand what the business does.

## 1.4 Master business description

Use the following as the approved master description, adapting length where necessary without changing the meaning:

> **42 is a senior-led HubSpot consultancy helping mid-market organisations simplify complex CRM challenges. We combine CRM strategy, technical implementation, automation, integrations, website delivery, and ongoing optimisation to make HubSpot fit the way each business actually operates. We work with teams across North America and EMEA to create clear, maintainable systems that people can use and leaders can trust.**

## 1.5 Version 1 launch intent

Version 1 must launch as a fast, accessible, credible, search-ready consultancy website with:

- a clear homepage;
- a structured services architecture;
- a strong About page;
- complete Insights content and category navigation;
- a functional HubSpot enquiry form;
- accurate privacy and terms pages;
- no public Work page until real proof is ready;
- no paid analytics or behavioural tracking requirements;
- no unnecessary cookie or marketing stack;
- clear extension points for post-launch measurement.

---

# 2. Product vision

## 2.1 Vision

The 42 website should become one of the strongest examples of a technically credible HubSpot consultancy website.

A qualified visitor should leave with the impression that 42:

- understands businesses before configuring software;
- can advise at a strategic level;
- can deliver technically;
- can simplify complex CRM and operating processes;
- understands how HubSpot connects to wider systems;
- will produce maintainable work;
- is direct, senior-led, and commercially practical.

## 2.2 Mission of the website

The website exists to help the right organisations understand:

1. what 42 does;
2. whether 42 is suitable for their situation;
3. how 42 approaches complex HubSpot work;
4. which service is relevant;
5. why a conversation is worthwhile;
6. how to contact 42 with minimal friction.

## 2.3 Product north star

> **Every page should make the visitor more certain that 42 can understand and solve a complex HubSpot problem.**

## 2.4 Product philosophy

### Understand before configuring

HubSpot should reflect the business rather than forcing the business to conform to a generic portal setup.

Every solution should begin with an understanding of:

- people;
- process;
- data;
- systems;
- commercial goals;
- reporting requirements;
- constraints;
- ownership;
- long-term maintainability.

### Simplify complexity

Complex organisations do not automatically require complicated systems.

42 should favour the simplest solution that:

- solves the actual problem;
- can be understood by the people using it;
- can be maintained;
- can scale appropriately;
- does not create avoidable technical debt.

### Build for the people using it

A theoretically perfect system that users distrust, avoid, or misunderstand is a failed system.

The website should reflect a human-centred delivery approach: clear language, visible logic, practical outcomes, and respect for operational reality.

### Solve the real problem

Clients may request a workflow, property, dashboard, integration, or website. The actual need may be process clarity, ownership, visibility, adoption, data quality, or operational control.

42 must be positioned as a consultancy that diagnoses before prescribing.

### Build for the long term

Implementations should remain understandable and useful after the initial engagement.

The product should reinforce:

- maintainable architecture;
- sensible governance;
- documentation;
- clear ownership;
- appropriate use of native HubSpot capability;
- custom development only where justified.

### Demonstrate, do not posture

The website must not rely on vague superlatives.

Trust should be earned through:

- specificity;
- coherent service descriptions;
- clear methodology;
- thoughtful insight content;
- real team information;
- accurate technical language;
- evidence when it becomes available.

---

# 3. Product objectives, success criteria, and non-goals

## 3.1 Business objectives

### PRD-OBJ-001 — Clear market position

The website **SHALL** position 42 as a senior-led HubSpot consultancy for mid-market organisations with meaningful CRM, operational, integration, website, or optimisation requirements.

**Acceptance criteria**

- The homepage identifies HubSpot consultancy within the first viewport.
- The target market is clear without excluding suitable adjacent opportunities.
- The service range is clear.
- The site does not present 42 as a generic full-service marketing agency.

### PRD-OBJ-002 — Qualified enquiry generation

The website **SHALL** provide a clear path for qualified visitors to start a conversation.

**Acceptance criteria**

- A primary CTA is visible in the global header and homepage hero.
- The Contact page contains a functional HubSpot form.
- `hello@company42.co` is displayed as a fallback contact method.
- Form completion does not require unnecessary information.

### PRD-OBJ-003 — Trust creation

The website **SHALL** establish trust without fabricated proof.

**Acceptance criteria**

- No fake testimonials, case studies, client logos, team members, certifications, metrics, or office locations are present.
- The Work page is not publicly discoverable at launch.
- The About page presents a credible delivery philosophy and real people only.
- Service pages contain enough detail to demonstrate expertise.

### PRD-OBJ-004 — Search readiness

The website **SHALL** be ready for indexing on `company42.co`.

**Acceptance criteria**

- Each public page has a clear search purpose.
- Production pages use the production domain as the canonical reference.
- Staging is excluded from indexing.
- The public page set is complete and free from placeholders.
- Category pages and Insight pages are structured coherently.

### PRD-OBJ-005 — Sustainable growth foundation

The website **SHALL** support future expansion without requiring a structural rebuild.

**Acceptance criteria**

- Services, Insights, categories, authors, and future case studies have scalable content structures.
- Analytics and tracking can be added later.
- New service and industry pages can be introduced without changing the global information architecture.
- The Work section can be re-enabled when approved evidence exists.

## 3.2 User objectives

Visitors must be able to:

- understand what 42 does within approximately five seconds;
- identify the service most relevant to their problem;
- assess whether 42 has the appropriate strategic and technical depth;
- learn how 42 approaches delivery;
- read useful HubSpot guidance;
- contact 42 without creating an account;
- navigate on mobile, keyboard, and assistive technology;
- distinguish factual evidence from positioning language.

## 3.3 Launch success criteria without analytics

Analytics will be configured after go-live. Version 1 success must therefore initially be assessed through:

- correct production deployment;
- successful DNS and HTTPS setup;
- successful enquiry-form submission;
- complete public content;
- no broken internal links;
- no publicly visible placeholders;
- no accidental staging references;
- satisfactory manual mobile and desktop review;
- successful search-engine crawl readiness;
- accessibility and performance targets defined in this document;
- successful post-launch Search Console setup.

## 3.4 Post-launch success metrics

Once analytics and Search Console are configured, the site should measure:

- qualified enquiry submissions;
- consultation CTA clicks;
- contact email clicks;
- organic impressions;
- non-branded organic clicks;
- indexed pages;
- search queries by service;
- service-page engagement;
- Insight-to-service journeys;
- form completion rate;
- returning visitor rate;
- landing-page conversion rate;
- Core Web Vitals;
- crawl and indexing errors.

No numerical commercial target should be invented before a traffic baseline exists.

## 3.5 Non-goals for Version 1

Version 1 is not required to include:

- Google Analytics 4;
- Google Tag Manager;
- Microsoft Clarity;
- HubSpot tracking code;
- LinkedIn Insight Tag;
- Meta Pixel;
- newsletter subscriptions;
- marketing automation;
- personalisation;
- gated downloads;
- user accounts;
- ecommerce;
- multilingual content;
- a public case-study library;
- a public Work page;
- programmatic SEO;
- paid SEO software;
- complex cookie-consent tooling where no non-essential tracking is active;
- a chatbot or Customer Agent;
- a full CRM portal integration beyond the enquiry form.

These items may be added after launch when there is a defined need.

---

# 4. Brand identity and messaging

## 4.1 Brand naming hierarchy

### Public brand

**42**

Use “42” in:

- logo;
- navigation;
- visible headings;
- footer brand label;
- calls to action;
- social display names;
- public page copy.

### Trading and legal references

**Company42** is the supplied legal/trading name.

The supplied contracting entity is **MadeYourLookAgency**, but the exact legal relationship and jurisdiction require confirmation before final Terms publication.

Until confirmed, Codex must not invent company-registration details.

### Brand naming requirements

#### PRD-BRAND-001

The website **SHALL** present the public brand as **42**, not “Company42”, except where legal or explanatory context requires the trading name.

#### PRD-BRAND-002

The site **SHALL** use the canonical domain `company42.co`.

#### PRD-BRAND-003

The brand may be described as:

> 42, trading as Company42

or:

> Company42, operating publicly as 42

only after the preferred legal wording is confirmed.

## 4.2 Tagline

Approved tagline:

> **Your HubSpot Answer**

### Usage rules

- The homepage H1 remains “Your HubSpot Answer”.
- The tagline must not appear alone without nearby explanatory copy.
- Do not dilute it with multiple competing taglines.
- Do not use “the answer to everything” as a business claim.
- The phrase may be used as a closing line or CTA theme where it feels natural.

## 4.3 Approved homepage SEO title

> **HubSpot Consultancy, CRM & Integrations | 42**

The engineering specification will define exact title-template behaviour for internal pages.

## 4.4 Approved homepage meta-description direction

Recommended launch description:

> **42 is a senior-led HubSpot consultancy helping mid-market organisations simplify CRM, implement HubSpot, automate operations, and connect critical systems.**

Codex may adjust punctuation or character length, but not the meaning.

## 4.5 Voice and tone

42 should sound like a senior consultant: clear, calm, direct, practical, technically literate, and commercially aware.

### The voice should be

- confident without arrogance;
- technical without unnecessary complexity;
- concise where possible;
- specific;
- grounded;
- consultative;
- useful;
- honest about trade-offs;
- oriented towards outcomes and operating reality.

### The voice should not be

- loud or hype-driven;
- overly casual;
- generic agency language;
- filled with unexplained jargon;
- aggressive;
- gimmicky;
- self-congratulatory;
- built around unsupported claims;
- excessively dependent on the “42” reference.

## 4.6 Language conventions

The site **SHALL** use UK English consistently.

Examples:

- organisation, not organization;
- optimisation, not optimization;
- programme where contextually correct;
- personalised, not personalized.

HubSpot product names must use HubSpot’s official capitalisation where relevant, such as:

- Sales Hub;
- Service Hub;
- Marketing Hub;
- Content Hub;
- Operations Hub;
- Commerce Hub;
- Smart CRM.

Do not change official product names merely to conform to UK spelling.

## 4.7 Messaging hierarchy

Every major page should communicate, in this order:

1. what the page is about;
2. which business problem it addresses;
3. what 42 does;
4. how the work is approached;
5. what outcomes the client should expect;
6. what the visitor should do next.

---

# 5. Target market and audience

## 5.1 Primary market

The primary target market is **mid-market organisations**.

The site should not rigidly define mid-market by a single employee or revenue threshold unless 42 later approves a formal definition.

The best-fit organisation typically has several of the following characteristics:

- HubSpot is already in use or under serious consideration;
- the CRM has become operationally important;
- multiple teams use or depend on CRM data;
- there are complex sales, service, marketing, fulfilment, or reporting processes;
- manual processes are creating risk or inefficiency;
- leadership does not fully trust CRM reporting;
- system integrations are required;
- data migration or architecture is non-trivial;
- internal ownership is limited;
- the organisation needs senior guidance as well as implementation capacity;
- basic onboarding is insufficient.

## 5.2 Service geography

Approved public service areas:

- **North America**
- **EMEA**

### Geographic-positioning requirements

#### PRD-GEO-001

The website **SHALL** communicate that 42 serves clients across North America and EMEA.

#### PRD-GEO-002

The website **SHALL NOT** imply that 42 has a physical office in the United States, Palm Springs, the United Kingdom, Europe, or any other location unless that office genuinely exists.

#### PRD-GEO-003

A street address is not required on public marketing pages at launch.

#### PRD-GEO-004

Legal pages must use the correct registered jurisdiction once confirmed. Service area and legal jurisdiction must not be conflated.

## 5.3 Primary decision-makers

### Persona A — Revenue or commercial leader

Typical roles:

- Chief Revenue Officer;
- Sales Director;
- Commercial Director;
- Revenue Operations leader;
- Head of Sales;
- Managing Director.

Needs:

- trustworthy pipeline visibility;
- lead and deal process clarity;
- improved adoption;
- faster response;
- reliable forecasting;
- reduced manual administration;
- alignment across teams.

Concerns:

- another consultancy overcomplicating the portal;
- disruption to sales;
- poor change management;
- unclear ROI;
- reporting that remains unreliable.

### Persona B — Operations or systems leader

Typical roles:

- Operations Director;
- Head of Operations;
- Business Systems Manager;
- IT lead;
- Transformation lead;
- CRM programme owner.

Needs:

- clear architecture;
- integration feasibility;
- data ownership;
- maintainability;
- controlled automation;
- documented processes;
- reliable synchronisation;
- reduced operational risk.

Concerns:

- brittle custom code;
- vendor lock-in;
- poor documentation;
- data duplication;
- unclear system boundaries;
- unmanaged technical debt.

### Persona C — Marketing or CRM owner

Typical roles:

- Marketing Director;
- Head of Marketing;
- CRM Manager;
- HubSpot Administrator;
- Marketing Operations leader.

Needs:

- a clean portal;
- usable segmentation;
- reporting;
- lifecycle clarity;
- campaign enablement;
- governance;
- support;
- internal credibility.

Concerns:

- lack of internal resource;
- messy properties and workflows;
- poor alignment with sales;
- inconsistent data;
- difficulty demonstrating value.

### Persona D — Service or customer-experience leader

Typical roles:

- Customer Service Director;
- Head of Support;
- Customer Success leader;
- Service Operations Manager.

Needs:

- clear ticket ownership;
- Service Hub implementation;
- SLAs;
- status automation;
- knowledge management;
- reporting;
- improved customer hand-offs.

Concerns:

- automation creating poor customer experiences;
- support teams resisting the system;
- fragmented inboxes;
- unclear escalation logic.

### Persona E — Executive sponsor or owner

Typical roles:

- Founder;
- CEO;
- COO;
- Managing Partner;
- General Manager.

Needs:

- confidence that the CRM investment will work;
- a clear partner;
- visibility;
- reduced risk;
- practical delivery;
- a roadmap.

Concerns:

- paying for activity rather than outcomes;
- overengineering;
- implementation delays;
- dependency on one person;
- lack of accountability.

## 5.4 Secondary audiences

The site may also serve:

- HubSpot teams needing specialist support;
- agencies requiring technical delivery support;
- private-equity portfolio operations;
- implementation partners requiring integration capability;
- technical stakeholders assessing architecture;
- prospective team members or collaborators;
- existing clients looking for guidance.

These audiences must not displace the primary mid-market positioning.

---

# 6. Jobs to be done and user journeys

## 6.1 Core jobs to be done

A visitor may be trying to:

- choose a HubSpot consultancy;
- rescue or simplify an existing portal;
- prepare for implementation;
- migrate data;
- improve CRM adoption;
- create a scalable CRM architecture;
- automate a manual process;
- integrate HubSpot with an ERP or operational system;
- improve reporting;
- redesign a HubSpot website;
- implement Service Hub;
- obtain ongoing HubSpot support;
- validate whether a proposed solution is sensible;
- understand a HubSpot concept before contacting a consultancy.

## 6.2 Primary user journey — Referral visitor

**Entry:** Homepage or direct service link  
**Mindset:** Some trust already exists; visitor wants validation  
**Required path:**

1. Understand 42 quickly.
2. Review relevant services.
3. Review approach and About page.
4. Contact 42.

**Product requirement:** The site must not force a referral visitor through excessive content before presenting a contact route.

## 6.3 Primary user journey — Organic search visitor

**Entry:** Service page or Insight article  
**Mindset:** Problem-aware, brand-unaware  
**Required path:**

1. Receive a direct answer to the search intent.
2. Understand 42’s competence.
3. Discover a relevant service.
4. Read related content or contact 42.

**Product requirement:** Every Insight article should provide a natural route to a relevant service without becoming an advertisement.

## 6.4 Primary user journey — Technical evaluator

**Entry:** Integrations, automation, CRM, or implementation page  
**Mindset:** Testing depth and credibility  
**Required path:**

1. See accurate technical language.
2. Understand delivery boundaries.
3. See evidence of architecture-first thinking.
4. Contact 42 with enough context for a useful discussion.

## 6.5 Primary user journey — Executive evaluator

**Entry:** Homepage, About, service overview  
**Mindset:** Wants clarity, confidence, and commercial relevance  
**Required path:**

1. Understand the offer.
2. Recognise relevant business outcomes.
3. Understand why 42 is different.
4. Start a conversation.

## 6.6 Returning visitor journey

Returning users should be able to:

- find contact details immediately;
- revisit a service page;
- locate an article;
- identify new content;
- navigate without intrusive pop-ups.

## 6.7 AI-assisted discovery journey

A potential client may discover 42 through an AI-generated answer rather than a conventional search result.

The public website should therefore make it easy for machines and humans to identify:

- the organisation;
- its services;
- its audience;
- its service areas;
- its expertise;
- its authors;
- the relationship between Insight content and services;
- accurate contact information.

The site must not use manipulative or unverifiable “AI SEO” claims.

---

# 7. Information architecture

## 7.1 Version 1 public site map

The public site should contain the following principal routes.

```text
/
├── /services
│   ├── /services/hubspot-strategy-consulting
│   ├── /services/hubspot-implementation-onboarding
│   ├── /services/hubspot-crm-revops
│   ├── /services/hubspot-automation-operations
│   ├── /services/integrations-custom-development
│   ├── /services/hubspot-websites-content-hub
│   ├── /services/hubspot-service-hub
│   └── /services/managed-hubspot-support
├── /about
├── /insights
│   ├── /insights/category/[category-slug]
│   └── /insights/[article-slug]
├── /contact
├── /privacy
├── /terms
└── /404
```

Existing route names may be retained where they are already coherent. Codex must not change live slugs casually because redirects will be required after launch.

## 7.2 Work page status

### PRD-IA-001

The Work page **SHALL NOT** appear in the Version 1 public navigation.

### PRD-IA-002

The Work route should either:

- not be generated in production; or
- return an appropriate not-found response; or
- remain inaccessible and `noindex` if retained temporarily for development.

A public page that merely promises future case studies is not acceptable.

### PRD-IA-003

The Work section may be reintroduced after 42 has approved case studies, testimonials, or verified project evidence.

## 7.3 Global navigation

The main navigation should prioritise:

- Services;
- About;
- Insights;
- Contact or Book a consultation.

The navigation should remain concise. Do not expose every service as a top-level item on small screens without a usable grouping pattern.

## 7.4 Footer navigation

The footer should include:

- brand and concise description;
- key service links;
- About;
- Insights;
- Contact;
- Privacy;
- Terms;
- email address;
- LinkedIn placeholder only if it is not rendered as a broken or fake link;
- copyright notice.

If a LinkedIn URL does not yet exist, either omit the link or render a clearly non-interactive placeholder in development only. Production must not contain `#`, empty, or misleading social links.

## 7.5 Internal-linking principles

- Every service page should link to adjacent relevant services.
- Every Insight article should link to one primary relevant service and selected related articles.
- Service pages should surface relevant Insights when available.
- The About page should link to Contact and Services.
- Category pages should link to all valid articles in that category.
- Avoid excessive repeated exact-match anchor text.
- Avoid orphan pages.
- Avoid forcing all traffic through the homepage.

---

# 8. Page-level product requirements

## 8.1 Homepage

### Product purpose

The homepage must position 42, establish relevance, communicate service breadth, create trust, and direct visitors to the next appropriate action.

### Required content hierarchy

1. Hero
2. Clear scope statement
3. Core services
4. Explanation of the problems 42 solves
5. Delivery philosophy or differentiators
6. Selected Insight content
7. Strong final CTA

### Homepage hero

**H1:**

> **Your HubSpot Answer**

**Supporting copy direction:**

> Senior-led HubSpot consulting for mid-market organisations that need to simplify CRM, improve operations, connect critical systems, and get more from HubSpot.

Codex may refine this for rhythm while preserving:

- senior-led;
- HubSpot;
- mid-market;
- CRM;
- operational/technical depth;
- clear value.

**Primary CTA:**

> Book a consultation

or the existing equivalent if it is already established consistently.

**Secondary CTA:**

> Explore our services

### Homepage requirements

#### PRD-HOME-001

The homepage **SHALL** communicate the business category within the first viewport.

#### PRD-HOME-002

The phrase “Your HubSpot Answer” **SHALL** be accompanied by explicit explanatory copy.

#### PRD-HOME-003

The homepage **SHALL** show the breadth of the offer without becoming a duplicate of the Services page.

#### PRD-HOME-004

The homepage **SHALL** include at least one proof-of-thinking section: methodology, principles, process, or expertise.

#### PRD-HOME-005

The homepage **SHALL NOT** include fake client logos, invented metrics, or placeholder testimonials.

#### PRD-HOME-006

The homepage **SHOULD** include selected Insight articles once they are complete.

#### PRD-HOME-007

The homepage **SHALL** contain a clear final CTA.

## 8.2 Services overview

### Product purpose

Help visitors identify the correct type of engagement.

### Required elements

- concise introduction;
- clear explanation of 42’s service model;
- eight service categories;
- brief problem/outcome framing for each service;
- links to detail pages;
- contact CTA;
- guidance for visitors who are unsure which service applies.

### Requirement

The Services page must not be a list of HubSpot product features. It must frame services around business needs and delivery outcomes.

## 8.3 Service-detail pages

Each service page must be sufficiently distinct to justify its existence.

### Required structure

1. Clear H1
2. Problem context
3. Who the service is for
4. What 42 does
5. Typical deliverables
6. Approach or process
7. Expected outcomes
8. Related services
9. Related Insights
10. CTA

### Service pages in scope

#### HubSpot strategy and consulting

Focus:

- discovery;
- process mapping;
- portal strategy;
- roadmap;
- governance;
- requirements definition;
- operating-model alignment.

#### HubSpot implementation and onboarding

Focus:

- architecture;
- setup;
- migration;
- configuration;
- enablement;
- training;
- launch planning;
- adoption.

#### HubSpot CRM and RevOps

Focus:

- lifecycle and pipeline design;
- data model;
- reporting;
- lead management;
- ownership;
- forecasting;
- operational alignment.

#### HubSpot automation and operations

Focus:

- workflows;
- hand-offs;
- task automation;
- SLA logic;
- operational visibility;
- maintainability;
- exception handling.

#### Integrations and custom development

Focus:

- integration discovery;
- system contracts;
- APIs;
- middleware;
- webhooks;
- data mapping;
- custom objects;
- custom code;
- ERP and operational-system connectivity.

This page must strongly demonstrate that integration begins with architecture and ownership, not simply an API connection.

#### HubSpot websites and Content Hub

Focus:

- strategy;
- UX;
- information architecture;
- Content Hub;
- custom modules;
- performance;
- CRM-connected journeys;
- migration;
- maintainable editing.

#### HubSpot Service Hub

Focus:

- help desk;
- ticket pipelines;
- routing;
- SLAs;
- statuses;
- automation;
- reporting;
- knowledge base;
- customer experience.

#### Managed HubSpot support

Focus:

- ongoing optimisation;
- portal administration;
- backlog management;
- troubleshooting;
- governance;
- improvements;
- clearly defined retainer boundaries.

The site must not imply unlimited support or undefined availability.

## 8.4 About page

### Product purpose

Explain who 42 is, how it works, and why the delivery model is credible.

### Required elements

- positioning statement;
- senior-led model;
- delivery principles;
- team section using real people only;
- service-area statement;
- CTA.

### Requirements

#### PRD-ABOUT-001

The principles section **SHALL** render each principle once only.

#### PRD-ABOUT-002

Desktop and mobile presentation must not create duplicate semantic content.

#### PRD-ABOUT-003

Team placeholders must not imply fictional employees.

#### PRD-ABOUT-004

Until final team photography is supplied, use neutral, clearly intentional image placeholders or omit photos. Do not use stock headshots that could be mistaken for real team members.

#### PRD-ABOUT-005

The About page **SHALL** communicate that delivery is senior-led.

#### PRD-ABOUT-006

The About page **SHALL NOT** publish a physical office location that has not been confirmed.

## 8.5 Insights index

### Product purpose

Establish expertise, answer real buyer questions, support organic discovery, and provide useful guidance.

### Required elements

- clear introduction;
- category navigation;
- featured or latest articles;
- article cards with title, summary, category, author, and reading time where available;
- pagination or a scalable loading pattern when content volume grows;
- contact or service CTA that does not interrupt reading.

## 8.6 Insight category pages

Category pages are approved for Version 1.

### Initial category framework

Use a manageable set of categories. Recommended launch categories:

1. HubSpot Strategy
2. CRM & RevOps
3. Implementation & Onboarding
4. Automation & Operations
5. Integrations & Development
6. Websites & Content Hub
7. Service Hub
8. Reporting & Data

Categories may be consolidated if there are too few articles to support each one.

### Category requirements

- Each category page must include an original introduction.
- A category should not be published with zero articles.
- Avoid thin category pages with only one short card and no context.
- Category URLs must be stable and readable.
- Articles may have one primary category and selected tags.
- Tags do not require public index pages at launch.

## 8.7 Insight article pages

### Required elements

- article title;
- concise description or standfirst;
- author;
- publication date;
- updated date where relevant;
- category;
- reading time;
- clear article body;
- table of contents for sufficiently long articles;
- related articles;
- relevant service CTA;
- author information;
- sources where factual claims require support.

### Requirements

#### PRD-INSIGHT-001

Articles **SHALL** provide complete, useful answers and must not exist only to target a keyword.

#### PRD-INSIGHT-002

Articles **SHALL NOT** invent HubSpot features, limits, pricing, beta availability, legal requirements, or product behaviour.

#### PRD-INSIGHT-003

Time-sensitive articles should display an updated date when materially revised.

#### PRD-INSIGHT-004

Long articles **SHOULD** include a table of contents.

#### PRD-INSIGHT-005

Related content should be contextually selected, not random.

#### PRD-INSIGHT-006

The author profile must use real biographical information.

#### PRD-INSIGHT-007

Articles should use clear headings, short paragraphs, examples, and practical recommendations.

## 8.8 Author pages

Author pages are approved where an author has more than one article or a meaningful public profile.

At launch, a single real author page is acceptable.

Required content:

- name;
- role;
- concise professional biography;
- areas of expertise;
- authored articles;
- LinkedIn link once available;
- real image once supplied.

Do not create multiple empty author pages.

## 8.9 Contact page

### Product purpose

Make it easy for qualified prospects to start a useful conversation.

### Required elements

- concise invitation;
- expectations about what happens next;
- embedded HubSpot form;
- visible fallback email: `hello@company42.co`;
- service-area statement;
- no unnecessary friction.

### Form fields

The form should ask only for information that supports qualification and response.

Recommended initial fields:

- first name;
- last name;
- work email;
- company;
- role or job title, if useful;
- what help is needed;
- optional service area or enquiry type;
- consent/notice text required for the HubSpot form and applicable privacy requirements.

Do not request phone number unless there is a clear operational need.

### Requirements

- The form must work before launch.
- Success and error states must be clear.
- The form must be usable with keyboard and assistive technology.
- The page must remain useful if the form script fails.
- The email address must use the correct spelling: `hello@company42.co`.

## 8.10 Privacy page

The Privacy page must be complete before production launch.

It should accurately describe the Version 1 website, including:

- identity of the responsible business;
- contact email;
- categories of data collected;
- HubSpot form processing;
- server logs and essential technical data;
- whether fonts are self-hosted or externally requested;
- cookies or local storage actually used;
- processors and third-party services actually present;
- retention approach;
- rights and contact process;
- international transfers where applicable;
- governing privacy framework as confirmed by legal review;
- policy update date.

### Important constraint

The site currently plans no GA4, HubSpot tracking code, Microsoft Clarity, newsletter, or marketing pixels at launch. The Privacy page must not claim these are active.

However, Codex must not state that the site uses “no cookies” until the deployed application and embedded HubSpot form have been tested. Embedded forms and hosting infrastructure may create technical storage or requests that need disclosure.

## 8.11 Terms page

The Terms page must be complete before launch.

It should cover, subject to professional review:

- website owner/operator;
- relationship between 42, Company42, and MadeYourLookAgency;
- permitted use;
- intellectual property;
- information-only nature of website content;
- no guaranteed business or search outcomes;
- third-party links;
- limitation of liability;
- service engagements governed by separate proposals or agreements;
- governing law and jurisdiction;
- contact method;
- update date.

The Terms page must not invent payment terms or service-contract terms that have not been approved.

## 8.12 Error and empty states

The site must include:

- a useful 404 page;
- clear form errors;
- an appropriate response where no articles exist in a category during development;
- no public “coming soon” pages unless explicitly approved;
- no broken placeholder components.

---

# 9. Content strategy and editorial model

## 9.1 Content role

Content must demonstrate how 42 thinks and works.

The strongest content themes should be derived from genuine delivery experience, including:

- CRM architecture;
- HubSpot implementation planning;
- lead management;
- workflow governance;
- ticketing and service operations;
- Buyer Intent;
- data quality;
- integration architecture;
- ERP and operational-system connectivity;
- quote and commerce design;
- reporting;
- portal clean-up;
- website and CRM alignment;
- managed support.

Client names and identifiable details must not be used without permission.

## 9.2 Content hierarchy

The content system should consist of:

- service pages for commercial intent;
- Insights for education and expertise;
- category pages for topical organisation;
- future case studies for proof;
- future downloadable resources only when there is a real use case.

## 9.3 Editorial standards

Every published article should:

- address a real question;
- provide a clear answer;
- demonstrate practical understanding;
- avoid filler;
- distinguish opinion from fact;
- cite primary or reliable sources where appropriate;
- be reviewed for current accuracy;
- use real examples only when permitted;
- include a next step relevant to the reader.

## 9.4 Knowledge-base direction

The long-term intent is to evolve Insights into a structured HubSpot knowledge system rather than an undifferentiated blog.

The website should support future topic clusters such as:

- HubSpot CRM;
- Sales Hub;
- Marketing Hub;
- Service Hub;
- Content Hub;
- Operations Hub;
- integrations;
- RevOps;
- automation;
- reporting;
- AI and Buyer Intent;
- implementation;
- governance;
- websites.

Version 1 should not create empty taxonomies merely to imply scale.

## 9.5 Content freshness

Time-sensitive content should be reviewed when:

- HubSpot changes a feature;
- product names change;
- pricing or package requirements change;
- beta features become public or are withdrawn;
- legal or privacy requirements change;
- the recommended implementation approach changes.

## 9.6 Duplicate content

The application must avoid:

- repeated About principles;
- identical service intros;
- duplicated mobile/desktop copy in rendered markup;
- multiple versions of the same article;
- staging and production copies;
- parameterised indexable duplicates.

---

# 10. Conversion strategy

## 10.1 Primary conversion

The primary conversion is a qualified consultation enquiry.

Approved primary CTA direction:

> **Book a consultation**

Alternative wording such as “Start a conversation” may be used only if applied consistently and approved.

## 10.2 Secondary conversions

Secondary actions may include:

- explore services;
- read an Insight;
- email 42;
- view a relevant service from an article;
- return to a saved article;
- share an article.

## 10.3 CTA principles

- CTAs must be specific.
- The same page should not contain several competing primary actions.
- Avoid aggressive urgency.
- Avoid false scarcity.
- Avoid exit-intent pop-ups at launch.
- Avoid chat widgets at launch.
- Contact prompts should appear at natural decision points.
- Article CTAs should be relevant to the article topic.

## 10.4 Contact expectations

The Contact page may state an expected response window only if 42 can consistently meet it.

Do not promise immediate or 24/7 response.

---

# 11. Trust and evidence strategy

## 11.1 Launch trust signals

Because public case studies are not ready, trust must initially come from:

- clarity of positioning;
- quality of service explanations;
- delivery principles;
- real author expertise;
- real team information;
- technically accurate Insights;
- professional design;
- fast and accessible performance;
- transparent contact and legal information;
- consistent brand identity.

## 11.2 Prohibited proof

The website must not publish:

- invented testimonials;
- fabricated client logos;
- unverifiable revenue claims;
- fake review ratings;
- fictional case studies;
- made-up project counts;
- unapproved client names;
- false HubSpot partner-tier claims;
- awards that have not been received;
- stock images presented as staff;
- physical office locations that do not exist.

## 11.3 Future case-study model

When the Work section is reintroduced, each case study should include:

- client context or approved anonymised description;
- problem;
- constraints;
- approach;
- solution;
- implementation detail;
- outcome;
- verified metrics where available;
- technologies used;
- related services;
- client approval status.

Where client names cannot be used, descriptions may use accurate anonymised labels such as:

- UK electronics manufacturer;
- B2B architectural-products supplier;
- energy technology provider.

Anonymisation must not create misleading scale or outcomes.

---

# 12. Search, entity, and AI-discovery requirements

## 12.1 Search strategy

The website should pursue focused commercial and educational relevance rather than broad keyword volume.

Approved primary themes include:

- HubSpot consultancy;
- HubSpot consultant;
- HubSpot implementation;
- HubSpot CRM consultant;
- HubSpot partner or specialist, only where accurate;
- HubSpot automation;
- HubSpot RevOps;
- HubSpot integrations;
- HubSpot development;
- HubSpot websites;
- HubSpot support.

## 12.2 Page-to-topic alignment

Each major page should have one clear primary search theme.

Recommended map:

| Page | Primary theme |
|---|---|
| Home | HubSpot consultancy |
| Strategy | HubSpot strategy consultant |
| Implementation | HubSpot implementation and onboarding |
| CRM & RevOps | HubSpot CRM and RevOps consulting |
| Automation | HubSpot automation consulting |
| Integrations | HubSpot integration services |
| Websites | HubSpot website development |
| Service Hub | HubSpot Service Hub implementation |
| Managed support | HubSpot support services |
| Insights | HubSpot guidance and expertise |

This map is directional. Copy must remain natural.

## 12.3 Geographic search

Do not create North America, US, UK, South Africa, or EMEA landing pages at launch unless each page can provide genuinely differentiated information.

Do not clone pages and replace place names.

## 12.4 Entity clarity

The website must consistently identify:

- public name: 42;
- trading name: Company42;
- production URL: `https://company42.co`;
- contact email: `hello@company42.co`;
- service areas: North America and EMEA;
- category: HubSpot consultancy;
- core services;
- real people associated with the organisation.

## 12.5 AI-discovery principles

The site should support AI-assisted discovery through:

- clear definitions;
- direct answers;
- descriptive headings;
- structured relationships between services, authors, and articles;
- visible dates;
- author expertise;
- source citations;
- coherent organisation information;
- consistent terminology;
- practical examples;
- no hidden or manipulative content.

## 12.6 FAQ usage

FAQ sections may be used where they answer genuine buyer questions.

Do not add repetitive FAQ blocks to every page merely for search purposes.

Each FAQ answer must be:

- accurate;
- concise;
- useful;
- visible to users;
- consistent with the page content.

## 12.7 Search promises

The site must not promise:

- first-place rankings;
- guaranteed indexing;
- guaranteed AI citation;
- guaranteed inbound leads;
- guaranteed HubSpot outcomes.

---

# 13. User experience and visual product requirements

## 13.1 Experience qualities

The site should feel:

- precise;
- calm;
- premium;
- modern;
- technically credible;
- easy to navigate;
- spacious without feeling empty;
- confident without being flashy.

## 13.2 Design principles

- Content clarity takes priority over visual novelty.
- Motion must support comprehension.
- Components must remain consistent.
- Service pages should feel related but not identical.
- Visual hierarchy must make scanning easy.
- Mobile is a first-class experience.
- The site should not feel like a generic template.
- Decorative elements must not reduce performance or accessibility.

## 13.3 Animation

Animation may be used for:

- page transitions;
- section reveals;
- hover feedback;
- subtle brand expression.

Animation must not:

- delay access to content;
- cause motion sickness;
- hide essential information;
- create major layout shift;
- interfere with keyboard use;
- run excessively on mobile;
- ignore reduced-motion preferences.

## 13.4 Photography

The long-term preference is real photography of the founder and team.

At launch:

- placeholders may be used in development;
- production must not show obviously unfinished frames;
- stock photography must not imply a false office, team, or client;
- all images should support the brand’s senior, technical, human positioning.

## 13.5 Team content

The design should support Thierry-Luc and up to five additional team profiles.

Until the real names, biographies, and images are supplied:

- do not invent profiles;
- do not publish fake names;
- do not publish fake job titles;
- use only confirmed team members;
- keep the layout capable of expansion.

## 13.6 Responsive requirements

The experience must work across:

- current desktop browsers;
- tablets;
- modern mobile devices;
- portrait and landscape orientations;
- touch and keyboard interaction.

No key content or CTA may depend exclusively on hover.

---

# 14. Accessibility, performance, and quality goals

These are product-level targets. Detailed implementation belongs in the engineering specification.

## 14.1 Accessibility target

The site **SHALL** meet WCAG 2.2 AA as the minimum product standard.

The target Lighthouse Accessibility score is **100**, but automated scoring does not replace manual testing.

Key requirements include:

- keyboard navigation;
- visible focus states;
- meaningful link and button labels;
- correct semantic landmarks;
- logical heading structure;
- adequate colour contrast;
- form labels and error handling;
- reduced-motion support;
- alt text for informative images;
- empty alt text for decorative images;
- no duplicate semantic content;
- accessible menus, accordions, and dialogs.

## 14.2 Performance target

Target Lighthouse Performance score: **95 or higher** on representative production pages under realistic mobile conditions.

Performance must not be achieved by removing meaningful content or accessibility features.

Product priorities:

- fast first meaningful render;
- stable layout;
- responsive interaction;
- optimised images;
- restrained third-party scripts;
- no unnecessary analytics at launch;
- self-hosted or framework-managed Inter font loading;
- no blocking external font dependency where avoidable.

## 14.3 SEO and best-practice targets

Target Lighthouse scores:

- SEO: **100**
- Accessibility: **100**
- Best Practices: **100**
- Performance: **95+**

These are release targets, not guarantees that every environment will always report the same score.

## 14.4 Quality expectations

The production site must have:

- no broken internal links;
- no browser-console errors during normal use;
- no visible hydration failures;
- no placeholder copy;
- no spelling errors in core pages;
- no accidental staging URL references;
- no duplicate H1 caused by component variants;
- no inaccessible navigation;
- no unusable form state.

---

# 15. Privacy, tracking, analytics, and cost constraints

## 15.1 Version 1 tracking position

The first launch should minimise cost and technical overhead.

The following are deferred until after go-live:

- Google Analytics 4;
- Google Tag Manager;
- Microsoft Clarity;
- HubSpot tracking code;
- advertising pixels;
- newsletter tracking;
- marketing automation;
- conversion attribution beyond the HubSpot form’s native behaviour.

## 15.2 Required future extension points

The application **SHOULD** make later tracking additions straightforward through configuration or isolated components.

Do not add dormant third-party scripts in production.

Do not add commented secrets, fake IDs, or placeholder tracking IDs.

## 15.3 Cookie banner

A cookie banner is not automatically required merely because one might be needed later.

Before launch, Codex must identify the actual storage and third-party requests produced by:

- the Next.js application;
- Render or future production hosting;
- the HubSpot embedded form;
- any embedded media;
- any externally hosted fonts.

The privacy implementation must reflect the actual result.

When analytics or marketing tracking is introduced, consent requirements must be reviewed and implemented before the new tracking goes live.

## 15.4 HubSpot form

The HubSpot form is the only planned CRM-related website functionality at launch.

Codex must ensure:

- correct portal/form reference;
- successful submission;
- clear consent wording;
- no accidental test portal configuration;
- no staging submission contamination where avoidable;
- no display of secrets in client code.

## 15.5 Cost principle

Version 1 should prefer:

- existing tools;
- free platform capabilities;
- native Next.js functionality;
- low-maintenance solutions;
- no unnecessary paid SEO plugins;
- no paid cookie platform unless required;
- no paid analytics tooling.

Cost reduction must not justify insecure, misleading, or legally inaccurate implementation.

---

# 16. Functional requirements summary

## 16.1 Mandatory launch functionality

The site **SHALL** provide:

- responsive global navigation;
- service navigation;
- Insight browsing;
- category pages;
- article pages;
- author attribution;
- related content;
- contact form;
- fallback contact email;
- Privacy and Terms pages;
- 404 page;
- production canonical domain;
- staging exclusion from search;
- working internal links;
- accessible interactive components.

## 16.2 Deferred functionality

The site **MAY** later provide:

- case studies;
- public Work page;
- newsletter;
- downloadable guides;
- webinar content;
- event registration;
- client portal;
- calculators or assessment tools;
- advanced site search;
- HubSpot Customer Agent;
- personalisation;
- multilingual content;
- industry-specific landing pages;
- interactive system diagrams;
- ROI tools.

---

# 17. Version 1 launch scope and acceptance criteria

## 17.1 Launch-critical content

The following must be complete:

- Home;
- Services overview;
- all published service pages;
- About;
- Insights index;
- all published category pages;
- all published articles;
- Contact;
- Privacy;
- Terms;
- footer;
- navigation;
- 404.

## 17.2 Launch-critical exclusions

The following must not be publicly visible unless completed:

- Work page;
- empty team cards;
- placeholder LinkedIn link;
- unapproved legal wording;
- lorem ipsum;
- unfinished article drafts;
- test pages;
- development notes;
- Render staging URLs;
- fake data;
- empty categories.

## 17.3 Product acceptance checklist

### Positioning

- [ ] Public brand is 42.
- [ ] Tagline is “Your HubSpot Answer”.
- [ ] The first viewport explains that 42 is a HubSpot consultancy.
- [ ] Mid-market focus is evident.
- [ ] North America and EMEA service areas are stated accurately.
- [ ] No false office location is shown.

### Content

- [ ] Master description is used consistently.
- [ ] Service pages are distinct.
- [ ] About principles appear once.
- [ ] All published Insights are complete.
- [ ] Category pages contain real content.
- [ ] Team information is factual.
- [ ] Work page is unpublished.

### Conversion

- [ ] Primary CTA is consistent.
- [ ] HubSpot form submits successfully.
- [ ] Confirmation state works.
- [ ] Error state works.
- [ ] `hello@company42.co` is visible and correct.

### Trust and legal

- [ ] Privacy page reflects actual technology.
- [ ] Terms identify the correct operating/contracting entity.
- [ ] No fake testimonials or client claims.
- [ ] No broken social links.
- [ ] Legal wording has been reviewed or explicitly accepted by the owner.

### Search and discovery

- [ ] Public pages have a clear topic.
- [ ] Production canonical is `https://company42.co`.
- [ ] Render staging is not indexable.
- [ ] No public placeholder pages are included.
- [ ] Insight relationships and categories are coherent.

### UX and quality

- [ ] Navigation works on mobile.
- [ ] Keyboard navigation works.
- [ ] Focus states are visible.
- [ ] Reduced motion is respected.
- [ ] Forms are accessible.
- [ ] No duplicated semantic sections.
- [ ] No broken links.
- [ ] No normal-use console errors.
- [ ] Lighthouse targets are met or deviations are documented.

### Tracking and cost

- [ ] No GA4 is loaded.
- [ ] No GTM is loaded.
- [ ] No Clarity is loaded.
- [ ] No advertising pixel is loaded.
- [ ] No HubSpot tracking code is loaded unless separately approved.
- [ ] HubSpot form is the only approved initial CRM embed.
- [ ] Future tracking hooks do not load dormant scripts.

---

# 18. Assumptions, constraints, and open decisions

Codex must not silently resolve the following items.

## 18.1 Contracting and legal identity

Supplied information:

- Public brand: 42
- Legal/trading name: Company42
- Contracting entity for Terms: MadeYourLookAgency
- Privacy country supplied: South Africa
- Terms country supplied: “America”
- Service areas: North America and EMEA

### Decision required before final legal publication

Confirm:

1. the exact registered legal name of MadeYourLookAgency;
2. its country/state of registration;
3. whether Company42 is a trading name of that entity;
4. the correct governing law;
5. the exact wording to identify the operator of the website.

Until confirmed, use explicit TODO markers in non-production legal drafts. Do not publish contradictory details.

## 18.2 Public base location

No street address should be published.

The public site may state that 42 serves North America and EMEA.

Do not state Palm Springs as a physical office unless a genuine office exists and is approved.

## 18.3 LinkedIn

The company LinkedIn profile does not yet exist.

Requirement:

- omit the production link until the URL is supplied;
- retain a configurable social-link field;
- do not publish an empty or fake URL.

## 18.4 Team profiles

The design should support six people, but only confirmed people may be published.

Required later:

- names;
- roles;
- biographies;
- images;
- LinkedIn URLs where applicable.

## 18.5 Legal review

Privacy and Terms content require review appropriate to the actual legal entity, service model, HubSpot form configuration, and target markets.

This PRD is not legal advice.

## 18.6 Hosting

The site is currently on Render for testing.

The final production hosting platform remains an implementation decision. Regardless of platform:

- `company42.co` is canonical;
- HTTPS is mandatory;
- staging must not be indexed;
- email DNS must not be disrupted.

---

# 19. Roadmap

## Phase 1 — Production-ready launch

### Objective

Launch a credible, fast, accessible, search-ready website at minimal ongoing cost.

### Scope

- final content review;
- Work page removal;
- About duplication fix;
- category pages;
- article improvements;
- contact-form verification;
- Privacy and Terms completion;
- production metadata;
- canonical domain;
- sitemap and robots behaviour;
- accessibility;
- performance;
- production deployment;
- staging search exclusion.

## Phase 2 — Measurement and baseline

### Objective

Understand how the live website is discovered and used.

### Scope

- Google Search Console;
- sitemap submission;
- index inspection;
- GA4;
- optional Google Tag Manager;
- conversion events;
- cookie consent where required;
- HubSpot tracking where approved;
- Microsoft Clarity;
- first performance and conversion baseline.

## Phase 3 — Authority

### Objective

Build proof and topical depth.

### Scope

- approved case studies;
- Work page relaunch;
- testimonials;
- expanded author profiles;
- stronger service-to-Insight linking;
- topic clusters;
- comparison and decision-support content;
- original implementation frameworks;
- verified outcomes.

## Phase 4 — Growth

### Objective

Increase qualified discovery and conversion.

### Scope

- content based on Search Console evidence;
- industry and use-case pages where justified;
- downloadable assets;
- interactive tools;
- improved conversion journeys;
- partnership content;
- external authority and backlinks;
- refined AI-discovery optimisation.

## Phase 5 — Productised knowledge platform

### Objective

Turn the site into a durable HubSpot knowledge and advisory platform.

Possible scope:

- advanced knowledge navigation;
- interactive implementation checklists;
- architecture templates;
- self-assessment tools;
- system-integration briefs;
- workshops or training resources;
- selected public utilities.

No future phase should be implemented simply because it appears in this roadmap. Each requires a validated business case.

---

# 20. Codex delivery protocol

## 20.1 Recommended implementation order

Codex should work in the following sequence.

### Batch 1 — Product alignment and content inventory

1. Map current routes to this PRD.
2. List deviations.
3. Identify incomplete pages.
4. identify duplicate content.
5. Confirm Work page is excluded.
6. Confirm all service pages.
7. Confirm all Insight routes and categories.
8. Produce a proposed change list before destructive edits.

### Batch 2 — Public content and information architecture

1. Implement final navigation.
2. Implement category pages.
3. Correct About duplication.
4. remove placeholder social links.
5. verify contact details.
6. align homepage messaging.
7. improve service-page consistency.
8. remove unfinished public content.

### Batch 3 — Conversion and legal readiness

1. Verify HubSpot form.
2. Add email fallback.
3. implement complete Privacy and Terms drafts using confirmed details.
4. verify form consent.
5. test success and error states.

### Batch 4 — Search and discovery readiness

1. Align page titles and descriptions.
2. ensure correct canonical domain.
3. exclude staging.
4. generate production sitemap.
5. configure production robots behaviour.
6. implement article, author, service, breadcrumb, and organisation relationships as defined by the engineering specification.
7. confirm no incomplete routes are indexable.

### Batch 5 — Accessibility and performance

1. Audit navigation.
2. audit headings.
3. audit forms.
4. audit focus.
5. audit contrast.
6. audit motion.
7. optimise images and fonts.
8. remove unnecessary scripts.
9. run automated and manual checks.
10. document exceptions.

### Batch 6 — Release candidate

1. production build;
2. broken-link check;
3. page-by-page review;
4. form test;
5. mobile review;
6. browser review;
7. staging-indexing check;
8. production-domain check;
9. final acceptance checklist;
10. release notes.

## 20.2 Change-report format

After each batch, Codex should report:

```text
Batch:
Objective:
Files changed:
Routes affected:
Requirements completed:
Requirements partially completed:
Open decisions:
Tests run:
Known limitations:
Recommended next batch:
```

## 20.3 Guardrails

Codex must not:

- rewrite the entire site without a reasoned migration plan;
- delete working content without recording it;
- change public URLs after launch without redirects;
- add analytics or tracking without approval;
- add paid dependencies without approval;
- fabricate legal text as definitive advice;
- add fake proof;
- publish development placeholders;
- expose secrets;
- introduce new brand colours or typography without reference to the design system;
- optimise only for Lighthouse while harming usability;
- overuse schema, FAQ blocks, or keyword repetition;
- treat the staging URL as canonical.

---

# Appendix A — Approved constants

```yaml
brand:
  public_name: "42"
  trading_name: "Company42"
  tagline: "Your HubSpot Answer"
  production_domain: "https://company42.co"
  contact_email: "hello@company42.co"
  language: "en-GB"

positioning:
  audience: "Mid-market organisations"
  service_areas:
    - "North America"
    - "EMEA"
  category: "Senior-led HubSpot consultancy"

homepage:
  h1: "Your HubSpot Answer"
  seo_title: "HubSpot Consultancy, CRM & Integrations | 42"
  meta_description: "42 is a senior-led HubSpot consultancy helping mid-market organisations simplify CRM, implement HubSpot, automate operations, and connect critical systems."

tracking_v1:
  google_analytics: false
  google_tag_manager: false
  microsoft_clarity: false
  hubspot_tracking_code: false
  advertising_pixels: false
  newsletter: false
  hubspot_form: true

public_routes_v1:
  work_page: false
  services: true
  about: true
  insights: true
  insight_categories: true
  contact: true
  privacy: true
  terms: true
```

---

# Appendix B — Master description variants

## Full

> 42 is a senior-led HubSpot consultancy helping mid-market organisations simplify complex CRM challenges. We combine CRM strategy, technical implementation, automation, integrations, website delivery, and ongoing optimisation to make HubSpot fit the way each business actually operates. We work with teams across North America and EMEA to create clear, maintainable systems that people can use and leaders can trust.

## Medium

> 42 helps mid-market organisations simplify complex CRM challenges through senior-led HubSpot strategy, implementation, automation, integrations, websites, and ongoing optimisation.

## Short

> Senior-led HubSpot consulting for complex CRM, automation, integration, and operational requirements.

## Footer

> 42 is a senior-led HubSpot consultancy serving mid-market organisations across North America and EMEA.

---

# Appendix C — Recommended launch CTA language

## Primary

- Book a consultation
- Start a conversation

Use one as the dominant site-wide CTA.

## Secondary

- Explore our services
- See how we can help
- Read our Insights
- Discuss your HubSpot requirements

## Avoid

- Get started now
- Transform your business today
- Unlock explosive growth
- Dominate HubSpot
- Guaranteed results
- Limited spaces remaining

---

# Appendix D — Definition of done

Version 1 is done when:

1. the public website accurately represents 42;
2. visitors understand the offer quickly;
3. all public pages are complete;
4. Work is not public;
5. the contact journey works;
6. Privacy and Terms are accurate enough for launch and approved by the owner;
7. the site is accessible and performant;
8. production uses `company42.co`;
9. staging is excluded from search;
10. no unapproved tracking is active;
11. the site can be extended after launch without structural rework;
12. Codex has produced a release report against this PRD.

---

**End of document**
