# Figma wireframe and website content audit

Reviewed against:

- `docs/42_WEBSITE_MASTER_BRIEF.md`
- `src/content/site-content.json`
- the connected Company42 Brand Figma file

The Figma wireframes remain the source for page rhythm, section order, alternating editorial layouts, and interaction intent. The master brief and structured content remain authoritative for public wording, service taxonomy, proof, and navigation. Wireframe footer lorem ipsum, template links, Company42 naming, and unverified claims are not carried into the website.

| Figma node | Wireframe | Website route | Reconciliation decision |
| --- | --- | --- | --- |
| `6:39` | Homepage | `/` | Implemented with the approved “Your HubSpot answer.” narrative and eight-service system. |
| `13:764` | Services | `/services` | Implemented as the approved eight-line service overview. |
| `14:1661` | Implementation | `/services/implementation-onboarding` | Implemented through the shared service template and approved structured service copy. |
| `14:2003` | Audit | `/hubspot-review` plus strategy/CRM services | The wireframe’s audit intent is represented by the focused HubSpot review route; no unsupported standalone service line was added. |
| `14:2142` | Integrations | `/services/integrations-custom-development` | Implemented with the approved integration and custom-development scope. |
| `14:2281` | Websites | `/services/websites-content-hub` | Implemented with the approved website and Content Hub scope. |
| `14:2420` | Accessibility | Website service and accessibility insight | Accessibility remains a cross-cutting delivery requirement and published guide, not an invented ninth service line. |
| `14:2559` | Reporting and data | `/services/crm-revops` | Reporting and data architecture are covered by the approved CRM and RevOps service line. |
| `14:2698` | Managed support | `/services/managed-hubspot-support` | Implemented through the shared service template. |
| `13:308` | How we work option | `/approach` | Its step-led structure informed the detailed process presentation. |
| `38:1391` | Process page | `/approach` | The six low-fi steps were reconciled to the approved four-stage model: Understand, Architect, Build, Enable. Outputs and sticky progression preserve the wireframe intent. |
| `38:417` | Industries page | `/industries` | The alternating sector structure is retained. Sector names follow the master brief: manufacturing, SaaS, professional services, education, energy, and e-commerce. |
| `38:1817` | About page | `/about` | Editorial story, principles, working model, and team are implemented using approved 42 positioning. Team names and roles come from the owner’s instruction; portraits remain labelled placeholders. |
| `38:1033` | Work | `/work` | Implemented with proof safeguards; no client, result, logo, or testimonial is invented. |
| `38:2256` | Resources | `/insights` | Implemented as the published insights listing and ten complete article routes. |
| `39:2761` | Contact | `/contact` | Implemented with configurable contact/booking details and no invented destination. |
| `40:638` | Privacy | `/privacy` | Route exists as an explicit legal-review foundation until approved legal copy is supplied. |
| `40:771` | Terms | `/terms` | Route exists as an explicit legal-review foundation until approved legal copy is supplied. |

## Intentional content safeguards

- The public brand is `42`, not `Company42`.
- “Approach” and “Industries” are now structured primary-navigation items across desktop and mobile.
- Figma placeholder photography is replaced with original local editorial imagery or code-native system diagrams.
- Events/ticketing and aviation/hospitality wording from the low-fi industries frame was not treated as approved positioning because it conflicts with the master brief’s priority industry list.
- HubSpot partner status, certifications, awards, client proof, metrics, pricing, booking URLs, and employee relationships remain unstated unless approved content is supplied.
- AI-generated team portraits are visually labelled as placeholders and have a dedicated `imageIsPlaceholder` field independent of the public team-record gate.
