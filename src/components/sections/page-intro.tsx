import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { Body, Heading } from "@/components/ui/typography";

type PageIntroProps = {
  actions?: ReactNode;
  body: string;
  breadcrumb?: string;
  breadcrumbItems?: BreadcrumbItem[];
  eyebrow: string;
  imageSrc?: string;
  path?: string;
  title: string;
  visual?: boolean;
};

export function PageIntro({
  actions,
  body,
  breadcrumb,
  breadcrumbItems,
  eyebrow,
  imageSrc = "/images/placeholders/foundation-grid.webp",
  path,
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
        {breadcrumb || breadcrumbItems ? (
          <div className="mb-12">
            <Breadcrumb
              currentPath={path}
              items={
                breadcrumbItems ?? [
                  { href: "/", label: "Home" },
                  { label: breadcrumb ?? title },
                ]
              }
            />
          </div>
        ) : null}
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className={visual ? "lg:col-span-7" : "lg:col-span-8"}>
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
          </div>
          {visual ? (
            <div className="lg:col-span-5">
              <ImagePlaceholder
                alt=""
                aspect="square"
                className="rounded-none border-white/15 bg-ink-900"
                sizes="(max-width: 1024px) 100vw, 38vw"
                src={imageSrc}
              />
            </div>
          ) : (
            <div className="lg:col-span-4 lg:pb-2">
              <Body size="lg">{body}</Body>
              {actions ? (
                <div className="mt-8 flex flex-wrap gap-3">{actions}</div>
              ) : null}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
