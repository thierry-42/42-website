import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Body, Heading } from "@/components/ui/typography";

type CtaPanelProps = {
  body: string;
  eyebrow: string;
  href: string;
  label: string;
  title: string;
};

export function CtaPanel({ body, eyebrow, href, label, title }: CtaPanelProps) {
  return (
    <div
      className="relative overflow-hidden rounded-xl border border-white/15 bg-ink-900 p-7 text-paper-50 shadow-lift md:p-12 lg:p-16"
      data-surface="dark"
    >
      <div
        aria-hidden="true"
        className="hairline-grid absolute inset-0 opacity-30"
      />
      <div className="relative z-10 grid items-end gap-10 lg:grid-cols-[1fr_auto]">
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <Heading className="max-w-[14ch]" size="h2">
            {title}
          </Heading>
          <Body className="mt-6 max-w-[58ch]" size="lg">
            {body}
          </Body>
        </div>
        <Button className="self-end" href={href} showArrow>
          {label}
        </Button>
      </div>
    </div>
  );
}
