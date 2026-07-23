import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { EngagementsSection } from "@/components/sections/engagements-section";
import { ProcessSection } from "@/components/sections/process-section";
import { RouteFoundation } from "@/components/sections/route-foundation";
import { SectionHeading } from "@/components/sections/section-heading";
import { ServiceGrid } from "@/components/sections/service-grid";
import { SystemCapabilities } from "@/components/sections/system-capabilities";
import { CapabilityTag } from "@/components/ui/capability-tag";
import { ProblemCard } from "@/components/ui/cards";
import {
  audienceProfiles,
  audienceRoles,
  routeFoundations,
} from "@/content/page-content";
import { siteContent } from "@/content/site-content";
import { siteConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/metadata";

const content = routeFoundations.services;

export const metadata = createPageMetadata({
  description: content.description,
  path: content.path,
  title: "HubSpot services",
});

export default function ServicesPage() {
  return (
    <RouteFoundation
      consultationHref={siteConfig.bookingUrl ?? "/contact"}
      route="services"
    >
      <ServiceGrid
        body="Eight connected service lines cover strategy, implementation, CRM architecture, automation, integrations, websites, service operations, and managed optimisation."
        eyebrow="What 42 can help with"
      />
      <EngagementsSection variant="stacked" />
      <SystemCapabilities />
      <Section surface="paper">
        <Container>
          <SectionHeading
            body={siteContent.home.problem.body}
            eyebrow="Typical problems"
            index="04"
            title="Start with the operational problem, not the feature list."
          />
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {siteContent.home.problem.items.map((problem, index) => (
              <ProblemCard index={index} key={problem} title={problem} />
            ))}
          </div>
        </Container>
      </Section>
      <Section surface="muted">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <SectionHeading
              body="42 works with mid-market organisations across North America and EMEA when customer processes, teams, data, and systems need a clearer operating model."
              className="lg:col-span-5"
              eyebrow="Who the services are for"
              index="05"
              title="Senior support for teams beyond the simple setup."
            />
            <div className="space-y-8 lg:col-span-6 lg:col-start-7">
              <div>
                <p className="font-mono text-xs tracking-[0.12em] text-[var(--text-muted)] uppercase">
                  Organisation profiles
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {audienceProfiles.map((profile) => (
                    <CapabilityTag key={profile}>{profile}</CapabilityTag>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-mono text-xs tracking-[0.12em] text-[var(--text-muted)] uppercase">
                  Typical stakeholders
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {audienceRoles.map((role) => (
                    <CapabilityTag key={role}>{role}</CapabilityTag>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
      <ProcessSection compact />
    </RouteFoundation>
  );
}
