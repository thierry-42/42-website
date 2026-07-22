import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/sections/section-heading";
import { Surface } from "@/components/ui/surface";

type LegalReviewProps = {
  body: string;
  sections: readonly string[];
};

export function LegalReview({ body, sections }: LegalReviewProps) {
  return (
    <Section surface="paper">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <SectionHeading
            body={body}
            className="lg:col-span-5"
            eyebrow="Publication status"
            index="01"
            title="Legal review is required before launch."
          />
          <div className="lg:col-span-6 lg:col-start-7">
            <Surface className="overflow-hidden">
              <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] p-6">
                <p className="font-mono text-xs tracking-[0.12em] text-[var(--text-muted)] uppercase">
                  Required coverage
                </p>
                <span className="rounded-full border border-[var(--border)] px-3 py-1 font-mono text-[0.6875rem] text-[var(--text-muted)]">
                  Draft withheld
                </span>
              </div>
              <ol className="divide-y divide-[var(--border)]">
                {sections.map((item, index) => (
                  <li
                    className="grid grid-cols-[3rem_1fr] gap-4 p-6"
                    key={item}
                  >
                    <span className="font-mono text-xs text-[var(--text-muted)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-semibold tracking-[-0.02em]">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            </Surface>
          </div>
        </div>
      </Container>
    </Section>
  );
}
