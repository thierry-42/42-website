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
import { siteConfig } from "@/lib/config";
import {
  getPublishedInsightAuthor,
  listPublishedInsightsByAuthor,
} from "@/lib/insights/repository";
import { createPageMetadata } from "@/lib/metadata";
import { createPersonStructuredData } from "@/lib/structured-data";

export const dynamic = "force-dynamic";

type AuthorPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getPublishedInsightAuthor(slug);
  if (!author) return {};
  const approvedImage =
    author.portraitApprovalStatus === "approved" ? author.image : undefined;

  return createPageMetadata({
    description: author.shortBiography,
    image: approvedImage,
    imageAlt: approvedImage ? author.imageAlt : undefined,
    imageHeight: 1280,
    imageWidth: 1024,
    path: `/insights/author/${author.slug}`,
    title: author.name,
  });
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const [author, insights] = await Promise.all([
    getPublishedInsightAuthor(slug),
    listPublishedInsightsByAuthor(slug),
  ]);

  if (!author) notFound();
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
              <div className="bg-paper-100">
                <Image
                  alt={author.imageAlt}
                  className="aspect-[4/5] h-auto w-full object-cover lg:h-full"
                  height={1280}
                  sizes="(max-width: 1024px) 100vw, 320px"
                  src={author.image}
                  width={1024}
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
