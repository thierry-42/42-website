export const heroAnswerModes = [
  {
    number: "01",
    title: "Understand",
    body: "Map the goals, teams, processes, data, constraints, and current platform.",
    signals: ["Goals", "Process", "Constraints"],
  },
  {
    number: "02",
    title: "Architect",
    body: "Define the CRM model, system design, roadmap, responsibilities, and measures of success.",
    signals: ["CRM model", "Roadmap", "Ownership"],
  },
  {
    number: "03",
    title: "Build",
    body: "Configure, develop, integrate, migrate, test, and document.",
    signals: ["Configure", "Connect", "Test"],
  },
  {
    number: "04",
    title: "Enable",
    body: "Train users, launch the system, monitor adoption, and improve what comes next.",
    signals: ["Train", "Launch", "Improve"],
  },
] as const;

export const connectedCapabilityGroups = [
  {
    id: "data-flow",
    label: "Data flow",
    description:
      "Move dependable information between HubSpot and the systems around it.",
    capabilities: ["REST APIs", "Webhooks", "Middleware", "Data migrations"],
    nodes: ["Source system", "Validation", "Destination"],
  },
  {
    id: "operations",
    label: "Operations",
    description:
      "Connect customer activity to the operational processes that fulfil it.",
    capabilities: ["ERP integrations", "Finance systems", "Quote experiences"],
    nodes: ["Customer signal", "HubSpot", "Operations"],
  },
  {
    id: "platform",
    label: "Platform design",
    description:
      "Extend the platform when the standard data model or workflow no longer fits.",
    capabilities: [
      "Custom objects",
      "Custom-coded workflows",
      "CRM extensions",
    ],
    nodes: ["Data model", "Automation", "Interface"],
  },
  {
    id: "experience",
    label: "Experience",
    description:
      "Turn connected data into useful customer and team-facing experiences.",
    capabilities: ["Custom modules", "Reporting architecture"],
    nodes: ["Content", "Customer view", "Decision layer"],
  },
] as const;

export const homeScrollStatement =
  "HubSpot becomes the answer when strategy, data, systems, and delivery move together.";
