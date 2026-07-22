import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ImageMaskReveal, Reveal } from "@/components/motion/reveal";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { Body, Heading } from "@/components/ui/typography";

type PageIntroProps = {
  actions?: ReactNode;
  body: string;
  breadcrumb?: string;
  eyebrow: string;
  imageSrc?: string;
  title: string;
  visual?: boolean;
};

export function PageIntro({
  actions,
  body,
  breadcrumb,
  eyebrow,
  imageSrc = "/images/placeholders/foundation-grid.webp",
  title,
  visual = false,
}: PageIntroProps) {
  return (
    <Section
      className="min-h-[36rem] pt-[calc(var(--header-height)+4rem)] md:min-h-[42rem] md:pt-[calc(var(--header-height)+5.5rem)]"
      spacing="compact"
      surface="dark"
    >
      <div
        aria-hidden="true"
        className="hairline-grid absolute inset-0 opacity-35"
      />
      <Container className="relative z-10">
        {breadcrumb ? (
          <div className="mb-12">
            <Breadcrumb
              items={[{ href: "/", label: "Home" }, { label: breadcrumb }]}
            />
          </div>
        ) : null}
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <Reveal className={visual ? "lg:col-span-7" : "lg:col-span-8"}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <Heading as="h1" className="max-w-[13ch]" size="h1">
              {title}
            </Heading>
            {visual ? (
              <Body className="mt-7" size="lg">
                {body}
              </Body>
            ) : null}
            {visual && actions ? (
              <div className="mt-8 flex flex-wrap gap-3">{actions}</div>
            ) : null}
          </Reveal>
          {visual ? (
            <ImageMaskReveal className="lg:col-span-5">
              <ImagePlaceholder
                alt=""
                aspect="square"
                className="rounded-none border-white/15 bg-ink-900"
                sizes="(max-width: 1024px) 100vw, 38vw"
                src={imageSrc}
              />
            </ImageMaskReveal>
          ) : (
            <Reveal className="lg:col-span-4 lg:pb-2">
              <Body size="lg">{body}</Body>
              {actions ? (
                <div className="mt-8 flex flex-wrap gap-3">{actions}</div>
              ) : null}
            </Reveal>
          )}
        </div>
      </Container>
    </Section>
  );
}
