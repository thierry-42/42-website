import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Surface } from "@/components/ui/surface";
import { Body, Heading } from "@/components/ui/typography";

type PublicationSafeguardProps = {
  body: string;
  title: string;
};

export function PublicationSafeguard({
  body,
  title,
}: PublicationSafeguardProps) {
  return (
    <Section surface="paper">
      <Container>
        <Surface className="grid gap-10 p-7 md:grid-cols-12 md:p-12">
          <div className="md:col-span-3">
            <span className="inline-flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.12em] text-[var(--text-muted)] uppercase">
              <span
                aria-hidden="true"
                className="size-2 rounded-full bg-signal-500"
              />
              Publication safeguard
            </span>
          </div>
          <div className="md:col-span-8 md:col-start-5">
            <Heading as="h2" size="h3">
              {title}
            </Heading>
            <Body className="mt-5">{body}</Body>
          </div>
        </Surface>
      </Container>
    </Section>
  );
}
