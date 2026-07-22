import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { EngagementsSection } from "@/components/sections/engagements-section";
import { ProcessSection } from "@/components/sections/process-section";
import { RouteFoundation } from "@/components/sections/route-foundation";
import { SectionHeading } from "@/components/sections/section-heading";
import { ServiceGrid } from "@/components/sections/service-grid";
import { SystemCapabilities } from "@/components/sections/system-capabilities";
import { Accordion } from "@/components/ui/accordion";
import { ProblemCard } from "@/components/ui/cards";
import { siteContent } from "@/content/site-content";
import { routeFoundations } from "@/content/page-content";
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
      <ProcessSection compact />
      <Section surface="paper">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <SectionHeading
              className="lg:col-span-5"
              eyebrow="Frequently asked"
              index="06"
              title="Useful answers before choosing a service."
            />
            <div className="lg:col-span-6 lg:col-start-7">
              <Accordion items={siteContent.faqs} />
            </div>
          </div>
        </Container>
      </Section>
    </RouteFoundation>
  );
}
