import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CardEntrance, Stagger } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { siteContent } from "@/content/site-content";

export function DifferenceSection() {
  const content = siteContent.home.difference;

  return (
    <Section surface="dark">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-12">
          <SectionHeading
            body={content.body}
            className="lg:col-span-5"
            eyebrow={content.eyebrow}
            index="06"
            title={content.headline}
          />
          <div className="lg:col-span-6 lg:col-start-7">
            <Stagger className="mt-10 border-t border-[var(--border)]">
              {content.items.map((item, index) => (
                <CardEntrance key={item}>
                  <div className="grid grid-cols-[3rem_1fr] gap-4 border-b border-[var(--border)] py-5">
                    <span className="font-mono text-xs text-[var(--text-muted)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="max-w-[42ch] font-semibold tracking-[-0.02em]">
                      {item}
                    </span>
                  </div>
                </CardEntrance>
              ))}
            </Stagger>
          </div>
        </div>
      </Container>
    </Section>
  );
}
