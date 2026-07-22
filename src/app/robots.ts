import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: "/",
      disallow: ["/dev/"],
      userAgent: "*",
    },
    host: siteConfig.siteUrl,
    sitemap: siteConfig.siteUrl
      ? new URL("/sitemap.xml", siteConfig.siteUrl).toString()
      : undefined,
  };
}
