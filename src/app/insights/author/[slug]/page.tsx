import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { GlobalCta } from "@/components/sections/global-cta";
import { PageIntro } from "@/components/sections/page-intro";
import { StructuredData } from "@/components/seo/structured-data";
import { SectionHeading } from "@/components/sections/section-heading";
import { InsightCard } from "@/components/ui/cards";
import { Surface } from "@/components/ui/surface";
import {
  getPublishedAuthor,
  publicAuthors,
  publicContent,
} from "@/content/site-content";
import { siteConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/metadata";
import { createPersonStructuredData } from "@/lib/structured-data";

type AuthorPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return publicAuthors.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = getPublishedAuthor(slug);
  if (!author || author.bioApprovalStatus !== "approved") return {};

  return createPageMetadata({
    description: author.shortBiography,
    path: `/insights/author/${author.slug}`,
    title: author.name,
  });
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = getPublishedAuthor(slug);

  if (!author || author.bioApprovalStatus !== "approved") notFound();

  const insights = publicContent.insights.filter(
    (insight) => insight.authorSlug === author.slug,
  );
  const showPortrait =
    author.portraitApprovalStatus === "approved" ||
    siteConfig.usesDevelopmentPortraits;

  return (
    <>
      <StructuredData data={createPersonStructuredData(author)} />
      <PageIntro
        body={author.shortBiography}
        breadcrumb={author.name}
        breadcrumbItems={[
          { href: "/", label: "Home" },
          { href: "/insights", label: "Insights" },
          { label: author.name },
        ]}
        eyebrow="About the author"
        path={`/insights/author/${author.slug}`}
        title={author.name}
      />
      <Section surface="paper">
        <Container>
          <Surface
            className={
              showPortrait
                ? "grid overflow-hidden lg:grid-cols-[20rem_1fr]"
                : "overflow-hidden"
            }
          >
            {showPortrait ? (
              <div className="relative aspect-[4/5] bg-paper-100 lg:aspect-auto">
                <Image
                  alt={author.imageAlt}
                  className="object-cover"
                  fill
                  sizes="(max-width: 1024px) 100vw, 320px"
                  src={author.image}
                />
              </div>
            ) : null}
            <div className="p-7 md:p-10 lg:p-12">
              <p className="font-mono text-xs tracking-[0.12em] text-[var(--text-muted)] uppercase">
                {author.role}
              </p>
              <p className="mt-8 max-w-[68ch] text-lg leading-8">
                {author.biography}
              </p>
            </div>
          </Surface>
        </Container>
      </Section>
      <Section surface="muted">
        <Container>
          <SectionHeading
            eyebrow="Published insights"
            index="01"
            title={`Guides by ${author.name}.`}
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {insights.map((insight) => (
              <InsightCard insight={insight} key={insight.slug} />
            ))}
          </div>
        </Container>
      </Section>
      <GlobalCta href="/contact" />
    </>
  );
}
