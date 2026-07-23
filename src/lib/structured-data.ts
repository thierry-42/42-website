import type { Author, Insight, Service } from "@/content/site-content";
import { siteContent } from "@/content/site-content";
import { siteConfig } from "@/lib/config";

const organizationId = `${siteConfig.siteUrl}/#organization`;
const websiteId = `${siteConfig.siteUrl}/#website`;

export function createGlobalStructuredData() {
  return [
    {
      "@context": "https://schema.org",
      "@id": organizationId,
      "@type": ["Organization", "ProfessionalService"],
      alternateName: siteContent.meta.tradingName,
      areaServed: siteContent.meta.serviceAreas.map((name) => ({
        "@type": "Place",
        name,
      })),
      description: siteContent.meta.defaultDescription,
      email: siteConfig.contactEmail,
      legalName: siteContent.legal.legalEntity,
      name: siteContent.meta.brand,
      url: siteConfig.siteUrl,
    },
    {
      "@context": "https://schema.org",
      "@id": websiteId,
      "@type": "WebSite",
      inLanguage: "en-GB",
      name: siteContent.meta.brand,
      publisher: { "@id": organizationId },
      url: siteConfig.siteUrl,
    },
  ];
}

export function createServiceStructuredData(service: Service) {
  const url = new URL(
    `/services/${service.slug}`,
    siteConfig.siteUrl,
  ).toString();

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    areaServed: siteContent.meta.serviceAreas.map((name) => ({
      "@type": "Place",
      name,
    })),
    description: service.summary,
    name: service.name,
    provider: { "@id": organizationId },
    serviceType: service.serviceLine,
    url,
  };
}

export function createArticleStructuredData(insight: Insight, author?: Author) {
  const url = new URL(
    `/insights/${insight.slug}`,
    siteConfig.siteUrl,
  ).toString();
  const authorUrl = author
    ? new URL(`/insights/author/${author.slug}`, siteConfig.siteUrl).toString()
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    author: author
      ? {
          "@type": "Person",
          description: author.biography,
          image: new URL(author.image, siteConfig.siteUrl).toString(),
          jobTitle: author.role,
          name: author.name,
          url: authorUrl,
          worksFor: { "@id": organizationId },
        }
      : { "@type": "Person", name: insight.author },
    dateModified: insight.updatedAt ?? undefined,
    datePublished: insight.publishedAt ?? undefined,
    description: insight.summary,
    headline: insight.title,
    image: new URL(insight.image, siteConfig.siteUrl).toString(),
    inLanguage: "en-GB",
    mainEntityOfPage: url,
    publisher: { "@id": organizationId },
    url,
  };
}

export function createPersonStructuredData(author: Author) {
  const url = new URL(
    `/insights/author/${author.slug}`,
    siteConfig.siteUrl,
  ).toString();

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    description: author.biography,
    image: new URL(author.image, siteConfig.siteUrl).toString(),
    jobTitle: author.role,
    name: author.name,
    url,
    worksFor: { "@id": organizationId },
  };
}

export function createBreadcrumbStructuredData(
  items: Array<{ href?: string; label: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      item: new URL(item.href ?? "/", siteConfig.siteUrl).toString(),
      name: item.label,
      position: index + 1,
    })),
  };
}
