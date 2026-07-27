type DeploymentEnvironment = "development" | "production" | "staging";

const visualPreferencesCopy = {
  production:
    "Optional visual preferences allow visitors to choose a light or dark appearance, select a colour-vision support palette, and enable high contrast. These support palettes are not diagnostic tools or exact medical simulations.",
  staging:
    "On the staging trial, optional visual preferences allow visitors to choose a light or dark appearance, select a colour-vision support palette, and enable high contrast. These support palettes are not diagnostic tools or exact medical simulations.",
} as const;

export function getAccessibilityStatement(environment: DeploymentEnvironment) {
  const preferencesCopy =
    environment === "production"
      ? visualPreferencesCopy.production
      : visualPreferencesCopy.staging;

  return {
    title: "Accessibility at 42",
    eyebrow: "Accessibility statement",
    description:
      "How 42 approaches accessibility, testing, visual preferences, and feedback on this website.",
    updatedAt: "26 July 2026",
    sections: [
      {
        title: "Our target",
        paragraphs: [
          "42 targets Web Content Accessibility Guidelines 2.2 Level AA for this website. This target guides design, development, content, interaction, and testing decisions.",
          "This statement is not a claim of certification or universal accessibility. Technology, browser settings, assistive technology, third-party services, and individual needs can affect how a website is experienced.",
        ],
      },
      {
        title: "How the website is tested",
        paragraphs: [
          "The website uses automated accessibility checks alongside manual review of keyboard access, focus visibility, page structure, contrast, zoom, responsive reflow, reduced motion, and common interaction states.",
          "Testing is repeated when material interface or content changes are introduced. Automated tools can identify useful issues, but they do not replace manual testing or feedback from people using the website.",
        ],
      },
      {
        title: "Supported interaction preferences",
        paragraphs: [
          "The website supports keyboard navigation, visible focus indicators, a skip link, reduced-motion preferences, responsive layouts, semantic headings, and labelled controls.",
          preferencesCopy,
        ],
      },
      {
        title: "Third-party content",
        paragraphs: [
          "The Contact page includes a HubSpot-hosted form. 42 styles and tests the surrounding page and provides an email fallback, but some form behaviour remains controlled by HubSpot and can vary by browser, region, or form configuration.",
        ],
      },
      {
        title: "Feedback",
        paragraphs: [
          "If something on this website is difficult to access or use, email hello@company42.co. Please include the page, the task you were trying to complete, and any assistive technology or browser information you are comfortable sharing.",
          "42 will review accessibility feedback and use it to prioritise practical improvements.",
        ],
      },
    ],
  } as const;
}
