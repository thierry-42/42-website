import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CardEntrance, Stagger } from "@/components/motion/reveal";
import { IndustrySectors } from "@/components/sections/industry-sectors";
import { RouteFoundation } from "@/components/sections/route-foundation";
import { SectionHeading } from "@/components/sections/section-heading";
import { Surface } from "@/components/ui/surface";
import { industrySignals, routeFoundations } from "@/content/page-content";
import { siteContent } from "@/content/site-content";
import { siteConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/metadata";

const content = routeFoundations.industries;

export const metadata = createPageMetadata({
  description: content.description,
  path: content.path,
  title: "Industries",
});

export default function IndustriesPage() {
  if (!siteContent.features.industries) notFound();

  return (
    <RouteFoundation
      consultationHref={siteConfig.bookingUrl ?? "/contact"}
      route="industries"
    >
      <Section surface="dark">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <SectionHeading
              body="42 works best where customer experience, commercial process, operational data, and technical systems have to behave as one joined-up answer."
              className="lg:col-span-5"
              eyebrow="A connected operating context"
              index="01"
              title="Different sectors. The same need for clarity."
            />
            <Stagger className="grid gap-3 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
              {industrySignals.map((signal, index) => (
                <CardEntrance className="h-full" key={signal}>
                  <Surface
                    className="h-full min-h-40 border-white/14 p-6"
                    tone="dark"
                  >
                    <p className="font-mono text-xs text-white/45">
                      C/{String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-8 max-w-[24ch] font-semibold tracking-[-0.025em]">
                      {signal}
                    </p>
                  </Surface>
                </CardEntrance>
              ))}
            </Stagger>
          </div>
        </Container>
      </Section>

      <IndustrySectors />
    </RouteFoundation>
  );
}
