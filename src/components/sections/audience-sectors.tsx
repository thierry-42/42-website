import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/sections/section-heading";
import { CardEntrance, Stagger } from "@/components/motion/reveal";
import { CapabilityTag } from "@/components/ui/capability-tag";
import { Surface } from "@/components/ui/surface";
import { SystemIcon, type SystemIconName } from "@/components/ui/system-icons";
import { audienceSectors } from "@/content/page-content";
import { cn } from "@/lib/cn";

export function AudienceSectors() {
  const sectorIcons: SystemIconName[] = [
    "sector-manufacturing",
    "sector-saas",
    "sector-professional",
    "sector-education",
    "sector-energy",
    "sector-commerce",
  ];

  return (
    <Section surface="paper">
      <Container>
        <SectionHeading
          body="Different industries have different workflows, but the same systems problem often appears underneath: customer data and operational work need a clearer way to connect."
          eyebrow="Where 42 can add value"
          index="01"
          title="Industry context without forcing the business into a template."
        />

        <Stagger className="mt-14 grid gap-4 lg:grid-cols-2">
          {audienceSectors.map((sector, index) => {
            const dark = index === 1 || index === 4;

            return (
              <CardEntrance key={sector.name}>
                <Surface
                  className={cn(
                    "min-h-[26rem] p-7 md:p-10",
                    dark && "border-white/14",
                  )}
                  tone={dark ? "dark" : "default"}
                >
                  <div className="flex items-center justify-between gap-6">
                    <p className="font-mono text-xs tracking-[0.12em] text-[var(--text-muted)] uppercase">
                      Sector / {String(index + 1).padStart(2, "0")}
                    </p>
                    <SystemIcon
                      className={cn(
                        "size-14",
                        dark ? "text-paper-50" : "text-ink-950",
                      )}
                      name={sectorIcons[index]}
                    />
                  </div>
                  <h3 className="mt-16 max-w-[18ch] font-serif text-4xl leading-[1.02] tracking-[-0.035em] md:text-5xl">
                    {sector.name}
                  </h3>
                  <p className="mt-6 max-w-[58ch] text-sm leading-6 text-[var(--text-muted)] md:text-base md:leading-7">
                    {sector.body}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {sector.needs.map((need) => (
                      <CapabilityTag
                        className={cn(
                          dark && "border-white/15 bg-white/5 text-white/65",
                        )}
                        key={need}
                      >
                        {need}
                      </CapabilityTag>
                    ))}
                  </div>
                </Surface>
              </CardEntrance>
            );
          })}
        </Stagger>
      </Container>
    </Section>
  );
}
