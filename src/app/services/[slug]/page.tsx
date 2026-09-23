import { notFound } from "next/navigation";

import { ServiceDetail } from "@/components/sections/service-detail";
import { getPublishedService, type Service } from "@/content/site-content";
import { siteConfig } from "@/lib/config";
import { listPublishedInsightsByService } from "@/lib/insights/repository";
import { createPageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getPublishedService(slug);

  if (!service) return {};

  return createPageMetadata({
    description: service.summary,
    path: `/services/${service.slug}`,
    title: service.name,
  });
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getPublishedService(slug);

  if (!service) notFound();

  const relatedInsights = (
    await listPublishedInsightsByService(service.slug)
  ).slice(0, 3);

  return (
    <ServiceDetail
      consultationHref={siteConfig.bookingUrl ?? "/contact"}
      relatedInsights={relatedInsights}
      service={service satisfies Service}
    />
  );
}
