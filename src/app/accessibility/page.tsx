import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { GlobalCta } from "@/components/sections/global-cta";
import { PageIntro } from "@/components/sections/page-intro";
import { Surface } from "@/components/ui/surface";
import { getAccessibilityStatement } from "@/content/accessibility-content";
import { siteConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/metadata";

const accessibilityStatement = getAccessibilityStatement(
  siteConfig.deploymentEnvironment,
);

export function generateMetadata(): Metadata {
  if (!siteConfig.visualPreferencesEnabled) return {};

  return createPageMetadata({
    description: accessibilityStatement.description,
    path: "/accessibility",
    title: accessibilityStatement.title,
  });
}

export default function AccessibilityPage() {
  if (!siteConfig.visualPreferencesEnabled) notFound();

  return (
    <>
      <PageIntro
        body={accessibilityStatement.description}
        breadcrumb={accessibilityStatement.title}
        eyebrow={accessibilityStatement.eyebrow}
        path="/accessibility"
        title={accessibilityStatement.title}
      />
      <Section surface="paper">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-[16rem_minmax(0,48rem)] lg:justify-center lg:gap-16">
            <Surface className="p-6 lg:sticky lg:top-28">
              <p className="font-mono text-[0.6875rem] tracking-[0.12em] text-[var(--colour-text-muted)] uppercase">
                Last updated
              </p>
              <p className="mt-3 font-semibold">
                {accessibilityStatement.updatedAt}
              </p>
              <p className="mt-5 text-sm leading-6 text-[var(--colour-text-muted)]">
                Feedback is welcomed at{" "}
                <a
                  className="font-semibold text-[var(--colour-link)] underline underline-offset-4"
                  href="mailto:hello@company42.co"
                >
                  hello@company42.co
                </a>
                .
              </p>
            </Surface>
            <div className="divide-y divide-[var(--colour-divider)]">
              {accessibilityStatement.sections.map((section, index) => (
                <section className="py-10 first:pt-0" key={section.title}>
                  <p className="font-mono text-xs text-[var(--colour-text-muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-3 text-3xl leading-tight font-semibold tracking-[-0.045em] sm:text-4xl">
                    {section.title}
                  </h2>
                  <div className="mt-6 grid gap-5 text-base leading-7 text-[var(--colour-text-muted)]">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </Container>
      </Section>
      <GlobalCta href="/contact" />
    </>
  );
}
