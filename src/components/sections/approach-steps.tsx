import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import {
  AnimatedConnector,
  CardEntrance,
  Reveal,
  Stagger,
} from "@/components/motion/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { CapabilityTag } from "@/components/ui/capability-tag";
import { Surface } from "@/components/ui/surface";
import { SystemIcon, type SystemIconName } from "@/components/ui/system-icons";
import { approachSteps } from "@/content/page-content";

export function ApproachSteps() {
  const stepIcons: SystemIconName[] = [
    "engagement-review",
    "hubspot-strategy-consulting",
    "engagement-build",
    "engagement-improve",
  ];

  return (
    <Section surface="paper">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <SectionHeading
            body="Every engagement is different, but the working model stays deliberate: understand the question, design the system, build the answer, and leave the team able to operate it."
            className="lg:sticky lg:top-32 lg:col-span-4 lg:self-start"
            eyebrow="A clear implementation process"
            index="01"
            title="How 42 moves from problem to working system."
          />

          <ol className="border-t border-[var(--border-strong)] lg:col-span-7 lg:col-start-6">
            {approachSteps.map((step, index) => (
              <li
                className="border-b border-[var(--border)] py-10 md:py-14"
                key={step.number}
              >
                <Reveal>
                  <div className="flex items-start justify-between gap-6">
                    <p className="font-mono text-xs tracking-[0.12em] text-slate-500 uppercase">
                      Step {step.number} / {step.title}
                    </p>
                    <span className="grid size-14 shrink-0 place-items-center rounded-full border border-ink-950/12 bg-paper-100">
                      <SystemIcon
                        className="size-9 text-ink-950"
                        name={stepIcons[index]}
                      />
                    </span>
                  </div>

                  <h3 className="mt-8 max-w-[22ch] text-2xl leading-tight font-semibold tracking-[-0.04em] md:text-4xl">
                    {step.headline}
                  </h3>
                  <p className="mt-5 max-w-[60ch] leading-7 text-slate-500">
                    {step.body}
                  </p>

                  <AnimatedConnector className="my-8" />

                  <p className="font-mono text-[0.6875rem] tracking-[0.12em] text-slate-500 uppercase">
                    Typical outputs
                  </p>
                  <Stagger className="mt-4 grid gap-3 sm:grid-cols-2">
                    {step.outputs.map((output, outputIndex) => (
                      <CardEntrance className="h-full" key={output}>
                        <Surface className="h-full min-h-28 p-4">
                          <p className="font-mono text-[0.625rem] text-slate-500">
                            {step.number}.
                            {String(outputIndex + 1).padStart(2, "0")}
                          </p>
                          <p className="mt-4 text-sm font-semibold tracking-[-0.02em]">
                            {output}
                          </p>
                        </Surface>
                      </CardEntrance>
                    ))}
                  </Stagger>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-12 flex flex-wrap gap-2 border-t border-[var(--border)] pt-8 lg:ml-[41.666667%]">
          {[
            "Discovery",
            "Architecture",
            "Delivery",
            "Testing",
            "Documentation",
            "Enablement",
          ].map((discipline) => (
            <CapabilityTag key={discipline}>{discipline}</CapabilityTag>
          ))}
        </div>
      </Container>
    </Section>
  );
}
