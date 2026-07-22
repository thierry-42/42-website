import type { MetadataRoute } from "next";

import { publicContent } from "@/content/site-content";
import { getSiteOrigin } from "@/lib/config";

const routes = [
  "",
  "/services",
  "/work",
  "/about",
  "/approach",
  "/audience",
  "/industries",
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
  const caseStudyRoutes = publicContent.caseStudies.map(
    (caseStudy) => `/work/${caseStudy.slug}`,
  );
  const insightRoutes = publicContent.insights.map(
    (insight) => `/insights/${insight.slug}`,
  );

  return [
    ...routes,
    ...serviceRoutes,
    ...caseStudyRoutes,
    ...insightRoutes,
  ].map((path) => ({
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/contact" ? 0.8 : 0.7,
    url: new URL(path || "/", origin).toString(),
  }));
}
