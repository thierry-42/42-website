import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CardEntrance, Stagger } from "@/components/motion/reveal";
import { AudienceSectors } from "@/components/sections/audience-sectors";
import { RouteFoundation } from "@/components/sections/route-foundation";
import { SectionHeading } from "@/components/sections/section-heading";
import { CapabilityTag } from "@/components/ui/capability-tag";
import { ProblemCard } from "@/components/ui/cards";
import { audienceRoles, routeFoundations } from "@/content/page-content";
import { siteContent } from "@/content/site-content";
import { siteConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/metadata";

const content = routeFoundations.audience;

export const metadata = createPageMetadata({
  description: content.description,
  path: content.path,
  title: "Who 42 helps",
});

export default function AudiencePage() {
  return (
    <RouteFoundation
      consultationHref={siteConfig.bookingUrl ?? "/contact"}
      route="audience"
    >
      <AudienceSectors />

      <Section surface="dark">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <SectionHeading
              body="42 is designed to work across commercial, operational, customer, finance, and technology perspectives without losing sight of the business question."
              className="lg:col-span-5"
              eyebrow="Decision-makers"
              index="02"
              title="Different responsibilities. One connected system."
            />
            <div className="flex flex-wrap content-start gap-3 lg:col-span-6 lg:col-start-7">
              {audienceRoles.map((role) => (
                <CapabilityTag
                  className="border-white/15 bg-white/5 text-white/70"
                  key={role}
                >
                  {role}
                </CapabilityTag>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section surface="paper">
        <Container>
          <SectionHeading
            body={siteContent.home.problem.body}
            eyebrow="A familiar pattern"
            index="03"
            title="The industry may be different. The systems problem is usually familiar."
          />
          <Stagger className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {siteContent.home.problem.items.map((problem, index) => (
              <CardEntrance className="h-full" key={problem}>
                <ProblemCard index={index} title={problem} />
              </CardEntrance>
            ))}
          </Stagger>
        </Container>
      </Section>
    </RouteFoundation>
  );
}
