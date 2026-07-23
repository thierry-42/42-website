export const routeFoundations = {
  services: {
    path: "/services",
    eyebrow: "HubSpot services",
    title: "HubSpot expertise from strategy to working system.",
    description:
      "Whether HubSpot needs to be implemented, repaired, connected, expanded, or simply made easier to operate, 42 brings the strategic and technical capability to move from question to answer.",
  },
  work: {
    path: "/work",
    eyebrow: "Selected work",
    title: "HubSpot answers built around real business problems.",
    description:
      "Verified case studies will be published here once client details, outcomes, and permissions have been approved. No placeholder proof is shown publicly.",
  },
  about: {
    path: "/about",
    eyebrow: "About 42",
    title: "42 exists to make complex digital systems clearer.",
    description:
      "The best HubSpot work sits between strategy, operations, customer experience, data, and technology. 42 brings those disciplines together, then turns the answer into a system people can use.",
  },
  approach: {
    path: "/approach",
    eyebrow: "How 42 works",
    title: "From question to working answer.",
    description:
      "42 starts by understanding the goals, teams, processes, data, constraints, and current platform before designing and building the answer.",
  },
  audience: {
    path: "/audience",
    eyebrow: "Who 42 helps",
    title: "Built for growing teams with increasing process complexity.",
    description:
      "42 works with organisations that need HubSpot to connect customer data, commercial processes, service operations, websites, reporting, and the systems around them.",
  },
  industries: {
    path: "/industries",
    eyebrow: "Industries",
    title: "HubSpot shaped around the realities of your industry.",
    description:
      "Different sectors have different buying journeys, operating models, data requirements, and handovers. 42 designs the connected HubSpot system around those realities instead of forcing the business into a generic template.",
  },
  insights: {
    path: "/insights",
    eyebrow: "Insights",
    title: "Practical thinking for better HubSpot systems.",
    description:
      "Clear guidance on CRM architecture, operations, automation, integrations, websites, service, and the decisions behind good implementation. Articles will appear only after their copy and publication details are approved.",
  },
  review: {
    path: "/hubspot-review",
    eyebrow: "HubSpot portal review",
    title: "Find out what is holding your HubSpot portal back.",
    description:
      "Get a senior review of the structure, data, automation, reporting, adoption, and technical setup behind your portal, followed by a prioritised view of what to fix first.",
  },
  contact: {
    path: "/contact",
    eyebrow: "Start a conversation",
    title: "What question are you trying to answer?",
    description:
      "Tell 42 what is happening in your HubSpot portal, customer process, website, or connected systems. The first step is understanding the problem clearly.",
  },
  privacy: {
    path: "/privacy",
    eyebrow: "Legal",
    title: "Privacy Policy",
    description:
      "How 42 handles information submitted through this website and its HubSpot enquiry form. This draft requires owner and legal approval before production publication.",
  },
  terms: {
    path: "/terms",
    eyebrow: "Legal",
    title: "Terms of Use",
    description:
      "The draft terms that apply to use of the public 42 website. Consultancy engagements remain subject to separate written agreements.",
  },
} as const;

export type RouteFoundationKey = keyof typeof routeFoundations;

export const audienceProfiles = [
  "Growing B2B organisations",
  "Teams with increasing process complexity",
  "Companies already using HubSpot but underutilising it",
  "Companies moving from spreadsheets or legacy CRMs",
  "Businesses connecting HubSpot to operational systems",
  "Teams that value senior expertise and direct access",
] as const;

export const reviewAreas = [
  "CRM architecture",
  "Data quality",
  "Pipelines and lifecycle",
  "Workflows and automation",
  "Reporting",
  "Permissions and governance",
  "Integrations",
  "User adoption",
  "Service processes",
  "Website and forms",
] as const;

