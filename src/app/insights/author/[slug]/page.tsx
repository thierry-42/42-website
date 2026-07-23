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
import { getAuthor, publicContent, siteContent } from "@/content/site-content";
import { siteConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/metadata";
import { createPersonStructuredData } from "@/lib/structured-data";

type AuthorPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return siteContent.authors.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author || !author.isPublished) return {};

  return createPageMetadata({
    description: author.biography,
    path: `/insights/author/${author.slug}`,
    title: author.name,
  });
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = getAuthor(slug);
  const isOwnerReview =
    author &&
    (!author.isPublished ||
      author.bioApprovalStatus !== "approved" ||
      author.portraitApprovalStatus !== "approved");

  if (
    !author ||
    (siteConfig.deploymentEnvironment === "production" && isOwnerReview)
  ) {
    notFound();
  }

  const insights = publicContent.insights.filter(
    (insight) => insight.authorSlug === author.slug,
  );

  return (
    <>
      {author.isPublished &&
      author.bioApprovalStatus === "approved" &&
      author.portraitApprovalStatus === "approved" ? (
        <StructuredData data={createPersonStructuredData(author)} />
      ) : null}
      <PageIntro
        body="Development preview of the author-page structure. This page is excluded from production until the biography and portrait are approved."
        breadcrumb={author.name}
        breadcrumbItems={[
          { href: "/", label: "Home" },
          { href: "/insights", label: "Insights" },
          { label: author.name },
        ]}
        eyebrow="Owner review required"
        path={`/insights/author/${author.slug}`}
        title={author.name}
      />
      <Section surface="paper">
        <Container>
          <Surface className="grid overflow-hidden lg:grid-cols-[20rem_1fr]">
            <div className="relative aspect-[4/5] bg-paper-100 lg:aspect-auto">
              <Image
                alt={author.imageAlt}
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 100vw, 320px"
                src={author.image}
              />
              <span className="absolute top-4 left-4 rounded-full bg-ink-950 px-3 py-1 font-mono text-[0.625rem] tracking-[0.1em] text-paper-50 uppercase">
                Development portrait
              </span>
            </div>
            <div className="p-7 md:p-10 lg:p-12">
              <p className="font-mono text-xs tracking-[0.12em] text-[var(--text-muted)] uppercase">
                {author.role}
              </p>
              <p className="mt-8 max-w-[68ch] text-lg leading-8">
                {author.biography}
              </p>
              <p className="mt-8 max-w-[68ch] rounded-md border border-hubspot-coral/35 bg-hubspot-coral/8 p-4 text-sm leading-6">
                Biography and portrait require final owner approval before this
                page can be published.
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
