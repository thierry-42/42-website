export type InsightSource = {
  publisher: "HubSpot" | "W3C";
  title: string;
  url: string;
};

export type InsightSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  steps?: { title: string; body: string }[];
  note?: string;
};

export type InsightBody = {
  quickAnswer: string;
  introduction: string[];
  sections: InsightSection[];
  conclusion: string;
  sources: InsightSource[];
};

export const insightBodies: Record<string, InsightBody> = {
  "signs-your-hubspot-portal-needs-an-audit": {
    quickAnswer:
      "Your portal probably needs an audit when teams no longer trust the data, ordinary changes feel risky, reporting needs repeated explanation, or nobody can describe how records, properties, automation, integrations, and permissions fit together. An audit should diagnose the operating system—not simply produce a list of untidy assets.",
    introduction: [
      "A HubSpot portal rarely becomes difficult because of one dramatic failure. More often, small decisions accumulate: a field created for one campaign, a workflow copied for a new region, a pipeline stage used differently by two teams, or an integration that quietly overwrites values. Each choice may have been reasonable in isolation. Together, they make the system hard to trust.",
      "The right time for an audit is before that uncertainty turns into a failed migration, a broken handover, or a reporting dispute. The signals below help distinguish a local issue from a structural one.",
    ],
    sections: [
      {
        id: "trust-and-adoption",
        title: "1. People keep their own version of the truth",
        paragraphs: [
          "The strongest warning sign is behavioural. If sales keeps a shadow spreadsheet, service stores critical context in inboxes, or marketing exports data before every analysis, the CRM is no longer the dependable place where work happens.",
          "Low adoption is not always a training problem. It can be a rational response to irrelevant fields, unclear ownership, duplicate records, slow processes, or automation that changes values without explanation. An audit should compare the configured system with the real work, not blame users for working around it.",
        ],
        bullets: [
          "Teams reconcile HubSpot with spreadsheets before meetings.",
          "Owners, lifecycle stages, or deal stages are frequently blank or disputed.",
          "Users avoid updating records because they do not know what automation will run.",
          "Different teams use the same property or stage to mean different things.",
        ],
      },
      {
        id: "data-model",
        title: "2. The data model has become difficult to explain",
        paragraphs: [
          "Properties are cheap to create and expensive to govern. Similar names, overlapping purposes, inconsistent field types, and abandoned imports can make even simple segmentation unreliable. Duplicate records add a different problem: the same customer can carry conflicting owners, consent, activity, and lifecycle information.",
          "HubSpot can surface potential duplicate contact and company records, but the available tooling and bulk controls depend on subscription and permissions. That is useful operationally, but it does not replace decisions about canonical identifiers, merge rules, and which source is allowed to update a value.",
        ],
        bullets: [
          "Several properties appear to capture the same business concept.",
          "Internal property names no longer match their visible labels or purpose.",
          "Required reporting fields have low completion or inconsistent formats.",
          "Imports and integrations create new records instead of updating existing ones.",
        ],
      },
      {
        id: "automation",
        title: "3. Automation is hard to change safely",
        paragraphs: [
          "A healthy portal has automation that can be traced from trigger to outcome. When workflows have unclear names, overlapping enrolment criteria, long chains of branches, or no accountable owner, ordinary improvements start to feel dangerous.",
          "The audit should map what writes to important properties, which workflows can re-enrol records, how failures are reviewed, and what happens when an integration or user changes the same value. Property history and change sources are especially useful when a field appears to change by itself.",
        ],
      },
      {
        id: "reporting",
        title: "4. Dashboards look polished but decisions still stall",
        paragraphs: [
          "A report can be technically correct and still answer the wrong question. Problems often begin upstream: inconsistent stage definitions, missing associations, unsuitable date fields, excluded records, or multiple data sources joined in a way that changes the count.",
          "If every dashboard requires a verbal caveat, the portal needs more than report formatting. An audit should trace important metrics back to the operating definition, source property, responsible team, and process that creates the data.",
        ],
      },
      {
        id: "governance",
        title: "5. Access and ownership have grown by accident",
        paragraphs: [
          "Permissions, seats, teams, connected apps, and administrative access should reflect current responsibilities. They often do not. Former project users remain administrators, imports are available too widely, or nobody owns a critical integration token.",
          "HubSpot permissions can control who views, edits, creates, deletes, imports, or exports records. The audit question is whether those controls have been deliberately designed and reviewed—not whether the portal has any permissions at all.",
        ],
      },
      {
        id: "audit-output",
        title: "What a useful portal audit should produce",
        paragraphs: [
          "A useful audit converts findings into decisions. It should not overwhelm the business with an unranked asset inventory or silently change production while discovery is still underway.",
        ],
        steps: [
          {
            title: "A current-state map",
            body: "The important objects, properties, pipelines, workflows, reports, integrations, permissions, and ownership relationships.",
          },
          {
            title: "Evidence-based findings",
            body: "Specific problems tied to business impact, affected users, and the evidence used to reach the conclusion.",
          },
          {
            title: "Prioritised recommendations",
            body: "Immediate risks, high-value improvements, dependencies, and items that should intentionally remain unchanged.",
          },
          {
            title: "A sequenced roadmap",
            body: "A realistic order of work with owners, validation steps, change controls, and success measures.",
          },
        ],
        note: "Do not begin a large cleanup without exports, dependency checks, agreed merge rules, and a rollback approach. Tidier is not automatically safer.",
      },
    ],
    conclusion:
      "The purpose of an audit is not to prove that a portal is messy. It is to restore a shared understanding of how the system supports the business, where it creates risk, and what to improve first.",
    sources: [
      {
        publisher: "HubSpot",
        title: "Review and manage duplicate records",
        url: "https://knowledge.hubspot.com/records/manage-duplicate-records",
      },
      {
        publisher: "HubSpot",
        title: "View a record's property history",
        url: "https://knowledge.hubspot.com/records/view-record-property-history",
      },
      {
        publisher: "HubSpot",
        title: "HubSpot user permissions guide",
        url: "https://knowledge.hubspot.com/user-management/hubspot-user-permissions-guide",
      },
    ],
  },
  "prepare-for-hubspot-crm-implementation": {
    quickAnswer:
      "Prepare for a HubSpot CRM implementation by agreeing the business outcomes, mapping the customer and internal processes, defining the data model and ownership rules, cleaning the migration data, designing permissions, and planning adoption before configuration starts. The build should express those decisions—not be the place where the business first discovers them.",
    introduction: [
      "Implementation is often described as a software setup. In practice, it is an operating-model project with software at the centre. HubSpot can provide objects, pipelines, lifecycle stages, automation, permissions, and reports; it cannot decide how your teams should qualify demand, hand over work, or govern customer data.",
      "The preparation phase reduces rework because it separates business decisions from button clicks. It also gives the implementation team something testable to build against.",
    ],
    sections: [
      {
        id: "outcomes",
        title: "1. Define the outcome and the boundary",
        paragraphs: [
          "Start with the decisions and behaviours the CRM must improve. ‘Implement HubSpot’ is not an outcome. ‘Give sales one qualified pipeline, route new enquiries within an agreed window, and report conversion from accepted lead to closed revenue’ is much closer.",
          "Define what the first release includes and what it deliberately postpones. List the teams, regions, products, pipelines, integrations, and historical data in scope. A clear boundary protects the launch from becoming an attempt to solve every process at once.",
        ],
        bullets: [
          "Which decisions must become easier after launch?",
          "Which manual handovers should disappear or become visible?",
          "Which teams must use the system on day one?",
          "Which outcomes will prove that the implementation works?",
        ],
      },
      {
        id: "process",
        title: "2. Map the real process before designing fields",
        paragraphs: [
          "Interview the people doing the work and follow real examples from first interaction to sale, onboarding, support, and renewal. Capture entry criteria, exit criteria, ownership, exceptions, service levels, and the information required at each transition.",
          "Lifecycle stages and pipeline stages solve different problems. Lifecycle stages describe a broad customer relationship; pipeline stages describe progress through a specific process. Agreeing that distinction early prevents reporting and automation from carrying contradictory meanings.",
        ],
      },
      {
        id: "data",
        title: "3. Design the data model and migration rules",
        paragraphs: [
          "List the records you need—contacts, companies, deals, tickets, products, activities, and any justified custom objects—then define the associations that make them useful. For each important field, document its purpose, format, allowed values, owner, source, and whether users or automation may update it.",
          "Clean source data before migration. Decide which identifier updates an existing record, which system wins when values conflict, how duplicates are handled, and how historical activity will be treated. HubSpot imports require the appropriate import and object edit permissions, and record IDs or unique-value properties can be used to update and deduplicate supported records.",
        ],
        note: "Run a representative test migration before the final cutover. Record counts alone are not enough—validate associations, values, ownership, dates, and downstream automation.",
      },
      {
        id: "access",
        title: "4. Design seats, teams, permissions, and governance",
        paragraphs: [
          "Create a role matrix before adding users. Define who needs to view, create, edit, delete, import, export, publish, configure automation, and administer the account. Apply least privilege without making routine work impossible.",
          "Name accountable owners for the CRM, data model, integrations, reporting definitions, and change requests. Governance does not need to be bureaucratic; it needs to make the next change understandable and reversible.",
        ],
      },
      {
        id: "build-plan",
        title: "5. Turn the design into a testable build plan",
        paragraphs: [
          "Translate the process maps into configuration stories with acceptance criteria. A story should describe the trigger, the intended behaviour, the data created or changed, who can see it, and how it will be tested.",
        ],
        steps: [
          {
            title: "Prototype",
            body: "Validate the data model, pipeline logic, and key user journeys with a small group before scaling the build.",
          },
          {
            title: "Configure",
            body: "Build in controlled increments with naming standards, documentation, and peer review for high-risk automation.",
          },
          {
            title: "Test",
            body: "Use real scenarios, negative cases, permission checks, integration failures, and reporting reconciliations—not only happy paths.",
          },
          {
            title: "Cut over",
            body: "Freeze source changes where necessary, run the final migration, reconcile totals, and document exceptions.",
          },
        ],
      },
      {
        id: "adoption",
        title: "6. Plan adoption as part of the implementation",
        paragraphs: [
          "Training should be role-based and close to launch. Sales needs to know how the CRM supports selling; service needs to know how handovers and tickets work; managers need to understand the definitions behind their dashboards.",
          "Create concise operating guides, office hours, a support route, and a prioritised backlog for post-launch learning. Measure adoption through meaningful behaviours—timely updates, stage quality, completed required data, and successful handovers—not just login counts.",
        ],
      },
    ],
    conclusion:
      "A prepared implementation is faster because the difficult decisions have owners. HubSpot then becomes a clear expression of the operating model, rather than a collection of features looking for a process.",
    sources: [
      {
        publisher: "HubSpot",
        title: "Import records for a single object",
        url: "https://knowledge.hubspot.com/import-and-export/import-records-for-a-single-object",
      },
      {
        publisher: "HubSpot",
        title: "Deduplicate records in HubSpot",
        url: "https://knowledge.hubspot.com/records/deduplication-of-records",
      },
      {
        publisher: "HubSpot",
        title: "Use lifecycle stages",
        url: "https://knowledge.hubspot.com/records/use-lifecycle-stages",
      },
      {
        publisher: "HubSpot",
        title: "HubSpot user permissions guide",
        url: "https://knowledge.hubspot.com/user-management/hubspot-user-permissions-guide",
      },
    ],
  },
  "before-connecting-your-website-to-hubspot": {
    quickAnswer:
      "Before connecting a website to HubSpot, decide exactly what will be tracked and captured, verify the correct account and domains, choose the form approach, map fields and lifecycle behaviour, configure consent with legal input, protect the implementation through a tag manager or controlled deployment, and test end-to-end in a clean browser session.",
    introduction: [
      "Adding a tracking script is easy. Creating trustworthy website-to-CRM data is not. A connection can affect analytics, contact creation, attribution, forms, chat, consent, automation, and reporting, so the work needs an agreed design and a test plan.",
      "This checklist is for externally hosted websites. HubSpot-hosted pages include the account tracking code automatically, while external pages require deliberate installation.",
    ],
    sections: [
      {
        id: "purpose",
        title: "1. Decide what the connection is meant to do",
        paragraphs: [
          "Write down the required outcomes before touching production: traffic analytics, HubSpot forms, non-HubSpot form capture, chat, campaign attribution, behavioural events, consent management, or all of the above. Each outcome has different dependencies.",
          "The HubSpot tracking code associates an external site with an account and enables page and visitor tracking. It does not create forms by itself. If the code is absent, features that depend on it—including overall site tracking and some embedded experiences—will not work on that page.",
        ],
      },
      {
        id: "account-domain",
        title: "2. Verify the account, domains, and deployment method",
        paragraphs: [
          "Confirm the HubSpot account ID, production domain, subdomains, country or language paths, staging domains, and who controls the website release. Entire domains hosted outside HubSpot should also be added in HubSpot settings as required by the chosen tools.",
          "Install through one controlled route. If the code is hard-coded and also deployed through a tag manager or plugin, the site can fire it twice. Keep a record of where it is installed and exclude non-production environments from production reporting where appropriate.",
        ],
        bullets: [
          "Confirm the script uses the intended HubSpot account.",
          "List every template and subdomain that must include it.",
          "Decide how single-page application route changes will be tracked.",
          "Prevent duplicate installation and accidental staging traffic.",
        ],
      },
      {
        id: "forms",
        title: "3. Choose the form and field strategy",
        paragraphs: [
          "An embedded HubSpot form submits directly to HubSpot. A supported non-HubSpot form may be detected when the tracking code and non-HubSpot form capture are enabled, but that approach should be tested against the actual form implementation. A custom experience may need the Forms API or a server-side integration.",
          "Map each visible and hidden field to an intentional CRM property. Define the subscription or lawful-basis fields, campaign context, page context, owner or routing inputs, and the automation that follows. Avoid creating new properties simply because the website uses different labels.",
        ],
      },
      {
        id: "privacy",
        title: "4. Design consent and privacy behaviour",
        paragraphs: [
          "Cookie and communication consent are related but not identical. Decide which cookies and scripts may run before consent, what the banner covers, how preferences can be reopened, and what notice appears on each form. Ask legal counsel to confirm the approach for the jurisdictions and data involved.",
          "HubSpot's consent banner can work on external pages with the tracking code and can block cookies from supported HubSpot integrations. HubSpot explicitly notes that it cannot automatically block arbitrary scripts manually placed on the page. Those scripts need their own consent-aware implementation.",
        ],
        note: "This is an implementation checklist, not legal advice. Your legal team should approve the privacy notice, consent language, retention rules, and regional behaviour.",
      },
      {
        id: "testing",
        title: "5. Test the complete journey, not just the script",
        paragraphs: [
          "Use a new incognito session with browser extensions disabled where possible. Test consent choices, page views, a first-time submission, a returning visitor, an existing contact, validation errors, duplicate behaviour, hidden fields, routing, notifications, workflow enrolment, thank-you states, and reporting attribution.",
        ],
        steps: [
          {
            title: "Browser",
            body: "Confirm no duplicate network requests, blocked resources, JavaScript errors, layout shifts, or performance regressions.",
          },
          {
            title: "CRM",
            body: "Confirm the correct record is created or updated with expected values, source, consent, associations, and activity.",
          },
          {
            title: "Operations",
            body: "Confirm owners, tasks, notifications, workflows, and service-level timers behave as designed.",
          },
          {
            title: "Analytics",
            body: "Confirm pages and submissions appear in the intended account and reconcile with a controlled test set.",
          },
        ],
      },
      {
        id: "ownership",
        title: "6. Document ownership before launch",
        paragraphs: [
          "Name the owner of the website code, HubSpot configuration, consent implementation, forms, and post-launch monitoring. Record the account ID, deployment location, field map, test cases, and rollback process. The connection is infrastructure and should be maintained like infrastructure.",
        ],
      },
    ],
    conclusion:
      "A successful connection is not one where the tracking code appears in the source. It is one where a real visitor journey produces accurate, consent-aware, actionable CRM data without introducing avoidable risk.",
    sources: [
      {
        publisher: "HubSpot",
        title: "Install the HubSpot tracking code",
        url: "https://knowledge.hubspot.com/reports/install-the-hubspot-tracking-code",
      },
      {
        publisher: "HubSpot",
        title: "Style and embed HubSpot forms on an external site",
        url: "https://knowledge.hubspot.com/forms/set-up-and-style-your-form-on-an-external-site",
      },
      {
        publisher: "HubSpot",
        title: "Set up cookie tracking settings and consent banners",
        url: "https://knowledge.hubspot.com/privacy-and-consent/set-up-a-consent-banner-with-the-new-editor",
      },
    ],
  },
  "why-your-crm-reports-are-not-reliable": {
    quickAnswer:
      "CRM reports become unreliable when the business definition, underlying data, record associations, date logic, filters, and user behaviour do not agree. Fix reliability by defining the metric first, tracing every field to its source, testing the report against a known record set, and assigning ownership for the process that creates the data.",
    introduction: [
      "When two dashboards disagree, the natural reaction is to rebuild the chart. The chart is often the least important part. Reporting quality is the visible result of data architecture and operational discipline upstream.",
      "The practical question is not whether HubSpot can draw the report. It is whether the records included, excluded, grouped, and counted genuinely represent the business question.",
    ],
    sections: [
      {
        id: "definition",
        title: "1. The metric has no shared definition",
        paragraphs: [
          "Terms such as lead, qualified, pipeline, conversion, active customer, and revenue sound obvious until teams compare their definitions. A dashboard cannot resolve that disagreement. Document the event, record type, field, date, exclusions, currency treatment, and owner behind each important metric.",
          "A good metric definition can be tested on an individual record. If nobody can explain why a particular deal is included, the aggregate is not ready for executive use.",
        ],
      },
      {
        id: "source",
        title: "2. The report starts from the wrong data source",
        paragraphs: [
          "In the custom report builder, the primary data source determines the focus of the report and how related sources are joined. With multiple sources, records can be excluded or counted more than once because of their associations and filters.",
          "Choose the grain of the question first: one row per contact, company, deal, ticket, activity, or something else. Then confirm the data-source join matches that grain. Do not add sources merely because they contain an interesting field.",
        ],
      },
      {
        id: "quality",
        title: "3. The required fields are incomplete or unstable",
        paragraphs: [
          "A report based on owner, source, stage, amount, product, or region is only as reliable as the process that sets those properties. Blank values, free-text alternatives, retroactive edits, and automation conflicts quietly change the result.",
          "Use property history and change sources to investigate unexpected updates. HubSpot can show when a value changed and whether the source was a user, import, workflow, integration, or another process. That evidence helps fix the cause instead of patching the report.",
        ],
      },
      {
        id: "dates-filters",
        title: "4. Date logic and filters are answering a different question",
        paragraphs: [
          "Create date, close date, stage-entry date, activity date, and campaign date are not interchangeable. A report about deals created this quarter is different from revenue closed this quarter. Relative dates, fiscal calendars, time zones, and reopened records can add further differences.",
          "Dashboard filters are combined with report-level filters, and they only affect reports using compatible data sources. Review the final filter stack rather than assuming a dashboard control overrides the report beneath it.",
        ],
      },
      {
        id: "operations",
        title: "5. The operating process does not create the data on time",
        paragraphs: [
          "If teams update stages before a forecast meeting, the dashboard is a periodic survey—not a live operating view. If handovers happen in email, HubSpot cannot report them. Reporting reliability therefore needs process design, required information at the right moment, and managers who use the same system in their routines.",
        ],
      },
      {
        id: "repair",
        title: "A practical reliability test",
        paragraphs: [
          "Pick one important report and test it deeply before attempting a dashboard-wide redesign.",
        ],
        steps: [
          {
            title: "Write the definition",
            body: "Describe the business question, grain, inclusion rules, exclusions, date, and expected output without referring to the chart.",
          },
          {
            title: "Build a known sample",
            body: "Select a small set of records whose expected inclusion and values can be checked manually.",
          },
          {
            title: "Trace each field",
            body: "Identify its source, format, owner, update paths, completion rate, and historical behaviour.",
          },
          {
            title: "Reconcile and monitor",
            body: "Explain every difference, record the accepted logic, and add a recurring data-quality check.",
          },
        ],
      },
    ],
    conclusion:
      "Trustworthy reporting is a chain of definitions, data, process, and configuration. Strengthen that chain and the dashboard becomes simpler—because it no longer has to disguise uncertainty.",
    sources: [
      {
        publisher: "HubSpot",
        title: "Understand the custom report builder",
        url: "https://knowledge.hubspot.com/reports/understand-the-custom-report-builder",
      },
      {
        publisher: "HubSpot",
        title: "Create reports with the custom report builder",
        url: "https://knowledge.hubspot.com/reports/create-reports-with-the-custom-report-builder",
      },
      {
        publisher: "HubSpot",
        title: "Use dashboard filters",
        url: "https://knowledge.hubspot.com/dashboards/use-dashboard-filters",
      },
      {
        publisher: "HubSpot",
        title: "View a record's property history",
        url: "https://knowledge.hubspot.com/records/view-record-property-history",
      },
    ],
  },
  "what-to-include-in-a-custom-integration-brief": {
    quickAnswer:
      "A custom integration brief should define the business outcome, systems and environments, record ownership, field and association mappings, trigger and timing rules, authentication and permissions, volume, error handling, reconciliation, privacy, monitoring, support, acceptance tests, and explicit out-of-scope items.",
    introduction: [
      "‘Connect HubSpot to our other system’ is a request, not a specification. Two teams can hear that sentence and imagine different records, directions, timing, security, and failure behaviour.",
      "The brief does not need to prescribe every technical implementation. It needs to make the intended behaviour and constraints clear enough for an architect to evaluate options, estimate responsibly, and test the finished integration.",
    ],
    sections: [
      {
        id: "outcome-scope",
        title: "1. Outcome, users, and scope",
        paragraphs: [
          "Explain the operational problem, the people affected, and the decision or handover the integration should improve. Name both systems, the relevant products or editions, production and test environments, and the objects in scope.",
        ],
        bullets: [
          "What should happen without manual re-entry?",
          "Who needs to see or act on the resulting data?",
          "What is the required first release?",
          "What is explicitly excluded?",
        ],
      },
      {
        id: "ownership-mapping",
        title: "2. System of record and mapping rules",
        paragraphs: [
          "For every object and important field, state which system is authoritative, which direction data travels, how records are matched, and what happens when both sides change. Map associations as deliberately as fields: a contact without the right company or a line item without its deal may be technically synced but operationally useless.",
          "Include allowed values, transformations, required fields, default behaviour, deletion or archive handling, and historical data requirements. Avoid burying business rules inside code when they should be governed openly.",
        ],
      },
      {
        id: "timing",
        title: "3. Triggers, timing, and volume",
        paragraphs: [
          "Define whether the integration is real-time, event-driven, scheduled, or manually initiated. Give realistic current and peak volumes, batch sizes, acceptable delay, backfill size, and expected growth.",
          "HubSpot API limits vary by authentication and distribution model. Webhooks can reduce unnecessary polling, but the receiving service must validate requests, respond promptly, handle out-of-order or repeated events, and tolerate retries. Design for limits and failure from the start.",
        ],
      },
      {
        id: "security",
        title: "4. Authentication, access, and data protection",
        paragraphs: [
          "Identify the account owner, app owner, required scopes, secret-storage approach, rotation process, installation method, and people allowed to approve access. Use the smallest set of permissions that supports the design.",
          "HubSpot's current developer platform uses OAuth for apps installed across multiple accounts, while static authentication is intended for a single authorised account. The right model depends on distribution, support responsibility, and lifecycle—not developer convenience.",
        ],
      },
      {
        id: "failure",
        title: "5. Failure, recovery, and reconciliation",
        paragraphs: [
          "Specify what happens when a record fails validation, a system is unavailable, a request is rate-limited, or the same event arrives twice. Decide whether processing stops, retries, quarantines the record, alerts an owner, or continues with a recorded exception.",
        ],
        bullets: [
          "Idempotency and duplicate-event handling",
          "Retry policy and dead-letter or exception queue",
          "Human-readable error context and responsible owner",
          "Daily or periodic reconciliation between systems",
          "Backfill, replay, and rollback procedure",
        ],
      },
      {
        id: "acceptance",
        title: "6. Acceptance, monitoring, and support",
        paragraphs: [
          "Turn the brief into testable scenarios: create, update, merge, association change, deletion or archive, invalid input, permission failure, timeout, retry, and recovery. State the expected record and audit evidence in each system.",
          "Define operational measures such as success rate, processing delay, queue depth, unresolved exceptions, and reconciliation variance. Name who supports each side, expected response windows, logging retention, deployment ownership, and the change process after launch.",
        ],
        note: "A diagram is helpful, but it should complement the mapping and behavioural rules—not replace them.",
      },
    ],
    conclusion:
      "The best integration brief makes ambiguity visible early. That creates space to choose the simplest reliable architecture and gives the business a shared definition of done.",
    sources: [
      {
        publisher: "HubSpot",
        title: "Authentication overview",
        url: "https://developers.hubspot.com/docs/apps/developer-platform/build-apps/authentication/overview",
      },
      {
        publisher: "HubSpot",
        title: "API usage guidelines and limits",
        url: "https://developers.hubspot.com/docs/developer-tooling/platform/usage-guidelines",
      },
      {
        publisher: "HubSpot",
        title: "Webhooks API guide",
        url: "https://developers.hubspot.com/docs/api-reference/latest/webhooks/guide",
      },
    ],
  },
  "plan-a-website-redesign-around-crm-and-lead-capture": {
    quickAnswer:
      "Plan a redesign around the customer journey and the data it must create. Before final visual design, define audiences, conversion paths, content types, forms, CRM properties, consent, lifecycle and routing rules, attribution, integrations, measurement, migration, and post-launch ownership.",
    introduction: [
      "A website redesign can look successful while making the commercial system worse. Attractive pages do not compensate for broken attribution, duplicated properties, poor form strategy, inaccessible interactions, or leads that arrive without enough context to route and follow up.",
      "The CRM should not dictate every creative choice. It should, however, be part of the architecture from the beginning so that the experience and the operating system support the same journey.",
    ],
    sections: [
      {
        id: "journeys",
        title: "1. Start with audiences, questions, and journeys",
        paragraphs: [
          "Define the priority audiences, the decisions they are trying to make, and the evidence they need. Map the routes from entry page to useful next action, including journeys that should not end in a sales form.",
          "Then connect those journeys to the internal response. A consultation request, support question, partner enquiry, application, and content download should not all create the same record state or follow-up process.",
        ],
      },
      {
        id: "content-model",
        title: "2. Design the content model before the page inventory",
        paragraphs: [
          "Define reusable content types, required fields, ownership, relationships, metadata, and publishing rules. Services, sectors, case studies, team profiles, resources, and legal content each need different structures and proof controls.",
          "A content model makes future pages consistent without forcing every page into the same visual template. It also creates cleaner inputs for search, structured data, personalisation, and migration.",
        ],
      },
      {
        id: "capture",
        title: "3. Treat forms as part of the operating process",
        paragraphs: [
          "For each form, define its purpose, fields, hidden context, CRM mapping, progressive profiling strategy, consent, error handling, thank-you state, routing, notification, and service-level expectation. Collect only information that changes the next action or is genuinely required.",
          "Decide whether each experience uses an embedded HubSpot form, a captured supported external form, the Forms API, or a custom integration. Test the chosen approach with the real front-end framework rather than assuming all forms behave the same.",
        ],
      },
      {
        id: "measurement",
        title: "4. Write the measurement plan before launch",
        paragraphs: [
          "Agree the events, campaign parameters, traffic-source expectations, conversion definitions, lifecycle rules, and dashboards before the build is complete. Ensure the data required for those reports will actually be created by the experience.",
          "Keep an implementation register for tracking code, tag manager, consent controls, analytics, ad platforms, form embeds, chat, and custom events. This reduces duplicate scripts and makes the eventual privacy and performance review practical.",
        ],
      },
      {
        id: "migration",
        title: "5. Plan redirects, migration, and cutover as product work",
        paragraphs: [
          "Inventory current URLs, organic landing pages, downloads, forms, conversion points, scripts, structured data, and inbound links. Define redirect rules and content acceptance criteria. A redesign that discards high-value routes or changes forms without a CRM reconciliation can create invisible loss.",
        ],
        steps: [
          {
            title: "Before",
            body: "Capture baselines, crawl the current site, map forms and scripts, and approve redirect and migration rules.",
          },
          {
            title: "During",
            body: "Validate responsive layouts, accessibility, performance, metadata, tracking, consent, and CRM outcomes in staging.",
          },
          {
            title: "Launch",
            body: "Use a cutover checklist with named owners, backups, DNS and cache planning, and a rollback decision point.",
          },
          {
            title: "After",
            body: "Monitor crawl errors, key journeys, form reconciliation, attribution, automation, and performance against the baseline.",
          },
        ],
      },
      {
        id: "governance",
        title: "6. Design for the team that will run the site",
        paragraphs: [
          "Document component rules, content standards, image requirements, form ownership, publishing permissions, QA checks, and the path for requesting changes. A scalable site is not only reusable code; it is a workable publishing and governance model.",
        ],
      },
    ],
    conclusion:
      "When the website and CRM are planned together, design can stay expressive while lead capture, consent, routing, measurement, and operations become dependable. That is a better redesign than a visual reset followed by months of integration repair.",
    sources: [
      {
        publisher: "HubSpot",
        title: "Install the HubSpot tracking code",
        url: "https://knowledge.hubspot.com/reports/install-the-hubspot-tracking-code",
      },
      {
        publisher: "HubSpot",
        title: "Style and embed HubSpot forms on an external site",
        url: "https://knowledge.hubspot.com/forms/set-up-and-style-your-form-on-an-external-site",
      },
      {
        publisher: "W3C",
        title: "Evaluating Web Accessibility Overview",
        url: "https://www.w3.org/WAI/test-evaluate/",
      },
    ],
  },
  "basic-website-accessibility-checks": {
    quickAnswer:
      "Every business can check whether a site works by keyboard, shows visible focus, has a sensible heading and reading order, provides useful text alternatives, maintains usable contrast and zoom, labels forms clearly, gives users control of motion, and communicates errors. These checks are a first review—not proof of WCAG conformance.",
    introduction: [
      "Accessibility quality is experienced in ordinary interactions: finding the main content, understanding a heading, seeing where keyboard focus moved, completing a form, or pausing motion. Many serious barriers can be spotted without specialist software.",
      "The checks below draw on W3C Web Accessibility Initiative guidance and WCAG 2.2. They are useful for triage and ongoing content quality, but a complete evaluation still needs knowledgeable human review and testing with appropriate tools and assistive technologies.",
    ],
    sections: [
      {
        id: "keyboard",
        title: "1. Use the whole page with a keyboard",
        paragraphs: [
          "Put the mouse aside. Use Tab and Shift+Tab to move through interactive elements, Enter or Space to activate controls, arrow keys where the pattern expects them, and Escape to close overlays. Everything operable by pointer should have a practical keyboard route.",
        ],
        bullets: [
          "Focus is always visible and has sufficient contrast.",
          "Focus order follows the visual and logical reading order.",
          "Menus, dialogs, accordions, carousels, and forms are operable.",
          "No component traps focus or leaves it behind hidden content.",
          "Sticky headers or overlays do not completely obscure the focused item.",
        ],
      },
      {
        id: "structure",
        title: "2. Check page title, language, headings, and landmarks",
        paragraphs: [
          "Each page needs a descriptive title and the document should identify its primary language. There should be one clear main content area, and headings should describe the sections beneath them rather than being chosen for visual size.",
          "Read the headings as an outline. Then imagine the page linearised into one column or read aloud. If the sequence no longer makes sense, the source order or semantic structure needs attention.",
        ],
      },
      {
        id: "visual",
        title: "3. Test alternatives, contrast, zoom, and reflow",
        paragraphs: [
          "Meaningful images need text alternatives that convey their purpose in context; decorative images should be ignored by assistive technology. Do not put essential instructions only inside an image.",
          "Check text and interface contrast, then zoom the browser to 200% and inspect common mobile widths. Content should remain readable without losing controls or requiring two-dimensional scrolling for ordinary text. Do not rely on colour alone to communicate status.",
        ],
      },
      {
        id: "forms",
        title: "4. Complete every form slowly and incorrectly",
        paragraphs: [
          "Every input needs a persistent, programmatically connected label. Required status, format expectations, and errors should be communicated in text and associated with the affected field. Placeholder text is not a reliable replacement for a label.",
          "Submit the form empty, enter invalid data, correct one field, and try again. Confirm focus moves sensibly, existing values remain where appropriate, and the success state is announced and visually clear.",
        ],
      },
      {
        id: "motion-media",
        title: "5. Give people control of motion and media",
        paragraphs: [
          "Avoid unexpected audio. Provide accurate captions for video with speech and relevant non-speech audio, and consider transcripts and audio description where the content requires them.",
          "Users should be able to pause, stop, or hide auto-starting movement that lasts more than five seconds. Respect reduced-motion preferences and ensure the experience remains understandable when animation is removed.",
        ],
      },
      {
        id: "process",
        title: "6. Make accessibility part of normal publishing",
        paragraphs: [
          "Automated tools can find some missing names, contrast problems, and structural errors, but no tool alone can determine whether a site is accessible. Combine automated checks with keyboard testing, zoom and reflow checks, screen-reader sampling, content review, and periodic expert evaluation.",
        ],
        steps: [
          {
            title: "Design",
            body: "Review contrast, focus, target size, states, content order, and motion before handoff.",
          },
          {
            title: "Build",
            body: "Use semantic HTML and test components with keyboard and assistive technology.",
          },
          {
            title: "Publish",
            body: "Require useful headings, link text, alt text, captions, and form instructions.",
          },
          {
            title: "Maintain",
            body: "Include accessibility in regression testing and review real user feedback.",
          },
        ],
        note: "Passing these checks does not establish legal compliance or full WCAG conformance. Treat them as a practical baseline and escalate material issues for specialist evaluation.",
      },
    ],
    conclusion:
      "The most useful first step is to make accessibility observable in everyday work. Once teams routinely notice focus, structure, labels, alternatives, and motion, fewer barriers survive until the end of a project.",
    sources: [
      {
        publisher: "W3C",
        title: "Easy Checks – A First Review of Web Accessibility",
        url: "https://www.w3.org/WAI/test-evaluate/preliminary/",
      },
      {
        publisher: "W3C",
        title: "Web Content Accessibility Guidelines (WCAG) 2.2",
        url: "https://www.w3.org/TR/WCAG22/",
      },
      {
        publisher: "W3C",
        title: "Evaluating Web Accessibility Overview",
        url: "https://www.w3.org/WAI/test-evaluate/",
      },
    ],
  },
  "what-managed-hubspot-support-should-include": {
    quickAnswer:
      "Managed HubSpot support should include a prioritised request process, named senior ownership, administration and troubleshooting, preventative portal maintenance, data and automation governance, reporting improvement, controlled releases, documentation, enablement, transparent service measures, and a roadmap—not only a bucket of reactive hours.",
    introduction: [
      "Ongoing support is valuable when HubSpot is an operating system that keeps changing with the business. New products, team structures, campaigns, integrations, fields, reports, and regulatory requirements create a steady stream of decisions.",
      "A managed service should make that change safer and more coherent. If it only closes tickets without maintaining context, the portal can become busier and less dependable over time.",
    ],
    sections: [
      {
        id: "intake",
        title: "1. One clear intake and prioritisation process",
        paragraphs: [
          "Requests need a visible queue with enough context to evaluate impact, urgency, dependencies, and effort. The provider and client should agree who can submit work, who sets priority, what qualifies as an incident, and how competing requests are resolved.",
          "A short discovery step is often necessary. ‘Add a field’ may actually be a reporting definition, integration mapping, or process decision. Managed support should identify that before creating another permanent object in the portal.",
        ],
      },
      {
        id: "coverage",
        title: "2. Explicit coverage and boundaries",
        paragraphs: [
          "The service description should state what is included: portal administration, workflows, CRM architecture, reporting, forms, email, integrations, websites, troubleshooting, user changes, and enablement. It should also state what needs separate scoping, such as large migrations, net-new custom applications, or major redesigns.",
          "Clarify support windows, response targets, planned delivery capacity, unused-capacity rules, external vendor responsibilities, and escalation routes. Ambiguity here creates frustration even when the technical work is good.",
        ],
      },
      {
        id: "preventative",
        title: "3. Preventative maintenance, not only reactive fixes",
        paragraphs: [
          "A healthy service reviews the system for emerging risk: workflow failures, integration errors, duplicate patterns, unused properties, stale users, unexpected permission changes, reporting drift, form problems, and unresolved data-quality issues.",
          "The review frequency should match the portal's complexity and rate of change. The output should be a small set of evidence-based actions, not a generic monthly checklist disconnected from business priorities.",
        ],
      },
      {
        id: "change-control",
        title: "4. Controlled delivery and documentation",
        paragraphs: [
          "Changes should have an owner, rationale, test evidence, deployment record, and rollback consideration proportional to risk. Naming standards and concise architecture notes make later troubleshooting faster.",
          "High-impact workflows, lifecycle logic, integrations, and reporting definitions deserve peer review or client approval. Managed support should reduce the number of unexplained changes—not become another source of them.",
        ],
      },
      {
        id: "enablement",
        title: "5. Enablement and decision support",
        paragraphs: [
          "Support should help internal teams understand the system they use. That may include role-based training, release notes, quick operating guides, office hours, and guidance on whether a request should be solved through process, configuration, integration, or no change at all.",
        ],
      },
      {
        id: "measures",
        title: "6. Measures that show service health",
        paragraphs: [
          "Ticket count is not enough. A useful service review combines delivery measures with system and business signals.",
        ],
        bullets: [
          "Response and resolution against agreed service targets",
          "Work completed, in progress, blocked, and ageing",
          "Recurring incidents and their root causes",
          "Automation, integration, and data-quality health",
          "Adoption or process measures tied to current priorities",
          "Roadmap progress, decisions required, and upcoming risk",
        ],
      },
      {
        id: "selection",
        title: "Questions to ask a managed support provider",
        paragraphs: [
          "Ask who will actually do the work, how senior oversight is maintained, how the team handles production risk, where documentation lives, how priorities change, and what happens when a request exceeds the service boundary.",
          "The right service is not the one promising unlimited everything. It is the one that creates a dependable operating rhythm, understands the architecture, and is transparent about trade-offs.",
        ],
      },
    ],
    conclusion:
      "Managed support should leave the portal more understandable each month. That requires delivery capacity, but also governance, continuity, evidence, and senior judgement about what not to change.",
    sources: [
      {
        publisher: "HubSpot",
        title: "HubSpot user permissions guide",
        url: "https://knowledge.hubspot.com/user-management/hubspot-user-permissions-guide",
      },
      {
        publisher: "HubSpot",
        title: "View a record's property history",
        url: "https://knowledge.hubspot.com/records/view-record-property-history",
      },
      {
        publisher: "HubSpot",
        title: "HubSpot's change sources",
        url: "https://knowledge.hubspot.com/properties/hubspots-change-sources",
      },
    ],
  },
  "clean-up-duplicate-crm-properties": {
    quickAnswer:
      "Clean up duplicate CRM properties by freezing new field creation, inventorying similar fields, tracing every dependency, choosing a canonical property, defining value transformations, backing up data, migrating a controlled test set, updating workflows/forms/integrations/reports, validating results, and only then archiving or deleting the old property where the platform allows it.",
    introduction: [
      "Duplicate properties are different from duplicate records. Duplicate records represent the same person or company more than once. Duplicate properties are multiple fields representing the same or overlapping business concept—such as Industry, Company industry, Sector, and Primary sector.",
      "Deleting the obvious duplicate is risky because fields can be referenced by forms, workflows, segments, reports, integrations, personalisation, imports, or users' saved views. The cleanup needs a dependency-first sequence.",
    ],
    sections: [
      {
        id: "freeze-inventory",
        title: "1. Freeze creation and build an inventory",
        paragraphs: [
          "Pause non-essential property creation while the review is active. Export or document the candidate fields with object, label, internal name, type, options, description, creation context, fill rate, last use, and sample values.",
          "Group fields by business meaning, not only similar names. Two fields with different names may duplicate each other; two fields with similar names may serve legitimately different processes.",
        ],
      },
      {
        id: "dependencies",
        title: "2. Trace dependencies and write paths",
        paragraphs: [
          "Identify everywhere each property is read or written: forms, workflows, calculated fields, segments, reports, lists, integrations, custom code, imports, record views, personalisation, lead scoring, and external data warehouses.",
          "Use property history on representative records to see which sources update the field. A property with low visible use may still be maintained by an integration or workflow and may be the authoritative source for a downstream system.",
        ],
        note: "Do not treat a low fill rate as proof that a property is safe to remove. It may be required for a small but high-value process.",
      },
      {
        id: "canonical",
        title: "3. Choose the canonical property",
        paragraphs: [
          "Select the field that best supports the current business definition, data type, integrations, reporting, and governance model. The oldest or most populated property is not automatically the right choice.",
        ],
        bullets: [
          "One documented meaning and accountable owner",
          "A suitable field type and controlled options",
          "An internal name compatible with required integrations",
          "Clear rules for who or what may update it",
          "A migration path for every valid value in the duplicates",
        ],
      },
      {
        id: "mapping",
        title: "4. Define merge and transformation rules",
        paragraphs: [
          "Map old values to the canonical field. Resolve spelling, casing, retired options, multi-select combinations, blanks, and conflicts. Define precedence when more than one old field is populated and keep an exception list for records that need human review.",
          "Back up the affected records and property definitions before changing values. Preserve stable record identifiers so the migration updates existing records rather than creating new ones.",
        ],
      },
      {
        id: "migrate",
        title: "5. Migrate in a controlled sequence",
        paragraphs: [
          "Test the transformation on a representative subset. Validate values and downstream behaviour, then migrate the remainder in manageable batches. Update write paths before old fields are retired so new data does not continue to diverge.",
        ],
        steps: [
          {
            title: "Protect",
            body: "Export data, document definitions and dependencies, and agree rollback and exception handling.",
          },
          {
            title: "Populate",
            body: "Transform and write the canonical values without deleting the source fields.",
          },
          {
            title: "Redirect",
            body: "Update forms, workflows, integrations, reports, segments, and user views to the canonical field.",
          },
          {
            title: "Observe",
            body: "Monitor new writes, compare counts and reports, and resolve exceptions during a defined safety period.",
          },
          {
            title: "Retire",
            body: "Rename or archive old fields clearly, restrict use, and delete only after the dependency and retention checks pass.",
          },
        ],
      },
      {
        id: "prevent",
        title: "6. Prevent the property set from drifting again",
        paragraphs: [
          "Create a lightweight request and approval process for new properties. Require a purpose, object, type, options, owner, source, reporting need, retention expectation, and a search for existing fields. Maintain a data dictionary that people can actually use.",
          "Review high-growth objects periodically and include property governance in integration and campaign design. Prevention is cheaper than discovering five definitions of the same customer attribute during a migration.",
        ],
      },
    ],
    conclusion:
      "The goal is not the smallest possible property count. It is a data model where each field has a clear meaning, owner, source, and purpose—and where removing one does not break work nobody remembered to map.",
    sources: [
      {
        publisher: "HubSpot",
        title: "View a record's property history",
        url: "https://knowledge.hubspot.com/records/view-record-property-history",
      },
      {
        publisher: "HubSpot",
        title: "Deduplicate records in HubSpot",
        url: "https://knowledge.hubspot.com/records/deduplication-of-records",
      },
      {
        publisher: "HubSpot",
        title: "HubSpot's change sources",
        url: "https://knowledge.hubspot.com/properties/hubspots-change-sources",
      },
    ],
  },
  "hubspot-pricing-and-ai-credits-explained": {
    quickAnswer:
      "Read a HubSpot quote in layers: products, editions, required seat types, marketing-contact capacity, included limits, onboarding, add-ons, HubSpot Credits, implementation services, contract term, and taxes or currency. Credits are usage capacity for specific AI and automation actions; they are not the same as seats, and included credits are generally based on the highest relevant subscription rather than added across every product.",
    introduction: [
      "HubSpot pricing feels complicated because several different commercial models can appear on the same quote. A product may have an edition, users may need particular seats, Marketing Hub may scale with marketing contacts, some editions require onboarding, and usage-based features consume credits.",
      "This guide explains the structure, not a universal quote. Prices, promotions, included features, rates, and product names can change. The figures and rules below were checked against HubSpot's official catalog on 22 July 2026; always validate the current catalog and your account or proposal before buying.",
    ],
    sections: [
      {
        id: "products-editions",
        title: "1. Start with products and editions",
        paragraphs: [
          "HubSpot groups capabilities into products such as Smart CRM, Marketing Hub, Sales Hub, Service Hub, Content Hub, Data Hub, and Revenue Hub. Products are offered in editions—commonly Starter, Professional, and Enterprise—with different features and technical limits.",
          "Choose the edition from required capabilities, governance, scale, and limits—not from company size alone. Build a short requirements matrix and mark each item must-have, useful, or later. That makes edition trade-offs visible before a quote bundles them together.",
        ],
      },
      {
        id: "seats",
        title: "2. Separate seats from the product subscription",
        paragraphs: [
          "Seats determine what an individual user can do. The current catalog distinguishes Core, Sales, Service, Revenue, View-Only, and eligible Partner Seats. Full advanced Sales Hub, Service Hub, or Revenue Hub functionality requires the corresponding specialist seat; a Core Seat does not automatically grant every specialist capability.",
          "Create a role-to-feature matrix. Count the people who genuinely need advanced seller, service, revenue, administration, editing, or view-only access. Do not buy every person the same seat by default, and do not assume a no-cost view-only user can make changes.",
        ],
      },
      {
        id: "contacts-onboarding",
        title: "3. Add contact capacity, onboarding, and limits",
        paragraphs: [
          "Marketing Hub pricing is also affected by marketing contacts—the contacts eligible for marketing email and ads. Non-marketing contacts can be stored without counting toward that paid marketing tier, subject to current platform limits, but cannot be targeted in the same way. Define who genuinely needs marketing status and how that status will be governed.",
          "Some Professional and Enterprise products include required one-time onboarding charges. Also review email sends, pipelines, reports, automation, API calls, calling, file storage, and other limits relevant to your design. A cheaper edition with an important missing limit can become the expensive choice after implementation.",
        ],
      },
      {
        id: "credits",
        title: "4. Understand what HubSpot Credits are",
        paragraphs: [
          "HubSpot Credits are monthly usage capacity for specific AI agents, AI actions, data, and automation features. A feature consumes a stated number of credits per action or recurrence. Credits reset monthly and unused credits do not roll over.",
          "In the official catalog checked on 22 July 2026, many Starter subscriptions include 500 credits, Professional 3,000, and Enterprise 5,000. Data Hub and bundled Customer Platform editions can include different higher allocations. Included credits are not generally additive across products; the applicable highest allocation is used.",
          "The rate sheet gives each action a cost. At the time of review, examples included 10 credits for one Breeze action in a workflow, 50 for a text-channel Customer Agent resolution, 100 for one Prospecting Agent outreach recommendation, and 1,000 for one Content Agent content item. The catalog also states that custom-agent action units begin consuming credits on 23 July 2026. These rates can change, so use the live rate sheet for forecasting.",
        ],
        note: "Credits do not unlock every feature by themselves. The relevant product edition, seat, permission, and sometimes another service allowance may still be required.",
      },
      {
        id: "additional-credits",
        title: "5. Plan for additional credit usage",
        paragraphs: [
          "The catalog currently lists additional credits at USD $0.010 per credit through capacity packs or pay-as-you-go. A 1,000-credit capacity pack is listed at USD $10. Capacity packs raise the recurring monthly limit for the commitment term and can auto-upgrade when usage exceeds capacity unless settings are changed. Pay-as-you-go returns to the original limit after the monthly reset.",
          "Forecast with real actions: expected agent resolutions, records enriched, workflow executions, monitored companies, or content runs. Then add a sensible buffer and assign an owner to review usage, feature-level controls, notifications, and overage settings. Do not estimate from the word ‘AI’ alone.",
        ],
      },
      {
        id: "quote",
        title: "6. Turn the quote into a total-cost view",
        paragraphs: [
          "Build a simple schedule covering the full contract term. Separate recurring subscription cost, seat cost, marketing-contact tiers, credits and add-ons, required onboarding, implementation or migration, internal time, and ongoing optimisation.",
        ],
        steps: [
          {
            title: "Requirements",
            body: "Map each must-have capability to the product, edition, limit, and user role that needs it.",
          },
          {
            title: "Quantity",
            body: "Count seats, marketing contacts, API volume, credit-consuming actions, and other capacity from operating assumptions.",
          },
          {
            title: "Contract",
            body: "Confirm billing frequency, commitment term, onboarding, renewal treatment, currency, taxes, and downgrade conditions.",
          },
          {
            title: "Operate",
            body: "Budget implementation, data work, training, governance, support, and the people who will own the platform.",
          },
        ],
      },
      {
        id: "questions",
        title: "Questions to ask before approving a HubSpot quote",
        paragraphs: [
          "Ask which exact requirement drives each product and edition, which users need which seat, what is included versus promotional, which onboarding is mandatory, how contact tiers can change, which planned actions consume credits, how overages behave, and what happens at renewal.",
          "Request the proposal in a form you can reconcile with the official product catalog. A clear quote should let you explain every line item in operational terms.",
        ],
      },
    ],
    conclusion:
      "HubSpot pricing becomes manageable when each commercial layer is connected to a real requirement, person, contact, limit, or action. Model the operating design first; then compare the quote with much less ambiguity.",
    sources: [
      {
        publisher: "HubSpot",
        title: "HubSpot Product & Services Catalog",
        url: "https://legal.hubspot.com/hubspot-product-and-services-catalog",
      },
      {
        publisher: "HubSpot",
        title: "Manage HubSpot Credits",
        url: "https://knowledge.hubspot.com/account-management/understand-hubspot-credits-and-billing",
      },
      {
        publisher: "HubSpot",
        title: "Marketing Software Pricing",
        url: "https://www.hubspot.com/pricing/marketing",
      },
    ],
  },
};

export function getInsightBody(slug: string): InsightBody | undefined {
  return insightBodies[slug];
}
