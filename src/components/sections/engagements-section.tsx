import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/sections/section-heading";
import { EngagementStack } from "@/components/sections/engagement-stack";
import { CardEntrance, Stagger } from "@/components/motion/reveal";
import { CapabilityTag } from "@/components/ui/capability-tag";
import { Surface } from "@/components/ui/surface";
import { SystemIcon, type SystemIconName } from "@/components/ui/system-icons";
import { siteContent } from "@/content/site-content";
import { cn } from "@/lib/cn";

export function EngagementsSection({
  index = "04",
  variant = "grid",
}: {
  index?: string;
  variant?: "grid" | "stacked";
}) {
  const engagementIcons: SystemIconName[] = [
    "engagement-review",
    "engagement-build",
    "engagement-connect",
    "engagement-improve",
  ];

  return (
    <Section
      overflow={variant === "stacked" ? "visible" : "hidden"}
      surface="paper"
    >
      <Container>
        <SectionHeading
          body="Start with the shape of the problem, then choose the engagement that gets the system to a useful answer."
          eyebrow="Ways to work together"
          index={index}
          title="Diagnose. Build. Connect. Improve."
        />
        {variant === "stacked" ? (
          <EngagementStack engagements={siteContent.engagements} />
        ) : (
          <Stagger className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {siteContent.engagements.map((engagement, index) => (
              <CardEntrance
                className={cn(index === 3 && "xl:col-span-3")}
                key={engagement.name}
              >
                <Surface
                  className={cn(
                    "h-full min-h-96 p-6 md:p-8",
                    index === 3 && "xl:min-h-72",
                  )}
                >
                  <div className="flex items-start justify-between gap-6">
                    <p className="font-mono text-xs text-[var(--text-muted)]">
                      E/{String(index + 1).padStart(2, "0")}
                    </p>
                    <SystemIcon
                      className="size-14 text-ink-950"
                      name={engagementIcons[index]}
                    />
                  </div>
                  <h3 className="mt-12 font-serif text-4xl tracking-[-0.035em]">
                    {engagement.name}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
                    {engagement.description}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {engagement.items.map((item) => (
                      <CapabilityTag key={item}>{item}</CapabilityTag>
                    ))}
                  </div>
                </Surface>
              </CardEntrance>
            ))}
          </Stagger>
        )}
      </Container>
    </Section>
  );
}
