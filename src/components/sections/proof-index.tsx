import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/sections/section-heading";
import { Surface } from "@/components/ui/surface";

type ProofIndexProps = {
  body: string;
  children?: ReactNode;
  criteria: readonly string[];
  eyebrow: string;
  title: string;
};

export function ProofIndex({
  body,
  children,
  criteria,
  eyebrow,
  title,
}: ProofIndexProps) {
  return (
    <Section surface="paper">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <SectionHeading
            body={body}
            className="lg:col-span-5"
            eyebrow={eyebrow}
            index="01"
            title={title}
          />
          <Surface className="p-7 md:p-10 lg:col-span-6 lg:col-start-7">
            <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
              <p className="font-mono text-xs tracking-[0.12em] text-[var(--text-muted)] uppercase">
                Publication gate
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold">
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full bg-signal-500"
                />
                Approval required
              </span>
            </div>
            <ul className="mt-3 divide-y divide-[var(--border)]">
              {criteria.map((item, index) => (
                <li
                  className="grid grid-cols-[2.5rem_1fr] gap-4 py-4 text-sm leading-6"
                  key={item}
                >
                  <span className="font-mono text-xs text-[var(--text-muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Surface>
        </div>
        {children}
      </Container>
    </Section>
  );
}
