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
        <p className="mt-6 max-w-[68ch] font-mono text-xs leading-5 text-slate-500">
          Portraits shown below are AI-generated layout placeholders and are not
          likenesses. Names, roles, biographies, and working relationships
          remain subject to final approval.
        </p>

        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
