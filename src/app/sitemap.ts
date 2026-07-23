import type { MetadataRoute } from "next";

import {
  isRoutePublished,
  publicAuthors,
  publicContent,
  publicInsightCategories,
  siteContent,
} from "@/content/site-content";
import { getSiteOrigin } from "@/lib/config";

const routes = [
  "",
  "/services",
  "/about",
  "/approach",
  "/insights",
  "/hubspot-review",
  "/contact",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteOrigin();
  const serviceRoutes = publicContent.services.map(
    (service) => `/services/${service.slug}`,
  );
  const workRoutes = siteContent.features.work
    ? [
        "/work",
        ...publicContent.caseStudies.map(
          (caseStudy) => `/work/${caseStudy.slug}`,
        ),
      ]
    : [];
  const insightRoutes = publicContent.insights.map(
    (insight) => `/insights/${insight.slug}`,
  );
  const categoryRoutes = publicInsightCategories.map(
    (category) => `/insights/category/${category.slug}`,
  );
  const authorRoutes = publicAuthors.map(
    (author) => `/insights/author/${author.slug}`,
  );

  return [
    ...routes.filter(isRoutePublished),
    ...serviceRoutes,
    ...workRoutes,
    ...insightRoutes,
    ...categoryRoutes,
    ...authorRoutes,
  ].map((path) => ({
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/contact" ? 0.8 : 0.7,
    url: new URL(path || "/", origin).toString(),
  }));
}
