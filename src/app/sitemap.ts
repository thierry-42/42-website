import type { MetadataRoute } from "next";

import { isRoutePublished, publicContent } from "@/content/site-content";
import { getSiteOrigin, isSearchIndexable } from "@/lib/config";
import {
  listPublishedInsightAuthors,
  listPublishedInsightCategories,
  listPublishedInsights,
} from "@/lib/insights/repository";

export const dynamic = "force-dynamic";

const routes = [
  "",
  "/services",
  "/about",
  "/approach",
  "/insights",
  "/hubspot-review",
  "/contact",
  "/accessibility",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isSearchIndexable) return [];

  const origin = getSiteOrigin();
  const [insights, categories, authors] = await Promise.all([
    listPublishedInsights(),
    listPublishedInsightCategories(),
    listPublishedInsightAuthors(),
  ]);
  const serviceRoutes = publicContent.services.map(
    (service) => `/services/${service.slug}`,
  );
  const insightRoutes = insights.map((insight) => `/insights/${insight.slug}`);
  const categoryRoutes = categories.map(
    (category) => `/insights/category/${category.slug}`,
  );
  const authorRoutes = authors.map(
    (author) => `/insights/author/${author.slug}`,
  );

  const publishedRoutes = [
    ...routes.filter(isRoutePublished),
    ...serviceRoutes,
    ...insightRoutes,
    ...categoryRoutes,
    ...authorRoutes,
  ];

  return publishedRoutes.map((path) => {
    const insight = insights.find((item) => path === `/insights/${item.slug}`);

    return {
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      lastModified: insight?.updatedAt ?? insight?.publishedAt ?? undefined,
      priority: path === "" ? 1 : path === "/contact" ? 0.8 : 0.7,
      url: new URL(path || "/", origin).toString(),
    };
  });
}
