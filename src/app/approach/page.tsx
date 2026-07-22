import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CardEntrance, Reveal, Stagger } from "@/components/motion/reveal";
import { ApproachSteps } from "@/components/sections/approach-steps";
import { EngagementsSection } from "@/components/sections/engagements-section";
import { RouteFoundation } from "@/components/sections/route-foundation";
import { SectionHeading } from "@/components/sections/section-heading";
import { CapabilityTag } from "@/components/ui/capability-tag";
import { Surface } from "@/components/ui/surface";
import { routeFoundations } from "@/content/page-content";
import { siteContent } from "@/content/site-content";
import { siteConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/metadata";

const content = routeFoundations.approach;

export const metadata = createPageMetadata({
  description: content.description,
  path: content.path,
  title: "Approach",
});

export default function ApproachPage() {
  return (
    <RouteFoundation
      consultationHref={siteConfig.bookingUrl ?? "/contact"}
      route="approach"
    >
      <ApproachSteps />

      <Section surface="dark">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <SectionHeading
              body="The process is valuable only when the decisions behind it remain clear. These principles shape discovery, architecture, delivery, testing, and handover."
              className="lg:col-span-5"
              eyebrow="Principles"
              index="02"
              title="What keeps complex work understandable."
            />
            <Stagger className="grid gap-3 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
              {siteContent.brand.principles.map((principle, index) => (
                <CardEntrance className="h-full" key={principle}>
                  <Surface
                    className="h-full min-h-40 border-white/14 p-6"
                    tone="dark"
                  >
                    <p className="font-mono text-xs text-white/50">
                      P/{String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-10 max-w-[24ch] font-semibold tracking-[-0.025em]">
                      {principle}
                    </p>
                  </Surface>
                </CardEntrance>
              ))}
            </Stagger>
          </div>
        </Container>
      </Section>

      <EngagementsSection index="03" />

      <Section surface="paper">
        <Container>
          <SectionHeading
            body="Scope changes with the question, but the working disciplines remain visible throughout the engagement."
            eyebrow="Built into every engagement"
            index="04"
            title="Strategy, delivery, and enablement stay connected."
          />
          <Reveal>
            <div className="mt-10 flex flex-wrap gap-3">
              {[
                "Discovery",
                "Solution architecture",
                "Hands-on delivery",
                "Testing",
                "Documentation",
                "Training",
                "Clear handover",
                "Prioritised improvement",
              ].map((item) => (
                <CapabilityTag key={item}>{item}</CapabilityTag>
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>
    </RouteFoundation>
  );
}