export const approachSteps = [
  {
    number: "01",
    title: "Understand",
    headline:
      "Map the goals, teams, processes, data, constraints, and current platform.",
    body: "The first step is to understand the business question, how work moves today, where trust breaks down, and what a useful answer needs to make possible.",
    outputs: [
      "Goals and measures of success",
      "Current process and ownership map",
      "Platform and data assessment",
      "Constraints, risks, and dependencies",
    ],
  },
  {
    number: "02",
    title: "Architect",
    headline:
      "Define the CRM model, system design, roadmap, responsibilities, and measures of success.",
    body: "The answer is translated into a coherent design for data, objects, pipelines, permissions, automation, integrations, reporting, and delivery.",
    outputs: [
      "Solution architecture",
      "CRM and data model",
      "Prioritised delivery roadmap",
      "Governance and responsibility model",
    ],
  },
  {
    number: "03",
    title: "Build",
    headline: "Configure, develop, integrate, migrate, test, and document.",
    body: "The work moves from recommendation to a functioning system through controlled configuration, development, migration, integration, and quality assurance.",
    outputs: [
      "Configured HubSpot platform",
      "Automation and integrations",
      "Tested migration and data controls",
      "Technical and operational documentation",
    ],
  },
  {
    number: "04",
    title: "Enable",
    headline:
      "Train users, launch the system, monitor adoption, and improve what comes next.",
    body: "A working answer needs confident users, clear ownership, useful documentation, and a practical route for the next round of improvement.",
    outputs: [
      "Role-based enablement",
      "Launch and handover",
      "Adoption and quality monitoring",
      "Prioritised improvement backlog",
    ],
  },
] as const;

export const audienceSectors = [
  {
    name: "Manufacturing and distribution",
    body: "Connect commercial activity to quoting, distribution, finance, ERP data, handovers, and the full customer record.",
    problem:
      "Long sales cycles, distributor relationships, product data, quoting, and operational handovers often span CRM, ERP, inboxes, and spreadsheets.",
    answer:
      "42 maps the commercial process, clarifies ownership, and connects HubSpot to the operational data needed for a dependable customer view.",
    needs: [
      "CRM architecture",
      "ERP integration",
      "Quote processes",
      "Reporting",
    ],
    serviceSlugs: [
      "hubspot-strategy-consulting",
      "crm-revops",
      "integrations-custom-development",
    ],
  },
  {
    name: "SaaS and technology",
    body: "Align acquisition, sales, onboarding, product signals, renewals, service, and expansion around dependable lifecycle data.",
    problem:
      "Growth teams need lifecycle stages, lead routing, product or usage signals, customer handovers, and revenue reporting to tell the same story.",
    answer:
      "42 aligns the CRM model, automation, integrations, and reporting around the complete customer lifecycle rather than isolated funnel stages.",
    needs: [
      "Lifecycle design",
      "Automation",
      "Customer data",
      "Revenue reporting",
    ],
    serviceSlugs: [
      "implementation-onboarding",
      "automation-operations",
      "crm-revops",
    ],
  },
  {
    name: "Professional services",
    body: "Create clearer ownership from enquiry and qualification through proposals, delivery handover, relationship management, and follow-up.",
    problem:
      "Enquiries, qualification, proposals, delivery handovers, and relationship management can lose context as work moves between people and tools.",
    answer:
      "42 structures pipelines, handover workflows, and reporting so commercial and delivery teams can see what is moving, who owns it, and what happens next.",
    needs: [
      "Pipeline design",
      "Lead routing",
      "Handover workflows",
      "Governance",
    ],
    serviceSlugs: [
      "crm-revops",
      "automation-operations",
      "managed-hubspot-support",
    ],
  },
  {
    name: "Education and training",
    body: "Bring learner enquiries, admissions, programme communication, operational handovers, and service interactions into a coherent journey.",
    problem:
      "Learner enquiries, admissions, programme communication, support requests, and reporting frequently sit across disconnected systems and teams.",
    answer:
      "42 designs clearer enquiry and enrolment journeys, connects the relevant data, and gives teams practical automation and lifecycle visibility.",
    needs: ["Journey architecture", "Forms", "Automation", "Service processes"],
    serviceSlugs: [
      "websites-content-hub",
      "automation-operations",
      "service-hub-customer-experience",
    ],
  },
  {
    name: "Energy and technical services",
    body: "Connect long sales cycles, technical stakeholders, project handovers, field or service processes, and operational systems.",
    problem:
      "Technical sales, project qualification, field activity, service requests, and operational systems create a customer journey with many owners and dependencies.",
    answer:
      "42 connects the commercial and service context, builds the right handovers, and integrates the systems that need to exchange reliable data.",
    needs: ["Complex pipelines", "Integrations", "Service Hub", "Data quality"],
    serviceSlugs: [
      "hubspot-strategy-consulting",
      "integrations-custom-development",
      "service-hub-customer-experience",
    ],
  },
  {
    name: "E-commerce and product businesses",
    body: "Connect commerce, customer service, marketing, lifecycle communication, product data, and reporting without fragmenting the customer view.",
    problem:
      "Customer, order, payment, product, marketing, and service data often live in separate platforms, making segmentation and lifecycle reporting difficult to trust.",
    answer:
      "42 designs the data flows and customer model that let HubSpot support useful communication, service context, and reporting without becoming another silo.",
    needs: [
      "Commerce integration",
      "Customer service",
      "Segmentation",
      "Reporting",
    ],
    serviceSlugs: [
      "integrations-custom-development",
      "automation-operations",
      "service-hub-customer-experience",
    ],
  },
] as const;

