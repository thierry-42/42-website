import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { DifferenceSection } from "@/components/sections/difference-section";
import { FoundationBand } from "@/components/sections/foundation-band";
import { ProcessSection } from "@/components/sections/process-section";
import { RouteFoundation } from "@/components/sections/route-foundation";
import { SectionHeading } from "@/components/sections/section-heading";
import { TeamSection } from "@/components/sections/team-section";
import { CapabilityTag } from "@/components/ui/capability-tag";
import { Surface } from "@/components/ui/surface";
import { TextLink } from "@/components/ui/text-link";
import { audienceProfiles, routeFoundations } from "@/content/page-content";
import { siteContent } from "@/content/site-content";
import { siteConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/metadata";

const content = routeFoundations.about;

export const metadata = createPageMetadata({
  description: content.description,
  path: content.path,
  title: "About",
});

export default function AboutPage() {
  return (
    <RouteFoundation
      consultationHref={siteConfig.bookingUrl ?? "/contact"}
      route="about"
    >
      <Section surface="paper">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <SectionHeading
              body={siteContent.brand.positioning}
              className="lg:col-span-5"
              eyebrow="The answer"
              index="01"
              title={siteContent.brand.promise}
            />
            <Reveal className="lg:col-span-6 lg:col-start-7">
              <Surface className="p-7 md:p-10">
                <p className="font-serif text-[clamp(2rem,4vw,4rem)] leading-[1.04] tracking-[-0.045em]">
                  Understand the system. Design the answer. Build it properly.
                </p>
                <TextLink className="mt-8" href="/approach">
                  See the working approach
                </TextLink>
              </Surface>
            </Reveal>
          </div>
        </Container>
      </Section>
      <DifferenceSection />
      <FoundationBand
        body={siteContent.brand.positioning}
        title="Principles that keep complex work clear."
      />
      <TeamSection />
      <Section surface="muted">
        <Container>
          <SectionHeading
            body="42 is designed for organisations that need clearer ownership, connected data, practical automation, and direct access to senior technical thinking."
            eyebrow="Who 42 works best with"
            index="05"
            title="Built for teams whose systems have outgrown the simple answer."
          />
          <div className="mt-10 flex flex-wrap gap-3">
            {audienceProfiles.map((profile) => (
              <CapabilityTag key={profile}>{profile}</CapabilityTag>
            ))}
          </div>
          <TextLink className="mt-8" href="/industries">
            Explore industry contexts
          </TextLink>
        </Container>
      </Section>
      <ProcessSection compact />
    </RouteFoundation>
  );
}
