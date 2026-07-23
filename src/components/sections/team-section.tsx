import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CardEntrance, Stagger } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { TeamCard } from "@/components/ui/cards";
import { publicContent } from "@/content/site-content";

export function TeamSection() {
  if (publicContent.team.length === 0) return null;

  return (
    <Section surface="paper">
      <Container>
        <SectionHeading
          body="42 brings together HubSpot consulting, CRM architecture, development, integrations, marketing, and onboarding. The capability is shaped around the problem while ownership and communication stay clear."
          eyebrow="The people behind the answer"
          index="04"
          title="Senior expertise, without the agency maze."
        />
        <Stagger className="mt-12 grid gap-4 sm:grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))]">
          {publicContent.team.map((member) => (
            <CardEntrance className="h-full" key={member.id}>
              <TeamCard member={member} />
            </CardEntrance>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
