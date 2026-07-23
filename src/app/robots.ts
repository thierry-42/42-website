import type { MetadataRoute } from "next";

import { isSearchIndexable, siteConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  if (!isSearchIndexable) {
    return {
      rules: {
        disallow: "/",
        userAgent: "*",
      },
    };
  }

  return {
    rules: {
      allow: "/",
      disallow: ["/dev/"],
      userAgent: "*",
    },
    host: siteConfig.siteUrl,
    sitemap: new URL("/sitemap.xml", siteConfig.siteUrl).toString(),
  };
}
