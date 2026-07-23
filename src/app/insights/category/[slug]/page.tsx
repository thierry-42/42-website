import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CardEntrance, Stagger } from "@/components/motion/reveal";
import { GlobalCta } from "@/components/sections/global-cta";
import { PageIntro } from "@/components/sections/page-intro";
import { SectionHeading } from "@/components/sections/section-heading";
import { InsightCard } from "@/components/ui/cards";
import {
  getPublishedInsightCategory,
  publicContent,
  publicInsightCategories,
} from "@/content/site-content";
import { siteConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/metadata";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return publicInsightCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getPublishedInsightCategory(slug);
  if (!category) return {};

  return createPageMetadata({
    description: category.introduction,
    path: `/insights/category/${category.slug}`,
    title: category.name,
  });
}

export default async function InsightCategoryPage({
  params,
}: CategoryPageProps) {
  const { slug } = await params;
  const category = getPublishedInsightCategory(slug);
  if (!category) notFound();

  const insights = publicContent.insights.filter(
    (insight) => insight.categorySlug === category.slug,
  );
  if (insights.length === 0) notFound();

  return (
    <>
      <PageIntro
        body={category.introduction}
        breadcrumb={category.name}
        eyebrow="Insight category"
        title={category.name}
      />
      <Section surface="paper">
        <Container>
          <SectionHeading
            body={`${insights.length} practical ${insights.length === 1 ? "guide" : "guides"} in this collection.`}
            eyebrow="The collection"
            index="01"
            title="Apply the thinking to the next decision."
          />
          <Stagger className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {insights.map((insight) => (
              <CardEntrance className="h-full" key={insight.slug}>
                <InsightCard insight={insight} />
              </CardEntrance>
            ))}
          </Stagger>
        </Container>
      </Section>
      <GlobalCta href={siteConfig.bookingUrl ?? "/contact"} />
    </>
  );
}
