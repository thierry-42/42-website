import Image from "next/image";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { GlobalCta } from "@/components/sections/global-cta";
import { PageIntro } from "@/components/sections/page-intro";
import { SectionHeading } from "@/components/sections/section-heading";
import { CapabilityTag } from "@/components/ui/capability-tag";
import { Surface } from "@/components/ui/surface";
import {
  getPublishedCaseStudy,
  publicContent,
  siteContent,
} from "@/content/site-content";
import { siteConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/metadata";

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  if (!siteContent.features.work) return [];

  return publicContent.caseStudies.map((caseStudy) => ({
    slug: caseStudy.slug,
  }));
}

export async function generateMetadata({ params }: CaseStudyPageProps) {
  if (!siteContent.features.work) return {};

  const { slug } = await params;
  const caseStudy = getPublishedCaseStudy(slug);

  if (!caseStudy) return {};

  return createPageMetadata({
    description: caseStudy.summary,
    path: `/work/${caseStudy.slug}`,
    title: caseStudy.client,
  });
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  if (!siteContent.features.work) notFound();

  const { slug } = await params;
  const caseStudy = getPublishedCaseStudy(slug);

  if (!caseStudy) notFound();

  return (
    <>
      <PageIntro
        body={caseStudy.summary}
        breadcrumb={caseStudy.client}
        breadcrumbItems={[
          { href: "/", label: "Home" },
          { href: "/work", label: "Work" },
          { label: caseStudy.client },
        ]}
        eyebrow={caseStudy.sector}
        path={`/work/${caseStudy.slug}`}
        title={caseStudy.client}
      />
      <Section surface="paper">
        <Container>
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-[var(--border)] bg-paper-100">
            <Image
              alt=""
              className="object-cover"
              fill
              priority
              sizes="(max-width: 1440px) 100vw, 1360px"
              src={caseStudy.image}
            />
          </div>
        </Container>
      </Section>
      <Section surface="muted">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <Surface className="p-7 md:p-10 lg:col-span-5">
              <p className="font-mono text-xs tracking-[0.12em] text-[var(--text-muted)] uppercase">
                The challenge
              </p>
              <p className="mt-8 text-xl leading-8 font-semibold tracking-[-0.03em]">
                {caseStudy.challenge}
              </p>
            </Surface>
            <Surface className="p-7 md:p-10 lg:col-span-6 lg:col-start-7">
              <p className="font-mono text-xs tracking-[0.12em] text-[var(--text-muted)] uppercase">
                The answer
              </p>
              <p className="mt-8 text-xl leading-8 font-semibold tracking-[-0.03em]">
                {caseStudy.solution}
              </p>
              {caseStudy.services.length > 0 ? (
                <div className="mt-8 flex flex-wrap gap-2">
                  {caseStudy.services.map((service) => (
                    <CapabilityTag key={service}>{service}</CapabilityTag>
                  ))}
                </div>
              ) : null}
            </Surface>
          </div>
        </Container>
      </Section>
      {caseStudy.outcomes.length > 0 ? (
        <Section surface="dark">
          <Container>
            <SectionHeading
              eyebrow="Verified outcomes"
              index="03"
              title="What changed after the work."
            />
            <div className="mt-12 grid gap-3 md:grid-cols-2">
              {caseStudy.outcomes.map((outcome, index) => (
                <Surface
                  className="min-h-48 border-white/14 p-6"
                  key={outcome}
                  tone="dark"
                >
                  <p className="font-mono text-xs text-white/48">
                    O/{String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-12 text-xl font-semibold tracking-[-0.03em]">
                    {outcome}
                  </p>
                </Surface>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
      <GlobalCta href={siteConfig.bookingUrl ?? "/contact"} />
    </>
  );
}
