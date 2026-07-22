import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ScrollStatement } from "@/components/motion/scroll-statement";
import { DifferenceSection } from "@/components/sections/difference-section";
import { EngagementsSection } from "@/components/sections/engagements-section";
import { GlobalCta } from "@/components/sections/global-cta";
import { HomeHero } from "@/components/sections/home-hero";
import { ProblemSection } from "@/components/sections/problem-section";
import { ProcessSection } from "@/components/sections/process-section";
import { SectionHeading } from "@/components/sections/section-heading";
import { ServiceGrid } from "@/components/sections/service-grid";
import { SystemCapabilities } from "@/components/sections/system-capabilities";
import { Accordion } from "@/components/ui/accordion";
import { homeScrollStatement } from "@/content/experience-content";
import { siteContent } from "@/content/site-content";
import { siteConfig } from "@/lib/config";

export default function HomePage() {
  const hero = siteContent.home.hero;
  const consultationHref = siteConfig.bookingUrl ?? hero.primaryCta.href;

  return (
    <>
      <HomeHero consultationHref={consultationHref} />

      <Section className="border-t border-white/12" surface="dark">
        <Container>
          <p className="mb-10 font-mono text-[0.6875rem] tracking-[0.14em] text-white/46 uppercase">
            Clear answers / connected systems
          </p>
          <ScrollStatement statement={homeScrollStatement} />
        </Container>
      </Section>

      <ProblemSection />

      <ServiceGrid />
      <SystemCapabilities />
      <DifferenceSection />
      <EngagementsSection />
      <ProcessSection />

      <Section surface="paper">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <SectionHeading
              className="lg:col-span-5"
              eyebrow="Frequently asked"
              index="07"
              title="A few useful answers before we talk."
            />
            <div className="lg:col-span-6 lg:col-start-7">
              <Accordion items={siteContent.faqs} />
            </div>
          </div>
        </Container>
      </Section>

      <GlobalCta href={consultationHref} />
    </>
  );
}