export const industrySignals = [
  "Customer journeys that cross teams and systems",
  "Data that needs clear ownership and definitions",
  "Operational handovers that cannot depend on memory",
  "Reporting that must reflect how the business really works",
] as const;

export const audienceRoles = [
  "Founder or managing director",
  "Head of sales",
  "Head of marketing",
  "Revenue operations leader",
  "Operations director",
  "Customer success or service leader",
  "CRM or digital transformation lead",
  "Finance or IT stakeholder",
] as const;

export const serviceNarratives = {
  "hubspot-strategy-consulting": {
    whoFor: [
      "Mid-market leaders planning a new HubSpot investment or major change",
      "CRM, RevOps, marketing, sales, operations, and IT owners who need one coherent roadmap",
    ],
    typicalProblems: [
      "The platform decision is being made before the operating model is clear",
      "Teams have competing definitions, priorities, or ownership",
      "The delivery backlog lacks an agreed architecture and sequence",
    ],
    problemTitle: "The build is moving faster than the decisions behind it.",
    problemBody:
      "When goals, ownership, process, data, and platform constraints are unclear, every configuration choice creates another dependency. Strategy makes the answer explicit before effort is committed.",
    expectedOutcomes: [
      "A shared definition of the business problem",
      "A coherent solution and data architecture",
      "A prioritised roadmap with clear dependencies",
      "Governance that keeps future decisions consistent",
    ],
    approach:
      "Start with discovery, evidence, and decision mapping. Turn the findings into an architecture and prioritised roadmap before configuration or development begins.",
  },
  "implementation-onboarding": {
    whoFor: [
      "Mid-market organisations implementing HubSpot for the first time",
      "Teams replacing spreadsheets, a legacy CRM, or an under-designed portal",
    ],
    typicalProblems: [
      "Default onboarding does not represent the real customer process",
      "Migration, permissions, automation, reporting, and adoption are being planned separately",
      "Launch scope is growing without clear acceptance criteria",
    ],
    problemTitle:
      "A default setup cannot represent a specific operating model.",
    problemBody:
      "Implementation needs to connect customer journeys, data, ownership, permissions, automation, migration, testing, and adoption rather than simply switch HubSpot features on.",
    expectedOutcomes: [
      "A portal structured around real teams and processes",
      "A controlled migration and launch plan",
      "Tested automation, permissions, and reporting",
      "Documentation and enablement for confident adoption",
    ],
    approach:
      "Design the portal, migration, controls, test plan, and launch as one programme. Build in stages, validate with real users, and hand over clear documentation.",
  },
  "crm-revops": {
    whoFor: [
      "Revenue and operations teams that cannot rely on the CRM view",
      "Mid-market organisations standardising lifecycle, pipeline, ownership, and reporting",
    ],
    typicalProblems: [
      "Customer data and commercial definitions vary between teams",
      "Routing and handovers depend on manual knowledge",
      "Dashboards look complete but do not answer operational questions",
    ],
    problemTitle:
      "The CRM stores activity but cannot answer commercial questions.",
    problemBody:
      "Inconsistent data, unclear ownership, disconnected pipelines, and competing definitions make reporting difficult to trust and revenue processes harder to manage.",
    expectedOutcomes: [
      "A clear customer and revenue data model",
      "Defined ownership across the lifecycle",
      "Usable pipelines, routing, and quality controls",
      "Reporting built on consistent definitions",
    ],
    approach:
      "Trace the questions the business needs to answer back to data, ownership, and process rules. Rebuild the model in a controlled sequence so reporting rests on dependable operations.",
  },
  "automation-operations": {
    whoFor: [
      "Teams with repetitive handovers, routing, administration, or service work",
      "Portal owners inheriting overlapping or difficult-to-maintain workflows",
    ],
    typicalProblems: [
      "Workflow logic is undocumented or duplicated",
      "Poor data triggers unpredictable automation",
      "Exceptions and failure states have no clear owner",
    ],
    problemTitle: "Automation has become another source of operational risk.",
    problemBody:
      "Workflows that overlap, depend on poor data, or lack clear ownership can hide errors and make simple changes unpredictable. Good automation stays legible and controlled.",
    expectedOutcomes: [
      "A documented workflow architecture",
      "Clear triggers, safeguards, and ownership",
      "Less repetitive work across teams",
      "Automation that remains understandable as it grows",
    ],
    approach:
      "Audit the current logic, define ownership and safeguards, then simplify before adding new automation. Test normal, exceptional, and failure paths before release.",
  },
  "integrations-custom-development": {
    whoFor: [
      "Mid-market organisations connecting HubSpot to operational, finance, ERP, or product systems",
      "Teams whose required data model or workflow exceeds a native connector",
    ],
    typicalProblems: [
      "Systems disagree about source ownership and record identity",
      "Native synchronisation cannot support the required timing or validation",
      "Integration errors are difficult to detect, explain, or recover",
    ],
    problemTitle:
      "The customer process crosses systems that were never designed together.",
    problemBody:
      "Native connectors are useful until the data model, timing, validation, or operational process becomes specific. The right integration begins with the system contract, not an API call.",
    expectedOutcomes: [
      "A documented integration and data architecture",
      "Clear ownership of source and destination data",
      "Dependable synchronisation and error handling",
      "Custom functionality where native tools stop fitting",
    ],
    approach:
      "Define the system contract, mappings, volumes, timing, controls, and recovery behaviour first. Build and test against explicit acceptance criteria rather than a vague instruction to connect two tools.",
  },
  "websites-content-hub": {
    whoFor: [
      "Mid-market teams redesigning a website around HubSpot and lead capture",
      "Organisations that need Content Hub, CRM, forms, content operations, and reporting to work together",
    ],
    typicalProblems: [
      "The website and CRM are planned as separate systems",
      "Forms capture data without a clear follow-up or consent model",
      "Page production is slow, inconsistent, or difficult to govern",
    ],
    problemTitle:
      "The website is publishing content but operating outside the customer system.",
    problemBody:
      "A HubSpot website should connect content, forms, journeys, CRM data, personalisation, reporting, and the operational follow-up behind every conversion.",
    expectedOutcomes: [
      "A conversion and content architecture",
      "Reusable, accessible page and module systems",
      "Forms and journeys connected to CRM operations",
      "Performance, technical SEO, and reporting foundations",
    ],
    approach:
      "Map content, conversion, consent, data, and operational follow-up before finalising the page system. Build reusable components with accessibility, performance, and governance designed in.",
  },
  "service-hub-customer-experience": {
    whoFor: [
      "Service leaders bringing support activity into the customer record",
      "Teams replacing shared inboxes or inconsistent ticket processes with Service Hub",
    ],
    typicalProblems: [
      "Tickets, inboxes, knowledge, and CRM context are disconnected",
      "Routing, escalation, and service ownership vary by person",
      "Service reporting does not reflect the work customers experience",
    ],
    problemTitle:
      "Service teams are working without the full customer context.",
    problemBody:
      "Disconnected inboxes, ticket processes, knowledge, routing, and reporting make support harder to manage and separate service activity from the customer record.",
    expectedOutcomes: [
      "A clear service operating model",
      "Structured ticketing, routing, and ownership",
      "Connected knowledge and customer context",
      "Reporting that makes service performance visible",
    ],
    approach:
      "Design the service operating model, ticket structure, routing, escalation, knowledge, and reporting together. Validate the model with the people handling real customer work.",
  },
  "managed-hubspot-support": {
    whoFor: [
      "Mid-market teams that need senior HubSpot capacity without another full-time hire",
      "Portal owners with a growing improvement backlog and multiple specialist needs",
    ],
    typicalProblems: [
      "Important portal work competes with daily operational demand",
      "Changes are delivered without a visible backlog or decision record",
      "The internal team needs reliable access to consulting and technical specialists",
    ],
    problemTitle:
      "The portal needs steady improvement, but the internal backlog keeps growing.",
    problemBody:
      "Managed support adds senior capacity for prioritisation, administration, troubleshooting, optimisation, enablement, and technical delivery without creating another disconnected workstream.",
    expectedOutcomes: [
      "A visible, prioritised improvement backlog",
      "Reliable portal administration and troubleshooting",
      "Continuous optimisation with documented decisions",
      "Flexible specialist capacity around the internal team",
    ],
    approach:
      "Maintain one prioritised backlog, make ownership visible, and deliver improvements in reviewable increments. Document decisions and revisit priorities with the internal owner on a regular cadence.",
  },
} as const;
