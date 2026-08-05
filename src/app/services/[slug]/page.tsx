import { notFound } from "next/navigation";

import { ServiceDetail } from "@/components/sections/service-detail";
import {
  getPublishedService,
  publicContent,
  type Service,
} from "@/content/site-content";
import { siteConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/metadata";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return publicContent.services.map((service) => ({ slug: service.slug }));
}

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

  const StrategyServiceHeroPrototype =
    siteConfig.deploymentEnvironment === "staging" &&
    service.slug === "hubspot-strategy-consulting"
      ? (
          await import("@/components/prototypes/strategy-service-hero-prototype")
        ).StrategyServiceHeroPrototype
      : null;

  return (
    <ServiceDetail
      consultationHref={siteConfig.bookingUrl ?? "/contact"}
      heroVisual={
        StrategyServiceHeroPrototype ? (
          <StrategyServiceHeroPrototype posterSrc={service.image} />
        ) : undefined
      }
      service={service satisfies Service}
    />
  );
}
