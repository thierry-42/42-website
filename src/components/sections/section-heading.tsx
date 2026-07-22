import { Eyebrow } from "@/components/ui/eyebrow";
import { Body, Heading } from "@/components/ui/typography";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  body?: string;
  className?: string;
  eyebrow: string;
  index?: string;
  title: string;
};

export function SectionHeading({
  body,
  className,
  eyebrow,
  index,
  title,
}: SectionHeadingProps) {
  return (
    <Reveal className={cn("max-w-3xl", className)}>
      <Eyebrow index={index}>{eyebrow}</Eyebrow>
      <Heading className="max-w-[16ch]" size="h2">
        {title}
      </Heading>
      {body ? (
        <Body className="mt-6 max-w-[62ch]" size="lg">
          {body}
        </Body>
      ) : null}
    </Reveal>
  );
}
