import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/sections/section-heading";
import { Surface } from "@/components/ui/surface";
import { siteContent } from "@/content/site-content";

export function ProblemSection() {
  const content = siteContent.home.problem;

  return (
    <Section surface="paper">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading
              body={content.body}
              eyebrow={content.eyebrow}
              index="01"
              title={content.headline}
            />
            <ol className="mt-10 border-t border-[var(--border)]">
              {content.items.map((item, index) => (
                <li
                  className="grid grid-cols-[3rem_1fr] gap-4 border-b border-[var(--border)] py-4"
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
          </div>
          <Surface
            className="min-h-[30rem] p-8 md:p-12 lg:sticky lg:top-28 lg:col-span-5 lg:col-start-8"
            tone="dark"
          >
            <p className="font-mono text-xs tracking-[0.12em] text-signal-400 uppercase">
              An implementation that stopped at setup
            </p>
            <p className="mt-20 max-w-[18ch] font-serif text-4xl leading-[1.02] tracking-[-0.035em] md:text-5xl">
              42 finds the real problem, designs the right answer, and builds it
              into the platform.
            </p>
          </Surface>
        </div>
      </Container>
    </Section>
  );
}
