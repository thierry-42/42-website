import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import {
  AnimatedConnector,
  ImageMaskReveal,
  Reveal,
} from "@/components/motion/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { CapabilityTag } from "@/components/ui/capability-tag";
import { SystemIcon, type SystemIconName } from "@/components/ui/system-icons";
import { TextLink } from "@/components/ui/text-link";
import { audienceSectors } from "@/content/page-content";
import { getPublishedService } from "@/content/site-content";
import { cn } from "@/lib/cn";

const sectorIcons: SystemIconName[] = [
  "sector-manufacturing",
  "sector-saas",
  "sector-professional",
  "sector-education",
  "sector-energy",
  "sector-commerce",
];

export function IndustrySectors() {
  return (
    <Section surface="paper">
      <Container>
        <SectionHeading
          body="The sector changes the language, stakeholders, systems, and operational detail. The discipline stays the same: understand the real journey, establish a trustworthy data model, and connect the work that should move together."
          eyebrow="Where 42 can add value"
          index="02"
          title="Industry context without a one-size-fits-all playbook."
        />

        <div className="mt-16 border-t border-[var(--border-strong)]">
          {audienceSectors.map((sector, index) => {
            const reverse = index % 2 === 1;

            return (
              <article
                className="grid gap-10 border-b border-[var(--border)] py-14 md:py-20 lg:grid-cols-12 lg:items-stretch lg:gap-16"
                data-testid="industry-row"
                key={sector.name}
              >
                <Reveal
                  className={cn(
                    "lg:col-span-6 lg:row-start-1",
                    reverse ? "lg:col-start-7" : "lg:col-start-1",
                  )}
                >
                  <p className="font-mono text-xs tracking-[0.12em] text-slate-500 uppercase">
                    Industry / {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-6 max-w-[18ch] font-serif text-[clamp(2.5rem,5vw,4.75rem)] leading-[0.98] tracking-[-0.045em]">
                    {sector.name}
                  </h3>
                  <p className="mt-7 max-w-[58ch] leading-7 text-slate-500">
                    {sector.body}
                  </p>

                  <div className="mt-9 grid gap-6 border-t border-[var(--border)] pt-7 sm:grid-cols-2">
                    <div>
                      <p className="font-mono text-[0.6875rem] tracking-[0.12em] text-slate-500 uppercase">
                        Common pressure
                      </p>
                      <p className="mt-3 text-sm leading-6">{sector.problem}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[0.6875rem] tracking-[0.12em] text-slate-500 uppercase">
                        How 42 helps
                      </p>
                      <p className="mt-3 text-sm leading-6">{sector.answer}</p>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-2">
                    {sector.needs.map((need) => (
                      <CapabilityTag key={need}>{need}</CapabilityTag>
                    ))}
                  </div>

                  <div className="mt-9 border-t border-[var(--border)] pt-7">
                    <p className="font-mono text-[0.6875rem] tracking-[0.12em] text-slate-500 uppercase">
                      Relevant services
                    </p>
                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                      {sector.serviceSlugs.map((slug) => {
                        const service = getPublishedService(slug);
                        if (!service) return null;

                        return (
                          <TextLink href={`/services/${slug}`} key={slug}>
                            {service.shortName}
                          </TextLink>
                        );
                      })}
                    </div>
                  </div>
                </Reveal>

                <ImageMaskReveal
                  className={cn(
                    "lg:col-span-5 lg:row-start-1",
                    reverse ? "lg:col-start-1" : "lg:col-start-8",
                  )}
                >
                  <IndustrySystemVisual
                    icon={sectorIcons[index]}
                    index={index}
                    labels={sector.needs}
                  />
                </ImageMaskReveal>
              </article>
            );
          })}
        </div>

        <div className="mt-14 flex flex-col gap-5 rounded-lg bg-ink-950 p-7 text-paper-50 md:flex-row md:items-center md:justify-between md:p-10">
          <p className="max-w-[40ch] text-xl font-semibold tracking-[-0.03em] md:text-2xl">
            Your industry may be different. The systems question is often
            familiar.
          </p>
          <Link
            className="font-mono text-xs tracking-[0.1em] text-signal-400 uppercase hover:text-white"
            href="/contact"
          >
            Talk through the context <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Container>
    </Section>
  );
}

function IndustrySystemVisual({
  icon,
  index,
  labels,
}: {
  icon: SystemIconName;
  index: number;
  labels: readonly string[];
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "surface-texture relative flex aspect-[4/5] min-h-[30rem] flex-col overflow-hidden rounded-lg border p-7 lg:aspect-auto lg:h-full lg:min-h-[38rem]",
        index === 1 || index === 4
          ? "surface-texture-dark border-white/12 bg-ink-950 text-paper-50"
          : "border-ink-950/10 bg-paper-100 text-ink-950",
      )}
    >
      <div className="flex items-start justify-between">
        <span className="font-mono text-[0.625rem] tracking-[0.12em] uppercase opacity-55">
          Context map / {String(index + 1).padStart(2, "0")}
        </span>
        <SystemIcon className="size-20" name={icon} />
      </div>

      <div className="my-auto grid gap-4">
        {labels.map((label, labelIndex) => (
          <div key={label}>
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-full border font-mono text-[0.625rem]",
                  labelIndex === 0 &&
                    "border-signal-500 bg-signal-400 text-signal-900",
                )}
              >
                {String(labelIndex + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-semibold tracking-[-0.02em]">
                {label}
              </span>
            </div>
            {labelIndex < labels.length - 1 ? (
              <AnimatedConnector className="ml-4 h-8 w-px bg-current/15" />
            ) : null}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 opacity-60">
        <span className="h-1 rounded-full bg-current/25" />
        <span className="h-1 rounded-full bg-signal-400" />
        <span className="h-1 rounded-full bg-current/25" />
      </div>
    </div>
  );
}
