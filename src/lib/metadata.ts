import type { Metadata } from "next";

import { siteContent } from "@/content/site-content";
import { siteConfig } from "@/lib/config";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
};

export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Metadata {
  const canonical = siteConfig.siteUrl
    ? new URL(path, siteConfig.siteUrl).toString()
    : undefined;

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      type: "website",
      siteName: siteContent.meta.brand,
      title,
      description,
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
